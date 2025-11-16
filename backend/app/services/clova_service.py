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
