USE Attendance_Management;

-- ===================================================================
-- STUDENT MANAGEMENT PROCEDURES
-- ===================================================================

DELIMITER //

-- Procedure to enroll a student in a course
CREATE PROCEDURE sp_EnrollStudent(
    IN p_roll_no INT,
    IN p_course_id INT
)
BEGIN
    INSERT INTO ENROLLS (roll_no, course_id)
    VALUES (p_roll_no, p_course_id);
END //

-- Procedure to get all students enrolled in a specific course
CREATE PROCEDURE sp_GetStudentsByCourse(
    IN p_course_id INT
)
BEGIN
    SELECT s.roll_no, s.name, s.batch_year, s.department
    FROM STUDENT s
    INNER JOIN ENROLLS e ON s.roll_no = e.roll_no
    WHERE e.course_id = p_course_id
    ORDER BY s.roll_no;
END //

-- Procedure to get all courses for a specific student
CREATE PROCEDURE sp_GetCoursesByStudent(
    IN p_roll_no INT
)
BEGIN
    SELECT c.course_id, c.course_name
    FROM COURSE c
    INNER JOIN ENROLLS e ON c.course_id = e.course_id
    WHERE e.roll_no = p_roll_no
    ORDER BY c.course_name;
END //

-- ===================================================================
-- LECTURE MANAGEMENT PROCEDURES
-- ===================================================================

-- Procedure to create a new lecture
CREATE PROCEDURE sp_CreateLecture(
    IN p_lecture_id INT,
    IN p_lecture_date DATE,
    IN p_status VARCHAR(20),
    IN p_course_id INT,
    IN p_section_name VARCHAR(50),
    IN p_faculty_id INT
)
BEGIN
    INSERT INTO LECTURE (lecture_id, lecture_date, status, course_id, section_name, faculty_id)
    VALUES (p_lecture_id, p_lecture_date, p_status, p_course_id, p_section_name, p_faculty_id);
END //

-- Procedure to get lectures by faculty for a specific course and section
CREATE PROCEDURE sp_GetLecturesByFaculty(
    IN p_faculty_id INT,
    IN p_course_id INT,
    IN p_section_name VARCHAR(50)
)
BEGIN
    SELECT lecture_id, lecture_date, status
    FROM LECTURE
    WHERE faculty_id = p_faculty_id 
      AND course_id = p_course_id 
      AND section_name = p_section_name
    ORDER BY lecture_date DESC;
END //

-- Procedure to finalize a lecture
CREATE PROCEDURE sp_FinalizeLecture(
    IN p_lecture_id INT
)
BEGIN
    UPDATE LECTURE
    SET status = 'Completed'
    WHERE lecture_id = p_lecture_id;
END //

-- ===================================================================
-- ATTENDANCE MANAGEMENT PROCEDURES
-- ===================================================================

-- Procedure to mark attendance for a student in a lecture
CREATE PROCEDURE sp_MarkAttendance(
    IN p_attendance_id INT,
    IN p_roll_no INT,
    IN p_lecture_id INT,
    IN p_is_present BOOLEAN
)
BEGIN
    INSERT INTO ATTENDANCE (attendance_id, roll_no, lecture_id, is_present)
    VALUES (p_attendance_id, p_roll_no, p_lecture_id, p_is_present);
END //

-- Procedure to update attendance status
CREATE PROCEDURE sp_UpdateAttendance(
    IN p_roll_no INT,
    IN p_lecture_id INT,
    IN p_is_present BOOLEAN
)
BEGIN
    UPDATE ATTENDANCE
    SET is_present = p_is_present
    WHERE roll_no = p_roll_no AND lecture_id = p_lecture_id;
END //

-- Procedure to get attendance records for a specific lecture
CREATE PROCEDURE sp_GetAttendanceByLecture(
    IN p_lecture_id INT
)
BEGIN
    SELECT a.attendance_id, a.roll_no, s.name, a.is_present
    FROM ATTENDANCE a
    INNER JOIN STUDENT s ON a.roll_no = s.roll_no
    WHERE a.lecture_id = p_lecture_id
    ORDER BY s.roll_no;
END //

-- Procedure to get attendance records for a specific student
CREATE PROCEDURE sp_GetAttendanceByStudent(
    IN p_roll_no INT
)
BEGIN
    SELECT a.attendance_id, a.lecture_id, l.lecture_date, l.course_id, 
           c.course_name, l.section_name, a.is_present
    FROM ATTENDANCE a
    INNER JOIN LECTURE l ON a.lecture_id = l.lecture_id
    INNER JOIN COURSE c ON l.course_id = c.course_id
    WHERE a.roll_no = p_roll_no
    ORDER BY l.lecture_date DESC;
