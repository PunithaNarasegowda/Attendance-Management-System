-- Idempotent seed script for Attendance Management System (MySQL)
-- Safe to run multiple times.

CREATE DATABASE IF NOT EXISTS attendance_management_system;
USE attendance_management_system;

SET @stmt := IF((SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'student' AND column_name = 'email') = 0,
	'ALTER TABLE student ADD COLUMN email VARCHAR(255) NULL', 'SELECT 1');
PREPARE s1 FROM @stmt; EXECUTE s1; DEALLOCATE PREPARE s1;

SET @stmt := IF((SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'student' AND column_name = 'password_hash') = 0,
	'ALTER TABLE student ADD COLUMN password_hash VARCHAR(255) NULL', 'SELECT 1');
PREPARE s2 FROM @stmt; EXECUTE s2; DEALLOCATE PREPARE s2;

SET @stmt := IF((SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'student' AND column_name = 'is_active') = 0,
	'ALTER TABLE student ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE', 'SELECT 1');
PREPARE s3 FROM @stmt; EXECUTE s3; DEALLOCATE PREPARE s3;

SET @stmt := IF((SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'faculty' AND column_name = 'password_hash') = 0,
	'ALTER TABLE faculty ADD COLUMN password_hash VARCHAR(255) NULL', 'SELECT 1');
PREPARE f1 FROM @stmt; EXECUTE f1; DEALLOCATE PREPARE f1;

SET @stmt := IF((SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'faculty' AND column_name = 'is_active') = 0,
	'ALTER TABLE faculty ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE', 'SELECT 1');
PREPARE f2 FROM @stmt; EXECUTE f2; DEALLOCATE PREPARE f2;

-- Students
INSERT INTO STUDENT (roll_no, name, batch_year, department) VALUES
('23BCS083', 'Rajat Kumar', 2023, 'Computer Science'),
('23BCS084', 'Amit Singh', 2023, 'Computer Science'),
('23BIT045', 'Priya Sharma', 2023, 'Information Technology'),
('23BCS085', 'John Doe', 2023, 'Computer Science'),
('23BIT046', 'Jane Smith', 2023, 'Information Technology'),
('24BCS091', 'Arjun Patel', 2024, 'Computer Science'),
('24BIT052', 'Neha Gupta', 2024, 'Information Technology'),
('24BCS092', 'Rohan Shah', 2024, 'Computer Science')
ON DUPLICATE KEY UPDATE
name = VALUES(name),
batch_year = VALUES(batch_year),
department = VALUES(department);

UPDATE STUDENT
SET email = CONCAT(LOWER(roll_no), '@nithams.local')
WHERE email IS NULL OR TRIM(email) = '';

UPDATE STUDENT
SET password_hash = LOWER(SHA2(CONCAT('Stu@', roll_no), 256))
WHERE password_hash IS NULL OR TRIM(password_hash) = '';

-- Courses
INSERT INTO COURSE (course_id, course_name) VALUES
('CS-101', 'Database Management System'),
('CS-211', 'Web Development'),
('CS-130', 'Data Structures'),
('CS-150', 'Operating Systems')
ON DUPLICATE KEY UPDATE
course_name = VALUES(course_name);

-- Sections
INSERT INTO SECTION (section_name, course_id) VALUES
('CD-2', 'CS-101'),
('CS-2', 'CS-101'),
('CD-3', 'CS-211'),
('CS-3', 'CS-211'),
('EC-2', 'CS-130'),
('CD-2', 'CS-150')
ON DUPLICATE KEY UPDATE
section_name = VALUES(section_name);

-- Faculty
INSERT INTO FACULTY (faculty_id, name, email, department) VALUES
('23FAC001', 'Dr. Ramesh Kumar', 'ramesh.kumar@nith.ac.in', 'Computer Science'),
('23FAC002', 'Prof. Anjali Sharma', 'anjali.sharma@nith.ac.in', 'Computer Science'),
('23FAC003', 'Dr. Vikram Singh', 'vikram.singh@nith.ac.in', 'Information Technology'),
('23FAC004', 'Prof. Meera Patel', 'meera.patel@nith.ac.in', 'Computer Science')
ON DUPLICATE KEY UPDATE
name = VALUES(name),
email = VALUES(email),
department = VALUES(department);

UPDATE FACULTY
SET email = CONCAT(LOWER(faculty_id), '@nithams.local')
WHERE email IS NULL OR TRIM(email) = '';

UPDATE FACULTY
SET password_hash = LOWER(SHA2(CONCAT('Fac@', faculty_id), 256))
WHERE password_hash IS NULL OR TRIM(password_hash) = '';

-- Enrollments
INSERT INTO ENROLLS (roll_no, course_id) VALUES
('23BCS083', 'CS-101'), ('23BCS084', 'CS-101'), ('23BIT045', 'CS-101'), ('23BCS085', 'CS-101'), ('23BIT046', 'CS-101'),
('23BCS083', 'CS-211'), ('23BCS084', 'CS-211'), ('23BIT045', 'CS-211'), ('24BCS091', 'CS-211'), ('24BIT052', 'CS-211'),
('23BCS083', 'CS-130'), ('23BCS085', 'CS-130'), ('23BIT046', 'CS-130'), ('24BCS091', 'CS-130'), ('24BCS092', 'CS-130'),
('23BCS084', 'CS-150'), ('23BIT045', 'CS-150'), ('24BIT052', 'CS-150'), ('24BCS092', 'CS-150')
ON DUPLICATE KEY UPDATE
roll_no = VALUES(roll_no);

