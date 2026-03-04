from pydantic import BaseModel, EmailStr, Field 
from typing import Optional

class FacultyCreate(BaseModel):
    faculty_id: str = Field(...)
    name: str
    email: EmailStr
    department: str 
    

class StudentCreate(BaseModel):
    course_id: str = Field(..., example="CS-321")
    course_name: str 
    
class SectionCreate(BaseModel):
    section_name: str = Field(..., example="CD-3")
    

    