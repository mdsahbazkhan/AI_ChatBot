from langchain_huggingface import (
    HuggingFaceEmbeddings
)
from dotenv import load_dotenv
from langchain_groq import ChatGroq

from langchain_chroma import Chroma
from typing import AsyncGenerator
import os
import json
load_dotenv()
from langchain_core.messages import (
    SystemMessage,
    HumanMessage,
    AIMessage
)
from app.memory.session_memory import chat_sessions

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
)



embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    model_kwargs={
        "device": "cpu"
    }
)

def pdf_exists(session_id):
    session_folder = os.path.join("storage", session_id)
    info_path = os.path.join(session_folder, "storage_info.json")
    return os.path.exists(info_path)


def get_pdf_storage(session_id):
    session_folder = os.path.join("storage", session_id)
    info_path = os.path.join(session_folder, "storage_info.json")
    if os.path.exists(info_path):
        with open(info_path, "r") as f:
            data = json.load(f)
        return data.get("filename")
    return None

def get_retriever(session_id):
    vector_path = os.path.join(
        "storage",
        session_id,
        "vectordb"
    )
    vector_store = Chroma(
        persist_directory=vector_path,
        embedding_function=embeddings
    )

    return vector_store.as_retriever(
        search_kwargs={"k":6}
        
    )


async def ask_question(session_id: str,
    question: str):

    retriever = get_retriever(session_id)

    docs = retriever.invoke(question)

    context = "\n\n".join(
        [doc.page_content for doc in docs]
    )

    prompt = f"""
You are a PDF assistant.

Answer ONLY using the provided context.

If the answer is not found in the context,
reply exactly:

I couldn't find that information in the uploaded document.

Do not use outside knowledge.

Context:
{context}

Question:
{question}
"""

    response = await llm.ainvoke(prompt)

    return response.content


async def stream_rag_response(
    session_id: str,
    message: str,
    pdf_filename: str = None
) -> AsyncGenerator[str, None]:

    retriever = get_retriever(session_id)
    docs = retriever.invoke(message)

    if not docs:
        yield "I couldn't find that information in the uploaded document."
        return

    context = "\n\n".join([doc.page_content for doc in docs])

    prompt = f"""You are a PDF assistant. Answer ONLY using the provided context. If the answer is not found in the context, reply exactly: I couldn't find that information in the uploaded document. Do not use outside knowledge.

Context:
{context}

Question: {message}"""

    full_response = ""
    async for chunk in llm.astream(
        [HumanMessage(content=prompt)]
    ):
        if chunk.content:
            full_response += chunk.content
            yield chunk.content

    if full_response:
        chat_sessions[session_id].append(
            AIMessage(content=full_response)
        )