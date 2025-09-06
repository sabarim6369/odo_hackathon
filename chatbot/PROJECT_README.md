This folder contains the EcoFinds Chatbot Backend starter using FastAPI, SQLAlchemy, Alembic, and LangChain Groq.

Files added:
- `app/` - FastAPI app package (models, routes, db, crud, schemas).
- `alembic/` - Alembic configuration and placeholder migration.
- `requirements.txt` - dependencies to install.
- `.env.example` - environment variable template.

Next steps:
1. Create a Python venv and install requirements.
2. Configure `DATABASE_URL` and `GROQ_API_KEY` in `.env`.
3. Run `alembic revision --autogenerate -m "init"` then `alembic upgrade head` to create DB tables.
4. Start the server with `python run.py` or `uvicorn app.main:app --reload`.
