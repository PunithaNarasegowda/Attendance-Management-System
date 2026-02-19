# Student Attendance Management System - UI Component Architecture

## Component Hierarchy Structure

```
App/
├── Layout Components/
│   ├── MainLayout
│   │   ├── Header
│   │   │   ├── Logo
│   │   │   ├── NavigationMenu (mobile hamburger)
│   │   │   ├── UserProfile
│   │   │   │   ├── ProfileDropdown
│   │   │   │   ├── Notifications
│   │   │   │   └── Logout
│   │   │   └── SearchBar
│   │   ├── Sidebar
│   │   │   ├── NavMenu
│   │   │   │   └── NavItem (recursive)
│   │   │   └── NavCollapse (mobile)
│   │   ├── MainContent
│   │   │   └── [Router Outlet]
│   │   ├── Footer
│   │   │   ├── CompanyInfo
│   │   │   ├── Links
│   │   │   └── Version
│   │   └── Modal Portal
│   │       └── [Modal Components]
│   ├── AuthLayout
│   │   ├── LeftPanel (branding)
│   │   ├── RightPanel (form)
│   │   └── Background
│   └── ErrorLayout
│       └── ErrorPage
│
├── Shared Components/
│   ├── Forms/
│   │   ├── TextInput
│   │   ├── TextArea
│   │   ├── SelectDropdown
│   │   ├── MultiSelect
│   │   ├── DatePicker
│   │   ├── TimePicker
│   │   ├── FileUpload
│   │   ├── RichTextEditor
│   │   ├── Checkbox
│   │   ├── RadioButton
│   │   └── FormValidator
│   │
│   ├── Tables/
│   │   ├── DataTable
│   │   │   ├── TableHeader
│   │   │   ├── TableRow
│   │   │   ├── TableCell
│   │   │   ├── SortIcon
│   │   │   ├── FilterBar
│   │   │   └── Pagination
│   │   ├── ExpandableTable
│   │   ├── ScrollableTable
│   │   └── TableActions
│   │
│   ├── Cards/
│   │   ├── StatCard
│   │   ├── InfoCard
│   │   ├── CourseCard
│   │   ├── StudentCard
│   │   ├── FacultyCard
│   │   └── AnnouncementCard
│   │
│   ├── Buttons/
│   │   ├── PrimaryButton
│   │   ├── SecondaryButton
│   │   ├── DangerButton
│   │   ├── IconButton
│   │   ├── FloatingActionButton
│   │   ├── LoadingButton (with spinner)
│   │   └── DropdownButton
│   │
│   ├── Modals/
│   │   ├── ConfirmModal
│   │   ├── FormModal
│   │   ├── AlertModal
│   │   ├── LoadingModal (spinner)
│   │   ├── DetailsModal
│   │   └── Modal (generic)
│   │
│   ├── Loaders/
│   │   ├── Spinner
│   │   ├── Skeleton
│   │   ├── ProgressBar
│   │   ├── LinearProgress
│   │   └── LazyLoader
│   │
│   ├── Navigation/
│   │   ├── Breadcrumb
│   │   ├── Tabs
│   │   ├── StepperForm
│   │   ├── Carousel
│   │   └── Pagination
│   │
│   ├── Alerts/
│   │   ├── ToastNotification
│   │   ├── SnackBar
│   │   ├── BannerAlert
│   │   ├── InlineAlert
│   │   └── AlertContainer
│   │
│   ├── Badges/
│   │   ├── StatusBadge
│   │   ├── PriorityBadge
│   │   ├── AttendanceBadge (Present/Absent)
│   │   ├── RoleBadge
│   │   └── CountBadge
│   │
│   ├── Lists/
│   │   ├── SimpleList
│   │   ├── AdvancedList
│   │   ├── TimelineList
│   │   └── ListItem
│   │
│   ├── Charts/
│   │   ├── BarChart
│   │   ├── LineChart
│   │   ├── PieChart
│   │   ├── AreaChart
│   │   └── ChartLegend
│   │
│   ├── Filter Components/
│   │   ├── FilterPanel
│   │   ├── FilterChip
│   │   ├── DateRangeFilter
│   │   ├── StatusFilter
│   │   └── ClearFiltersButton
│   │
│   ├── Search/
│   │   ├── SearchBar
│   │   ├── AdvancedSearch
│   │   └── SearchResults
│   │
│   ├── Tooltips & Popovers/
│   │   ├── Tooltip
│   │   ├── Popover
│   │   └── HelpIcon
│   │
│   ├── Dialog/
│   │   ├── SimpleDialog
│   │   ├── FullScreenDialog
│   │   └── ScrollableDialog
│   │
│   └── Other/
│       ├── Avatar (user profile picture)
│       ├── Badge (notification count)
│       ├── Divider
│       ├── Empty State
│       ├── Error Boundary
│       └── NoData Component
│
├── Admin Module/
│   ├── Pages/
│   │   ├── AdminDashboard
│   │   │   ├── WelcomeSection
│   │   │   ├── StatsCardsContainer
│   │   │   ├── RecentActivityFeed
│   │   │   ├── QuickActionButtons
│   │   │   └── AnalyticsDashboard
│   │   │
│   │   ├── StudentManagement
│   │   │   ├── StudentListPage
│   │   │   │   ├── ListViewTable
│   │   │   │   ├── Filters
│   │   │   │   ├── SearchBar
│   │   │   │   ├── BulkActions
│   │   │   │   └── ActionMenu
│   │   │   ├── AddStudentModal
│   │   │   ├── EditStudentModal
│   │   │   └── StudentDetailsPage
│   │   │
│   │   ├── FacultyManagement
│   │   │   ├── FacultyListPage
│   │   │   │   ├── ListViewTable
│   │   │   │   ├── Filters
│   │   │   │   └── ActionMenu
│   │   │   ├── AddFacultyModal
│   │   │   ├── EditFacultyModal
│   │   │   ├── FacultyDetailsPage
│   │   │   └── AssignCoursesToFacultyModal
│   │   │
│   │   ├── CourseManagement
│   │   │   ├── CourseListPage
│   │   │   │   ├── CourseTable
│   │   │   │   ├── Filters
│   │   │   │   └── ActionMenu
│   │   │   ├── AddCourseModal
│   │   │   ├── EditCourseModal
│   │   │   ├── ManageSectionsPage
│   │   │   │   ├── SectionsTable
│   │   │   │   └── AddSectionModal
│   │   │   └── CourseDetailsPage
│   │   │
│   │   ├── BatchManagement
│   │   │   ├── BatchListPage
│   │   │   ├── CreateBatchModal
│   │   │   ├── EditBatchModal
│   │   │   └── BatchDetailsPage
│   │   │
│   │   ├── FacultyAllocation
│   │   │   ├── AllocationListPage
│   │   │   ├── AllocationTable
│   │   │   ├── AssignFacultyModal
│   │   │   └── EditAllocationModal
│   │   │
│   │   ├── BroadcastMessages
│   │   │   ├── MessageListPage
│   │   │   ├── MessageTable
│   │   │   ├── CreateAnnouncementModal
│   │   │   ├── EditAnnouncementModal
│   │   │   └── MessagePreview
│   │   │
│   │   ├── TicketManagement
│   │   │   ├── TicketListPage
│   │   │   │   ├── TicketTable
│   │   │   │   ├── FilterPanel
│   │   │   │   └── StatusFilter
│   │   │   ├── TicketDetailsPage
│   │   │   │   ├── TicketHeader
│   │   │   │   ├── TicketDetails
│   │   │   │   ├── CommentsSection
│   │   │   │   ├── ResolutionSection
│   │   │   │   └── ActionButtonsGroup
│   │   │   └── TicketCommentComponent
│   │   │
│   │   └── AdminReports
│   │       ├── ReportsPage
│   │       ├── SelectReportType
│   │       ├── ReportsDisplay
│   │       │   ├── EnrollmentChart
│   │       │   ├── FacultyWorkloadChart
│   │       │   ├── CourseDistributionChart
│   │       │   └── StatisticsGrid
│   │       └── ExportOptions
│   │
│   └── Components/
│       ├── AdminSidebar (nav)
│       └── RoleSpecificPermissions
│
├── Faculty Module/
│   ├── Pages/
│   │   ├── FacultyDashboard
│   │   │   ├── WelcomeSection
│   │   │   ├── StatsCardsContainer
│   │   │   ├── TodayScheduleSection
│   │   │   ├── RecentActivityFeed
│   │   │   └── QuickActionsWidget
│   │   │
│   │   ├── MyCoursesPage
│   │   │   ├── CoursesListView
│   │   │   │   ├── CourseCard
│   │   │   │   ├── CourseTable
│   │   │   │   └── FilterOptions
│   │   │   ├── CourseDetailsPage
│   │   │   │   ├── CourseHeader
│   │   │   │   ├── CourseTabs
│   │   │   │   │   ├── OverviewTab
│   │   │   │   │   ├── StudentsTab
│   │   │   │   │   ├── LecturesTab
│   │   │   │   │   └── ReportsTab
│   │   │   │   └── ActionButtonsGroup
│   │   │
│   │   ├── LectureManagement
│   │   │   ├── CreateLectureModal
│   │   │   ├── LectureListPage
│   │   │   │   ├── LectureTable
│   │   │   │   ├── FilterPanel
│   │   │   │   ├── StatusBadges
│   │   │   │   └── ActionMenu
│   │   │   ├── EditLectureModal
│   │   │   ├── LectureDetailsPage
│   │   │   ├── RecurringLectureForm
│   │   │   └── CancelLectureModal
│   │   │
│   │   ├── AttendanceMarking
│   │   │   ├── MarkAttendancePage
│   │   │   │   ├── LectureSelector
│   │   │   │   ├── AttendanceSheet
│   │   │   │   │   ├── StudentRow
│   │   │   │   │   ├── StatusToggle (Present/Absent)
│   │   │   │   │   ├── NotesField
│   │   │   │   │   ├── SearchStudentInput
│   │   │   │   │   ├── FilterStudents
│   │   │   │   │   └── QuickActionButtons
│   │   │   │   ├── SubmitSection
│   │   │   │   │   ├── SaveDraftButton
│   │   │   │   │   ├── FinalizeButton
│   │   │   │   │   └── ConfirmationModal
│   │   │   │   └── ImportPreviousButton
│   │   │   ├── AttendanceRecordsPage
│   │   │   │   ├── RecordsTable
│   │   │   │   ├── EditAttendanceModal
│   │   │   │   └── HistoryView
│   │   │   └── ViewAttendancePage (per lecture)
│   │   │
│   │   ├── AttendanceReportsPage
│   │   │   ├── ReportGeneratorSection
│   │   │   │   ├── DateRangeSelector
│   │   │   │   ├── CourseSelect
│   │   │   │   ├── SectionSelect
│   │   │   │   ├── StudentFilter
│   │   │   │   └── GenerateReportButton
│   │   │   ├── AttendanceSummaryTable
│   │   │   │   ├── TableHeader
│   │   │   │   ├── StudentRows (color-coded)
│   │   │   │   └── SummaryFooter
│   │   │   └── ExportSection
│   │   │       ├── PDFExportButton
│   │   │       ├── ExcelExportButton
│   │   │       ├── PrintButton
│   │   │       └── EmailButton
│   │   │
│   │   └── Support
│   │       ├── RaiseQueryPage
│   │       │   ├── QueryForm
│   │       │   │   ├── SubjectInput
│   │       │   │   ├── CategorySelect
│   │       │   │   ├── DescriptionEditor
│   │       │   │   ├── AttachmentUpload
│   │       │   │   └── PrioritySelect
│   │       │   └── SubmitButton
│   │       └── ViewTicketsPage
│   │           ├── TicketListTable
│   │           ├── TicketDetailsModal
│   │           └── CommentThread
│   │
│   └── Components/
│       ├── FacultySidebar (nav)
│       └── LectureStatusBadge
│
├── Student Module/
│   ├── Pages/
│   │   ├── StudentDashboard
│   │   │   ├── WelcomeSection
│   │   │   ├── StatsCardsContainer
│   │   │   │   ├── EnrolledCoursesCard
│   │   │   │   ├── OverallAttendanceCard
│   │   │   │   ├── CoursesAtRiskCard
│   │   │   │   └── PendingTicketsCard
│   │   │   ├── AttendanceVisualization
│   │   │   │   └── AttendanceChart
│   │   │   ├── QuickLinksWidget
│   │   │   ├── AnnouncementsFeed
│   │   │   └── RecentUpdatesFeed
│   │   │
│   │   ├── MyCoursesPage
│   │   │   ├── EnrolledCoursesListView
│   │   │   │   ├── CourseCard
│   │   │   │   │   ├── CourseTitle
│   │   │   │   │   ├── CourseInfo
│   │   │   │   │   ├── AttendancePercentage (color-coded)
│   │   │   │   │   ├── ClassesInfo
│   │   │   │   │   └── ViewDetailsButton
│   │   │   │   └── FilterOptions
│   │   │   ├── CourseDetailsPage
│   │   │   │   ├── CourseHeader
│   │   │   │   ├── AttendanceStatsSummary
│   │   │   │   │   ├── ClassesHeldCard
│   │   │   │   │   ├── ClassesAttendedCard
│   │   │   │   │   ├── ClassesAbsentCard
│   │   │   │   │   ├── AttendancePercentageCard
│   │   │   │   │   ├── ThresholdCard
│   │   │   │   │   └── StatusBadge
│   │   │   │   ├── LectureHistoryTable
│   │   │   │   │   ├── TableHeaders
│   │   │   │   │   ├── LectureRows
│   │   │   │   │   └── ColorCodedStatus
│   │   │   │   └── DownloadButton
│   │   │   └── BackButton
│   │   │
│   │   ├── AttendanceViewPage
│   │   │   ├── OverallStatisticsCard
│   │   │   ├── CourseWiseBreakdownTable
│   │   │   │   ├── TableHeaders
│   │   │   │   ├── CourseRows
│   │   │   │   ├── ColorCodedPercentage
│   │   │   │   └── ViewDetailsButton
│   │   │   ├── DetailedViewByCoursePage
│   │   │   │   ├── CourseHeader
│   │   │   │   ├── LectureWiseTable
│   │   │   │   │   ├── DateColumn
│   │   │   │   │   ├── TimeColumn
│   │   │   │   │   ├── TopicColumn
│   │   │   │   │   ├── StatusColumn (color-coded)
│   │   │   │   │   └── RemarksColumn
│   │   │   │   ├── RunningStatistics
│   │   │   │   └── BackButton
│   │   │   └── ExportButton
│   │   │
│   │   ├── CertificatePage
│   │   │   ├── CertificateGeneratorSection
│   │   │   │   ├── DateRangeSelector
│   │   │   │   ├── CourseMultiSelect
│   │   │   │   └── GenerateButton
│   │   │   ├── CertificatePreview
│   │   │   │   ├── CertificateHeader
│   │   │   │   ├── StudentInfo
│   │   │   │   ├── CoursesInfo
│   │   │   │   ├── AttendancePercentage
│   │   │   │   ├── DateGenerated
│   │   │   │   └── InstituteLogo
│   │   │   └── DownloadSection
│   │   │       ├── DownloadPDFButton
│   │   │       └── EmailButton
│   │   │
│   │   ├── AnnouncementsPage
│   │   │   ├── AnnouncementsListView
│   │   │   │   ├── Filter (Unread/Recent/ByDate)
│   │   │   │   ├── AnnouncementItem
│   │   │   │   │   ├── Title
│   │   │   │   │   ├── Date
│   │   │   │   │   ├── Department/BatchTag
│   │   │   │   │   ├── ReadStatus
│   │   │   │   │   └── ClickHandler
│   │   │   │   └── Pagination
│   │   │   └── AnnouncementDetailsModal
│   │   │       ├── Title
│   │   │       ├── PostedBy
│   │   │       ├── Date
│   │   │       ├── Content (rich text)
│   │   │       ├── Attachments
│   │   │       └── MarkAsReadButton
│   │   │
│   │   └── Support
│   │       ├── RaiseQueryPage
│   │       │   ├── QueryForm
│   │       │   │   ├── SubjectInput
│   │       │   │   ├── CategorySelect
│   │       │   │   ├── AffectedCourseSelect
│   │       │   │   ├── DescriptionEditor
│   │       │   │   ├── EvidenceUpload
│   │       │   │   └── SubmitButton
│   │       │   └── SuccessMessage
│   │       └── ViewTicketsPage
│   │           ├── TicketListTable
│   │           │   ├── TicketIDColumn
│   │           │   ├── SubjectColumn
│   │           │   ├── CategoryColumn
│   │           │   ├── StatusColumn (color-coded)
│   │           │   ├── DateColumn
│   │           │   └── ActionButton
│   │           ├── TicketDetailsPage
│   │           │   ├── TicketHeader
│   │           │   ├── OriginalDescription
│   │           │   ├── AdminResponsesTimeline
│   │           │   ├── ApprovalStatus
│   │           │   └── CloseButton
│   │
│   └── Components/
│       ├── StudentSidebar (nav)
│       ├── AttendanceColorBadge
│       └── StatusIndicator

├── Utilities/
│   ├── API Service
│   │   ├── apiClient
│   │   ├── endpoints
│   │   ├── auth.service
│   │   ├── student.service
│   │   ├── faculty.service
│   │   ├── course.service
│   │   ├── attendance.service
│   │   ├── ticket.service
│   │   └── notification.service
│   │
│   ├── State Management
│   │   ├── Store (Redux/Zustand)
│   │   ├── reducers
│   │   │   ├── authReducer
│   │   │   ├── userReducer
│   │   │   ├── courseReducer
│   │   │   ├── attendanceReducer
│   │   │   ├── ticketReducer
│   │   │   └── uiReducer
│   │   ├── actions
│   │   └── selectors
│   │
│   ├── Helpers & Utils
│   │   ├── dateUtils
│   │   ├── formatters
│   │   ├── validators
│   │   ├── constants
│   │   ├── permissions
│   │   ├── localStorage
│   │   ├── exportUtils (PDF/Excel)
│   │   └── errorHandlers
│   │
│   ├── Hooks
│   │   ├── useAuth
│   │   ├── useFetch
│   │   ├── useForm
│   │   ├── useLocalStorage
│   │   ├── useDebounce
│   │   └── useWindowSize (responsive)
│   │
│   └── Constants
│       ├── apiEndpoints
│       ├── roles
│       ├── colors
│       ├── statusMessages
│       └── validationRules

└── Contexts/
    ├── AuthContext
    ├── NotificationContext
    ├── ThemeContext
    └── LanguageContext
```

