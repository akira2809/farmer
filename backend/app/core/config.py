from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # MongoDB Configuration
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "nong_dan_ai"

    # JWT Configuration
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # External API Configuration
    WEATHER_API_KEY: str
    WEATHER_API_URL: str

    # Clova Studio API Configuration
    CLOVA_STUDIO_API_KEY: str
    CLOVA_STUDIO_REQUEST_ID: str

    # Application Configuration
    APP_NAME: str = "NÔNG DÂN AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # CORS Configuration
    CORS_ORIGINS: list[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )


settings = Settings()
