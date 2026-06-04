from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.chat import router
from app.routes.upload import router as upload_router
from app.routes.rag_chat import (
    router as rag_router
)

app=FastAPI(title="AI Chat API", description="A simple API for AI chat interactions", version="1.0.0")
app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AI Chatbot Backend Running"}
app.include_router(router)
app.include_router(upload_router)
app.include_router(rag_router)
