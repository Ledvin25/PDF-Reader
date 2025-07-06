import os
import logging
from openai import OpenAI, OpenAIError

PROVIDER = os.getenv("AI_PROVIDER", "openai").lower()

if PROVIDER == "openai":
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    DEFAULT_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    logging.info(f"AI Client configurado para OpenAI, modelo {DEFAULT_MODEL}")
else:
    raise RuntimeError(f"Proveedor de IA no soportado: {PROVIDER}")


def stream_chat(messages: list[dict]):
    # Generador que yield cada trozo de contenido recibido en modo streaming desde OpenAI
    try:
        response = client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=messages,
            temperature=0.0,
            stream=True,
        )
        for chunk in response:
            token = chunk.choices[0].delta.content
            if token:
                yield token
    except OpenAIError as e:
        logging.error(f"Error en OpenAI API: {e}")
        raise RuntimeError(f"OpenAI API error: {e}")


def chat_completion(messages: list[dict]) -> str:
    # Devuelve la respuesta completa como un sólo string
    try:
        resp = client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=messages,
            temperature=0.0
        )
        return resp.choices[0].message.content
    except OpenAIError as e:
        logging.error(f"Error en OpenAI API: {e}")
        raise RuntimeError(f"OpenAI API error: {e}")