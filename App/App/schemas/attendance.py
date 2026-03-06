from datetime import date

from pydantic import BaseModel, Field


class CreateLectureRequest(BaseModel):
    lecture_id: int
    lecture_date: date | None = None
    status: str = Field(default="Ongoing", max_length=20)
    course_code: str = Field(..., min_length=2, max_length=16)
    section_name: str = Field(..., min_length=1, max_length=20)
    faculty_employee_id: str = Field(..., min_length=2, max_length=32)


class LectureItem(BaseModel):
    lecture_id: int
    lecture_date: date
    status: str
    course_code: str
    section_name: str
    faculty_employee_id: str


class FinalizeLectureResponse(BaseModel):
    lecture_id: int
    status: str


class MarkAttendanceRequest(BaseModel):
    roll_no: str = Field(..., min_length=2, max_length=32)
    lecture_id: int
    is_present: bool


class UpdateAttendanceRequest(BaseModel):
    roll_no: str = Field(..., min_length=2, max_length=32)
    lecture_id: int
    is_present: bool


class AttendanceByLectureItem(BaseModel):
    attendance_id: str
    roll_no: str
    is_present: bool


class AttendanceByStudentItem(BaseModel):
    attendance_id: str
    lecture_id: int
    course_code: str
    section_name: str
    lecture_date: date | None
    is_present: bool


class AttendancePercentage(BaseModel):
    roll_no: str
    course_code: str
    section_name: str
    total_lectures: int
    attended_lectures: int
    percentage: float


class AttendanceSummaryItem(BaseModel):
    roll_no: str
    name: str
    total_lectures: int
    attended_lectures: int
    attendance_percentage: float


class LowAttendanceItem(BaseModel):
    roll_no: str
    name: str
    attendance_percentage: float
