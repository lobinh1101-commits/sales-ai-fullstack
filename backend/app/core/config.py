from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    app_timezone: str = "Asia/Ho_Chi_Minh"
    database_url: str = "postgresql+psycopg://sales_ai:sales_ai@db:5432/sales_ai"
    jwt_secret: str = "change-me-development-only-32-bytes-min"
    access_token_minutes: int = 20
    refresh_token_days: int = 7
    cors_origins: str = "http://localhost:5173,http://localhost:8080"
    ai_provider: str = "mock"
    gemini_api_key: str = ""
    ai_model: str = ""
    ai_timeout_seconds: int = 10
    seed_demo_data: bool = True
    demo_admin_password: str = "Admin@12345"
    demo_sales_password: str = "Sales@12345"
    demo_owner_password: str = "Owner@12345"
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origin_list(self) -> list[str]:
        return [x.strip() for x in self.cors_origins.split(",") if x.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
