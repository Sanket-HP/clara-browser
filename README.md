# Clara — AI-Powered Autonomous Browser

Clara is a next-generation AI-powered autonomous browser built with a modern frontend/backend architecture. It combines a sleek Electron + React desktop experience with a Python FastAPI backend powered by multi-agent AI capabilities.

## Architecture

```
clara-browser/
├── frontend/          # React + TypeScript + Vite + Electron
│   ├── src/
│   │   ├── components/   # UI components (layout, tabs, AI panel, etc.)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API client services
│   │   ├── store/        # Zustand state management
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # Helpers and constants
│   └── electron/         # Electron main/preload processes
│
├── backend/           # Python FastAPI
│   └── app/
│       ├── agents/       # Multi-agent system (orchestrator, navigation, research, etc.)
│       ├── routers/      # REST API endpoints
│       ├── services/     # Core services (AI, browser automation, memory)
│       ├── models/       # Pydantic schemas and enums
│       └── middleware/   # Auth and request middleware
```

## Features

### Frontend
- **Custom tab system** with smooth animations
- **Glassmorphism UI** with dark theme and accent glow effects
- **AI chat sidebar** — floating panel for conversational commands
- **URL / search bar** with smart navigation
- **Workspace panel** for saving research and bookmarks
- **Settings page** with AI model, search engine, and feature toggles
- **Electron-ready** with webview support and CSP
- **Voice-command architecture** prepared for future integration

### Backend
- **Multi-agent orchestrator** routing tasks to specialised agents:
  - **Navigation Agent** — opens URLs, clicks elements
  - **Research Agent** — searches and summarises web content
  - **Memory Agent** — stores/recalls context via ChromaDB
  - **Automation Agent** — executes multi-step browser workflows
  - **Decision Agent** — handles general conversation with memory augmentation
- **OpenAI integration** for conversational AI and intent classification
- **Playwright browser automation** for autonomous web actions
- **ChromaDB vector memory** for persistent user context
- **Structured logging** with structlog
- **Auth-ready middleware** scaffold

### AI Commands (examples)
- `"Research AI internships"` — agent searches and summarises results
- `"Summarize this website"` — extracts and condenses page content
- `"Open YouTube and search for ML tutorials"` — multi-step automation
- `"Remember that I prefer Python"` — stores to vector memory
- `"What do you remember about me?"` — retrieves stored context

## Getting Started

### Prerequisites
- **Node.js** >= 18
- **Python** >= 3.11
- **OpenAI API key** (set in `.env`)

### Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"

# Install Playwright browsers
playwright install chromium

# Copy env and add your API key
cp .env.example .env

# Run the server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev        # Vite dev server at http://localhost:5173
```

### Run as Electron App

```bash
cd frontend
npm run electron:dev
```

### Run Tests

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm run typecheck
npm run lint
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/chat/` | Send a message to the AI orchestrator |
| `POST` | `/api/chat/classify` | Classify message intent |
| `POST` | `/api/browser/actions` | Execute browser automation actions |
| `GET` | `/api/browser/status` | Browser engine status |
| `POST` | `/api/memory/store` | Store information in vector memory |
| `POST` | `/api/memory/query` | Query vector memory |
| `DELETE` | `/api/memory/clear` | Clear memory entries |
| `GET/POST` | `/api/workspace/` | List/create workspace items |
| `GET/PUT` | `/api/settings/` | Get/update application settings |
| `GET` | `/health` | Health check |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend UI | React 18, TypeScript, Tailwind CSS |
| Build Tool | Vite 5 |
| Desktop Shell | Electron 32 |
| State | Zustand |
| Animations | Framer Motion |
| Icons | Lucide React |
| Backend | FastAPI, Python 3.11+ |
| AI | OpenAI GPT-4o |
| Automation | Playwright |
| Memory | ChromaDB (vector DB) |
| Logging | structlog |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key | — |
| `CLARA_ENV` | Environment mode | `development` |
| `CLARA_PORT` | Backend port | `8000` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:5173` |
| `CHROMA_PERSIST_DIR` | ChromaDB storage path | `./data/chroma` |
| `VITE_API_URL` | Frontend API base URL | `/api` |

## License

MIT
