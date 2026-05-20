"""Centralised configuration loaded from environment variables."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings sourced from env / .env file."""

    openai_api_key: str = ""
    clara_env: str = "development"
    clara_log_level: str = "INFO"
    clara_host: str = "0.0.0.0"
    clara_port: int = 8000
    cors_origins: str = "http://localhost:5173,http://localhost:3000"
    chroma_persist_dir: str = "./data/chroma"
    chroma_collection_name: str = "clara_memory"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def is_dev(self) -> bool:
        return self.clara_env == "development"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
