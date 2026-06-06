from fastapi import APIRouter
from pydantic import BaseModel

from app.services.rag_service import (
    ask_question
)

router = APIRouter()


class QuestionRequest(BaseModel):
    question: str
    session_id: str


@router.post("/ask")
async def ask(
    request: QuestionRequest
):

    answer = await ask_question(
        request.session_id,
        request.question
    )

    return {
        "answer": answer
    }