from sqlalchemy import func
from sqlalchemy.orm import Session

from App.models import Attendance, Course, Enrollment, Faculty, Lecture, Section, Student
from App.repositories.base_repo import BaseRepository


class AdminRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(db)

    def get_faculty_by_employee_id(self, employee_id: str) -> Faculty | None:
        return self.db.query(Faculty).filter(Faculty.employee_id == employee_id).first()

    def get_faculty_by_email(self, email: str) -> Faculty | None:
        return self.db.query(Faculty).filter(Faculty.email == email).first()

    def create_faculty(self, faculty: Faculty) -> Faculty:
        self.db.add(faculty)
        self.db.commit()
        self.db.refresh(faculty)
        return faculty

    def get_course_by_code(self, code: str) -> Course | None:
        return self.db.query(Course).filter(Course.code == code).first()

    def create_course(self, course: Course) -> Course:
        self.db.add(course)
        self.db.commit()
        self.db.refresh(course)
        return course

    def get_section(self, section_id: int) -> Section | None:
        return self.db.query(Section).filter(Section.id == section_id).first()

    def get_section_by_course_and_name(self, course_code: str, section_name: str) -> Section | None:
        return (
            self.db.query(Section)
            .filter(Section.course_code == course_code, Section.name == section_name)
            .first()
        )

    def section_exists(self, course_code: str, section_name: str) -> bool:
        return (
            self.db.query(Section)
            .filter(Section.course_code == course_code, Section.name == section_name)
            .first()
            is not None
        )

    def create_section(self, section: Section) -> Section:
        self.db.add(section)
        self.db.commit()
        self.db.refresh(section)
        return section

    def assign_faculty_to_section(self, section: Section, employee_id: str) -> Section:
        section.faculty_employee_id = employee_id
        self.db.add(section)
        self.db.commit()
        self.db.refresh(section)
        return section

    def get_student_by_roll_no(self, roll_no: str) -> Student | None:
        return self.db.query(Student).filter(Student.roll_no == roll_no).first()

    def get_student_by_email(self, email: str) -> Student | None:
        return self.db.query(Student).filter(Student.email == email).first()

    def create_student(self, student: Student) -> Student:
        self.db.add(student)
        self.db.commit()
        self.db.refresh(student)
        return student

    def create_enrollment(self, enrollment: Enrollment) -> Enrollment:
        self.db.add(enrollment)
        self.db.commit()
        self.db.refresh(enrollment)
        return enrollment

    def enrollment_exists(self, roll_no: str, course_code: str) -> bool:
        return (
            self.db.query(Enrollment)
            .filter(
                Enrollment.student_roll_no == roll_no,
                Enrollment.course_code == course_code,
            )
            .first()
            is not None
        )

    def list_enrollments(self) -> list[Enrollment]:
        return (
            self.db.query(Enrollment)
            .order_by(Enrollment.course_code.asc(), Enrollment.student_roll_no.asc())
            .all()
        )

    def get_dashboard_stats(self) -> dict[str, int]:
        students_count = self.db.query(func.count(Student.roll_no)).scalar() or 0
        faculty_count = self.db.query(func.count(Faculty.employee_id)).scalar() or 0
        course_count = self.db.query(func.count(Course.code)).scalar() or 0
        section_count = self.db.query(func.count(Section.id)).scalar() or 0
        return {
            "total_users": students_count + faculty_count,
            "courses": course_count,
            "sections": section_count,
            "students": students_count,
        }

    def list_students(self) -> list[Student]:
        return self.db.query(Student).order_by(Student.roll_no.asc()).all()

    def list_faculty(self) -> list[Faculty]:
        return self.db.query(Faculty).order_by(Faculty.employee_id.asc()).all()

    def list_courses(self) -> list[Course]:
        return self.db.query(Course).order_by(Course.code.asc()).all()

    def list_sections(self) -> list[Section]:
        return self.db.query(Section).order_by(Section.course_code.asc(), Section.name.asc()).all()

    def list_sections_by_course(self, course_code: str) -> list[Section]:
        return (
            self.db.query(Section)
            .filter(Section.course_code == course_code)
            .order_by(Section.name.asc())
            .all()
        )

    def list_students_by_course(self, course_code: str) -> list[Student]:
        return (
            self.db.query(Student)
            .join(Enrollment, Enrollment.student_roll_no == Student.roll_no)
            .filter(Enrollment.course_code == course_code)
            .order_by(Student.roll_no.asc())
            .all()
        )

    def list_lectures_by_section(self, course_code: str, section_id: int) -> list[Lecture]:
        return (
            self.db.query(Lecture)
            .filter(Lecture.course_code == course_code, Lecture.section_id == section_id)
            .order_by(Lecture.lecture_date.desc(), Lecture.id.desc())
            .all()
        )

    def list_faculty_sections(self, employee_id: str) -> list[Section]:
        return (
            self.db.query(Section)
            .filter(Section.faculty_employee_id == employee_id)
            .order_by(Section.course_code.asc(), Section.name.asc())
            .all()
        )

    def update_faculty(self, employee_id: str, name: str, email: str, department: str | None) -> Faculty | None:
        faculty = self.get_faculty_by_employee_id(employee_id)
        if not faculty:
            return None
        faculty.name = name
        faculty.email = email
        faculty.department = department
        self.db.add(faculty)
        self.db.commit()
        self.db.refresh(faculty)
        return faculty

    def delete_faculty(self, employee_id: str) -> bool:
        faculty = self.get_faculty_by_employee_id(employee_id)
        if not faculty:
            return False
        self.db.delete(faculty)
        self.db.commit()
        return True

    def update_course(self, code: str, name: str, credits: int, department: str | None) -> Course | None:
        course = self.get_course_by_code(code)
        if not course:
            return None
        course.name = name
        course.credits = credits
        course.department = department
        self.db.add(course)
        self.db.commit()
        self.db.refresh(course)
        return course

    def delete_course(self, code: str) -> bool:
        course = self.get_course_by_code(code)
        if not course:
            return False
        self.db.delete(course)
        self.db.commit()
        return True

    def update_student(
        self,
        roll_no: str,
        name: str,
        email: str,
        batch_year: int,
        department: str | None,
    ) -> Student | None:
        student = self.get_student_by_roll_no(roll_no)
        if not student:
            return None
        student.name = name
        student.email = email
        student.batch_year = batch_year
        student.department = department
        self.db.add(student)
        self.db.commit()
        self.db.refresh(student)
        return student

    def delete_student(self, roll_no: str) -> bool:
        student = self.get_student_by_roll_no(roll_no)
        if not student:
            return False
        self.db.delete(student)
        self.db.commit()
        return True

    def count_enrolled_students(self, course_code: str) -> int:
        return (
            self.db.query(func.count(Enrollment.id))
            .filter(Enrollment.course_code == course_code)
            .scalar()
            or 0
        )

    def count_lectures(self, course_code: str, section_id: int) -> int:
        return (
            self.db.query(func.count(Lecture.id))
            .filter(Lecture.course_code == course_code, Lecture.section_id == section_id)
            .scalar()
            or 0
        )

    def get_student_enrollments(self, roll_no: str) -> list[Enrollment]:
        return (
            self.db.query(Enrollment)
            .filter(Enrollment.student_roll_no == roll_no)
            .order_by(Enrollment.id.asc())
            .all()
        )
