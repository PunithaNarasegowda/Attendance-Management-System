# Demo Setup Instructions

This guide will help you quickly set up demo data to test the Student Attendance Management System.

## Step 1: Create Admin Account

First, you need to create an admin account programmatically or through the first signup.

**Demo Admin Credentials:**
```
Email: admin@nith.ac.in
Password: Admin@123
Name: System Administrator
Role: admin
```

## Step 2: Login as Admin

1. Open the application
2. Login with admin credentials
3. You'll be redirected to the Admin Dashboard

## Step 3: Create Faculty Members

In the **Users** tab, create these faculty members:

**Faculty 1:**
```
Email: faculty1@nith.ac.in
Password: Faculty@123
Name: Dr. Rajesh Kumar
Role: faculty
Employee ID: FAC001
```

**Faculty 2:**
```
Email: faculty2@nith.ac.in
Password: Faculty@123
Name: Dr. Priya Sharma
Role: faculty
Employee ID: FAC002
```

## Step 4: Create Students

In the **Users** tab, create these students:

**Student 1:**
```
Email: student1@nith.ac.in
Password: Student@123
Name: Amit Singh
Role: student
Roll Number: 21BCS001
Batch Year: 2021
```

**Student 2:**
```
Email: student2@nith.ac.in
Password: Student@123
Name: Neha Verma
Role: student
Roll Number: 21BCS002
Batch Year: 2021
```

**Student 3:**
```
Email: student3@nith.ac.in
Password: Student@123
Name: Rohit Sharma
Role: student
Roll Number: 21BCS003
Batch Year: 2021
```

## Step 5: Create Courses

In the **Courses** tab, create:

**Course 1:**
```
Code: CS101
Name: Data Structures and Algorithms
Credits: 4
Department: CSE
```

**Course 2:**
```
Code: CS201
Name: Database Management Systems
Credits: 3
Department: CSE
```

**Course 3:**
```
Code: MA101
Name: Engineering Mathematics
Credits: 4
Department: Mathematics
```

## Step 6: Create Sections

In the **Sections** tab, create:

**Section 1:**
```
Course: CS101 - Data Structures and Algorithms
Section Name: A
Batch Year: 2021
Faculty: Dr. Rajesh Kumar (optional at this stage)
```

**Section 2:**
```
Course: CS201 - Database Management Systems
Section Name: B
Batch Year: 2021
Faculty: Dr. Priya Sharma (optional at this stage)
```

## Step 7: Assign Faculty to Sections

In the **Faculty Assignment** tab:

**Assignment 1:**
```
Section: CS101 - Section A (Batch 2021)
Faculty: Dr. Rajesh Kumar (FAC001)
```

**Assignment 2:**
```
Section: CS201 - Section B (Batch 2021)
Faculty: Dr. Priya Sharma (FAC002)
```

## Step 8: Enroll Students

In the **Enrollments** tab, enroll students:

**For CS101 Section A:**
- Enroll: Amit Singh (21BCS001)
- Enroll: Neha Verma (21BCS002)
- Enroll: Rohit Sharma (21BCS003)

**For CS201 Section B:**
- Enroll: Amit Singh (21BCS001)
- Enroll: Neha Verma (21BCS002)

## Step 9: Test Faculty Dashboard

1. **Logout** from admin account
2. **Login** as faculty: `faculty1@nith.ac.in` / `Faculty@123`
3. You should see CS101 - Section A

### Create Lectures:

**Lecture 1:**
```
Date: 2026-02-01
Topic: Introduction to Data Structures
```

**Lecture 2:**
```
Date: 2026-02-03
Topic: Arrays and Linked Lists
```

**Lecture 3:**
```
Date: 2026-02-05
Topic: Stacks and Queues
```

### Mark Attendance:

**For Lecture 1 (2026-02-01):**
- Amit Singh: Present
- Neha Verma: Present
- Rohit Sharma: Absent

**For Lecture 2 (2026-02-03):**
- Amit Singh: Present
- Neha Verma: Absent
- Rohit Sharma: Present

**For Lecture 3 (2026-02-05):**
- Amit Singh: Absent
- Neha Verma: Present
- Rohit Sharma: Present

### Finalize Lectures:
- Click "Finalize" button for each lecture after marking attendance

### View Report:
- Go to "Attendance Report" tab
- You should see:
  - Amit Singh: 2/3 lectures = 66.67%
  - Neha Verma: 2/3 lectures = 66.67%
  - Rohit Sharma: 2/3 lectures = 66.67%

## Step 10: Test Student Dashboard

1. **Logout** from faculty account
2. **Login** as student: `student1@nith.ac.in` / `Student@123`
3. You should see enrolled courses: CS101 and CS201

### View CS101 Attendance:
- Click on CS101 card
- View statistics:
  - Total Lectures: 3
  - Attended: 2
  - Percentage: 66.67%
- See warning about low attendance
- View detailed lecture-by-lecture records

## Expected Results

After completing these steps, you should have:

✅ 1 Admin account
✅ 2 Faculty accounts
✅ 3 Student accounts
✅ 3 Courses
✅ 2 Sections with faculty assigned
✅ 5 Student enrollments
✅ 3 Lectures created (for CS101)
✅ Attendance marked for all 3 lectures
✅ All lectures finalized
✅ Attendance reports generated

## Testing Scenarios

### Test Case 1: Low Attendance Warning
- Login as any student
- View CS101 course (66.67% attendance)
- Verify yellow warning is displayed
- Check calculation for required attendance

### Test Case 2: Faculty Cannot Modify Finalized Lecture
- Login as faculty
- Try to change attendance for finalized lecture
- System should allow but show warning

### Test Case 3: Student View Only
- Login as student
- Verify student cannot create lectures
- Verify student cannot mark attendance
- Verify student can only view their own data

### Test Case 4: Cross-Faculty Access
- Login as faculty2@nith.ac.in
- Verify they can only see CS201 Section B
- Verify they cannot access CS101 Section A

### Test Case 5: Admin Full Access
- Login as admin
- Verify access to all management functions
- Create additional users, courses, sections

## Quick Reset

To reset the demo:
1. Delete all users except admin (or create fresh users)
2. Create new courses and sections
3. Re-enroll students
4. Start fresh with lectures

## Troubleshooting Demo

**Issue: Cannot see sections as faculty**
- Solution: Verify faculty is assigned to section in Admin → Faculty Assignment

**Issue: Student not seeing courses**
- Solution: Verify student is enrolled in Admin → Enrollments

**Issue: Attendance percentage is 0%**
- Solution: Ensure lectures are finalized by faculty

**Issue: Cannot login**
- Solution: Verify account was created with exact email/password

## Demo Tips

1. Use consistent batch years (2021) for all demo students
2. Create at least 3 lectures per section to see meaningful percentages
3. Vary attendance (some present, some absent) to test warnings
4. Test all three roles to verify access control
5. Create edge cases (0% attendance, 100% attendance)

## Demo Accounts Quick Reference

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Admin | admin@nith.ac.in | Admin@123 | Full system access |
| Faculty | faculty1@nith.ac.in | Faculty@123 | CS101 Section A |
| Faculty | faculty2@nith.ac.in | Faculty@123 | CS201 Section B |
| Student | student1@nith.ac.in | Student@123 | CS101, CS201 |
| Student | student2@nith.ac.in | Student@123 | CS101, CS201 |
| Student | student3@nith.ac.in | Student@123 | CS101 only |

---

**Note:** This is demo data for testing purposes. In production, use stronger passwords and real email addresses.
