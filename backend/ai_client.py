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

# Precios por modelo (USD por 1K tokens, ejemplo para GPT-4o-mini)
MODEL_PRICING = {
    "gpt-4o-mini": {"input": 0.0005, "output": 0.0015},
    # Agrega otros modelos si es necesario
}


def stream_chat(messages: list[dict]):
    # Generador que yield cada trozo de contenido recibido en modo streaming desde OpenAI
    try:
        response = client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=messages,
            temperature=0.0,
            stream=True,
        )
        full_response = ""
        usage = None
        for chunk in response:
            token = chunk.choices[0].delta.content
            if token:
                full_response += token
                yield token
            # usage sólo viene en el último chunk
            if hasattr(chunk, "usage") and chunk.usage:
                usage = chunk.usage
        # Si usage no viene en el stream, hacer una llamada extra para obtenerlo
        if usage is None:
            # Llamada no-stream para obtener usage real
            resp = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=messages + [{"role": "assistant", "content": full_response}],
                temperature=0.0,
                stream=False,
            )
            usage = resp.usage
        # Calcular costo real
        model_price = MODEL_PRICING.get(DEFAULT_MODEL, {"input": 0.001, "output": 0.002})
        prompt_tokens = usage.prompt_tokens if usage else 0
        completion_tokens = usage.completion_tokens if usage else 0
        total_tokens = usage.total_tokens if usage else prompt_tokens + completion_tokens
        cost = (prompt_tokens * model_price["input"] + completion_tokens * model_price["output"]) / 1000
        yield {"type": "usage", "tokens": total_tokens, "cost": cost}
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