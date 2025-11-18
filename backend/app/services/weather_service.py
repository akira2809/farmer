import asyncio
from datetime import datetime
from typing import Any, Dict, List

import httpx
from deep_translator import GoogleTranslator
from fastapi import HTTPException, status

from app.core.config import settings
from app.models.farm import GeoJSONPoint
from app.models.weather import (
    DailyForecast,
    HourlyForecast,
    WeatherAlert,
    WeatherForecast,
    WeatherRequest,
)


class WeatherService:
    """Service for fetching weather forecast data from WeatherAPI.com"""

    def __init__(self):
        self.api_key = settings.WEATHER_API_KEY
        self.base_url = settings.WEATHER_API_URL
        self.timeout = 10.0  # 10-second timeout
        self.max_retries = 2
        self.weather_conditions_translation = {
            "Sunny": "Nắng",
            "Clear": "Trời quang",
            "Partly cloudy": "Mây rải rác",
            "Cloudy": "Nhiều mây",
            "Overcast": "U ám",
            "Mist": "Sương mù",
            "Patchy rain possible": "Có thể có mưa vài nơi",
            "Patchy snow possible": "Có thể có tuyết vài nơi",
            "Patchy sleet possible": "Có thể có mưa tuyết vài nơi",
            "Patchy freezing drizzle possible": "Có thể có mưa phùn đóng băng vài nơi",
            "Thundery outbreaks possible": "Có khả năng có dông",
            "Blowing snow": "Bão tuyết",
            "Blizzard": "Bão tuyết lớn",
            "Fog": "Sương mù",
            "Freezing fog": "Sương mù đóng băng",
            "Patchy light drizzle": "Mưa phùn nhẹ vài nơi",
            "Light drizzle": "Mưa phùn nhẹ",
            "Freezing drizzle": "Mưa phùn đóng băng",
            "Heavy freezing drizzle": "Mưa phùn đóng băng dày đặc",
            "Patchy light rain": "Mưa nhẹ vài nơi",
            "Light rain": "Mưa nhỏ",
            "Moderate rain at times": "Đôi khi có mưa vừa",
            "Moderate rain": "Mưa vừa",
            "Heavy rain at times": "Đôi khi có mưa lớn",
            "Heavy rain": "Mưa lớn",
            "Light freezing rain": "Mưa đá nhẹ",
            "Moderate or heavy freezing rain": "Mưa đá vừa hoặc nặng",
            "Light sleet": "Mưa tuyết nhẹ",
            "Moderate or heavy sleet": "Mưa tuyết vừa hoặc nặng",
            "Patchy light snow": "Tuyết nhẹ vài nơi",
            "Light snow": "Tuyết nhẹ",
            "Patchy moderate snow": "Tuyết vừa phải vài nơi",
            "Moderate snow": "Tuyết vừa phải",
            "Patchy heavy snow": "Tuyết dày vài nơi",
            "Heavy snow": "Tuyết dày",
            "Ice pellets": "Mưa đá",
            "Light rain shower": "Mưa rào nhẹ",
            "Moderate or heavy rain shower": "Mưa rào vừa hoặc nặng",
            "Torrential rain shower": "Mưa như trút nước",
            "Light sleet showers": "Mưa tuyết nhẹ",
            "Moderate or heavy sleet showers": "Mưa tuyết vừa hoặc nặng",
            "Light snow showers": "Mưa tuyết nhẹ",
            "Moderate or heavy snow showers": "Mưa tuyết vừa hoặc nặng",
            "Light showers of ice pellets": "Mưa đá nhẹ",
            "Moderate or heavy showers of ice pellets": "Mưa đá vừa hoặc nặng",
            "Patchy light rain with thunder": "Mưa nhẹ vài nơi kèm sấm sét",
            "Moderate or heavy rain with thunder": "Mưa vừa hoặc lớn kèm sấm sét",
            "Patchy light snow with thunder": "Tuyết nhẹ vài nơi kèm sấm sét",
            "Moderate or heavy snow with thunder": "Tuyết vừa hoặc dày kèm sấm sét",
            "Unknown": "Không xác định"
        }

    async def get_weather_forecast(self, location: GeoJSONPoint) -> WeatherForecast:
        """
        Get 5-day weather forecast for a specific location with retry logic.

        Args:
            location: GeoJSON Point with coordinates [longitude, latitude]

        Returns:
            WeatherForecast: Formatted weather forecast data

        Raises:
            HTTPException: If the weather API fails or times out
        """
        longitude, latitude = location.coordinates
        q = f"{latitude},{longitude}"

        for attempt in range(self.max_retries + 1):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    params = {
                        "key": self.api_key,
                        "q": q,
                        "days": 5,
                        "aqi": "no",
                        "alerts": "yes"
                    }
                    response = await client.get(f"{self.base_url}/forecast.json", params=params)
                    response.raise_for_status()

                    raw_data = response.json()
                    return self.format_weather_data(raw_data)

            except httpx.TimeoutException:
                if attempt == self.max_retries:
                    raise HTTPException(
                        status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                        detail="Weather service unavailable - request timed out"
                    )
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

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Weather service unavailable"
        )

    def format_weather_data(self, raw_data: Dict[str, Any]) -> WeatherForecast:
        """
        Transforms WeatherAPI.com response to WeatherForecast model.

        Args:
            raw_data: Raw response from WeatherAPI.com

        Returns:
            WeatherForecast: Formatted weather data
        """
        current = raw_data.get("current", {})
        forecast = raw_data.get("forecast", {}).get("forecastday", [])
        location = raw_data.get("location", {})
        alerts_data = raw_data.get("alerts", {}).get("alert", [])

        if not forecast:
            raise ValueError("No forecast data available")

        daily_forecasts = self._aggregate_daily_forecasts(forecast)
        alerts = self._format_alerts(alerts_data)

        return WeatherForecast(
            temperature=current.get("temp_c", 0.0),
            humidity=current.get("humidity", 0.0),
            rainfall=current.get("precip_mm", 0.0),
            conditions=self._translate_condition(
                current.get("condition", {}).get("text", "Unknown")),
            forecast_days=daily_forecasts,
            location=location.get("name", "Unknown"),
            alerts=alerts
        )

    def _aggregate_daily_forecasts(self, forecast_days: List[Dict[str, Any]]) -> List[DailyForecast]:
        """
        Converts daily forecast data from WeatherAPI.com to DailyForecast models.

        Args:
            forecast_days: List of daily forecast items from the API response

        Returns:
            List[DailyForecast]: List of daily aggregated forecasts
        """
        daily_forecasts = []
        for day_data in forecast_days:
            day = day_data.get("day", {})
            hourly_data = day_data.get("hour", [])
            hourly_forecasts = self._format_hourly_forecasts(hourly_data)

            daily_forecasts.append(DailyForecast(
                date=day_data.get("date"),
                max_temp=day.get("maxtemp_c", 0.0),
                min_temp=day.get("mintemp_c", 0.0),
                avg_temp=day.get("avgtemp_c", 0.0),
                max_humidity=day.get("avghumidity", 0.0),
                avg_humidity=day.get("avghumidity", 0.0),
                total_rainfall=day.get("totalprecip_mm", 0.0),
                conditions=self._translate_condition(
                    day.get("condition", {}).get("text", "Unknown")),
                hourly=hourly_forecasts
            ))
        return daily_forecasts

    def _format_hourly_forecasts(self, hourly_data: List[Dict[str, Any]]) -> List[HourlyForecast]:
        """
        Converts hourly forecast data from WeatherAPI.com to HourlyForecast models.

        Args:
            hourly_data: List of hourly forecast items from the API response

        Returns:
            List[HourlyForecast]: List of hourly forecasts
        """
        hourly_forecasts = []
        for hour_data in hourly_data:
            hourly_forecasts.append(HourlyForecast(
                time=hour_data.get("time"),
                temp_c=hour_data.get("temp_c"),
                condition=self._translate_condition(
                    hour_data.get("condition", {}).get("text", "Unknown")),
                wind_kph=hour_data.get("wind_kph"),
                wind_dir=hour_data.get("wind_dir"),
                precip_mm=hour_data.get("precip_mm"),
                humidity=hour_data.get("humidity"),
                chance_of_rain=hour_data.get("chance_of_rain")
            ))
        return hourly_forecasts

    def _format_alerts(self, alerts_data: List[Dict[str, Any]]) -> List[WeatherAlert]:
        """
        Converts alert data from WeatherAPI.com to WeatherAlert models.

        Args:
            alerts_data: List of alert items from the API response

        Returns:
            List[WeatherAlert]: List of weather alerts
        """
        alerts = []
        for alert_data in alerts_data:
            alerts.append(WeatherAlert(
                headline=alert_data.get("headline"),
                event=alert_data.get("event"),
                effective=alert_data.get("effective"),
                expires=alert_data.get("expires"),
                description=alert_data.get("desc"),
                instruction=alert_data.get("instruction")
            ))
        return alerts

    def _translate_condition(self, condition_text: str) -> str:
        """
        Translates weather condition text to Vietnamese.
        If the translation is not in the local dictionary, it uses Google Translate.

        Args:
            condition_text: The weather condition in English.

        Returns:
            The translated weather condition in Vietnamese.
        """
        return self.weather_conditions_translation.get(condition_text, self._translate_with_google(condition_text))

    def _translate_with_google(self, text: str, dest_language: str = "vi") -> str:
        """
        Translates text using Google Translate as a fallback.

        Args:
            text: The text to translate.
            dest_language: The destination language (default: Vietnamese).

        Returns:
            The translated text or the original text if translation fails.
        """
        try:
            return GoogleTranslator(source='auto', target=dest_language).translate(text)
        except Exception:
            # In case of any error with the translation service, return the original text
            return text
