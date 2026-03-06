from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from App.db.session import get_db
from App.repositories.attendance_repo import AttendanceRepository
from App.schemas.attendance import (
	CreateLectureRequest,
	MarkAttendanceRequest,
	UpdateAttendanceRequest,
)
from App.schemas.responses import APIResponse
from App.services.attendance_service import AttendanceService

router = APIRouter(prefix="/attendance", tags=["Attendance"])


def _attendance_service(db: Session) -> AttendanceService:
	return AttendanceService(AttendanceRepository(db))


@router.post("/lectures", response_model=APIResponse)
def create_lecture(payload: CreateLectureRequest, db: Session = Depends(get_db)):
	service = _attendance_service(db)
	lecture = service.create_lecture(payload)
	return APIResponse(
		message="Lecture created",
		data={
			"lecture_id": lecture.id,
			"lecture_date": str(lecture.lecture_date),
			"status": lecture.status,
			"course_code": lecture.course_code,
			"section_name": payload.section_name,
			"faculty_employee_id": lecture.faculty_employee_id,
		},
	)


@router.get("/lectures", response_model=APIResponse)
def get_lectures(employee_id: str, course_code: str, section_name: str, db: Session = Depends(get_db)):
	service = _attendance_service(db)
	return APIResponse(
		message="Lectures fetched",
		data=[item.model_dump() for item in service.lectures_by_faculty(employee_id, course_code, section_name)],
	)


@router.get("/lectures/faculty/{employee_id}", response_model=APIResponse)
def get_faculty_lectures(employee_id: str, db: Session = Depends(get_db)):
	service = _attendance_service(db)
	return APIResponse(
		message="Faculty lectures fetched",
		data=[item.model_dump() for item in service.lectures_by_faculty_all(employee_id)],
	)


@router.post("/lectures/{lecture_id}/finalize", response_model=APIResponse)
def finalize_lecture(lecture_id: int, db: Session = Depends(get_db)):
	service = _attendance_service(db)
	result = service.finalize_lecture(lecture_id)
	return APIResponse(message="Lecture finalized", data=result.model_dump())


@router.delete("/lectures/{lecture_id}", response_model=APIResponse)
def delete_lecture(lecture_id: int, db: Session = Depends(get_db)):
	service = _attendance_service(db)
	service.delete_lecture(lecture_id)
	return APIResponse(message="Lecture deleted", data={"lecture_id": lecture_id})


@router.post("/mark", response_model=APIResponse)
def mark_attendance(payload: MarkAttendanceRequest, db: Session = Depends(get_db)):
	service = _attendance_service(db)
	created = service.mark_attendance(payload)
	return APIResponse(message="Attendance marked", data=created.model_dump())


@router.put("/mark", response_model=APIResponse)
def update_attendance(payload: UpdateAttendanceRequest, db: Session = Depends(get_db)):
	service = _attendance_service(db)
	updated = service.update_attendance(payload)
	return APIResponse(message="Attendance updated", data=updated.model_dump())


@router.get("/lecture/{lecture_id}", response_model=APIResponse)
def get_attendance_by_lecture(lecture_id: int, db: Session = Depends(get_db)):
	service = _attendance_service(db)
	return APIResponse(
		message="Attendance by lecture fetched",
		data=[item.model_dump() for item in service.attendance_by_lecture(lecture_id)],
	)


@router.get("/student/{roll_no}", response_model=APIResponse)
def get_attendance_by_student(roll_no: str, db: Session = Depends(get_db)):
	service = _attendance_service(db)
	return APIResponse(
		message="Attendance by student fetched",
		data=[item.model_dump() for item in service.attendance_by_student(roll_no)],
	)


@router.get("/percentage", response_model=APIResponse)
def get_attendance_percentage(roll_no: str, course_code: str, section_name: str, db: Session = Depends(get_db)):
	service = _attendance_service(db)
	result = service.attendance_percentage(roll_no, course_code, section_name)
	return APIResponse(message="Attendance percentage fetched", data=result.model_dump())


@router.get("/summary", response_model=APIResponse)
def get_section_summary(course_code: str, section_name: str, db: Session = Depends(get_db)):
	service = _attendance_service(db)
	return APIResponse(
		message="Section attendance summary fetched",
		data=[item.model_dump() for item in service.section_summary(course_code, section_name)],
	)


@router.get("/low-attendance", response_model=APIResponse)
def get_low_attendance(course_code: str, section_name: str, threshold: float = 75.0, db: Session = Depends(get_db)):
	service = _attendance_service(db)
	return APIResponse(
		message="Low attendance students fetched",
		data=[item.model_dump() for item in service.low_attendance(course_code, section_name, threshold)],
	)
