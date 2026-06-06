from fastapi import APIRouter, HTTPException
from app.models.chat_model import (
    ChatRequest,
    ChatResponse
)

from app.services.llm_service import (
    generate_response,
    stream_response
)

from app.services.rag_service import (
    ask_question,
      pdf_exists
)

from fastapi.responses import StreamingResponse

router = APIRouter()


@router.post(
    "/chat/stream",
    response_model=ChatResponse
)
async def chat_stream(request: ChatRequest):

    try:

        if pdf_exists(request.session_id):

            ai_response = await ask_question(
            request.session_id,
            request.message
        )

        else:

            ai_response = await generate_response(
            request.session_id,
            request.message
    )

        return ChatResponse(
            response=ai_response
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )