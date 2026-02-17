"""Agentic workflow runtime settings."""

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class AgenticSettings(BaseSettings):
    """Settings for workflow tracing, checkpointing, and retries."""

    model_config = SettingsConfigDict(env_prefix="BITNET_AGENTIC_", extra="ignore")

    tracing_enabled: bool = Field(default=True)
    checkpoint_backend: str = Field(default="memory")
    retry_limit: int = Field(default=1, ge=0)
    checkpoint_namespace: str = Field(default="bitnet:workflow")
    redis_url: str = Field(default="redis://localhost:6379/0")
    postgres_dsn: str = Field(default="postgresql://localhost:5432/bitnet")
