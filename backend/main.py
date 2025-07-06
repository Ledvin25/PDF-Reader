from fastapi import FastAPI, HTTPException, status, Request
from fastapi.responses import JSONResponse
import os
from pdf_loader import load_pdf
from chat_handler import chat_stream
from models import ChatRequest
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# --- CORS flexible para desarrollo y producción ---
frontend_origins = [
    "http://localhost:8080",
    "http://localhost",
    "http://127.0.0.1:8080",
    "http://127.0.0.1"
]

extra_origins = os.getenv("FRONTEND_ORIGINS")

if extra_origins:
    frontend_origins.extend([o.strip() for o in extra_origins.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Manejo global de errores inesperados ---
@app.exception_handler(Exception)
def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error", "error": str(exc)},
    )

# --- Cargar PDF al iniciar la app ---
@app.on_event("startup")
def startup_event():
    pdf_path = os.getenv("PDF_PATH", "./Accessible_Travel_Guide_Partial.pdf")

    try:
        load_pdf(pdf_path)
    except Exception as e:
        print(f"Error al cargar el PDF en el startup: {e}")

# --- Health check: verifica PDF y API key ---
@app.get("/health", response_model=dict, tags=["System"])
async def health():
    from pdf_loader import _document_chunks

    status_val = "ok"
    details = {}

    if not _document_chunks:
        status_val = "error"
        details["pdf"] = "No hay chunks cargados. El PDF no fue procesado correctamente."
    else:
        details["pdf"] = f"{len(_document_chunks)} chunks cargados."

    if not os.getenv("OPENAI_API_KEY"):
        status_val = "error"
        details["openai"] = "OPENAI_API_KEY no está configurada."
    else:
        details["openai"] = "OPENAI_API_KEY presente."

    code = status.HTTP_200_OK if status_val == "ok" else status.HTTP_503_SERVICE_UNAVAILABLE

    return JSONResponse(status_code=code, content={"status": status_val, "details": details})

# --- Endpoint principal de chat (streaming) ---
@app.post("/chat", response_model=dict, tags=["Chat"])
async def chat_endpoint(request: ChatRequest):
    try:
        return await chat_stream(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en chat: {str(e)}")

# --- Endpoint raíz: mensaje de bienvenida ---
@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Hello from FastAPI backend!"}
