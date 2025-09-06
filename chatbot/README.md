EcoFinds Chatbot Backend

FastAPI backend using PostgreSQL (SQLAlchemy + Alembic) and LangChain Groq LLM.

Features:
- Models and migrations for users, products, cart, purchases, and conversations.
- REST API endpoints: health, chat, products, cart, orders.
- Chat integration using Groq LLaMA via `langchain_groq.ChatGroq`.

Quick start (local):

1. Create a Python virtualenv and install dependencies:

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1; pip install -r requirements.txt
```

2. Copy `.env.example` to `.env` and set values (DATABASE_URL, GROQ_API_KEY).

3. Run Alembic migrations:

```powershell
alembic upgrade head
```

4. Start the app:

```powershell
uvicorn app.main:app --reload --port 8000
```

Notes:
- Fill `GROQ_API_KEY` in your environment for chat to work.
