from langchain_huggingface import (
    HuggingFaceEmbeddings
)
from dotenv import load_dotenv
from langchain_groq import ChatGroq

from langchain_chroma import Chroma
load_dotenv()

llm = ChatGroq(
    model="llama3-8b-8192"
)




embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


def get_retriever():

    vector_store = Chroma(
        persist_directory="chroma_db",
        embedding_function=embeddings
    )

    retriever = vector_store.as_retriever(
        search_kwargs={"k": 3}
    )

    return retriever


async def ask_question(question: str):

    retriever = get_retriever()

    docs = retriever.invoke(question)

    context = "\n\n".join(
        [doc.page_content for doc in docs]
    )

    prompt = f"""
    Answer the question only using the
    provided context.

    Context:
    {context}

    Question:
    {question}
    """

    response = await llm.ainvoke(prompt)

    return response.content