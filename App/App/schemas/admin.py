from pydantic import BaseModel, ConfigDict, EmailStr, Field


class FacultyCreate(BaseModel):
    employee_id: str = Field(..., min_length=2, max_length=32)
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=6)
    department: str | None = Field(default=None, max_length=80)


class FacultyUpdate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    department: str | None = Field(default=None, max_length=80)


class CourseCreate(BaseModel):
    code: str = Field(..., min_length=2, max_length=16)
    name: str = Field(..., min_length=2, max_length=120)
    credits: int = Field(..., ge=1, le=10)
    department: str | None = Field(default=None, max_length=80)


class CourseUpdate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    credits: int = Field(..., ge=1, le=10)
    department: str | None = Field(default=None, max_length=80)


class SectionCreate(BaseModel):
    course_code: str = Field(..., min_length=2, max_length=16)
    name: str = Field(..., min_length=1, max_length=20)


class FacultySectionAssignRequest(BaseModel):
    course_code: str = Field(..., min_length=2, max_length=16)
    section_name: str = Field(..., min_length=1, max_length=20)
    employee_id: str = Field(..., min_length=2, max_length=32)


class StudentCreate(BaseModel):
    roll_no: str = Field(..., min_length=2, max_length=32)
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=6)
    batch_year: int = Field(..., ge=1990, le=2100)
    department: str | None = Field(default=None, max_length=80)


class StudentUpdate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    batch_year: int = Field(..., ge=1990, le=2100)
    department: str | None = Field(default=None, max_length=80)


class StudentEnrollmentCreate(BaseModel):
    roll_no: str = Field(..., min_length=2, max_length=32)
    course_code: str = Field(..., min_length=2, max_length=16)
    section_name: str = Field(..., min_length=1, max_length=20)


class DashboardStats(BaseModel):
    total_users: int
    courses: int
    sections: int
    students: int


class StudentListItem(BaseModel):
    roll_no: str
    name: str
    email: EmailStr
    batch_year: int


class FacultyListItem(BaseModel):
    employee_id: str
    name: str
    email: EmailStr
    department: str | None


class CourseListItem(BaseModel):
    code: str
    name: str
    credits: int
    department: str | None


class SectionLookupItem(BaseModel):
    name: str
    course_code: str
    faculty_employee_id: str | None


class EnrollmentItem(BaseModel):
    roll_no: str
    course_code: str


class DashboardData(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    stats: DashboardStats
    students: list[StudentListItem]
    faculty: list[FacultyListItem]
    courses: list[CourseListItem]
    enrollments: list[EnrollmentItem]


class AdminLookups(BaseModel):
    students: list[StudentListItem]
    faculty: list[FacultyListItem]
    courses: list[CourseListItem]
    sections: list[SectionLookupItem]
    enrollments: list[EnrollmentItem]

    
