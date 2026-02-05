CREATE DATABASE IF NOT EXISTS Attendance_Management;
USE Attendance_Management;
CREATE TABLE STUDENT (
    roll_no INT PRIMARY KEY,
    name VARCHAR(100),
    batch_year INT,
    department VARCHAR(100)
);
CREATE TABLE COURSE (
    course_id INT PRIMARY KEY,
    course_name VARCHAR(100)
);
CREATE TABLE SECTION (
    section_name VARCHAR(50) PRIMARY KEY,
    course_id INT,
    FOREIGN KEY (course_id) REFERENCES COURSE(course_id)
);
CREATE TABLE FACULTY (
    faculty_id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    department VARCHAR(100)
);
CREATE TABLE LECTURE (
    lecture_id INT PRIMARY KEY,
    lecture_date DATE,
    status VARCHAR(20),
    course_id INT,
    section_name VARCHAR(50),
    faculty_id INT,
    FOREIGN KEY (course_id) REFERENCES COURSE(course_id),
    FOREIGN KEY (section_name) REFERENCES SECTION(section_name),
    FOREIGN KEY (faculty_id) REFERENCES FACULTY(faculty_id)
);
CREATE TABLE ATTENDANCE (
    attendance_id INT PRIMARY KEY,
    roll_no INT,
    lecture_id INT,
    is_present BOOLEAN,
    FOREIGN KEY (roll_no) REFERENCES STUDENT(roll_no),
    FOREIGN KEY (lecture_id) REFERENCES LECTURE(lecture_id)
);
CREATE TABLE ENROLLS (
    roll_no INT,
    course_id INT,
    PRIMARY KEY (roll_no, course_id),
    FOREIGN KEY (roll_no) REFERENCES STUDENT(roll_no),
    FOREIGN KEY (course_id) REFERENCES COURSE(course_id)
);
