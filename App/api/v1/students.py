from fastapi import APIRouter, Depends 
from sqlalchemy.orm import Session 
from sqlalchemy import text 
from App.db.session import get_db 

router = APIRouter()

@router.get("/dashboard/{roll_no}")
def get_student_dashboard(roll_no: str, db: Session = Depends(get_db)):
    pass