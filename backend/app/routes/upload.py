from fastapi import APIRouter,UploadFile,File
import os
from app.services.pdf_service import (
    load_pdf,
    split_documents
)
from app.services.vector_store import (
    create_vector_store
)
router=APIRouter()


@router.post("/upload-pdf")
async def upload_file(
    file: UploadFile = File(...)):
    upload_dir="uploads"
    
    os.makedirs(upload_dir,exist_ok=True)
    file_path=os.path.join(upload_dir,file.filename)
    with open(file_path,"wb") as buffer:
        content=await file.read()
        buffer.write(content)
        # Load PDF
        documents=load_pdf(file_path)
        
        # Split PDF into chunks
        chunks=split_documents(documents)
        vector_store = create_vector_store(
    chunks
)
        
        print(f"Extracted {len(chunks)} chunks from the PDF.")
        print(chunks[0].page_content[:300])
    return {
        "message":
        "PDF Upload Successfully",
        "filename":
        file.filename,
        "chunks":
        len(chunks)
    }