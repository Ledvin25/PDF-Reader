import pytest
from ai_client import chat_completion
import os

@pytest.mark.skipif(not os.getenv("OPENAI_API_KEY"), reason="No OPENAI_API_KEY set")
def test_chat_completion_basic():
    messages = [
        {"role": "system", "content": "Eres un asistente útil."},
        {"role": "user", "content": "¿Cuál es la capital de Francia?"}
    ]
    respuesta = chat_completion(messages)
    assert isinstance(respuesta, str)
    assert "París".lower() in respuesta.lower() or "Paris".lower() in respuesta.lower()
