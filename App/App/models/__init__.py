from datetime import date, datetime

from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Faculty(Base):
    __tablename__ = "faculty"

    employee_id = Column(String(32), primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    department = Column(String(80), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    assigned_sections = relationship("Section", back_populates="faculty")


class Course(Base):
    __tablename__ = "course"

    code = Column(String(16), primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    credits = Column(Integer, nullable=False)
    department = Column(String(80), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    sections = relationship("Section", back_populates="course", cascade="all, delete-orphan")


class Section(Base):
    __tablename__ = "section"
    __table_args__ = (UniqueConstraint("course_code", "name", name="uq_course_section_name"),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(20), nullable=False)
    course_code = Column(String(16), ForeignKey("course.code"), nullable=False, index=True)
    faculty_employee_id = Column(String(32), ForeignKey("faculty.employee_id"), nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    course = relationship("Course", back_populates="sections")
    faculty = relationship("Faculty", back_populates="assigned_sections")
    lectures = relationship("Lecture", back_populates="section", cascade="all, delete-orphan")


class Student(Base):
    __tablename__ = "student"

    roll_no = Column(String(32), primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    batch_year = Column(Integer, nullable=False)
    department = Column(String(80), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    enrollments = relationship("Enrollment", back_populates="student", cascade="all, delete-orphan")
    attendance_records = relationship("Attendance", back_populates="student", cascade="all, delete-orphan")


class Enrollment(Base):
    __tablename__ = "enrollment"
    __table_args__ = (
        UniqueConstraint("student_roll_no", "course_code", name="uq_student_course"),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_roll_no = Column(String(32), ForeignKey("student.roll_no"), nullable=False, index=True)
    course_code = Column(String(16), ForeignKey("course.code"), nullable=False, index=True)
    enrolled_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    student = relationship("Student", back_populates="enrollments")
    course = relationship("Course")


class Lecture(Base):
    __tablename__ = "lecture"

    id = Column(Integer, primary_key=True, autoincrement=False, index=True)
    lecture_date = Column(Date, default=date.today, nullable=False)
    status = Column(String(20), default="Ongoing", nullable=False)
    course_code = Column(String(16), ForeignKey("course.code"), nullable=False, index=True)
    section_id = Column(Integer, ForeignKey("section.id"), nullable=False, index=True)
    faculty_employee_id = Column(String(32), ForeignKey("faculty.employee_id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    course = relationship("Course")
    section = relationship("Section", back_populates="lectures")
    faculty = relationship("Faculty")
    attendance_records = relationship("Attendance", back_populates="lecture", cascade="all, delete-orphan")


class Attendance(Base):
    __tablename__ = "attendance"
    __table_args__ = (
        UniqueConstraint("student_roll_no", "lecture_id", name="uq_student_lecture_attendance"),
    )

    attendance_id = Column(String(16), primary_key=True, index=True)
    student_roll_no = Column(String(32), ForeignKey("student.roll_no"), nullable=False, index=True)
    lecture_id = Column(Integer, ForeignKey("lecture.id"), nullable=False, index=True)
    is_present = Column(Boolean, default=False, nullable=False)
    marked_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    student = relationship("Student", back_populates="attendance_records")
    lecture = relationship("Lecture", back_populates="attendance_records")
