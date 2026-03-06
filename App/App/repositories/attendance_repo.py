from sqlalchemy import func

from App.models import Attendance, Enrollment, Lecture, Section, Student
from App.repositories.base_repo import BaseRepository


class AttendanceRepository(BaseRepository):
    def get_student_enrollments(self, roll_no: str) -> list[Enrollment]:
        return (
            self.db.query(Enrollment)
            .filter(Enrollment.student_roll_no == roll_no)
            .order_by(Enrollment.id.asc())
            .all()
        )

    def get_student(self, roll_no: str) -> Student | None:
        return self.db.query(Student).filter(Student.roll_no == roll_no).first()

    def get_lecture(self, lecture_id: int) -> Lecture | None:
        return self.db.query(Lecture).filter(Lecture.id == lecture_id).first()

    def get_section(self, course_code: str, section_name: str) -> Section | None:
        return (
            self.db.query(Section)
            .filter(Section.course_code == course_code, Section.name == section_name)
            .first()
        )

    def create_lecture(self, lecture: Lecture) -> Lecture:
        self.db.add(lecture)
        self.db.commit()
        self.db.refresh(lecture)
        return lecture

    def lectures_by_faculty(self, employee_id: str, course_code: str, section_name: str) -> list[Lecture]:
        section = self.get_section(course_code, section_name)
        if not section:
            return []

        return (
            self.db.query(Lecture)
            .filter(
                Lecture.faculty_employee_id == employee_id,
                Lecture.course_code == course_code,
                Lecture.section_id == section.id,
            )
            .order_by(Lecture.lecture_date.desc(), Lecture.id.desc())
            .all()
        )

    def lectures_by_faculty_all(self, employee_id: str) -> list[Lecture]:
        return (
            self.db.query(Lecture)
            .filter(Lecture.faculty_employee_id == employee_id)
            .order_by(Lecture.lecture_date.desc(), Lecture.id.desc())
            .all()
        )

    def finalize_lecture(self, lecture: Lecture) -> Lecture:
        lecture.status = "Completed"
        self.db.add(lecture)
        self.db.commit()
        self.db.refresh(lecture)
        return lecture

    def get_attendance(self, roll_no: str, lecture_id: int) -> Attendance | None:
        return (
            self.db.query(Attendance)
            .filter(Attendance.student_roll_no == roll_no, Attendance.lecture_id == lecture_id)
            .first()
        )

    def create_attendance(self, attendance: Attendance) -> Attendance:
        self.db.add(attendance)
        self.db.commit()
        self.db.refresh(attendance)
        return attendance

    def update_attendance(self, attendance: Attendance, is_present: bool) -> Attendance:
        attendance.is_present = is_present
        self.db.add(attendance)
        self.db.commit()
        self.db.refresh(attendance)
        return attendance

    def attendance_by_lecture(self, lecture_id: int) -> list[Attendance]:
        return (
            self.db.query(Attendance)
            .filter(Attendance.lecture_id == lecture_id)
            .order_by(Attendance.student_roll_no.asc())
            .all()
        )

    def attendance_by_student(self, roll_no: str) -> list[Attendance]:
        return (
            self.db.query(Attendance)
            .filter(Attendance.student_roll_no == roll_no)
            .order_by(Attendance.lecture_id.desc())
            .all()
        )

    def completed_lectures_count(self, course_code: str, section_id: int) -> int:
        return (
            self.db.query(func.count(Lecture.id))
            .filter(
                Lecture.course_code == course_code,
                Lecture.section_id == section_id,
                Lecture.status == "Completed",
            )
            .scalar()
            or 0
        )

    def completed_lecture_ids(self, course_code: str, section_id: int) -> list[int]:
        rows = (
            self.db.query(Lecture.id)
            .filter(
                Lecture.course_code == course_code,
                Lecture.section_id == section_id,
                Lecture.status == "Completed",
            )
            .all()
        )
        return [row[0] for row in rows]

    def students_by_course(self, course_code: str) -> list[Student]:
        return (
            self.db.query(Student)
            .join(Enrollment, Enrollment.student_roll_no == Student.roll_no)
            .filter(Enrollment.course_code == course_code)
            .order_by(Student.roll_no.asc())
            .all()
        )

    def attendance_count(self) -> int:
        return self.db.query(func.count(Attendance.attendance_id)).scalar() or 0

    def delete_lecture(self, lecture: Lecture) -> None:
        self.db.delete(lecture)
        self.db.commit()