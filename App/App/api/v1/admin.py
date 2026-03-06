from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from App.db.session import get_db
from App.repositories.admin_repo import AdminRepository
from App.schemas.admin import (
    CourseCreate,
    CourseUpdate,
    DashboardData,
    FacultyCreate,
    FacultyUpdate,
    FacultySectionAssignRequest,
    SectionCreate,
    StudentCreate,
    StudentEnrollmentCreate,
    StudentUpdate,
)
from App.schemas.responses import APIResponse
from App.services.admin_service import AdminService

router = APIRouter(prefix="/admin", tags=["Admin"])


def _admin_service(db: Session) -> AdminService:
    return AdminService(AdminRepository(db))


@router.get("/dashboard", response_model=APIResponse)
def get_dashboard(db: Session = Depends(get_db)):
    service = _admin_service(db)
    dashboard: DashboardData = service.get_dashboard()
    return APIResponse(message="Dashboard fetched", data=dashboard.model_dump())


@router.get("/lookups", response_model=APIResponse)
def get_lookups(db: Session = Depends(get_db)):
    service = _admin_service(db)
    return APIResponse(message="Lookup data fetched", data=service.get_lookups().model_dump())


@router.post("/faculty", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
def create_faculty(payload: FacultyCreate, db: Session = Depends(get_db)):
    service = _admin_service(db)
    created = service.create_faculty(
        employee_id=payload.employee_id,
        name=payload.name,
        email=payload.email,
        password=payload.password,
        department=payload.department,
    )
    return APIResponse(
        message="Faculty created",
        data={
            "employee_id": created.employee_id,
            "name": created.name,
            "email": created.email,
            "department": created.department,
        },
    )


@router.post("/courses", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
def create_course(payload: CourseCreate, db: Session = Depends(get_db)):
    service = _admin_service(db)
    created = service.create_course(payload)
    return APIResponse(
        message="Course created",
        data={
            "code": created.code,
            "name": created.name,
            "credits": created.credits,
            "department": created.department,
        },
    )


@router.post("/sections", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
def create_section(payload: SectionCreate, db: Session = Depends(get_db)):
    service = _admin_service(db)
    created = service.create_section(payload)
    return APIResponse(
        message="Section created",
        data={
            "name": created.name,
            "course_code": created.course_code,
            "faculty_employee_id": created.faculty_employee_id,
        },
    )


@router.post("/sections/assign-faculty", response_model=APIResponse)
def assign_faculty(payload: FacultySectionAssignRequest, db: Session = Depends(get_db)):
    service = _admin_service(db)
    updated = service.assign_faculty_to_section(payload)
    return APIResponse(
        message="Faculty assigned to section",
        data={
            "name": updated.name,
            "course_code": updated.course_code,
            "faculty_employee_id": updated.faculty_employee_id,
        },
    )


@router.post("/students", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
def create_student(payload: StudentCreate, db: Session = Depends(get_db)):
    service = _admin_service(db)
    created = service.create_student(
        roll_no=payload.roll_no,
        name=payload.name,
        email=payload.email,
        password=payload.password,
        batch_year=payload.batch_year,
        department=payload.department,
    )
    return APIResponse(
        message="Student created",
        data={
            "roll_no": created.roll_no,
            "name": created.name,
            "email": created.email,
            "batch_year": created.batch_year,
            "department": created.department,
        },
    )


@router.post("/enrollments", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
def enroll_student(payload: StudentEnrollmentCreate, db: Session = Depends(get_db)):
    service = _admin_service(db)
    created = service.enroll_student(payload)
    return APIResponse(
        message="Student enrolled",
        data={
            "id": created.id,
            "student_roll_no": created.student_roll_no,
            "course_code": created.course_code,
            "section_name": payload.section_name,
        },
    )


@router.get("/students", response_model=APIResponse)
def list_students(db: Session = Depends(get_db)):
    service = _admin_service(db)
    return APIResponse(message="Students fetched", data=service.list_students())


@router.put("/students/{roll_no}", response_model=APIResponse)
def update_student(roll_no: str, payload: StudentUpdate, db: Session = Depends(get_db)):
    service = _admin_service(db)
    updated = service.update_student(roll_no, payload)
    return APIResponse(
        message="Student updated",
        data={
            "roll_no": updated.roll_no,
            "name": updated.name,
            "email": updated.email,
            "batch_year": updated.batch_year,
            "department": updated.department,
        },
    )


@router.delete("/students/{roll_no}", response_model=APIResponse)
def delete_student(roll_no: str, db: Session = Depends(get_db)):
    service = _admin_service(db)
    service.delete_student(roll_no)
    return APIResponse(message="Student deleted", data={"roll_no": roll_no})


@router.get("/faculty", response_model=APIResponse)
def list_faculty(db: Session = Depends(get_db)):
    service = _admin_service(db)
    return APIResponse(message="Faculty fetched", data=service.list_faculty())


@router.put("/faculty/{employee_id}", response_model=APIResponse)
def update_faculty(employee_id: str, payload: FacultyUpdate, db: Session = Depends(get_db)):
    service = _admin_service(db)
    updated = service.update_faculty(employee_id, payload)
    return APIResponse(
        message="Faculty updated",
        data={
            "employee_id": updated.employee_id,
            "name": updated.name,
            "email": updated.email,
            "department": updated.department,
        },
    )


@router.delete("/faculty/{employee_id}", response_model=APIResponse)
def delete_faculty(employee_id: str, db: Session = Depends(get_db)):
    service = _admin_service(db)
    service.delete_faculty(employee_id)
    return APIResponse(message="Faculty deleted", data={"employee_id": employee_id})


@router.get("/courses", response_model=APIResponse)
def list_courses(db: Session = Depends(get_db)):
    service = _admin_service(db)
    return APIResponse(message="Courses fetched", data=service.list_courses())


@router.put("/courses/{code}", response_model=APIResponse)
def update_course(code: str, payload: CourseUpdate, db: Session = Depends(get_db)):
    service = _admin_service(db)
    updated = service.update_course(code, payload)
    return APIResponse(
        message="Course updated",
        data={
            "code": updated.code,
            "name": updated.name,
            "credits": updated.credits,
            "department": updated.department,
        },
    )


@router.delete("/courses/{code}", response_model=APIResponse)
def delete_course(code: str, db: Session = Depends(get_db)):
    service = _admin_service(db)
    service.delete_course(code)
    return APIResponse(message="Course deleted", data={"code": code})


@router.get("/sections", response_model=APIResponse)
def list_sections(course_code: str, db: Session = Depends(get_db)):
    service = _admin_service(db)
    return APIResponse(message="Sections fetched", data=service.list_sections(course_code))


@router.get("/sections/{course_code}/{section_name}/students", response_model=APIResponse)
def section_students(course_code: str, section_name: str, db: Session = Depends(get_db)):
    service = _admin_service(db)
    return APIResponse(message="Section students fetched", data=service.section_students(course_code, section_name))


@router.get("/faculty/{employee_id}/courses", response_model=APIResponse)
def faculty_courses(employee_id: str, db: Session = Depends(get_db)):
    service = _admin_service(db)
    return APIResponse(message="Faculty courses fetched", data=service.faculty_courses(employee_id))


@router.get("/students/{roll_no}/courses", response_model=APIResponse)
def student_courses(roll_no: str, db: Session = Depends(get_db)):
    service = _admin_service(db)
    return APIResponse(message="Student courses fetched", data=service.student_courses(roll_no))
