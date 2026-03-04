# Student Attendance Management System - JavaScript Version

## Overview
This is a comprehensive Student Attendance Management System for NIT Hamirpur, rebuilt in **React + JavaScript** (converted from TypeScript).

## Design System
- **Background**: Clean white with soft-shadowed cards
- **Primary Color**: Deep Blue `#1a237e`
- **Success Color**: Green `#2e7d32`
- **Warning Color**: Amber `#ff8f00`
- **UI Framework**: Tailwind CSS + Radix UI components

## Three User Portals

### 1. **Admin Command Center** (Sidebar Layout)
- **Left Sidebar** with primary action buttons:
  - Enroll Faculty
  - Assign Course to Faculty
  - Enroll Students (with two tabs: "Enroll to Section" and "Create New Student")
  - Add New Course
- **Main Content Area**:
  - Stats cards showing total users, courses, sections, and students
  - Tabbed data view for browsing Students, Faculty, and Courses
- **Features**: 
  - Create faculty/student accounts
  - Assign faculty to course sections
  - Enroll students in sections
  - Create and manage courses

### 2. **Student Learning Dashboard** (Course Cards)
- **Top Navigation Bar** with AMS logo, user profile, and logout button
- **Course Cards Grid**:
  - Each card displays course code, name, section, faculty, and credits
  - Placeholder for circular progress bar showing attendance percentage
  - Click on card opens attendance history modal
- **Attendance History Modal**:
  - Circular progress bar with color coding (green ≥75%, amber ≥60%, red <60%)
  - Statistics cards for total lectures, attended, and missed
  - Warning messages for attendance below 75%
  - Chronological table of all lectures with date, topic, and attendance status

### 3. **Faculty Teaching Portal** (Hierarchical Batch View)
- **Top Navigation Bar** with AMS logo, user profile, and logout button
- **Batch Grouping**:
  - Sections organized by batch year (e.g., "Batch 2024", "Batch 2023")
  - Each batch shows course cards with section info and total lectures count
- **Section Detail View**:
  - Click on batch card to drill down
  - List of all lectures with dates, topics, and status
  - "+" floating button to create new lectures
- **Mark Attendance View** (Marking Sheet):
  - Table with Roll Number, Student Name, and Toggle Switch (Present/Absent)
  - Toggle switches for each student
  - Finalize lecture button to lock attendance

## Backend Integration
- **Supabase**: Full backend with authentication and data persistence
- **API Endpoints**: 18 RESTful endpoints for CRUD operations
- **Authentication**: Session-based with role-based access control

## Key Features
- ✅ First-time admin setup
- ✅ Login/Signup with role-based routing
- ✅ Complete user management (Admin, Faculty, Student)
- ✅ Course and section management
- ✅ Faculty-to-section assignments
- ✅ Student enrollment in sections
- ✅ Lecture creation and management
- ✅ Attendance marking with Present/Absent toggle switches
- ✅ Attendance percentage calculations (only finalized lectures count)
- ✅ Color-coded warnings (yellow <75%, red <60%)
- ✅ No duplicate attendance per student per lecture
- ✅ Professional UI with soft shadows and modern design

## File Structure
```
/src
  /app
    App.jsx (Main entry, converted from .tsx)
    /components
      AdminDashboard.jsx
      FacultyDashboard.jsx
      StudentDashboard.jsx
      LoginPage.jsx
      FirstTimeSetup.jsx
      /ui (Radix UI components)
  /utils
    api.js (API client, converted from .ts)
    supabase-client.js (Supabase initialization)
  /styles
    theme.css (Updated with design colors)
```

## Color Scheme Implementation
The theme.css has been updated with the specified colors:
- **Primary**: `#1a237e` (Deep Blue) - Used for headers, primary buttons, main branding
- **Success**: `#2e7d32` (Green) - Used for success states, present badges, finalize buttons
- **Warning**: `#ff8f00` (Amber) - Used for attendance warnings between 60-75%
- **Destructive/Red**: `#d32f2f` - Used for critical warnings (<60%), absent badges

## Changes from TypeScript to JavaScript
1. Removed all type annotations (`: Type`, `<Type>`)
2. Removed all `interface` and `type` declarations
3. Changed `.tsx` and `.ts` file extensions to `.jsx` and `.js`
4. Simplified React component prop handling (no TypeScript prop types)
5. Updated import paths for utility files

## Next Steps
To further enhance the system, you could:
- Add actual circular progress SVG component in StudentDashboard
- Implement search functionality in data tables
- Add bulk enrollment for students
- Create section management in Admin portal
- Add attendance reports export functionality
- Implement email notifications for low attendance
