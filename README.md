# Velquix — RAG-Powered Intelligent Assistant

A full-stack AI chat application with Retrieval-Augmented Generation (RAG) support. Chat with an LLM or upload a PDF and ask questions grounded exclusively in its content — with real-time streaming responses, auto-named sessions, and persistent multi-session history.

---

## Features

- **Multi-session chat** — create and switch between independent conversations
- **Real-time streaming** — responses stream token-by-token via `StreamingResponse`
- **Auto session naming** — session title is set automatically from the first 30 characters of the first message
- **PDF Q&A (RAG mode)** — upload a PDF and the assistant answers exclusively from its content
- **Automatic mode switching** — `POST /chat/stream` detects whether a PDF is present and routes to RAG or general LLM automatically
- **Persistent history** — chat history and session metadata are saved as JSON per session
- **Responsive UI** — mobile-friendly layout with a collapsible sidebar

---

## Tech Stack

### Backend

| Layer | Technology |
|---|---|
| API framework | FastAPI + Uvicorn |
| LLM provider | [Groq](https://groq.com) — `llama-3.3-70b-versatile` |
| LLM orchestration | LangChain |
| Embeddings | `sentence-transformers/all-MiniLM-L6-v2` (CPU) |
| Vector database | Chroma (`langchain-chroma`) |
| PDF parsing | PyPDF |
| Observability | LangSmith |
| Validation | Pydantic |

### Frontend

| Layer | Technology |
|---|---|
| UI framework | React 19 |
| Build tool | Vite |
| Styling | Tailwind CSS |
| Notifications | react-hot-toast |

---

## Project Structure

```
AI_ChatBot/
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI app entry point + CORS
│   │   ├── routes/
│   │   │   ├── chat.py                # POST /chat/stream (auto LLM or RAG)
│   │   │   ├── upload.py              # POST /upload-pdf
│   │   │   ├── rag_chat.py            # POST /ask (non-streaming RAG)
│   │   │   ├── session.py             # POST /session
│   │   │   └── history.py             # GET /sessions, GET /chat-history/{id}
│   │   ├── services/
│   │   │   ├── llm_service.py         # generate_response, stream_response
│   │   │   ├── rag_service.py         # stream_rag_response, ask_question, retriever
│   │   │   ├── pdf_service.py         # PDF loading and chunking
│   │   │   ├── vector_store.py        # Chroma vector store creation
│   │   │   ├── session_service.py     # Session directory init
│   │   │   ├── chat_history_service.py# JSON read/write for chat history
│   │   │   └── metadata_service.py    # Session title + has_pdf flag
│   │   ├── models/                    # Pydantic request/response models
│   │   ├── config/                    # App settings
│   │   └── memory/
│   │       └── session_memory.py      # In-memory chat_sessions dict
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                    # Root component, global state
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx         # Message list + streaming renderer
│   │   │   ├── ChatInput.jsx          # Input bar + PDF upload button
│   │   │   ├── Sidebar.jsx            # Session list
│   │   │   └── Header.jsx             # Top bar
│   │   └── services/api.js            # Fetch-based API client
│   ├── vite.config.js
│   └── package.json
│
└── storage/                           # Auto-created at runtime
    └── {session_id}/
        ├── chat.json                  # Full conversation history
        ├── metadata.json              # { title, has_pdf }
        ├── storage_info.json          # { filename, chunks, pdf_path }
        ├── pdf/                       # Uploaded PDF files
        └── vectordb/                  # Chroma vector database
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A [Groq API key](https://console.groq.com)

---

### Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create the environment file
cp .env.example .env            # then set GROQ_API_KEY in .env

# Start the server
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`.

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create the environment file
echo 'VITE_API_URL=http://127.0.0.1:8000' > .env

# Start the dev server
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## Environment Variables

### Backend — `backend/.env`

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Your Groq API key |

### Frontend — `frontend/.env`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (default: `http://127.0.0.1:8000`) |

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/session` | Create a new session; returns `session_id` |
| `GET` | `/sessions` | List all sessions with `title` and `has_pdf` flag |
| `POST` | `/chat/stream` | Stream a chat response — auto-routes to RAG if PDF is present |
| `POST` | `/upload-pdf` | Upload and index a PDF; returns filename and chunk count |
| `GET` | `/chat-history/{session_id}` | Load full chat history for a session |
| `POST` | `/ask` | Non-streaming RAG question answering |

### `POST /chat/stream`

```json
{ "session_id": "uuid", "message": "your message" }
```

Returns `text/plain` streaming response. Automatically uses RAG if a PDF has been uploaded for the session.

### `POST /upload-pdf`

Multipart form: `file` (PDF), `session_id` (string).

```json
{ "message": "PDF uploaded successfully", "session_id": "...", "filename": "...", "chunks": 42 }
```

---

## How RAG Works

1. User uploads a PDF — backend saves it to `storage/{session_id}/pdf/`
2. PyPDF extracts the text; LangChain splits it into chunks (size: 1000, overlap: 200)
3. Chunks are embedded with `all-MiniLM-L6-v2` (CPU) and stored in a per-session Chroma database
4. On the next message, the top 3 most relevant chunks are retrieved and injected into the LLM prompt
5. The model is instructed to answer only from the provided context — if the answer is not found, it replies: *"I couldn't find that information in the uploaded document."*

---

## Frontend Scripts

```bash
npm run dev       # Start Vite dev server (HMR)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```
