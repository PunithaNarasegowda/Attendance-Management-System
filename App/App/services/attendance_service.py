from datetime import date

from fastapi import HTTPException, status

from App.models import Attendance, Lecture
from App.repositories.attendance_repo import AttendanceRepository
from App.schemas.attendance import (
    AttendanceByLectureItem,
    AttendanceByStudentItem,
    AttendancePercentage,
    AttendanceSummaryItem,
    CreateLectureRequest,
    FinalizeLectureResponse,
    LectureItem,
    LowAttendanceItem,
    MarkAttendanceRequest,
    UpdateAttendanceRequest,
)


class AttendanceService:
    def __init__(self, repository: AttendanceRepository):
        self.repository = repository

    @staticmethod
    def _next_attendance_id(existing_count: int) -> str:
        return f"ATT{existing_count + 1:07d}"

    def create_lecture(self, payload: CreateLectureRequest) -> Lecture:
        if self.repository.get_lecture(payload.lecture_id):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Lecture already exists")

        section = self.repository.get_section(payload.course_code, payload.section_name)
        if not section:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Section not found")

        lecture = Lecture(
            id=payload.lecture_id,
            lecture_date=payload.lecture_date or date.today(),
            status=payload.status,
            course_code=payload.course_code,
            section_id=section.id,
            faculty_employee_id=payload.faculty_employee_id,
        )
        return self.repository.create_lecture(lecture)

    def lectures_by_faculty(self, employee_id: str, course_code: str, section_name: str) -> list[LectureItem]:
        lectures = self.repository.lectures_by_faculty(employee_id, course_code, section_name)
        return [
            LectureItem(
                lecture_id=lecture.id,
                lecture_date=lecture.lecture_date,
                status=lecture.status,
                course_code=lecture.course_code,
                section_name=section_name,
                faculty_employee_id=lecture.faculty_employee_id,
            )
            for lecture in lectures
        ]

    def lectures_by_faculty_all(self, employee_id: str) -> list[LectureItem]:
        lectures = self.repository.lectures_by_faculty_all(employee_id)
        return [
            LectureItem(
                lecture_id=lecture.id,
                lecture_date=lecture.lecture_date,
                status=lecture.status,
                course_code=lecture.course_code,
                section_name=lecture.section.name if lecture.section else "",
                faculty_employee_id=lecture.faculty_employee_id,
            )
            for lecture in lectures
        ]

    def finalize_lecture(self, lecture_id: int) -> FinalizeLectureResponse:
        lecture = self.repository.get_lecture(lecture_id)
        if not lecture:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lecture not found")

        updated = self.repository.finalize_lecture(lecture)
        return FinalizeLectureResponse(lecture_id=updated.id, status=updated.status)

    def delete_lecture(self, lecture_id: int) -> None:
        lecture = self.repository.get_lecture(lecture_id)
        if not lecture:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lecture not found")
        self.repository.delete_lecture(lecture)

    def mark_attendance(self, payload: MarkAttendanceRequest) -> AttendanceByLectureItem:
        if not self.repository.get_student(payload.roll_no):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
        if not self.repository.get_lecture(payload.lecture_id):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lecture not found")

        existing = self.repository.get_attendance(payload.roll_no, payload.lecture_id)
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Attendance already marked")

        next_id = self._next_attendance_id(self.repository.attendance_count())
        row = Attendance(
            attendance_id=next_id,
            student_roll_no=payload.roll_no,
            lecture_id=payload.lecture_id,
            is_present=payload.is_present,
        )
        created = self.repository.create_attendance(row)
        return AttendanceByLectureItem(
            attendance_id=created.attendance_id,
            roll_no=created.student_roll_no,
            is_present=created.is_present,
        )

    def update_attendance(self, payload: UpdateAttendanceRequest) -> AttendanceByLectureItem:
        row = self.repository.get_attendance(payload.roll_no, payload.lecture_id)
        if not row:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attendance record not found")

        updated = self.repository.update_attendance(row, payload.is_present)
        return AttendanceByLectureItem(
            attendance_id=updated.attendance_id,
            roll_no=updated.student_roll_no,
            is_present=updated.is_present,
        )

    def attendance_by_lecture(self, lecture_id: int) -> list[AttendanceByLectureItem]:
        rows = self.repository.attendance_by_lecture(lecture_id)
        return [
            AttendanceByLectureItem(
                attendance_id=row.attendance_id,
                roll_no=row.student_roll_no,
                is_present=row.is_present,
            )
            for row in rows
        ]

    def attendance_by_student(self, roll_no: str) -> list[AttendanceByStudentItem]:
        rows = self.repository.attendance_by_student(roll_no)
        return [
            AttendanceByStudentItem(
                attendance_id=row.attendance_id,
                lecture_id=row.lecture_id,
                course_code=row.lecture.course_code,
                section_name=row.lecture.section.name if row.lecture and row.lecture.section else "",
                lecture_date=row.lecture.lecture_date if row.lecture else None,
                is_present=row.is_present,
            )
            for row in rows
        ]

    def attendance_percentage(self, roll_no: str, course_code: str, section_name: str) -> AttendancePercentage:
        section = self.repository.get_section(course_code, section_name)
        if not section:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Section not found")

        lecture_ids = set(self.repository.completed_lecture_ids(course_code, section.id))
        total = len(lecture_ids)

        attended = 0
        if lecture_ids:
            records = self.repository.attendance_by_student(roll_no)
            attended = sum(1 for row in records if row.lecture_id in lecture_ids and row.is_present)

        percentage = round((attended * 100.0) / total, 2) if total > 0 else 0.0
        return AttendancePercentage(
            roll_no=roll_no,
            course_code=course_code,
            section_name=section_name,
            total_lectures=total,
            attended_lectures=attended,
            percentage=percentage,
        )

    def section_summary(self, course_code: str, section_name: str) -> list[AttendanceSummaryItem]:
        section = self.repository.get_section(course_code, section_name)
        if not section:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Section not found")

        students = self.repository.students_by_course(course_code)
        lecture_ids = set(self.repository.completed_lecture_ids(course_code, section.id))
        total_lectures = len(lecture_ids)

        summaries: list[AttendanceSummaryItem] = []
        for student in students:
            records = self.repository.attendance_by_student(student.roll_no)
            attended = sum(1 for row in records if row.lecture_id in lecture_ids and row.is_present)
            percentage = round((attended * 100.0) / total_lectures, 2) if total_lectures > 0 else 0.0
            summaries.append(
                AttendanceSummaryItem(
                    roll_no=student.roll_no,
                    name=student.name,
                    total_lectures=total_lectures,
                    attended_lectures=attended,
                    attendance_percentage=percentage,
                )
            )

        return summaries

    def low_attendance(self, course_code: str, section_name: str, threshold: float) -> list[LowAttendanceItem]:
        summaries = self.section_summary(course_code, section_name)
        return [
            LowAttendanceItem(
                roll_no=row.roll_no,
                name=row.name,
                attendance_percentage=row.attendance_percentage,
            )
            for row in summaries
            if row.attendance_percentage < threshold
        ]
