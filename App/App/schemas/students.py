from pydantic import BaseModel 
from datetime import date 
from typing import List 


class AttendanceHistory(BaseModel):
    lecture_id: int 
    lecture_date: date 
    status: str 
    
class StudentDashboardCard(BaseModel):
    course_id: str 
    course_name: str 
    attendance_percentage: float 
    total_lectures: int 
    attended_lectures: int 
    is_low_attendance: bool 
    