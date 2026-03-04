# Student Attendance Management System

A comprehensive web-based attendance management system designed for NIT Hamirpur with role-based access control for Admin, Faculty, and Students.

## 🎯 Features

### Admin Dashboard
- **User Management**: Create and manage admin, faculty, and student accounts
- **Course Management**: Create courses with codes, credits, and departments
- **Section Management**: Create class sections for different batches
- **Faculty Assignment**: Assign faculty members to teach specific sections
- **Student Enrollment**: Enroll students in course sections

### Faculty Dashboard
- **Section Overview**: View all assigned courses and sections
- **Lecture Management**: Create and manage lecture sessions
- **Attendance Marking**: Mark students present/absent for each lecture
- **Lecture Finalization**: Lock attendance after completion
- **Attendance Reports**: Auto-generated reports with percentages
- **Student Roster**: View all enrolled students per section

### Student Dashboard
- **Course Overview**: View all enrolled courses
- **Attendance Records**: Detailed lecture-by-lecture attendance
- **Attendance Percentage**: Real-time calculation of attendance
- **Visual Progress**: Progress bars and color-coded warnings
- **Attendance Warnings**: Alerts when below 75% or 60% threshold

## 🚀 Getting Started

### Prerequisites
- Supabase account (for backend and authentication)
- Modern web browser

### First Time Setup

1. **Launch the Application**
   - Open the application in your browser
   - Click "First time setup? Create admin account"

2. **Create Admin Account**
   - Enter your details (name, email, password)
   - Click "Create Admin Account"
   - You'll be redirected to login

3. **Login as Admin**
   - Use your admin credentials to login
   - You'll see the Admin Dashboard

4. **Initial Configuration**
   - Create faculty members
   - Create students
   - Create courses
   - Create sections
   - Assign faculty to sections
   - Enroll students in sections

See [DEMO_SETUP.md](./DEMO_SETUP.md) for detailed step-by-step demo setup instructions.

## 📚 Documentation

- **[SYSTEM_GUIDE.md](./SYSTEM_GUIDE.md)**: Comprehensive user guide with workflows
- **[DEMO_SETUP.md](./DEMO_SETUP.md)**: Quick demo setup with sample data

## 🏗️ Architecture

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** components
- **Lucide React** icons
- **Sonner** for notifications

### Backend
- **Supabase Authentication**: Email/password auth
- **Supabase Edge Functions**: Hono web server
- **KV Store**: Persistent data storage

### Data Model

```
Users (Admin, Faculty, Student)
├── Courses
│   └── Sections
│       ├── Faculty Assignment
│       ├── Student Enrollment
│       └── Lectures
│           └── Attendance Records
```

## 🔐 Security

- **Role-based Access Control (RBAC)**
- **JWT Token Authentication**
- **Protected API Routes**
- **Server-side Validation**

## 📊 Key Business Rules

1. **Attendance Calculation**
   - Only finalized lectures count toward percentage
   - Formula: (Attended Lectures / Total Finalized Lectures) × 100

2. **Attendance Warnings**
   - Green: ≥75% (Good standing)
   - Yellow: 60-75% (Warning)
   - Red: <60% (Critical)

3. **Access Control**
   - Admin: Full system access
   - Faculty: Only assigned sections
   - Student: Only enrolled courses

4. **Data Integrity**
   - No duplicate attendance per lecture
   - Students must be enrolled to have attendance
   - Faculty must be assigned to mark attendance

## 🎨 User Interface

### Design Principles
- Clean, modern interface
- Responsive design (desktop and mobile)
- Intuitive navigation
- Color-coded status indicators
- Real-time feedback with toasts

### Color Scheme
- Primary: Blue (#2563EB)
- Success: Green
- Warning: Yellow
- Error: Red
- Background: Light gray gradient

## 🔧 Technical Stack

- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Backend**: Supabase (Auth + Edge Functions)
- **Server Framework**: Hono
- **Language**: TypeScript

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (optimized)
- Tablets
- Mobile devices

## 🧪 Testing

### Test Accounts (After Demo Setup)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@nith.ac.in | Admin@123 |
| Faculty | faculty1@nith.ac.in | Faculty@123 |
| Student | student1@nith.ac.in | Student@123 |

### Test Scenarios
1. Login with different roles
2. Create courses and sections
3. Enroll students
4. Mark attendance
5. View reports
6. Test access control

## ⚠️ Important Notes

- This is a **prototype/development system**
- **Not suitable for production** with real PII data
- Email confirmation is auto-enabled (no SMTP configured)
- No email notifications (notifications via in-app toasts only)
- No data export features (manual viewing only)

## 🛠️ Development

### Project Structure
```
/src
  /app
    /components
      - AdminDashboard.tsx
      - FacultyDashboard.tsx
      - StudentDashboard.tsx
      - LoginPage.tsx
      - FirstTimeSetup.tsx
      /ui (Radix UI components)
    - App.tsx
  /utils
    - api.ts
    - supabase-client.ts
/supabase
  /functions
    /server
      - index.tsx (API routes)
      - kv_store.tsx (Data layer)
```

### API Routes

**Auth:**
- POST `/signup` - Create new user

**Admin:**
- POST `/admin/create-course`
- GET `/admin/courses`
- POST `/admin/create-section`
- GET `/admin/sections`
- POST `/admin/assign-faculty`
- POST `/admin/enroll-student`
- GET `/admin/users`

**Faculty:**
- GET `/faculty/my-sections`
- GET `/faculty/section-students/:sectionId`
- POST `/faculty/create-lecture`
- GET `/faculty/lectures/:sectionId`
- POST `/faculty/mark-attendance`
- GET `/faculty/lecture-attendance/:lectureId`
- POST `/faculty/finalize-lecture`
- GET `/faculty/attendance-report/:sectionId`

**Student:**
- GET `/student/my-courses`
- GET `/student/my-attendance/:sectionId`

## 🐛 Troubleshooting

### Common Issues

**Login fails**
- Check email/password are correct
- Verify account exists in system
- Clear browser cache

**Attendance not showing**
- Ensure lecture is finalized
- Verify student enrollment
- Refresh page

**Cannot mark attendance**
- Check faculty assignment
- Verify lecture status
- Ensure student is enrolled

## 🚦 Roadmap (Future Enhancements)

- [ ] Bulk operations (CSV upload)
- [ ] Email notifications
- [ ] SMS integration
- [ ] Biometric attendance
- [ ] Leave management
- [ ] Report export (PDF/Excel)
- [ ] Mobile app
- [ ] Parent portal
- [ ] Analytics dashboard
- [ ] Attendance trends

## 📄 License

This project is built for educational/prototyping purposes for NIT Hamirpur.

## 🤝 Support

For issues or questions:
1. Check [SYSTEM_GUIDE.md](./SYSTEM_GUIDE.md) for usage help
2. Review [DEMO_SETUP.md](./DEMO_SETUP.md) for setup guidance
3. Contact system administrator

## 🎓 About NIT Hamirpur

National Institute of Technology Hamirpur is a premier technical institution in India, known for excellence in engineering education and research.

---

**Built with ❤️ for NIT Hamirpur**
