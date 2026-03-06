from fastapi import HTTPException, status

from App.core.security import hash_password
from App.models import Course, Enrollment, Faculty, Section, Student
from App.repositories.admin_repo import AdminRepository
from App.schemas.admin import (
	AdminLookups,
	CourseCreate,
	CourseUpdate,
	DashboardData,
	DashboardStats,
	FacultyUpdate,
	FacultySectionAssignRequest,
	SectionCreate,
	SectionLookupItem,
	StudentEnrollmentCreate,
	StudentUpdate,
)


class AdminService:
	def __init__(self, repository: AdminRepository):
		self.repository = repository

	def create_faculty(
		self,
		employee_id: str,
		name: str,
		email: str,
		password: str,
		department: str | None,
	) -> Faculty:
		if self.repository.get_faculty_by_employee_id(employee_id):
			raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Employee ID already exists")
		if self.repository.get_faculty_by_email(email):
			raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Faculty email already exists")

		faculty = Faculty(
			employee_id=employee_id,
			name=name,
			email=email,
			password_hash=hash_password(password),
			department=department,
		)
		return self.repository.create_faculty(faculty)

	def create_course(self, payload: CourseCreate) -> Course:
		if self.repository.get_course_by_code(payload.code):
			raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Course code already exists")

		course = Course(code=payload.code, name=payload.name, credits=payload.credits, department=payload.department)
		return self.repository.create_course(course)

	def create_section(self, payload: SectionCreate) -> Section:
		if not self.repository.get_course_by_code(payload.course_code):
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
		if self.repository.section_exists(payload.course_code, payload.name):
			raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Section already exists for course")

		section = Section(course_code=payload.course_code, name=payload.name)
		return self.repository.create_section(section)

	def assign_faculty_to_section(self, payload: FacultySectionAssignRequest) -> Section:
		section = self.repository.get_section_by_course_and_name(payload.course_code, payload.section_name)
		if not section:
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Section not found")

		faculty = self.repository.get_faculty_by_employee_id(payload.employee_id)
		if not faculty:
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Faculty not found")

		return self.repository.assign_faculty_to_section(section, payload.employee_id)

	def create_student(
		self,
		roll_no: str,
		name: str,
		email: str,
		password: str,
		batch_year: int,
		department: str | None,
	) -> Student:
		if self.repository.get_student_by_roll_no(roll_no):
			raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Roll number already exists")
		if self.repository.get_student_by_email(email):
			raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Student email already exists")

		student = Student(
			roll_no=roll_no,
			name=name,
			email=email,
			password_hash=hash_password(password),
			batch_year=batch_year,
			department=department,
		)
		return self.repository.create_student(student)

	def enroll_student(self, payload: StudentEnrollmentCreate) -> Enrollment:
		student = self.repository.get_student_by_roll_no(payload.roll_no)
		if not student:
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

		section = self.repository.get_section_by_course_and_name(payload.course_code, payload.section_name)
		if not section:
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Section not found")

		if self.repository.enrollment_exists(payload.roll_no, payload.course_code):
			raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Student already enrolled in section")

		enrollment = Enrollment(
			student_roll_no=payload.roll_no,
			course_code=payload.course_code,
		)
		return self.repository.create_enrollment(enrollment)

	def get_dashboard(self) -> DashboardData:
		stats = DashboardStats(**self.repository.get_dashboard_stats())

		students = [
			{
				"roll_no": s.roll_no,
				"name": s.name,
				"email": s.email,
				"batch_year": s.batch_year,
			}
			for s in self.repository.list_students()
		]
		faculty = [
			{
				"employee_id": f.employee_id,
				"name": f.name,
				"email": f.email,
				"department": f.department,
			}
			for f in self.repository.list_faculty()
		]
		courses = [
			{
				"code": c.code,
				"name": c.name,
				"credits": c.credits,
				"department": c.department,
			}
			for c in self.repository.list_courses()
		]
		enrollments = [
			{"roll_no": e.student_roll_no, "course_code": e.course_code}
			for e in self.repository.list_enrollments()
		]
		return DashboardData(stats=stats, students=students, faculty=faculty, courses=courses, enrollments=enrollments)

	def get_lookups(self) -> AdminLookups:
		students = [
			{
				"roll_no": s.roll_no,
				"name": s.name,
				"email": s.email,
				"batch_year": s.batch_year,
			}
			for s in self.repository.list_students()
		]
		faculty = [
			{
				"employee_id": f.employee_id,
				"name": f.name,
				"email": f.email,
				"department": f.department,
			}
			for f in self.repository.list_faculty()
		]
		courses = [
			{
				"code": c.code,
				"name": c.name,
				"credits": c.credits,
				"department": c.department,
			}
			for c in self.repository.list_courses()
		]
		sections = [
			SectionLookupItem(
				name=section.name,
				course_code=section.course_code,
				faculty_employee_id=section.faculty_employee_id,
			)
			for section in self.repository.list_sections()
		]
		enrollments = [
			{"roll_no": e.student_roll_no, "course_code": e.course_code}
			for e in self.repository.list_enrollments()
		]
		return AdminLookups(students=students, faculty=faculty, courses=courses, sections=sections, enrollments=enrollments)

	def list_students(self) -> list[dict]:
		return [
			{
				"roll_no": s.roll_no,
				"name": s.name,
				"email": s.email,
				"batch_year": s.batch_year,
				"department": s.department,
			}
			for s in self.repository.list_students()
		]

	def list_faculty(self) -> list[dict]:
		return [
			{
				"employee_id": f.employee_id,
				"name": f.name,
				"email": f.email,
				"department": f.department,
			}
			for f in self.repository.list_faculty()
		]

	def list_courses(self) -> list[dict]:
		return [
			{
				"code": c.code,
				"name": c.name,
				"credits": c.credits,
				"department": c.department,
			}
			for c in self.repository.list_courses()
		]

	def update_faculty(self, employee_id: str, payload: FacultyUpdate) -> Faculty:
		if self.repository.get_faculty_by_email(payload.email):
			existing = self.repository.get_faculty_by_email(payload.email)
			if existing and existing.employee_id != employee_id:
				raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Faculty email already exists")

		updated = self.repository.update_faculty(
			employee_id=employee_id,
			name=payload.name,
			email=payload.email,
			department=payload.department,
		)
		if not updated:
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Faculty not found")
		return updated

	def delete_faculty(self, employee_id: str) -> None:
		if not self.repository.delete_faculty(employee_id):
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Faculty not found")

	def update_course(self, code: str, payload: CourseUpdate) -> Course:
		updated = self.repository.update_course(
			code=code,
			name=payload.name,
			credits=payload.credits,
			department=payload.department,
		)
		if not updated:
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
		return updated

	def delete_course(self, code: str) -> None:
		if not self.repository.delete_course(code):
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

	def update_student(self, roll_no: str, payload: StudentUpdate) -> Student:
		existing_by_email = self.repository.get_student_by_email(payload.email)
		if existing_by_email and existing_by_email.roll_no != roll_no:
			raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Student email already exists")

		updated = self.repository.update_student(
			roll_no=roll_no,
			name=payload.name,
			email=payload.email,
			batch_year=payload.batch_year,
			department=payload.department,
		)
		if not updated:
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
		return updated

	def delete_student(self, roll_no: str) -> None:
		if not self.repository.delete_student(roll_no):
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

	def list_sections(self, course_code: str) -> list[dict]:
		sections = self.repository.list_sections_by_course(course_code)
		return [
			{
				"section_name": section.name,
				"course_code": section.course_code,
				"faculty_employee_id": section.faculty_employee_id,
				"student_count": self.repository.count_enrolled_students(section.course_code),
				"lecture_count": self.repository.count_lectures(section.course_code, section.id),
			}
			for section in sections
		]

	def section_students(self, course_code: str, section_name: str) -> list[dict]:
		section = self.repository.get_section_by_course_and_name(course_code, section_name)
		if not section:
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Section not found")

		students = self.repository.list_students_by_course(course_code)
		return [
			{
				"roll_no": s.roll_no,
				"name": s.name,
				"department": s.department,
				"batch_year": s.batch_year,
			}
			for s in students
		]

	def faculty_courses(self, employee_id: str) -> list[dict]:
		sections = self.repository.list_faculty_sections(employee_id)
		rows: list[dict] = []
		for section in sections:
			course = self.repository.get_course_by_code(section.course_code)
			if not course:
				continue

			students = self.repository.list_students_by_course(section.course_code)
			batch_year = str(students[0].batch_year) if students else "Unknown"
			rows.append(
				{
					"course_code": course.code,
					"course_name": course.name,
					"section_name": section.name,
					"batch_year": batch_year,
					"student_count": len(students),
					"lecture_count": self.repository.count_lectures(course.code, section.id),
				}
			)
		return rows

	def student_courses(self, roll_no: str) -> list[dict]:
		student = self.repository.get_student_by_roll_no(roll_no)
		if not student:
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

		courses: list[dict] = []
		for enrollment in self.repository.get_student_enrollments(roll_no):
			course = self.repository.get_course_by_code(enrollment.course_code)
			if not course:
				continue
			section = self.repository.list_sections_by_course(course.code)
			section_name = section[0].name if section else "A"
			courses.append(
				{
					"course_code": course.code,
					"course_name": course.name,
					"section_name": section_name,
				}
			)
		return courses