---

## File Structure Example

```
src/
├── components/
│   ├── shared/
│   │   ├── buttons/
│   │   │   ├── PrimaryButton.jsx
│   │   │   ├── SecondaryButton.jsx
│   │   │   └── CardButton.jsx
│   │   ├── forms/
│   │   │   ├── TextInput.jsx
│   │   │   ├── SelectDropdown.jsx
│   │   │   ├── DatePicker.jsx
│   │   │   └── RichTextEditor.jsx
│   │   ├── tables/
│   │   │   ├── DataTable.jsx
│   │   │   ├── TableHeader.jsx
│   │   │   ├── TableRow.jsx
│   │   │   └── Pagination.jsx
│   │   ├── modals/
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── FormModal.jsx
│   │   │   └── AlertModal.jsx
│   │   └── ...
│   ├── layout/
│   │   ├── MainLayout.jsx
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   ├── admin/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── StudentManagement.jsx
│   │   │   ├── FacultyManagement.jsx
│   │   │   ├── CourseManagement.jsx
│   │   │   └── ...
│   │   └── components/
│   │       └── ...
│   ├── faculty/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MyCourses.jsx
│   │   │   ├── LectureManagement.jsx
│   │   │   ├── MarkAttendance.jsx
│   │   │   └── ...
│   │   └── components/
│   │       └── ...
│   └── student/
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── MyCourses.jsx
│       │   ├── ViewAttendance.jsx
│       │   ├── Certificate.jsx
│       │   └── ...
│       └── components/
│           └── ...
├── pages/
│   ├── LoginPage.jsx
│   ├── NotFoundPage.jsx
│   └── ErrorPage.jsx
├── services/
│   ├── api/
│   │   ├── attendanceApi.js
│   │   ├── userApi.js
│   │   ├── courseApi.js
│   │   └── ticketApi.js
│   └── auth.js
├── hooks/
│   ├── useAuth.js
│   ├── useFetch.js
│   ├── useForm.js
│   └── useLocalStorage.js
├── utils/
│   ├── dateUtils.js
│   ├── validators.js
│   ├── formatters.js
│   ├── constants.js
│   └── localStorage.js
├── store/
│   ├── store.js
│   ├── slices/
│   │   ├── authSlice.js
│   │   ├── userSlice.js
│   │   ├── attendanceSlice.js
│   │   └── uiSlice.js
│   └── actions/
├── contexts/
│   ├── AuthContext.jsx
│   └── NotificationContext.jsx
├── App.jsx
├── App.css
└── index.js
```

