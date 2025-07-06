# PDF Reader

## Instrucciones para correr la app localmente

1. **Clona este repositorio:**
   ```bash
   git clone <URL-del-repo>
   cd PDF-Reader
   ```

2. **Asegúrate de tener Docker y Docker Compose instalados.**

3. **Copia tu archivo PDF al directorio `backend/` o usa el que viene por defecto.**
   - Puedes cambiar el PDF editando la variable de entorno `PDF_PATH` en el archivo `backend/.env` o en el `docker-compose.yml`.

4. **Agrega tu clave de OpenAI en el archivo `.env` del backend:**
   - La ruta debe ser: `backend/.env`
   - El archivo debe verse así:
     ```env
     OPENAI_API_KEY=sk-xxxxxxx
     # (opcional) PDF_PATH=./Accessible_Travel_Guide_Partial.pdf
     ```

5. **Levanta toda la aplicación (frontend y backend) con Docker Compose:**
   ```bash
   docker compose up --build -d
   ```

6. **Abre tu navegador y accede a:**
   - [http://localhost:8080](http://localhost:8080) (Frontend)
   - [http://localhost:3001/docs](http://localhost:3001/docs) (API backend)

---

- El frontend está en React + Vite y el backend en FastAPI.
- El frontend se sirve automáticamente desde Nginx en el contenedor.
- El backend expone endpoints `/chat` (SSE), `/health` y `/`.
- Puedes detener todo con:
   ```bash
   docker compose down
   ```

---

