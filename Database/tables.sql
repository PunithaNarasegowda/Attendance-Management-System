
CREATE DATABASE IF NOT EXISTS attendance_management_system;
USE attendance_management_system;

CREATE TABLE STUDENT (
    roll_no VARCHAR(8) PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    batch_year INT,
    department VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE COURSE (
    course_id VARCHAR(6) PRIMARY KEY,
    course_name VARCHAR(100)
);
CREATE TABLE SECTION (
    section_name VARCHAR(10) PRIMARY KEY
);
CREATE TABLE COURSE_SECTION (
    course_id VARCHAR(6),
    section_name VARCHAR(10),
    PRIMARY KEY (course_id, section_name),
    FOREIGN KEY (course_id) REFERENCES COURSE(course_id),
    FOREIGN KEY (section_name) REFERENCES SECTION(section_name)
);
CREATE TABLE FACULTY (
    faculty_id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE LECTURE (
    lecture_id INT PRIMARY KEY,
    lecture_date DATE,
    status VARCHAR(20),
    course_id VARCHAR(6),
    section_name VARCHAR(10),
    faculty_id VARCHAR(10),
    FOREIGN KEY (course_id) REFERENCES COURSE(course_id),
    FOREIGN KEY (section_name) REFERENCES SECTION(section_name),
    FOREIGN KEY (faculty_id) REFERENCES FACULTY(faculty_id)
);
CREATE TABLE ATTENDANCE (
    attendance_id VARCHAR(10) PRIMARY KEY,
    roll_no VARCHAR(8),
    lecture_id INT,
    is_present BOOLEAN,
    FOREIGN KEY (roll_no) REFERENCES STUDENT(roll_no),
    FOREIGN KEY (lecture_id) REFERENCES LECTURE(lecture_id)
);
CREATE TABLE ENROLLS (
    roll_no VARCHAR(8),
    course_id VARCHAR(6),
    section_name VARCHAR(10),
    PRIMARY KEY (roll_no, course_id),
    FOREIGN KEY (roll_no) REFERENCES STUDENT(roll_no),
    FOREIGN KEY (course_id) REFERENCES COURSE(course_id),
    FOREIGN KEY (section_name) REFERENCES SECTION(section_name)
);
