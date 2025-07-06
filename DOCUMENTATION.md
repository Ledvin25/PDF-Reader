# PDF Reader - Brief Documentation

## Design Decisions

- **Full Stack Separation:** The app is split into a FastAPI backend (Python) and a React frontend, each in its own container for modularity and scalability.
- **Streaming Responses (SSE):** The backend uses Server-Sent Events (SSE) for real-time streaming of AI responses, providing a smooth chat experience.
- **Dockerized Workflow:** Both frontend and backend run in Docker containers, making setup and deployment easy and consistent.
- **Token/Cost Tracking:** The backend tracks token usage and cost per chat, and streams this info to the frontend for transparency.
- **Error Handling:** The frontend displays clear error banners, including rate limit errors, and allows retrying failed messages.
- **UI/UX:** The UI is modular, responsive, and Markdown rendering, and export to Markdown.

## Challenges Faced & Solutions

- **SSE (Server-Sent Events) Integration:**
  - *Challenge:* I was not initially familiar with using SSE in a React + FastAPI context, especially for streaming AI responses.
  - *Solution:* After research and experimentation, I implemented a custom hook in React to handle the SSE stream, parse events, and update the UI in real time. On the backend, FastAPI's `StreamingResponse` was used to yield tokens as they arrive from OpenAI.

- **Session Management:**
  - *Challenge:* The app was originally designed for a single chat session. Adding multi-session support required significant refactoring, especially to keep chat histories and token/cost stats per session. Actually, chat session management could not be completed in the backend/frontend logic due to time constraints and initial design.
  - *Solution:* The UI was refactored to support multiple sessions, and the backend was updated to store chat histories in memory per session. However, full session management is still pending.

## What I Would Improve With More Time

- **Markdown Rendering:**
  - I would further polish the Markdown rendering, ensuring all elements (titles, lists, code, etc.) are styled consistently and beautifully in the chat.

- **Full Multi-Session Support:**
  - I would complete the backend and frontend logic for renaming, deleting, and persisting chat sessions, not just the UI.

- **Conversation Persistence:**
    - Replace in-memory storage with a datastore (Redis or MongoDB) to support true multi-session functionality and allow history recovery after restarts.

- **Authentication and Authorization:**
    - Add client-specific API keys or JWT to control access to the endpoint and apply specific rate limits.

- **Advanced Error Handling:**
  - Add more granular error messages, auto-retry logic, and better feedback for network issues.

- **Testing & Documentation:**
  - Add more automated tests and expand the documentation.

---