END //

-- ===================================================================
-- ATTENDANCE CALCULATION PROCEDURES
-- ===================================================================

-- Procedure to calculate attendance percentage for a student in a course
CREATE PROCEDURE sp_CalculateAttendancePercentage(
    IN p_roll_no INT,
    IN p_course_id INT,
    OUT p_total_lectures INT,
    OUT p_attended_lectures INT,
    OUT p_percentage DECIMAL(5,2)
)
BEGIN
    -- Get total lectures
    SELECT COUNT(DISTINCT l.lecture_id) INTO p_total_lectures
    FROM LECTURE l
    WHERE l.course_id = p_course_id AND l.status = 'Completed';
    
    -- Get attended lectures
    SELECT COUNT(a.attendance_id) INTO p_attended_lectures
    FROM ATTENDANCE a
    INNER JOIN LECTURE l ON a.lecture_id = l.lecture_id
    WHERE a.roll_no = p_roll_no 
      AND l.course_id = p_course_id 
      AND a.is_present = TRUE
      AND l.status = 'Completed';
    
    -- Calculate percentage
    IF p_total_lectures > 0 THEN
        SET p_percentage = (p_attended_lectures * 100.0) / p_total_lectures;
    ELSE
        SET p_percentage = 0;
    END IF;
END //

-- Procedure to get attendance summary for a course section
CREATE PROCEDURE sp_GetCourseSectionAttendanceSummary(
    IN p_course_id INT,
    IN p_section_name VARCHAR(50)
)
BEGIN
    SELECT 
        s.roll_no,
        s.name,
        COUNT(DISTINCT l.lecture_id) AS total_lectures,
        SUM(CASE WHEN a.is_present = TRUE THEN 1 ELSE 0 END) AS attended_lectures,
        CASE 
            WHEN COUNT(DISTINCT l.lecture_id) > 0 
            THEN ROUND((SUM(CASE WHEN a.is_present = TRUE THEN 1 ELSE 0 END) * 100.0) / COUNT(DISTINCT l.lecture_id), 2)
            ELSE 0
        END AS attendance_percentage
    FROM STUDENT s
    INNER JOIN ENROLLS e ON s.roll_no = e.roll_no
    LEFT JOIN LECTURE l ON e.course_id = l.course_id AND l.section_name = p_section_name AND l.status = 'Completed'
    LEFT JOIN ATTENDANCE a ON s.roll_no = a.roll_no AND l.lecture_id = a.lecture_id
    WHERE e.course_id = p_course_id
    GROUP BY s.roll_no, s.name
    ORDER BY s.roll_no;
END //

-- ===================================================================
-- FACULTY MANAGEMENT PROCEDURES
-- ===================================================================

-- Procedure to get courses taught by a faculty member
CREATE PROCEDURE sp_GetCoursesByFaculty(
    IN p_faculty_id INT
)
BEGIN
    SELECT DISTINCT c.course_id, c.course_name
    FROM COURSE c
    INNER JOIN LECTURE l ON c.course_id = l.course_id
    WHERE l.faculty_id = p_faculty_id
    ORDER BY c.course_name;
END //

-- Procedure to get sections taught by faculty for a specific course
CREATE PROCEDURE sp_GetSectionsByFacultyCourse(
    IN p_faculty_id INT,
    IN p_course_id INT
)
BEGIN
    SELECT DISTINCT s.section_name, s.course_id
    FROM SECTION s
    INNER JOIN LECTURE l ON s.section_name = l.section_name AND s.course_id = l.course_id
    WHERE l.faculty_id = p_faculty_id AND l.course_id = p_course_id
    ORDER BY s.section_name;
END //

-- ===================================================================
-- SECTION MANAGEMENT PROCEDURES
-- ===================================================================

-- Procedure to create a new section
CREATE PROCEDURE sp_CreateSection(
    IN p_section_name VARCHAR(50),
    IN p_course_id INT
)
BEGIN
    INSERT INTO SECTION (section_name, course_id)
    VALUES (p_section_name, p_course_id);
END //

-- Procedure to get all sections for a course
CREATE PROCEDURE sp_GetSectionsByCourse(
    IN p_course_id INT
)
BEGIN
    SELECT section_name, course_id
    FROM SECTION
    WHERE course_id = p_course_id
    ORDER BY section_name;
END //

