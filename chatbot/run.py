"""Run helper for development."""
import os
from dotenv import load_dotenv

load_dotenv()

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)), reload=True)
