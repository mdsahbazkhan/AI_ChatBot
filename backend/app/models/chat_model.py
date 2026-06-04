from pydantic import BaseModel

class ChatRequest(BaseModel):
    session_id: str
    message: str
    use_rag: bool = False
class ChatResponse(BaseModel): 
    response: str

