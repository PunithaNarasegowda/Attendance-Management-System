from pydantic import BaseModel, Field
from typing import List 
from datetime import date 

class LectureCreate(BaseModel):
    lecture_id: int 
    lecture_date: date = Field(default_factory=date.today) 
    course_id: str 
    section_name: str 
    section_name: str 
    faculty_id: str 
    
class AttendanceToggle(BaseModel):
    roll_no: str 
    is_present: bool 
    
class MarkAttendanceRequest(BaseModel):
    lecture_id: int 
    attendance_records: List[AttendanceToggle]
    
class BatchPerformance(BaseModel):
    section_name: str 
    course_id: str 
    average_attendance: float 
    student_count: int