---

## Component Examples

### Example 1: DataTable Component

```jsx
// DataTable.jsx
export const DataTable = ({
  columns,           // {key, label, sortable, filterable}
  data,              // Array of row data
  loading,           // Boolean
  onSort,            // Function
  onFilter,          // Function
  onRowClick,        // Function
  actions,           // Array of action buttons
  pagination,        // {page, pageSize, total}
  onPageChange,      // Function
  selectable,        // Boolean - show checkboxes
  onSelectRows       // Function for bulk selection
}) => {
  // Implementation
  return (
    <div className="data-table-container">
      {loading && <Spinner />}
      <FilterBar columns={columns} onFilter={onFilter} />
      <table>
        {/* Headers, body with rows */}
      </table>
      <Pagination {...pagination} onPageChange={onPageChange} />
    </div>
  );
};
```

### Example 2: Modal Component

```jsx
// FormModal.jsx
export const FormModal = ({
  isOpen,            // Boolean
  title,             // String
  fields,            // Array of field configs
  onSubmit,          // Function
  onCancel,          // Function
  loading,           // Boolean
  submitText = "Save",
  cancelText = "Cancel"
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          {fields.map(field => (
            <FormField key={field.name} {...field} />
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onCancel}>{cancelText}</Button>
        <Button onClick={onSubmit} loading={loading}>
          {submitText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
```

