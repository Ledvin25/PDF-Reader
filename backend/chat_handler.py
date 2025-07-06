import json
from fastapi.responses import StreamingResponse
from models import ChatRequest
from pdf_loader import get_document_context
from ai_client import stream_chat

async def chat_stream(request: ChatRequest):
    # Recupera los chunks del PDF
    chunks = get_document_context()

    # Monta la conversación inicial (system + PDF + user)
    prompt = [
        {"role": "system", "content": "Eres un asistente que responde basado en el siguiente documento."},
        {"role": "user",   "content": "\n\n".join(chunks)},
        {"role": "user",   "content": request.message}
    ]

    def event_generator():
        try:
            for token in stream_chat(prompt):
                if isinstance(token, dict) and token.get("type") == "usage":
                    payload = {"type": "usage", "tokens": token["tokens"], "cost": token["cost"]}
                    yield f"data: {json.dumps(payload)}\n\n"
                else:
                    payload = {"type": "content", "content": token}
                    yield f"data: {json.dumps(payload)}\n\n"
            done = {"type": "done", "content": None}
            yield f"data: {json.dumps(done)}\n\n"
        except Exception as e:
            error = {"type": "error", "content": str(e)}
            yield f"data: {json.dumps(error)}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
