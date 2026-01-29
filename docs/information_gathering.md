# Information Gathering

## 1. Project Overview

The Student Attendance Management System is intended to digitally manage and monitor student attendance in an academic environment such as NIT Hamirpur. The system supports role-based access for different authorities to ensure secure, accurate, and efficient attendance recording, management, and reporting.

The system is designed with three primary authorities: Admin, Faculty, and Student. Each authority has clearly defined responsibilities and permissions, which directly influence the database design and relationships.

---

## 2. Stakeholders and Authorities

### 2.1 Admin Authority

The Admin acts as the central controller of the system and is responsible for maintaining institutional data.

**Responsibilities:**

* Enroll and manage faculty records
* Assign faculty to courses and sections
* Add and enroll students into courses and sections
* Monitor system activities
* Broadcast messages to faculty and students (optional)
* View and manage tickets raised by faculty or students (optional)

---

### 2.2 Faculty Authority

Faculty members are responsible for marking and managing attendance for the courses they teach.

**Responsibilities:**

* View the batch years assigned to them
* Access courses taught in a selected batch
* View section details for each course
* Create and manage lecture sessions
* Mark attendance for each lecture
* Finish a lecture to finalize attendance
* Automatically generate attendance percentage for students in a section
* Review medical certificate requests submitted by students
* Approve or reject medical certificates for attendance shortage cases
* Adjust attendance records based on approved medical certificates
* Broadcast messages or raise tickets to admin (optional)

---

### 2.3 Student Authority

Students have read-only access to their attendance data and limited communication features.

**Responsibilities:**

* View attendance details for enrolled courses
* Track attendance percentage
* Upload medical certificates for missed lectures due to medical reasons
* Track approval status of submitted medical certificates
* Raise tickets or queries to faculty regarding attendance

---

## 3. Functional Requirements

* The system shall support role-based access for Admin, Faculty, and Student.
* Admin shall be able to enroll faculty and students and assign courses and sections.
* Faculty shall be able to create lectures, mark attendance, and finalize attendance for each lecture.
* Attendance shall be recorded on a per-student, per-lecture basis.
* The system shall automatically compute attendance percentage for each student.
* Students shall be able to view their attendance records for enrolled courses.
* Students shall be able to upload medical certificates for lectures missed due to health reasons.
* Faculty shall have the authority to review, approve, or reject medical certificate submissions.
* Approved medical certificates shall be considered while calculating attendance percentage.
* The system shall maintain the status of medical certificate requests (Pending, Approved, Rejected).
* Faculty and students may raise tickets or broadcast messages (optional).

---

## 4. Data Requirements and Assumptions

* Each student, faculty, course, and lecture shall have a unique identifier.
* A student can enroll in multiple courses, but only once per section.
* A lecture is associated with exactly one course and one section.
* A student cannot have more than one attendance record for the same lecture.
* Attendance, once finalized, cannot be modified without authorization.
* Each medical certificate submission shall be associated with exactly one student and one or more lectures.
* A medical certificate submission shall have a status indicating approval or rejection.
* Attendance adjustments due to medical certificates shall require faculty authorization.

---

## 5. Identified Database Entities

Based on the information gathered, the following entities are identified:

1. Student
2. Faculty
3. Admin
4. Course
5. Section
6. Lecture
7. Attendance
8. Ticket (optional)
9. BroadcastMessage (optional)
10. MedicalCertificate

---

## 6. Non-Functional Requirements

* The system shall ensure data consistency and integrity through proper constraints.
* Only authorized users shall be able to access or modify data.
* The database design shall follow normalization principles up to Third Normal Form.
* The system shall support scalability for multiple batches, courses, and sections.
* The system shall provide fast retrieval of attendance and summary reports.
* Uploaded medical certificates shall be stored securely and accessible only to authorized users.

---

## 7. Design Considerations

* The system follows normalization principles to reduce redundancy.
* Attendance is separated from lecture details to ensure data integrity.
* Optional features such as tickets, broadcast messages, and medical certificate handling are modular and can be excluded if required.
* The design supports scalability for multiple batches, courses, and sections.

---

## 8. Scope Limitations

* The system focuses only on attendance management.
* Examination, grading, and evaluation modules are outside the scope.
* Authentication mechanisms are assumed but not implemented at the database level.
* The system supports only document-based medical certificates and does not perform medical validation.

---

## 9. Conclusion

This information-gathering phase establishes a clear understanding of the system’s scope, stakeholders, functional requirements, and data needs. The gathered information serves as a foundation for ER diagram design, normalization, and database schema implementation.
