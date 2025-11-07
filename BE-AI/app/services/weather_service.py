import httpx
import asyncio
from typing import List
from fastapi import HTTPException, status

from app.models.weather import WeatherForecast, DailyForecast
from app.models.farm import GeoJSONPoint
from app.core.config import settings


class WeatherService:
    """Service for fetching weather forecast data from external API"""
    
    def __init__(self):
        self.api_key = settings.WEATHER_API_KEY
        self.api_url = settings.WEATHER_API_URL
        self.timeout = 10.0  # 10 second timeout
        self.max_retries = 2
    
    async def get_weather_forecast(self, location: GeoJSONPoint) -> WeatherForecast:
        """
        Get weather forecast for a specific location with retry logic
        
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
                    # Using weatherapi.com format: /forecast.json?key=KEY&q=LAT,LON&days=7
                    url = f"{self.api_url}/forecast.json"
                    params = {
                        "key": self.api_key,
                        "q": f"{latitude},{longitude}",
                        "days": 7,
                        "aqi": "no"
                    }
                    
                    response = await client.get(url, params=params)
                    response.raise_for_status()
                    
                    raw_data = response.json()
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
        Transform Weather API response to WeatherForecast model
        
        Args:
            raw_data: Raw response from weather API
            
        Returns:
            WeatherForecast: Formatted weather data
        """
        current = raw_data.get("current", {})
        location_data = raw_data.get("location", {})
        forecast_data = raw_data.get("forecast", {}).get("forecastday", [])
        
        # Format daily forecasts
        forecast_days: List[DailyForecast] = []
        for day in forecast_data:
            day_data = day.get("day", {})
            forecast_days.append(DailyForecast(
                date=day.get("date", ""),
                max_temp=day_data.get("maxtemp_c", 0.0),
                min_temp=day_data.get("mintemp_c", 0.0),
                avg_temp=day_data.get("avgtemp_c", 0.0),
                max_humidity=day_data.get("maxhumidity", 0.0),
                avg_humidity=day_data.get("avghumidity", 0.0),
                total_rainfall=day_data.get("totalprecip_mm", 0.0),
                conditions=day_data.get("condition", {}).get("text", "Unknown")
            ))
        
        return WeatherForecast(
            temperature=current.get("temp_c", 0.0),
            humidity=current.get("humidity", 0.0),
            rainfall=current.get("precip_mm", 0.0),
            conditions=current.get("condition", {}).get("text", "Unknown"),
            forecast_days=forecast_days,
            location=location_data.get("name", "Unknown")
        )
