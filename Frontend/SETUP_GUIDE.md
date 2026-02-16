# Quick Start Guide - Attendance Management System Frontend

## ✅ Installation Complete!

All frontend files have been successfully created and dependencies installed.

## 📁 What's Been Created

### Core Structure
- ✅ **Constants & Configuration** - App-wide constants, API URLs, roles
- ✅ **Utilities** - Date formatting, attendance calculations, validators, API client
- ✅ **Authentication** - JWT-based auth with context and protected routes
- ✅ **API Services** - Complete service layer for all entities
- ✅ **UI Components** - 11 reusable components (Button, Input, Table, Modal, etc.)
- ✅ **Layouts** - Main layout with integrated navbar
- ✅ **Pages** - All pages for Admin, Faculty, and Student roles

### Admin Pages
- Dashboard with statistics
- Manage Students (CRUD operations)
- Manage Faculty (CRUD operations)
- Manage Courses (CRUD operations)

### Faculty Pages
- Dashboard with quick actions
- My Courses (view assigned courses)
- Manage Lectures (create and schedule)
- Mark Attendance (with finalization)
- Medical Certificates (review and approve)

### Student Pages
- Dashboard with attendance overview
- My Attendance (view records and percentage)
- Upload Certificate (for medical absences)
- My Certificates (track approval status)

## 🚀 Running the Application

### Start Development Server
```bash
cd "d:\Labs\DBMS\Attendance Management System\Frontend"
npm run dev
```

The app will be available at: **http://localhost:5173**

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🔧 Configuration

### Environment Variables (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=application/pdf,image/jpeg,image/png,image/jpg
```

**Important:** Update `VITE_API_BASE_URL` to match your backend API endpoint.

## 🎨 Features Implemented

### Authentication & Security
- ✅ JWT token-based authentication
- ✅ Role-based access control (Admin, Faculty, Student)
- ✅ Protected routes with automatic redirects
- ✅ Token refresh mechanism
- ✅ Automatic logout on token expiration

### UI/UX
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Modern Tailwind CSS styling
- ✅ Loading states and spinners
- ✅ Error handling with user-friendly messages
- ✅ Modal dialogs for forms
- ✅ Alert notifications
- ✅ Color-coded badges and status indicators

### Attendance Management
- ✅ Per-lecture attendance marking
- ✅ Automatic percentage calculation
- ✅ Medical certificate upload (with file validation)
- ✅ Certificate approval workflow
- ✅ Lecture finalization (locks attendance)
- ✅ Attendance reports and statistics

### Data Management
- ✅ Complete CRUD operations for all entities
- ✅ Real-time data updates
- ✅ Filterable and sortable tables
- ✅ Search functionality
- ✅ Batch operations support

## 📊 User Roles & Permissions

### Admin
- Enroll and manage students
- Add and manage faculty
- Create courses and sections
- Assign faculty to courses
- View system-wide statistics

### Faculty
- View assigned courses
- Create and schedule lectures
- Mark student attendance
- Finalize lectures
- Review medical certificates
- Generate attendance reports

### Student
- View attendance records
- Track attendance percentage
- Upload medical certificates
- View certificate status
- Monitor attendance trends

## 🔗 API Integration

The frontend is ready to integrate with your backend API. All API calls are configured through service modules:

- `authService.js` - Login, logout, authentication
- `studentService.js` - Student operations
- `facultyService.js` - Faculty operations
- `courseService.js` - Course management
- `sectionService.js` - Section management
- `lectureService.js` - Lecture scheduling
- `attendanceService.js` - Attendance marking and reports

**API Client Features:**
- Automatic JWT token injection
- Request/response interceptors
- Error handling
- Token refresh on 401 errors
- Centralized error messages

## 📝 Next Steps

1. **Start the Backend API**
   - Ensure your backend is running on the configured port (default: 5000)
   - Set up CORS to allow requests from `http://localhost:5173`

2. **Test the Frontend**
   ```bash
   npm run dev
   ```
   - Navigate to http://localhost:5173
   - Try logging in (you'll need backend authentication set up)

3. **Backend API Endpoints Needed**
   
   The frontend expects the following API structure:
   ```
   POST   /api/auth/login
   POST   /api/auth/logout
   POST   /api/auth/refresh
   
   GET    /api/students
   POST   /api/students
   GET    /api/students/:rollNo
   PUT    /api/students/:rollNo
   DELETE /api/students/:rollNo
   
   GET    /api/faculty
   POST   /api/faculty
   GET    /api/faculty/:id
   PUT    /api/faculty/:id
   DELETE /api/faculty/:id
   
   GET    /api/courses
   POST   /api/courses
   GET    /api/courses/:id
   PUT    /api/courses/:id
   DELETE /api/courses/:id
   
   GET    /api/lectures
   POST   /api/lectures
   GET    /api/lectures/:id
   POST   /api/lectures/:id/finalize
   
   GET    /api/attendance/lecture/:lectureId
   POST   /api/attendance/lecture/:lectureId
   GET    /api/attendance/student/:rollNo
   POST   /api/attendance/medical-certificate
   ```

4. **Customize as Needed**
   - Update colors in `tailwind.config.js`
   - Modify API endpoints in service files
   - Add additional features or pages
   - Adjust validation rules in `validators.js`

## 🎯 Demo Credentials (For Testing)

Once your backend is set up with test data, you can use:

- **Admin:** admin@nith.ac.in / admin123
- **Faculty:** faculty@nith.ac.in / faculty123
- **Student:** student@nith.ac.in / student123

## ⚠️ Important Notes

1. **Backend Required:** This frontend needs a running backend API to function
2. **CORS:** Ensure your backend allows requests from http://localhost:5173
3. **File Uploads:** Medical certificate uploads require multipart/form-data support in backend
4. **Database:** Backend should implement the normalized schema with medical certificate support

## 🐛 Troubleshooting

### Port Already in Use
```bash
npx kill-port 5173
```

### API Connection Issues
- Check if backend is running
- Verify `VITE_API_BASE_URL` in `.env`
- Check browser console for CORS errors
- Test API endpoints with Postman

### Dependency Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentation

- Full README: `Frontend/README.md`
- Component documentation: See JSDoc comments in component files
- API service docs: See comments in `src/services/` files

## 🎉 You're All Set!

The frontend is complete and ready to use. Start the dev server and begin testing!

```bash
npm run dev
```

Happy coding! 🚀
