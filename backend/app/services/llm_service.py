from dotenv import load_dotenv
from langchain_groq import ChatGroq
from typing import AsyncGenerator

from langchain_core.messages import (HumanMessage,AIMessage,SystemMessage)
from app.memory.session_memory import chat_sessions
from app.services.chat_history_service import (
    save_chat,
    prepare_chat_history
)
from app.services.metadata_service import (
    load_metadata,
    save_metadata
)

import os

load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile",api_key=os.getenv("GROQ_API_KEY"),)

async def generate_response(session_id: str,
    message: str):
    
    # Create a new session if it doesn't exist
    if session_id not in chat_sessions:
        chat_sessions[session_id] = [
            SystemMessage(content="""
                           You are a helpful AI assistant.
            Answer clearly and professionally.
            Keep responses concise.
            """)
        ]
        
    # Add user message to session history
    chat_sessions[session_id].append(HumanMessage(content=message))
    metadata = load_metadata(
    session_id
)

    if (
        metadata["title"] == "New Chat"
    and
    metadata["has_pdf"] == False
):

        save_metadata(

        session_id,

        message[:30],

        False

    )
    
    # Send the entire session history to the LLM and get a response
    response=await llm.ainvoke(chat_sessions[session_id])
    
    
    # Store the AI response in session history
    chat_sessions[session_id].append(AIMessage(content=response.content))
    messages = []

    for msg in chat_sessions[session_id]:

        if isinstance(msg, HumanMessage):

         messages.append({
            "role":"user",
            "content":msg.content
        })

        elif isinstance(msg, AIMessage):

            messages.append({
            "role":"assistant",
            "content":msg.content
        })
    save_chat(
    session_id,
    prepare_chat_history(
        chat_sessions[session_id]
    )
)
    
    return response.content 

async def stream_response(
    session_id: str,
    message: str
) -> AsyncGenerator[str, None]:

    if session_id not in chat_sessions:

        chat_sessions[session_id] = [

            SystemMessage(
                content="""
                You are a helpful AI assistant.
                Keep responses concise.
                """
            )

        ]

    chat_sessions[session_id].append(
        HumanMessage(content=message)
    )
    metadata = load_metadata(
    session_id
)

    if (
        metadata["title"] == "New Chat"
    and
    metadata["has_pdf"] == False
):

        save_metadata(

        session_id,

        message[:30],

        False

    )
    full_response = ""

    async for chunk in llm.astream(
        chat_sessions[session_id]
    ):

        if chunk.content:

            full_response += chunk.content

            yield chunk.content

    chat_sessions[session_id].append(
        AIMessage(content=full_response)
    )
    save_chat(
    session_id,
    prepare_chat_history(
        chat_sessions[session_id]
    )
)