### Example 3: Attendance Sheet Component

```jsx
// AttendanceSheet.jsx
export const AttendanceSheet = ({
  students,          // Array of student objects
  lectureId,         // UUID
  onMarkAttendance,  // Function
  onSubmit,          // Function
  loading            // Boolean
}) => {
  const [attendance, setAttendance] = useState({});

  const handleToggle = (studentId, status) => {
    setAttendance({
      ...attendance,
      [studentId]: status // 'present' or 'absent'
    });
  };

  return (
    <div className="attendance-sheet">
      <table>
        <thead>
          <tr>
            <th>Roll Number</th>
            <th>Student Name</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <AttendanceRow
              key={student.id}
              student={student}
              status={attendance[student.id]}
              onToggle={handleToggle}
            />
          ))}
        </tbody>
      </table>
      <div className="actions">
        <Button onClick={() => handleMarkAll('present')}>
          Mark All Present
        </Button>
        <Button onClick={() => handleMarkAll('absent')}>
          Mark All Absent
        </Button>
        <Button onClick={onSubmit} loading={loading}>
          Finalize Attendance
        </Button>
      </div>
    </div>
  );
};
```

---

## Component Styling Strategy

### CSS Architecture (BEM Methodology)
```css
/* Button.css */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn--primary {
  background-color: #007bff;
  color: white;
}

.btn--primary:hover {
  background-color: #0056b3;
}

.btn--primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--secondary {
  background-color: #f0f0f0;
  color: #333;
}

/* DataTable.css */
.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table__row {
  border-bottom: 1px solid #ddd;
}

.data-table__row:hover {
  background-color: #f9f9f9;
}

.data-table__cell {
  padding: 12px;
  text-align: left;
}

.data-table__cell--header {
  background-color: #f5f5f5;
  font-weight: bold;
}
```

### Tailwind CSS Alternative

```jsx
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">
  Click Me
</button>
```

---

## State Management Pattern

### Redux Action Example
```javascript
// slices/attendanceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchLectures = createAsyncThunk(
  'attendance/fetchLectures',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/lectures/${courseId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    lectures: [],
    attendance: {},
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLectures.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLectures.fulfilled, (state, action) => {
        state.lectures = action.payload;
        state.loading = false;
      })
      .addCase(fetchLectures.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

export default attendanceSlice.reducer;
```

---

## Responsive Design Patterns

### Mobile-First CSS Grid
```css
.course-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .course-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .course-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Responsive Table to Cards
```jsx
@media (max-width: 768px) {
  table {
    display: none;
  }
  
  .table-card {
    display: block;
    border: 1px solid #ddd;
    margin-bottom: 15px;
    padding: 15px;
    border-radius: 4px;
  }
}
```

---

## Form Validation Library Integration

### Example: React Hook Form + Yup

```jsx
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required()
});

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input {...register('password')} type="password" />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Login</button>
    </form>
  );
};
```

---

End of Document
