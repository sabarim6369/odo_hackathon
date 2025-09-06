import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..db import get_db
from langchain_groq import ChatGroq

router = APIRouter()


def get_llm():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY not set")
    return ChatGroq(model="llama3-70b-8192", api_key=api_key, temperature=0.3)


@router.post("/chat")
def chat_message(conv: schemas.ConversationCreate, db: Session = Depends(get_db)):
    # save user message
    crud.save_conversation(db, conv.userId, conv.sessionId, conv.message, conv.role)

    # retrieve history
    history = crud.get_conversation_history(db, conv.userId, conv.sessionId)
    # prepare messages for LLM
    messages = []
    for m in history:
        messages.append({"role": m.role, "content": m.message})

    # add current user message
    messages.append({"role": conv.role, "content": conv.message})

    # call LLM
    llm = get_llm()
    try:
        resp = llm.chat(messages)
        assistant_text = resp["content"] if isinstance(resp, dict) and "content" in resp else str(resp)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # save assistant reply
    crud.save_conversation(db, conv.userId, conv.sessionId, assistant_text, "assistant")

    return {"reply": assistant_text}
