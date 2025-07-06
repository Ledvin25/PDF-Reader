# app/pdf_loader.py
import os
import logging
from PyPDF2 import PdfReader

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s %(levelname)s %(message)s')

_document_chunks: list[str] = []


def load_pdf(path: str) -> None:
    # Carga y parsea el PDF en chunks para toda la app
    logging.debug(f"Verificando si el archivo existe: {path}")
    if not os.path.isfile(path):
        raise FileNotFoundError(f"PDF no encontrado en {path}")

    logging.info(f"Cargando PDF desde {path}")
    reader = PdfReader(path)
    full_text = ""
    logging.debug(f"Total de páginas en el PDF: {len(reader.pages)}")

    for i, page in enumerate(reader.pages):
        logging.debug(f"Extrayendo texto de la página {i}")
        text = page.extract_text() or ""
        logging.debug(f"Texto extraído (primeros 100 chars): {text[:100]}")
        full_text += text + "\n"

    logging.debug(f"Texto completo extraído (primeros 200 chars): {full_text[:200]}")
    full_text = " ".join(full_text.split())
    logging.debug(f"Texto limpio (primeros 200 chars): {full_text[:200]}")

    _document_chunks[:] = split_into_chunks(full_text)
    logging.info(f"PDF procesado: {len(_document_chunks)} chunks generados")


def get_document_context() -> list[str]:
    # Devuelve los chunks cargados. Lanza si no se ha llamado a load_pdf.
    if not _document_chunks:
        raise RuntimeError("No hay contexto cargado: ejecuta load_pdf() primero")

    return _document_chunks


def split_into_chunks(text: str, max_chars=1500, overlap=200) -> list[str]:
    # Divide un texto largo en trozos manejables con solapamiento
    chunks = []
    start = 0
    length = len(text)
    logging.debug(f"Iniciando split_into_chunks: texto de {length} caracteres")

    while start < length:
        end = min(start + max_chars, length)

        # Busca el último espacio antes del límite para no cortar palabras
        if end < length:
            space = text.rfind(" ", start, end)
            if space > start:
                end = space

        chunk = text[start:end].strip()
        if chunk and (not chunks or chunk != chunks[-1]):
            logging.debug(f"Chunk generado (start={start}, end={end}): '{chunk[:100]}'")
            chunks.append(chunk)

        # Si ya llegamos al final, salimos
        if end >= length:
            break

        next_start = end - overlap if end - overlap > start else end
        if next_start <= start or next_start < 0:
            break

        start = next_start

    logging.debug(f"Total de chunks generados: {len(chunks)}")
    return chunks
