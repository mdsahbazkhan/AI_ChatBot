import os
import uuid

BASE_STORAGE="storage"

def create_session():
    session_id=str(uuid.uuid4())
    session_path=os.path.join(BASE_STORAGE,session_id)
    pdf_path=os.path.join(session_path,"pdf")
    vectordb_path=os.path.join(session_path, "vectordb")
    
    os.makedirs(pdf_path, exist_ok=True)
    os.makedirs(vectordb_path, exist_ok=True)
    
    return{
        "session_id": session_id,
        "session_path": session_path,
        "pdf_path": pdf_path,
        "vectordb_path": vectordb_path

    }
    
def get_session_path(session_id):

    return os.path.join(
        BASE_STORAGE,
        session_id
    )


def get_pdf_path(session_id):

    return os.path.join(
        BASE_STORAGE,
        session_id,
        "pdf"
    )


def get_vector_path(session_id):

    return os.path.join(
        BASE_STORAGE,
        session_id,
        "vectordb"
    )