from fastapi import APIRouter, HTTPException
from app.models.chat_model import (ChatRequest, ChatResponse)
from fastapi.responses import StreamingResponse

from app.services.llm_service import (generate_response,stream_response)

router = APIRouter()

@router.post("/chat",response_model=ChatResponse)

async def chat(request: ChatRequest):
    try:
        ai_response= await generate_response(request.session_id, request.message)
        return ChatResponse(response= ai_response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    async def response_generator():
           async for chunk in stream_response(request.session_id, request.message):
                    yield chunk
        
    return StreamingResponse(response_generator(), media_type="text/plain")