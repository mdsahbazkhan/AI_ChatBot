from fastapi import APIRouter

from app.services.session_service import create_session

router = APIRouter()


@router.post("/session")

def new_session():

    return create_session()