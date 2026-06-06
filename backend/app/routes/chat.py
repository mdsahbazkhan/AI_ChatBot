from fastapi import APIRouter, HTTPException, Form
from fastapi.responses import StreamingResponse
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
    pdf_exists,
    stream_rag_response,
    get_pdf_storage
)

router = APIRouter()


@router.post(
    "/chat/stream",
)
async def chat_stream(request: ChatRequest):
    print(request)

    try:

        pdf_filename = get_pdf_storage(request.session_id) if pdf_exists(request.session_id) else None

        async def generator():
            print("Session ID:", request.session_id)
            print("PDF Exists:", pdf_filename)

            if pdf_filename:
                async for chunk in stream_rag_response(
                    request.session_id,
                    request.message,
                    pdf_filename
                ):
                    yield chunk
            else:
                async for chunk in stream_response(
                    request.session_id,
                    request.message
                ):
                     yield chunk

        return StreamingResponse(
            generator(),
            media_type="text/plain")

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )