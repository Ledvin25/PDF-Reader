# PDF Reader

## Instrucciones para correr la app localmente

1. **Clonar este repositorio:**
   ```bash
   git clone <URL-del-repo>
   cd PDF-Reader
   ```

2. **Asegurarse de tener Docker y Docker Compose instalados.**

3. **Colocar el archivo PDF a analizar en el directorio `backend/` o usar el que viene por defecto.**
   - Para cambiar el PDF, editar la variable de entorno `PDF_PATH` en el archivo `backend/.env` o en el `docker-compose.yml`.

4. **Agregar la clave de OpenAI en el archivo `.env` del backend:**
   - La ruta debe ser: `backend/.env`
   - El archivo debe verse así:
     ```env
     OPENAI_API_KEY=sk-xxxxxxx
     ```

5. **Levantar toda la aplicación (frontend y backend) con Docker Compose:**
   ```bash
   docker compose up --build -d
   ```

6. **Abrir el navegador y acceder a:**
   - [http://localhost:8080](http://localhost:8080) (Frontend)
   - [http://localhost:3001/docs](http://localhost:3001/docs) (API backend)

---

- El frontend está desarrollado en React + Vite y el backend en FastAPI.
- El frontend se sirve automáticamente desde Nginx en el contenedor.
- El backend expone los endpoints `/chat` (SSE), `/health` y `/`.
- Para detener todo, ejecutar:
   ```bash
   docker compose down
   ```

---

Made by Ledvin Leiva

