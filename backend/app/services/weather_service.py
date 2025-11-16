import httpx
import asyncio
from typing import List, Dict
from datetime import datetime
from fastapi import HTTPException, status

from app.models.weather import WeatherForecast, DailyForecast
from app.models.farm import GeoJSONPoint
from app.core.config import settings


class WeatherService:
    """Service for fetching weather forecast data from n8n webhook"""
    
    def __init__(self):
        self.n8n_webhook_url = settings.N8N_WEBHOOK_URL
        self.timeout = 10.0  # 10 second timeout
        self.max_retries = 2
    
    async def get_weather_forecast(self, location: GeoJSONPoint) -> WeatherForecast:
        """
        Get 5-day weather forecast for a specific location with retry logic
        
        Args:
            location: GeoJSON Point with coordinates [longitude, latitude]
            
        Returns:
            WeatherForecast: Formatted weather forecast data
            
        Raises:
            HTTPException: If weather API fails or times out
        """
        longitude, latitude = location.coordinates
        
        # Retry logic with exponential backoff
        for attempt in range(self.max_retries + 1):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    # Call n8n webhook with latitude and longitude
                    payload = {
                        "latitude": latitude,
                        "longitude": longitude
                    }
                    
                    response = await client.post(self.n8n_webhook_url, json=payload)
                    response.raise_for_status()
                    
                    raw_data = response.json()
                    
                    # Handle array response from n8n
                    if isinstance(raw_data, list) and len(raw_data) > 0:
                        raw_data = raw_data[0]
                    
                    return self.format_weather_data(raw_data)
                    
            except httpx.TimeoutException:
                if attempt == self.max_retries:
                    raise HTTPException(
                        status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                        detail="Weather service unavailable - request timed out"
                    )
                # Exponential backoff: wait 1s, then 2s
                await asyncio.sleep(2 ** attempt)
                
            except httpx.HTTPStatusError as e:
                if attempt == self.max_retries:
                    raise HTTPException(
                        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                        detail=f"Weather service error: {e.response.status_code}"
                    )
                await asyncio.sleep(2 ** attempt)
                
            except Exception as e:
                if attempt == self.max_retries:
                    raise HTTPException(
                        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                        detail=f"Weather service unavailable: {str(e)}"
                    )
                await asyncio.sleep(2 ** attempt)
        
        # This should never be reached due to the raise in the loop
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Weather service unavailable"
        )
    
    def format_weather_data(self, raw_data: dict) -> WeatherForecast:
        """
        Transform n8n weather API response to WeatherForecast model
        
        Args:
            raw_data: Raw response from n8n webhook (OpenWeatherMap format)
            
        Returns:
            WeatherForecast: Formatted weather data
        """
        forecast_list = raw_data.get("list", [])
        city_data = raw_data.get("city", {})
        
        if not forecast_list:
            raise ValueError("No forecast data available")
        
        # Get current weather from first item
        current = forecast_list[0]
        current_main = current.get("main", {})
        current_weather = current.get("weather", [{}])[0]
        current_rain = current.get("rain", {})
        
        # Group forecast by day and calculate daily aggregates
        daily_forecasts = self._aggregate_daily_forecasts(forecast_list)
        
        return WeatherForecast(
            temperature=current_main.get("temp", 0.0),
            humidity=current_main.get("humidity", 0.0),
            rainfall=current_rain.get("3h", 0.0),
            conditions=current_weather.get("description", "Unknown"),
            forecast_days=daily_forecasts,
            location=city_data.get("name", "Unknown")
        )
    
    def _aggregate_daily_forecasts(self, forecast_list: List[Dict]) -> List[DailyForecast]:
        """
        Aggregate 3-hour forecasts into daily forecasts
        
        Args:
            forecast_list: List of 3-hour forecast items
            
        Returns:
            List[DailyForecast]: List of daily aggregated forecasts (max 5 days)
        """
        daily_data = {}
        
        for item in forecast_list:
            # Extract date from dt_txt (format: "2025-11-07 09:00:00")
            dt_txt = item.get("dt_txt", "")
            if not dt_txt:
                continue
            
            date = dt_txt.split(" ")[0]  # Get just the date part
            
            if date not in daily_data:
                daily_data[date] = {
                    "temps": [],
                    "humidity": [],
                    "rainfall": 0.0,
                    "conditions": []
                }
            
            main = item.get("main", {})
            weather = item.get("weather", [{}])[0]
            rain = item.get("rain", {})
            
            daily_data[date]["temps"].append(main.get("temp", 0.0))
            daily_data[date]["humidity"].append(main.get("humidity", 0.0))
            daily_data[date]["rainfall"] += rain.get("3h", 0.0)
            daily_data[date]["conditions"].append(weather.get("description", ""))
        
        # Convert to DailyForecast objects
        forecast_days = []
        for date in sorted(daily_data.keys())[:5]:  # Limit to 5 days
            data = daily_data[date]
            temps = data["temps"]
            humidity = data["humidity"]
            
            # Get most common condition
            conditions = [c for c in data["conditions"] if c]
            most_common_condition = max(set(conditions), key=conditions.count) if conditions else "Unknown"
            
            forecast_days.append(DailyForecast(
                date=date,
                max_temp=max(temps) if temps else 0.0,
                min_temp=min(temps) if temps else 0.0,
                avg_temp=sum(temps) / len(temps) if temps else 0.0,
                max_humidity=max(humidity) if humidity else 0.0,
                avg_humidity=sum(humidity) / len(humidity) if humidity else 0.0,
                total_rainfall=data["rainfall"],
                conditions=most_common_condition
            ))
        
        return forecast_days
