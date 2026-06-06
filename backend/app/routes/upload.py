from fastapi import APIRouter,UploadFile,File,Form
import os
from app.services.pdf_service import (
    load_pdf,
    split_documents
)
from app.services.vector_store import (
    create_vector_store
)
from app.services.metadata_service import save_metadata
from app.services.rag_service import get_pdf_storage
import json
router=APIRouter()


@router.post("/upload-pdf")
async def upload_file(file: UploadFile = File(...),session_id: str = Form(...)):
    
    session_folder = os.path.join(
            "storage",
            session_id
        )

    pdf_folder = os.path.join(
            session_folder,
            "pdf"
        )

    vector_folder = os.path.join(
            session_folder,
            "vectordb"
        )

    os.makedirs(
            pdf_folder,
            exist_ok=True
        )

    os.makedirs(
            vector_folder,
            exist_ok=True
        )

    file_path = os.path.join(pdf_folder,file.filename)

    with open(
            file_path,
            "wb"
        ) as buffer:

            content = await file.read()

            buffer.write(content)

    documents = load_pdf(
            file_path
        )

    chunks = split_documents(
            documents
        )

    create_vector_store(
            chunks,
            vector_folder
        )
    pdf_title = os.path.splitext(file.filename)[0]

    save_metadata(
    session_id,
    pdf_title,
    True
)

    storage_info = os.path.join(
        session_folder,
        "storage_info.json"
    )

    with open(storage_info, "w") as f:
        json.dump({
            "filename": file.filename,
            "chunks": len(chunks),
            "pdf_path": file_path
        }, f)

    return {
            "message":
            "PDF uploaded successfully",

            "session_id":
            session_id,

            "filename":
            file.filename,

            "chunks":
            len(chunks)
        }