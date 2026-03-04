# Quick Start Guide

Get your Student Attendance Management System up and running in 5 minutes!

## ⚡ Quick Setup (5 Minutes)

### Step 1: Access the Application (30 seconds)
1. Open the application in your web browser
2. You'll see the login page

### Step 2: Create First Admin Account (1 minute)
1. Click **"First time setup? Create admin account"**
2. Fill in the form:
   - **Name**: Your full name (e.g., Dr. Admin User)
   - **Email**: admin@nith.ac.in
   - **Password**: Choose a secure password (min 6 characters)
   - **Confirm Password**: Re-enter the same password
3. Click **"Create Admin Account"**
4. You'll be redirected to the login page

### Step 3: Login as Admin (30 seconds)
1. Enter your admin credentials
2. Click **"Sign In"**
3. You'll see the Admin Dashboard with stats overview

### Step 4: Create a Faculty Member (1 minute)
1. Stay on the **"Users"** tab (default)
2. Fill in "Create New User" form:
   - **Email**: faculty@nith.ac.in
   - **Password**: faculty123
   - **Name**: Dr. Faculty Name
   - **Role**: Select "Faculty"
   - **Employee ID**: FAC001
3. Click **"Create User"**

### Step 5: Create a Student (1 minute)
1. Still on the **"Users"** tab
2. Fill in "Create New User" form:
   - **Email**: student@nith.ac.in
   - **Password**: student123
   - **Name**: Student Name
   - **Role**: Select "Student"
   - **Roll Number**: 21BCS001
   - **Batch Year**: 2024
3. Click **"Create User"**

### Step 6: Create a Course (30 seconds)
1. Click on **"Courses"** tab
2. Fill in "Create New Course" form:
   - **Course Code**: CS101
   - **Course Name**: Introduction to Programming
   - **Credits**: 4
   - **Department**: CSE
3. Click **"Create Course"**

### Step 7: Create a Section (30 seconds)
1. Click on **"Sections"** tab
2. Fill in "Create New Section" form:
   - **Course**: Select "CS101 - Introduction to Programming"
   - **Section Name**: A
   - **Batch Year**: 2024
   - **Faculty**: Leave empty for now
3. Click **"Create Section"**

### Step 8: Assign Faculty to Section (30 seconds)
1. Click on **"Faculty Assignment"** tab
2. Fill in the form:
   - **Section**: Select "CS101 - Section A (Batch 2024)"
   - **Faculty**: Select "Dr. Faculty Name (FAC001)"
3. Click **"Assign Faculty"**

### Step 9: Enroll Student (30 seconds)
1. Click on **"Enrollments"** tab
2. Fill in the form:
   - **Student**: Select "Student Name (21BCS001)"
   - **Course**: Select "CS101 - Introduction to Programming"
   - **Section**: Select "A (Batch 2024)"
3. Click **"Enroll Student"**

### Step 10: Test Faculty Dashboard (1 minute)
1. Click **Logout** (top right)
2. Login with faculty credentials:
   - Email: faculty@nith.ac.in
   - Password: faculty123
3. You should see CS101 Section A
4. Click on the course card
5. Click **"Create Lecture"**
6. Fill in:
   - Date: Today's date
   - Topic: Introduction to Course
7. Click **"Create Lecture"**
8. Click **"Mark Attendance"** button
9. Mark the student as **Present**
10. Close the dialog
11. Click **"Finalize"** to lock the lecture

### Step 11: Test Student Dashboard (1 minute)
1. Click **Logout**
2. Login with student credentials:
   - Email: student@nith.ac.in
   - Password: student123
3. You should see CS101 course
4. Click on the course card
5. View your attendance: 1/1 lectures = 100%

## ✅ You're Done!

You now have a fully functional attendance system with:
- ✓ 1 Admin account
- ✓ 1 Faculty account
- ✓ 1 Student account
- ✓ 1 Course
- ✓ 1 Section with faculty assigned
- ✓ 1 Student enrollment
- ✓ 1 Lecture with attendance marked

## 🎯 What's Next?

### Add More Data
- Create more students, faculty, and courses
- Set up multiple sections
- Add courses for different departments

### Explore Features
- **Admin**: Try creating courses for different departments
- **Faculty**: Create multiple lectures and track attendance over time
- **Student**: Watch your attendance percentage change

### Test Scenarios
- Mark some students absent to see percentage drop
- View the attendance report from faculty dashboard
- Check student warnings when attendance falls below 75%

## 📚 Learn More

- **Full Documentation**: See [README.md](./README.md)
- **Detailed Guide**: Check [SYSTEM_GUIDE.md](./SYSTEM_GUIDE.md)
- **Demo Setup**: Review [DEMO_SETUP.md](./DEMO_SETUP.md) for comprehensive demo data

## 🆘 Need Help?

### Common First-Time Issues

**Can't see the section in faculty dashboard?**
- Make sure you assigned the faculty to the section in Admin → Faculty Assignment

**Student not seeing the course?**
- Verify the student is enrolled in Admin → Enrollments

**Attendance percentage showing 0%?**
- Make sure you finalized the lecture (click "Finalize" button)

**Forgot password?**
- Contact admin to reset (or create new account for testing)

## 🚀 Pro Tips

1. **Organize by Batch**: Keep batch years consistent (e.g., 2024 for all first-year students)
2. **Section Names**: Use A, B, C for different sections of the same course
3. **Course Codes**: Follow pattern like CS101, MA101, PH101
4. **Regular Finalization**: Faculty should finalize lectures daily
5. **Check Reports**: Use attendance reports to identify students with low attendance

## 🎓 Sample Data Patterns

### Course Codes
- **CSE**: CS101, CS201, CS301
- **ECE**: EC101, EC201
- **Math**: MA101, MA201
- **Physics**: PH101, PH201

### Roll Numbers
- Format: YearDepartmentSequence
- Example: 21BCS001, 21BCS002, 22BCS001

### Employee IDs
- Format: Department + Number
- Example: CSE001, ECE001, MATH001

---

**Ready to manage attendance like a pro! 🎉**
