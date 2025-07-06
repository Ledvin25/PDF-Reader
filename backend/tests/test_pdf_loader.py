import pytest
from pdf_loader import split_into_chunks

def test_split_into_chunks_basic():
    text = "a b c d e f g h i j k l m n o p q r s t u v w x y z"
    chunks = split_into_chunks(text, max_chars=10, overlap=2)
    # Cada chunk debe tener máximo 10 caracteres (sin cortar palabras)
    assert all(len(chunk) <= 10 for chunk in chunks)
    # El texto original debe estar contenido en la concatenación de los chunks
    joined = "".join(chunks).replace(" ", "")
    for char in text.replace(" ", ""):
        assert char in joined
    # No hay chunks vacíos
    assert all(chunk for chunk in chunks)

def test_split_into_chunks_short_text():
    text = "short"
    chunks = split_into_chunks(text, max_chars=10, overlap=2)
    assert chunks == ["short"]

def test_split_into_chunks_overlap():
    text = "abcdefghijabcdefghij"
    chunks = split_into_chunks(text, max_chars=10, overlap=5)
    # El segundo chunk debe empezar 5 caracteres antes del final del primero (si hay suficiente texto)
    if len(chunks) > 1:
        assert chunks[1].startswith(text[5:15])
