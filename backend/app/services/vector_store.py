from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

_embeddings = None


def get_embeddings():
    global _embeddings

    if _embeddings is None:
        _embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={
                "device": "cpu"
            }
        )

    return _embeddings


def create_vector_store(chunks, persist_directory):

    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=get_embeddings(),
        persist_directory=persist_directory
    )

    return vector_store