-- Lectures
INSERT INTO LECTURE (lecture_id, lecture_date, status, course_id, section_name, faculty_id) VALUES
(1, '2026-02-15', 'Completed', 'CS-101', 'CD-2', '23FAC001'),
(2, '2026-02-16', 'Completed', 'CS-101', 'CD-2', '23FAC001'),
(3, '2026-02-18', 'Completed', 'CS-101', 'CD-2', '23FAC001'),
(4, '2026-02-19', 'Ongoing', 'CS-101', 'CD-2', '23FAC001'),
(5, '2026-02-15', 'Completed', 'CS-101', 'CS-2', '23FAC002'),
(6, '2026-02-16', 'Completed', 'CS-101', 'CS-2', '23FAC002'),
(7, '2026-02-15', 'Completed', 'CS-211', 'CD-3', '23FAC003'),
(8, '2026-02-16', 'Completed', 'CS-211', 'CD-3', '23FAC003'),
(9, '2026-02-18', 'Completed', 'CS-211', 'CD-3', '23FAC003'),
(10, '2026-02-15', 'Completed', 'CS-130', 'EC-2', '23FAC001'),
(11, '2026-02-16', 'Completed', 'CS-130', 'EC-2', '23FAC001'),
(12, '2026-02-18', 'Completed', 'CS-150', 'CD-2', '23FAC004')
ON DUPLICATE KEY UPDATE
lecture_date = VALUES(lecture_date),
status = VALUES(status),
course_id = VALUES(course_id),
section_name = VALUES(section_name),
faculty_id = VALUES(faculty_id);

-- Attendance
INSERT INTO ATTENDANCE (attendance_id, roll_no, lecture_id, is_present) VALUES
('ATT0000001', '23BCS083', 1, TRUE),
('ATT0000002', '23BCS084', 1, TRUE),
('ATT0000003', '23BIT045', 1, FALSE),
('ATT0000004', '23BCS085', 1, TRUE),
('ATT0000005', '23BIT046', 1, TRUE),
('ATT0000006', '23BCS083', 2, TRUE),
('ATT0000007', '23BCS084', 2, FALSE),
('ATT0000008', '23BIT045', 2, TRUE),
('ATT0000009', '23BCS085', 2, TRUE),
('ATT0000010', '23BIT046', 2, TRUE),
('ATT0000011', '23BCS083', 3, TRUE),
('ATT0000012', '23BCS084', 3, TRUE),
('ATT0000013', '23BIT045', 3, TRUE),
('ATT0000014', '23BCS085', 3, FALSE),
('ATT0000015', '23BIT046', 3, TRUE),
('ATT0000016', '23BCS083', 5, FALSE),
('ATT0000017', '23BCS084', 5, TRUE),
('ATT0000018', '23BIT045', 5, TRUE),
('ATT0000019', '23BCS085', 5, TRUE),
('ATT0000020', '23BIT046', 5, FALSE),
('ATT0000021', '23BCS083', 6, TRUE),
('ATT0000022', '23BCS084', 6, TRUE),
('ATT0000023', '23BIT045', 6, TRUE),
('ATT0000024', '23BCS085', 6, TRUE),
('ATT0000025', '23BIT046', 6, TRUE),
('ATT0000026', '23BCS083', 7, TRUE),
('ATT0000027', '23BCS084', 7, TRUE),
('ATT0000028', '23BIT045', 7, TRUE),
('ATT0000029', '24BCS091', 7, TRUE),
('ATT0000030', '24BIT052', 7, FALSE),
('ATT0000031', '23BCS083', 8, TRUE),
('ATT0000032', '23BCS084', 8, FALSE),
('ATT0000033', '23BIT045', 8, TRUE),
('ATT0000034', '24BCS091', 8, TRUE),
('ATT0000035', '24BIT052', 8, TRUE),
('ATT0000036', '23BCS083', 9, TRUE),
('ATT0000037', '23BCS084', 9, TRUE),
('ATT0000038', '23BIT045', 9, TRUE),
('ATT0000039', '24BCS091', 9, FALSE),
('ATT0000040', '24BIT052', 9, TRUE),
('ATT0000041', '23BCS083', 10, TRUE),
('ATT0000042', '23BCS085', 10, TRUE),
('ATT0000043', '23BIT046', 10, TRUE),
('ATT0000044', '24BCS091', 10, FALSE),
('ATT0000045', '24BCS092', 10, TRUE),
('ATT0000046', '23BCS083', 11, TRUE),
('ATT0000047', '23BCS085', 11, FALSE),
('ATT0000048', '23BIT046', 11, TRUE),
('ATT0000049', '24BCS091', 11, TRUE),
('ATT0000050', '24BCS092', 11, TRUE),
('ATT0000051', '23BCS084', 12, TRUE),
('ATT0000052', '23BIT045', 12, TRUE),
('ATT0000053', '24BIT052', 12, TRUE),
('ATT0000054', '24BCS092', 12, FALSE)
ON DUPLICATE KEY UPDATE
roll_no = VALUES(roll_no),
lecture_id = VALUES(lecture_id),
is_present = VALUES(is_present);

SELECT 'Seed complete' AS status;