-- ===================================================================
-- REPORTING PROCEDURES
-- ===================================================================

-- Procedure to get students with low attendance in a course
CREATE PROCEDURE sp_GetLowAttendanceStudents(
    IN p_course_id INT,
    IN p_section_name VARCHAR(50),
    IN p_threshold DECIMAL(5,2)
)
BEGIN
    SELECT 
        s.roll_no,
        s.name,
        s.department,
        COUNT(DISTINCT l.lecture_id) AS total_lectures,
        SUM(CASE WHEN a.is_present = TRUE THEN 1 ELSE 0 END) AS attended_lectures,
        ROUND((SUM(CASE WHEN a.is_present = TRUE THEN 1 ELSE 0 END) * 100.0) / COUNT(DISTINCT l.lecture_id), 2) AS attendance_percentage
    FROM STUDENT s
    INNER JOIN ENROLLS e ON s.roll_no = e.roll_no
    INNER JOIN LECTURE l ON e.course_id = l.course_id AND l.section_name = p_section_name
    LEFT JOIN ATTENDANCE a ON s.roll_no = a.roll_no AND l.lecture_id = a.lecture_id
    WHERE e.course_id = p_course_id AND l.status = 'Completed'
    GROUP BY s.roll_no, s.name, s.department
    HAVING ROUND((SUM(CASE WHEN a.is_present = TRUE THEN 1 ELSE 0 END) * 100.0) / COUNT(DISTINCT l.lecture_id), 2) < p_threshold
    ORDER BY attendance_percentage ASC, s.roll_no;
END //

-- Procedure to get attendance statistics for a faculty member
CREATE PROCEDURE sp_GetFacultyAttendanceStats(
    IN p_faculty_id INT
)
BEGIN
    SELECT 
        c.course_id,
        c.course_name,
        l.section_name,
        COUNT(DISTINCT l.lecture_id) AS total_lectures,
        COUNT(DISTINCT CASE WHEN l.status = 'Completed' THEN l.lecture_id END) AS completed_lectures,
        COUNT(DISTINCT a.roll_no) AS total_students,
        SUM(CASE WHEN a.is_present = TRUE THEN 1 ELSE 0 END) AS total_present,
        CASE 
            WHEN COUNT(a.attendance_id) > 0 
            THEN ROUND((SUM(CASE WHEN a.is_present = TRUE THEN 1 ELSE 0 END) * 100.0) / COUNT(a.attendance_id), 2)
            ELSE 0
        END AS overall_attendance_percentage
    FROM LECTURE l
    INNER JOIN COURSE c ON l.course_id = c.course_id
    LEFT JOIN ATTENDANCE a ON l.lecture_id = a.lecture_id
    WHERE l.faculty_id = p_faculty_id
    GROUP BY c.course_id, c.course_name, l.section_name
    ORDER BY c.course_name, l.section_name;
END //

-- Procedure to get batch-wise student count
CREATE PROCEDURE sp_GetBatchWiseStudentCount()
BEGIN
    SELECT batch_year, department, COUNT(*) AS student_count
    FROM STUDENT
    GROUP BY batch_year, department
    ORDER BY batch_year DESC, department;
END //

-- ===================================================================
-- BULK OPERATIONS PROCEDURES
-- ===================================================================

-- Procedure to mark all students present for a lecture
CREATE PROCEDURE sp_MarkAllPresent(
    IN p_lecture_id INT
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_roll_no INT;
    DECLARE v_attendance_id INT;
    DECLARE cur CURSOR FOR 
        SELECT s.roll_no
        FROM STUDENT s
        INNER JOIN ENROLLS e ON s.roll_no = e.roll_no
        INNER JOIN LECTURE l ON e.course_id = l.course_id
        WHERE l.lecture_id = p_lecture_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Get max attendance_id
    SELECT COALESCE(MAX(attendance_id), 0) INTO v_attendance_id FROM ATTENDANCE;
    
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_roll_no;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        SET v_attendance_id = v_attendance_id + 1;
        INSERT INTO ATTENDANCE (attendance_id, roll_no, lecture_id, is_present)
        VALUES (v_attendance_id, v_roll_no, p_lecture_id, TRUE);
    END LOOP;
    CLOSE cur;
END //

-- Procedure to delete all attendance records for a lecture
CREATE PROCEDURE sp_DeleteLectureAttendance(
    IN p_lecture_id INT
)
BEGIN
    DELETE FROM ATTENDANCE WHERE lecture_id = p_lecture_id;
END //

DELIMITER ;
