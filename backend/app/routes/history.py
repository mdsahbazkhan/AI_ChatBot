from fastapi import APIRouter
import os
from app.services.chat_history_service import (
    load_chat
)
from app.services.metadata_service import load_metadata

router = APIRouter()


@router.get(
    "/chat-history/{session_id}"
)
async def get_chat_history(
    session_id: str
):

    history = load_chat(
        session_id
    )

    return history



@router.get("/sessions")
async def get_sessions():
    

    storage_path = "storage"

    if not os.path.exists(storage_path):
        return []

    sessions = []

    for session_id in os.listdir(storage_path):

        metadata = load_metadata(session_id)

        sessions.append({
    "session_id": session_id,
    "title": metadata["title"],
    "has_pdf": metadata["has_pdf"]
})

    return sessions