from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class DailyForecast(BaseModel):
    """Daily weather forecast data"""
    date: str
    max_temp: float = Field(..., description="Maximum temperature in Celsius")
    min_temp: float = Field(..., description="Minimum temperature in Celsius")
    avg_temp: float = Field(..., description="Average temperature in Celsius")
    max_humidity: float = Field(..., description="Maximum humidity percentage")
    avg_humidity: float = Field(..., description="Average humidity percentage")
    total_rainfall: float = Field(..., description="Total rainfall in mm")
    conditions: str = Field(..., description="Weather conditions description")
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class WeatherForecast(BaseModel):
    """Weather forecast response model"""
    temperature: float = Field(..., description="Current temperature in Celsius")
    humidity: float = Field(..., description="Current humidity percentage")
    rainfall: float = Field(..., description="Current rainfall in mm")
    conditions: str = Field(..., description="Current weather conditions")
    forecast_days: List[DailyForecast] = Field(..., description="Multi-day forecast")
    location: str = Field(..., description="Location name")
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
