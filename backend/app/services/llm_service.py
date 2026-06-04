from dotenv import load_dotenv
from langchain_groq import ChatGroq
from typing import AsyncGenerator

from langchain_core.messages import (HumanMessage,AIMessage,SystemMessage)
from app.memory.session_memory import chat_sessions

load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile")

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
    
    # Send the entire session history to the LLM and get a response
    response=await llm.ainvoke(chat_sessions[session_id])
    
    
    # Store the AI response in session history
    chat_sessions[session_id].append(AIMessage(content=response.content))
    
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