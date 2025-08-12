# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
import requests
from dotenv import load_dotenv
from docs_store import DocsStore

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MODEL = os.getenv("GROQ_MODEL", "llama3-70b-8192")

if not GROQ_API_KEY:
    raise RuntimeError("Please set GROQ_API_KEY in your .env file")

# Groq API endpoint
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

store = DocsStore()

class ChatRequest(BaseModel):
    messages: list = None
    query: str = None

@app.post("/api/chat")
async def chat(req: ChatRequest):
    if req.messages and len(req.messages) > 0:
        user_text = req.messages[-1].get("content", "")
    elif req.query:
        user_text = req.query
    else:
        raise HTTPException(status_code=400, detail="No input provided")

    top_docs = store.get_top_k(user_text, k=3)

    system_prompt = (
        "You are a helpful assistant. Use the following documents (if relevant) to answer the user's question. "
        "If the answer is not in these documents, say you don't know.\n\n"
    )
    for i, d in enumerate(top_docs):
        system_prompt += f"[Source {i+1}: {d['id']}]:\n{d['text']}\n\n"

    messages = [{"role": "system", "content": system_prompt}]
    if req.messages:
        messages.extend(req.messages)
    else:
        messages.append({"role": "user", "content": user_text})

    try:
        response = requests.post(
            GROQ_API_URL,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": MODEL,
                "messages": messages,
                "max_tokens": 4096,
                "temperature": 0.2
            }
        )

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        data = response.json()
        answer = data["choices"][0]["message"]["content"]

        return {"answer": answer, "sources": [d["id"] for d in top_docs]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/docs/add")
async def add_doc(payload: dict):
    filename = payload.get("filename")
    text = payload.get("text")
    if not filename or not text:
        raise HTTPException(status_code=400, detail="filename and text are required")
    store.add_doc(filename, text)
    return {"ok": True}
