# Student Attendance Management System - User Guide

## Overview

This is a comprehensive Student Attendance Management System designed for NIT Hamirpur with role-based access control for three types of users:

- **Admin**: System administrators
- **Faculty**: Teachers/Professors
- **Student**: Enrolled students

## Getting Started

### Initial Setup

1. **Create an Admin Account First**
   - Use the Admin Dashboard to create the first admin user
   - Contact system administrator for initial credentials

2. **Default Login Flow**
   - Navigate to the login page
   - Enter your email and password
   - The system will automatically redirect you to the appropriate dashboard based on your role

## User Roles & Capabilities

### Admin Dashboard

**Capabilities:**
- Create and manage users (Admin, Faculty, Students)
- Create and manage courses
- Create sections for courses
- Assign faculty to sections
- Enroll students in sections

**Key Features:**
- **Users Tab**: Create users with role-specific fields
  - Students: Roll Number, Batch Year
  - Faculty: Employee ID
  - Admin: Standard credentials
  
- **Courses Tab**: Define courses with code, name, credits, and department

- **Sections Tab**: Create class sections linked to courses and batch years

- **Enrollments Tab**: Enroll students in specific course sections

- **Faculty Assignment Tab**: Assign faculty members to teach sections

### Faculty Dashboard

**Capabilities:**
- View assigned sections and courses
- Create lecture sessions
- Mark attendance for students
- Finalize lectures
- View attendance reports

**Key Features:**
- **My Sections**: View all assigned sections with course details
- **Lectures Tab**: 
  - Create new lecture sessions with date and topic
  - View all lectures (ongoing and finalized)
  - Mark attendance for each lecture
  - Finalize lectures (makes them immutable)
  
- **Students Tab**: View all enrolled students in a section

- **Attendance Report Tab**: 
  - View comprehensive attendance statistics
  - See percentage for each student
  - Color-coded warnings (Red: <60%, Yellow: 60-75%, Green: ≥75%)

**Attendance Marking Process:**
1. Create a lecture session
2. Click "Mark Attendance" for the lecture
3. Mark each student as Present or Absent
4. Finalize the lecture when complete

### Student Dashboard

**Capabilities:**
- View enrolled courses
- View attendance records
- Track attendance percentage
- View lecture history

**Key Features:**
- **My Courses**: Overview of all enrolled courses
- **Course Details**: 
  - Total lectures conducted
  - Attended lectures count
  - Attendance percentage with progress bar
  - Detailed lecture-by-lecture attendance records
  
- **Warnings**: 
  - Yellow warning if attendance < 75%
  - Red critical warning if attendance < 60%
  - Calculation of required classes to reach 75%

## System Features

### Attendance Rules
- Attendance can only be marked by assigned faculty
- Each student can have only one attendance record per lecture
- Lectures must be finalized to count toward percentage
- Attendance can be updated even after finalization (with warning)
- No duplicate attendance entries allowed

### Data Integrity
- Students can only be enrolled in sections for courses
- Faculty can only manage their assigned sections
- Attendance percentages are auto-calculated based on finalized lectures
- Role-based access ensures data security

## Sample Workflow

### Setting Up the System (Admin)

1. **Create Faculty Members**
   ```
   - Go to Users tab
   - Fill in Name, Email, Password
   - Select Role: Faculty
   - Add Employee ID
   - Click "Create User"
   ```

2. **Create Students**
   ```
   - Go to Users tab
   - Fill in Name, Email, Password
   - Select Role: Student
   - Add Roll Number and Batch Year
   - Click "Create User"
   ```

3. **Create Courses**
   ```
   - Go to Courses tab
   - Add Course Code (e.g., CS101)
   - Add Course Name (e.g., Data Structures)
   - Set Credits
   - Add Department
   - Click "Create Course"
   ```

4. **Create Sections**
   ```
   - Go to Sections tab
   - Select Course
   - Enter Section Name (e.g., A, B)
   - Enter Batch Year (e.g., 2024)
   - Optionally assign faculty
   - Click "Create Section"
   ```

5. **Enroll Students**
   ```
   - Go to Enrollments tab
   - Select Student
   - Select Course
   - Select Section
   - Click "Enroll Student"
   ```

### Faculty Daily Workflow

1. **Login** with faculty credentials
2. **Select Section** from the dashboard
3. **Create Lecture** for the class
4. **Mark Attendance** for all students
5. **Finalize Lecture** when done

### Student Usage

1. **Login** with student credentials
2. **View enrolled courses** on dashboard
3. **Select a course** to see detailed attendance
4. **Monitor attendance percentage** and warnings
5. **Track lecture history** and attendance status

## Technical Notes

### Authentication
- Uses Supabase Authentication
- Email confirmation is auto-enabled
- Passwords are securely hashed
- Session management with JWT tokens

### Data Storage
- All data stored in Supabase KV store
- Relational data maintained through key structures
- Real-time updates across sessions
- Persistent storage across sessions

### Security
- Role-based access control (RBAC)
- Authorization checks on all API endpoints
- Protected routes for sensitive operations
- Access tokens required for API calls

## Tips for Best Usage

### For Admins
- Create all faculty and students at the beginning of semester
- Set up all courses and sections before enrollment
- Regularly verify faculty assignments
- Monitor system usage and data integrity

### For Faculty
- Create lectures promptly after class
- Mark attendance immediately to avoid errors
- Finalize lectures only when certain all attendance is marked
- Review attendance reports regularly
- Contact students with low attendance early

### For Students
- Check attendance regularly
- Verify attendance is marked correctly
- Monitor percentage to stay above 75% threshold
- Contact faculty immediately if attendance is incorrectly marked
- Plan ahead if approaching critical thresholds

## Support & Troubleshooting

### Common Issues

**Cannot Login**
- Verify email and password are correct
- Ensure account has been created by admin
- Clear browser cache and try again

**Attendance Not Showing**
- Ensure lecture has been finalized by faculty
- Refresh the page
- Verify you are enrolled in the section

**Cannot Mark Attendance (Faculty)**
- Verify you are assigned to the section
- Check if lecture has already been finalized
- Ensure student is enrolled in the section

**Percentage Not Updating**
- Attendance percentage only counts finalized lectures
- Wait for faculty to finalize the lecture
- Refresh the dashboard

## Best Practices

1. **Regular Monitoring**: Students should check attendance weekly
2. **Prompt Marking**: Faculty should mark attendance same day
3. **Verification**: Admin should audit enrollments periodically
4. **Communication**: Report issues immediately to admin
5. **Backup**: Admin should maintain user records separately

## System Limitations

- This is a prototype system for development/testing purposes
- Not designed for production use with sensitive PII data
- Email notifications are not configured
- No file upload/download for bulk operations
- No mobile app (responsive web only)

## Future Enhancements (Not Implemented)

- Bulk student enrollment via CSV
- Email notifications for low attendance
- Mobile application
- Biometric integration
- Leave application system
- Attendance reports export (PDF/Excel)
- Parent portal access
- SMS notifications
