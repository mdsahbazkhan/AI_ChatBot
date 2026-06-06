# AI ChatBot with RAG

A full-stack AI chat application with Retrieval-Augmented Generation (RAG) support. Chat with an LLM or upload a PDF and ask questions grounded in its content — all with real-time streaming responses and persistent multi-session history.

---

## Features

- **Multi-session chat** — create and switch between independent conversations
- **Real-time streaming** — responses stream token by token
- **PDF Q&A (RAG mode)** — upload a PDF and the assistant answers exclusively from its content
- **Persistent history** — chat history and metadata are saved per session as JSON
- **Responsive UI** — mobile-friendly layout with a collapsible sidebar

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| API framework | FastAPI + Uvicorn |
| LLM provider | [Groq](https://groq.com) (`llama-3.3-70b-versatile`) |
| LLM orchestration | LangChain |
| Embeddings | `sentence-transformers/all-MiniLM-L6-v2` |
| Vector database | Chroma (via `langchain-chroma`) |
| PDF parsing | PyPDF |
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
│   │   ├── main.py              # FastAPI app + CORS config
│   │   ├── routes/              # API endpoints (chat, upload, session, history)
│   │   ├── services/            # Business logic (llm, rag, pdf, vector_store, session, history)
│   │   ├── models/              # Pydantic request/response models
│   │   ├── config/              # App settings
│   │   └── memory/              # In-memory session state
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Root component, global state
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx   # Message list + streaming renderer
│   │   │   ├── ChatInput.jsx    # Input bar + PDF upload button
│   │   │   ├── Sidebar.jsx      # Session list
│   │   │   └── Header.jsx       # Top bar
│   │   └── services/api.js      # API client
│   ├── vite.config.js
│   └── package.json
│
└── storage/                     # Auto-created at runtime
    └── {session_id}/
        ├── chat.json            # Full conversation history
        ├── metadata.json        # Title, has_pdf flag
        ├── storage_info.json    # PDF filename + chunk count
        ├── pdf/                 # Uploaded PDF files
        └── vectordb/            # Chroma vector database
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

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env            # then edit .env and add your GROQ_API_KEY

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

# Configure environment
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
| `VITE_API_URL` | URL of the backend API (default: `http://127.0.0.1:8000`) |

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/session` | Create a new chat session |
| `GET` | `/sessions` | List all sessions |
| `POST` | `/chat/stream` | Stream a chat response (auto-switches to RAG if PDF is present) |
| `POST` | `/upload-pdf` | Upload and index a PDF for the session |
| `GET` | `/chat-history/{session_id}` | Retrieve chat history for a session |

---

## How RAG Works

1. User uploads a PDF via the chat input
2. Backend extracts text with PyPDF and splits it into chunks (size: 1000, overlap: 200)
3. Chunks are embedded with `all-MiniLM-L6-v2` and stored in a per-session Chroma database
4. On the next message, the top 3 relevant chunks are retrieved and injected into the LLM prompt
5. The model is instructed to answer only from the provided context

---

## Available Scripts (Frontend)

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```
