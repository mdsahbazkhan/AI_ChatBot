from langchain_huggingface import (
    HuggingFaceEmbeddings
)
from dotenv import load_dotenv
from langchain_groq import ChatGroq

from langchain_chroma import Chroma
load_dotenv()
import os

llm = ChatGroq(
    model="llama-3.3-70b-versatile"
)




embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    model_kwargs={
        "device": "cpu"
    }
)

def pdf_exists(session_id):

    vector_path = os.path.join(
        "storage",
        session_id,
        "vectordb"
    )

    return (
        os.path.exists(vector_path)
        and
        len(os.listdir(vector_path)) > 0
    )

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
        search_kwargs={"k":3}
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