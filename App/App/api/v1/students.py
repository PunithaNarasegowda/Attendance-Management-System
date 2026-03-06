from fastapi import APIRouter, Depends 
from sqlalchemy.orm import Session 
from App.db.session import get_db 
from App.schemas.responses import APIResponse
from App.services.student_service import StudentService

router = APIRouter()


@router.get("/dashboard/{roll_no}")
def get_student_dashboard(roll_no: str, db: Session = Depends(get_db)):
    cards = StudentService.get_learning_summary(db, roll_no)
    return APIResponse(message="Student dashboard fetched", data={"cards": cards})