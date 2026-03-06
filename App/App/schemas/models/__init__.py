from sqlalchemy import Column, String, Integer, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship
import sys
from pathlib import Path

# Add parent directory to path to allow imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from App.db.base import Base


class Student(Base):
    __tablename__ = "STUDENT"
    
    roll_no = Column(String(8), primary_key=True)
    name = Column(String(100))
    batch_year = Column(Integer)
    department = Column(String(100))
    
    # Relationships
    attendances = relationship("Attendance", back_populates="student")
    enrollments = relationship("Enrolls", back_populates="student")


class Course(Base):
    __tablename__ = "COURSE"
    
    course_id = Column(String(6), primary_key=True)
    course_name = Column(String(100))
    
    # Relationships
    sections = relationship("Section", back_populates="course")
    lectures = relationship("Lecture", back_populates="course")


class Section(Base):
    __tablename__ = "SECTION"
    
    section_name = Column(String(4), primary_key=True)
    course_id = Column(String(6), ForeignKey("COURSE.course_id"), primary_key=True)
    
    # Relationships
    course = relationship("Course", back_populates="sections")
    lectures = relationship("Lecture", back_populates="section")


class Faculty(Base):
    __tablename__ = "FACULTY"
    
    faculty_id = Column(String(10), primary_key=True)
    name = Column(String(100))
    email = Column(String(100))
    department = Column(String(100))
    
    # Relationships
    lectures = relationship("Lecture", back_populates="faculty")


class Lecture(Base):
    __tablename__ = "LECTURE"
    
    lecture_id = Column(Integer, primary_key=True)
    lecture_date = Column(Date)
    status = Column(String(20))
    course_id = Column(String(6), ForeignKey("COURSE.course_id"))
    section_name = Column(String(4))
    faculty_id = Column(String(10), ForeignKey("FACULTY.faculty_id"))
    
    __table_args__ = (
        ForeignKey(["section_name", "course_id"], ["SECTION.section_name", "SECTION.course_id"]),
    )
    
    # Relationships
    course = relationship("Course", back_populates="lectures")
    faculty = relationship("Faculty", back_populates="lectures")
    attendances = relationship("Attendance", back_populates="lecture")


class Attendance(Base):
    __tablename__ = "ATTENDANCE"
    
    attendance_id = Column(String(10), primary_key=True)
    roll_no = Column(String(8), ForeignKey("STUDENT.roll_no"))
    lecture_id = Column(Integer, ForeignKey("LECTURE.lecture_id"))
    is_present = Column(Boolean)
    
    # Relationships
    student = relationship("Student", back_populates="attendances")
    lecture = relationship("Lecture", back_populates="attendances")


class Enrolls(Base):
    __tablename__ = "ENROLLS"
    
    roll_no = Column(String(8), ForeignKey("STUDENT.roll_no"), primary_key=True)
    course_id = Column(String(6), ForeignKey("COURSE.course_id"), primary_key=True)
    
    # Relationships
    student = relationship("Student", back_populates="enrollments")
    course = relationship("Course")
