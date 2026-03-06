from App.repositories.attendance_repo import AttendanceRepository


class StudentService:
    @staticmethod
    def get_learning_summary(db, roll_no: str):
        """Provides basic enrolled course cards for the student dashboard."""
        repo = AttendanceRepository(db)
        enrollments = repo.get_student_enrollments(roll_no)

        cards = []
        for enrollment in enrollments:
            course = enrollment.course
            if not course:
                continue
            cards.append({
                "course_code": course.code,
                "course_name": course.name,
                "percentage": 0.0,
                "credits": course.credits,
            })
        return cards