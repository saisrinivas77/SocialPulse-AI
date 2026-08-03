"""Provider-agnostic AI base abstractions.

This module defines the shared contract used by all AI providers,
prompt chains, and orchestration services. The goal is to keep the AI
layer replaceable without changing business logic or API handlers.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import StrEnum
from typing import Any, AsyncIterator


class AIProviderName(StrEnum):
    """Supported provider identifiers.

    The enum is intentionally broad so the application can support future
    vendors without changing the call sites.
    """

    OPENAI = "openai"
    GEMINI = "gemini"
    HUGGINGFACE = "huggingface"
    OLLAMA = "ollama"
    ANTHROPIC = "anthropic"
    AZURE_OPENAI = "azure_openai"
    GROQ = "groq"
    MISTRAL = "mistral"
    DEEPSEEK = "deepseek"


@dataclass(slots=True)
class AIMessage:
    """Single message passed to an AI provider.

    Attributes:
        role: The message role, for example `system`, `user`, or `assistant`.
        content: The natural language content.
    """

    role: str
    content: str


@dataclass(slots=True)
class AIRequest:
    """Normalized request object for all AI operations."""

    prompt: str
    provider: AIProviderName | str
    model: str | None = None
    temperature: float = 0.7
    max_tokens: int | None = None
    top_p: float | None = None
    stream: bool = False
    metadata: dict[str, Any] = field(default_factory=dict)
    messages: list[AIMessage] = field(default_factory=list)


@dataclass(slots=True)
class AIResponse:
    """Normalized response returned by AI providers."""

    text: str
    provider: AIProviderName | str
    model: str | None = None
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0
    metadata: dict[str, Any] = field(default_factory=dict)


class BaseAIProvider(ABC):
    """Abstract base class implemented by every AI provider adapter."""

    def __init__(self, model_name: str | None = None) -> None:
        self.model_name = model_name

    @property
    @abstractmethod
    def provider_name(self) -> AIProviderName:
        """Return the canonical provider name."""

    @abstractmethod
    async def generate_text(self, request: AIRequest) -> AIResponse:
        """Generate a single text response for the supplied request."""

    async def stream_text(self, request: AIRequest) -> AsyncIterator[str]:
        """Stream text chunks when a provider supports streaming.

        Providers that do not implement streaming can inherit this default
        behavior, which raises a clear runtime error.
        """

        raise NotImplementedError(
            f"Streaming is not implemented for {self.provider_name.value}."
        )

    async def health_check(self) -> bool:
        """Check whether the provider is reachable and properly configured."""

        return True


__all__ = [
    "AIMessage",
    "AIProviderName",
    "AIRequest",
    "AIResponse",
    "BaseAIProvider",
]