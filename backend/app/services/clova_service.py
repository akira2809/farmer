import httpx
from typing import Optional, Dict, Any
from app.core.config import settings


class ClovaStudioService:
    """Service for interacting with Clova Studio API"""
    
    def __init__(self):
        """Initialize Clova Studio service"""
        self.api_key = settings.CLOVA_STUDIO_API_KEY
        self.request_id = settings.CLOVA_STUDIO_REQUEST_ID
        self.host = "https://clovastudio.stream.ntruss.com"
        self.base_url = f"{self.host}/v1/chat-completions/HCX-003"
        self.timeout = 60.0
    
    async def get_disease_advice(
        self,
        disease_name: str,
        confidence: float,
        additional_context: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get advice and information about detected plant disease from Clova Studio
        
        Args:
            disease_name: Name of the detected disease
            confidence: Confidence score of the detection (0-1)
            additional_context: Optional additional context from user
            
        Returns:
            Dictionary containing AI response with disease information and advice
        """
        try:
            # Build the prompt for Clova Studio
            prompt = self._build_prompt(disease_name, confidence, additional_context)
            
            # Make API request
            response_data = await self._make_request(prompt)
            
            return {
                "success": True,
                "disease_name": disease_name,
                "confidence": confidence,
                "advice": response_data.get("content", ""),
                "raw_response": response_data
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "disease_name": disease_name,
                "confidence": confidence
            }
    
    def _build_prompt(
        self,
        disease_name: str,
        confidence: float,
        additional_context: Optional[str] = None
    ) -> str:
        """
        Build a prompt for Clova Studio based on disease detection results
        
        Args:
            disease_name: Name of the detected disease
            confidence: Confidence score (0-1)
            additional_context: Optional additional context
            
        Returns:
            Formatted prompt string
        """
        confidence_percentage = f"{confidence * 100:.1f}%"
        
        base_prompt = f"""Bệnh được phát hiện: {disease_name}
Độ tin cậy: {confidence_percentage}

Hãy cung cấp thông tin chi tiết về bệnh này bao gồm:
1. Mô tả triệu chứng của bệnh
2. Nguyên nhân gây bệnh
3. Cách phòng tránh
4. Phương pháp điều trị hiệu quả
5. Lưu ý quan trọng khi xử lý

Trả lời bằng tiếng Việt, ngắn gọn và dễ hiểu cho nông dân."""
        
        if additional_context:
            base_prompt += f"\n\nThông tin thêm từ nông dân: {additional_context}"
        
        return base_prompt
    
    async def _make_request(self, prompt: str) -> Dict[str, Any]:
        """
        Make HTTP request to Clova Studio API
        
        Args:
            prompt: The prompt to send to Clova Studio
            
        Returns:
            Response data from Clova Studio
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "X-NCP-CLOVASTUDIO-REQUEST-ID": self.request_id,
            "Content-Type": "application/json; charset=utf-8",
            "Accept": "application/json"
        }
        
        payload = {
            "messages": [
                {
                    "role": "system",
                    "content": "Bạn là chuyên gia nông nghiệp chuyên về bệnh cây trồng. Hãy cung cấp lời khuyên chính xác, hữu ích bằng tiếng Việt."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "topP": 0.8,
            "topK": 0,
            "maxTokens": 2000,
            "temperature": 0.5,
            "repeatPenalty": 1.1,
            "stopBefore": [],
            "includeAiFilters": False
        }
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.post(
                    self.base_url,
                    headers=headers,
                    json=payload
                )
                response.raise_for_status()
                
                result = response.json()
                
                # Extract content from response
                if "result" in result and "message" in result["result"]:
                    content = result["result"]["message"].get("content", "")
                    return {
                        "content": content,
                        "full_response": result
                    }
                else:
                    return {
                        "content": "Không thể lấy phản hồi từ AI",
                        "full_response": result
                    }
                    
            except httpx.HTTPStatusError as e:
                raise Exception(f"Clova Studio API error: {e.response.status_code} - {e.response.text}")
            except httpx.RequestError as e:
                raise Exception(f"Request to Clova Studio failed: {str(e)}")
            except Exception as e:
                raise Exception(f"Unexpected error calling Clova Studio: {str(e)}")
    
    async def chat(
        self,
        message: str,
        conversation_history: Optional[list] = None
    ) -> Dict[str, Any]:
        """
        General chat with Clova Studio (for follow-up questions)
        
        Args:
            message: User's message
            conversation_history: Optional conversation history
            
        Returns:
            AI response
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "X-NCP-CLOVASTUDIO-REQUEST-ID": self.request_id,
            "Content-Type": "application/json; charset=utf-8",
            "Accept": "application/json"
        }
        
        messages = [
            {
                "role": "system",
                "content": "Bạn là trợ lý AI chuyên về nông nghiệp, giúp nông dân giải đáp thắc mắc về cây trồng và bệnh hại."
            }
        ]
        
        # Add conversation history if provided
        if conversation_history:
            messages.extend(conversation_history)
        
        # Add current message
        messages.append({
            "role": "user",
            "content": message
        })
        
        payload = {
            "messages": messages,
            "topP": 0.8,
            "topK": 0,
            "maxTokens": 2000,
            "temperature": 0.7,
            "repeatPenalty": 1.1,
            "stopBefore": [],
            "includeAiFilters": False
        }
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.post(
                    self.base_url,
                    headers=headers,
                    json=payload
                )
                response.raise_for_status()
                
                result = response.json()
                
                if "result" in result and "message" in result["result"]:
                    content = result["result"]["message"].get("content", "")
                    return {
                        "success": True,
                        "content": content,
                        "full_response": result
                    }
                else:
                    return {
                        "success": False,
                        "error": "Invalid response format",
                        "full_response": result
                    }
                    
            except Exception as e:
                return {
                    "success": False,
                    "error": str(e)
                }

    async def get_weather_advice(
        self,
        weather_data: Dict[str, Any],
        location_name: str
    ) -> Dict[str, Any]:
        """
        Get weather advice from Clova Studio based on weather forecast
        
        Args:
            weather_data: Weather forecast data
            location_name: Name of the location
            
        Returns:
            Dictionary containing advice
        """
        import os
        import json
        from datetime import datetime
        import hashlib

        try:
            # 1. Check Cache
            today = datetime.now().strftime("%Y-%m-%d")
            # Create a simple hash of location to avoid filesystem issues with special chars
            loc_hash = hashlib.md5(location_name.encode()).hexdigest()
            cache_dir = "cache/weather_advice"
            cache_file = f"{cache_dir}/{today}_{loc_hash}.json"
            
            # Ensure cache directory exists
            os.makedirs(cache_dir, exist_ok=True)
            
            if os.path.exists(cache_file):
                try:
                    with open(cache_file, "r", encoding="utf-8") as f:
                        cached_data = json.load(f)
                        return cached_data
                except Exception as e:
                    print(f"Cache read error: {e}")
                    # Continue to generate if cache read fails

            # 2. Build Prompt
            prompt = self._build_weather_prompt(weather_data, location_name)
            
            # 3. Call Clova Studio
            response_data = await self._make_request(prompt)
            
            result = {
                "success": True,
                "advice": response_data.get("content", ""),
                "location": location_name,
                "date": today,
                "cached": False
            }

            # 4. Save to Cache
            try:
                # Mark as cached for future reads
                cache_content = result.copy()
                cache_content["cached"] = True
                with open(cache_file, "w", encoding="utf-8") as f:
                    json.dump(cache_content, f, ensure_ascii=False, indent=2)
            except Exception as e:
                print(f"Cache write error: {e}")

            return result
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "advice": "Hiện tại không thể lấy lời khuyên thời tiết. Hãy chú ý theo dõi dự báo thời tiết thường xuyên."
            }

    def _build_weather_prompt(
        self,
        weather_data: Dict[str, Any],
        location_name: str
    ) -> str:
        """
        Build a prompt for weather advice
        """
        # Extract key info from weather data (assuming WeatherForecast model structure)
        current_cond = weather_data.get("conditions", "")
        temp = weather_data.get("temperature", 0)
        humidity = weather_data.get("humidity", 0)
        rain = weather_data.get("rainfall", 0)
        
        forecast_summary = ""
        if "forecast_days" in weather_data:
            for day in weather_data["forecast_days"][:3]: # Look at next 3 days
                date = day.get("date", "")
                cond = day.get("conditions", "")
                min_t = day.get("min_temp", 0)
                max_t = day.get("max_temp", 0)
                rain_day = day.get("total_rainfall", 0)
                forecast_summary += f"- {date}: {cond}, {min_t}-{max_t}°C, Mưa: {rain_day}mm\n"

        prompt = f"""Dữ liệu thời tiết tại {location_name}:
Hiện tại: {current_cond}, Nhiệt độ: {temp}°C, Độ ẩm: {humidity}%, Mưa: {rain}mm.

Dự báo 3 ngày tới:
{forecast_summary}

Dựa trên dữ liệu trên, hãy đóng vai một chuyên gia nông nghiệp và đưa ra lời khuyên ngắn gọn (khoảng 2-3 câu) cho nông dân. 
Tập trung vào các hành động cần thiết ngay (như tưới nước, che chắn, phun thuốc, bón phân...) để bảo vệ cây trồng.
Văn phong thân thiện, như người nhà nói chuyện với nhau.
Bắt đầu bằng câu chào hoặc nhận định chung về thời tiết sắp tới.
Ví dụ: "Sắp tới sẽ có mưa to trong vòng 2-3 ngày, bác nhớ chú ý khơi thông rãnh thoát nước để tránh ngập úng cho cây nhé..."
"""
        return prompt

