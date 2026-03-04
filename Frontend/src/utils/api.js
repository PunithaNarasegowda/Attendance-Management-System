const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));
const STORAGE_KEY = 'ams_frontend_temp_state';

const defaultDb = {
  users: [
    { id: 'u-admin-1', email: 'admin@nith.ac.in', name: 'Admin User', role: 'admin', employeeId: 'ADM-001' },
    { id: 'u-fac-1', email: 'faculty@nith.ac.in', name: 'Dr. Ananya Sharma', role: 'faculty', employeeId: 'FAC-101' },
    { id: 'u-std-1', email: 'student@nith.ac.in', name: 'Rohit Verma', role: 'student', rollNo: '22CSE001', batchYear: '2022' },
    { id: 'u-std-2', email: 'student2@nith.ac.in', name: 'Neha Singh', role: 'student', rollNo: '22CSE002', batchYear: '2022' },
  ],
  courses: [
    { id: 'c-1', code: 'CS301', name: 'Database Management Systems', credits: 4, department: 'CSE' },
    { id: 'c-2', code: 'CS303', name: 'Operating Systems', credits: 4, department: 'CSE' },
  ],
  sections: [
    { id: 's-1', courseId: 'c-1', name: 'A', batchYear: '2022', facultyId: 'u-fac-1' },
    { id: 's-2', courseId: 'c-2', name: 'A', batchYear: '2022', facultyId: 'u-fac-1' },
  ],
  enrollments: [
    { id: 'e-1', studentId: 'u-std-1', sectionId: 's-1' },
    { id: 'e-2', studentId: 'u-std-2', sectionId: 's-1' },
    { id: 'e-3', studentId: 'u-std-1', sectionId: 's-2' },
  ],
  lectures: [
    { id: 'l-1', sectionId: 's-1', date: '2026-02-20', topic: 'ER Modeling', status: 'finalized' },
    { id: 'l-2', sectionId: 's-1', date: '2026-02-24', topic: 'Normalization', status: 'draft' },
  ],
  attendance: [
    { lectureId: 'l-1', studentId: 'u-std-1', status: 'present' },
    { lectureId: 'l-1', studentId: 'u-std-2', status: 'absent' },
  ],
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const readPersistedDb = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return clone(defaultDb);
    }
    const parsed = JSON.parse(raw);
    return {
      ...clone(defaultDb),
      ...parsed,
    };
  } catch {
    return clone(defaultDb);
  }
};

const db = readPersistedDb();

const persistDb = () => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // no-op for unavailable storage
  }
};

const currentFacultyId = 'u-fac-1';
const currentStudentId = 'u-std-1';

const withCourseAndFaculty = (section) => ({
  ...section,
  course: db.courses.find((course) => course.id === section.courseId) || null,
  faculty: db.users.find((user) => user.id === section.facultyId) || null,
});

const withCourse = (section) => ({
  ...section,
  course: db.courses.find((course) => course.id === section.courseId) || null,
});

export const api = {
  signup: async (userData) => {
    await delay();
    const id = `u-${Date.now()}`;
    db.users.push({ id, ...userData });
    persistDb();
    return { success: true, user: { id, ...userData } };
  },

  admin: {
    createCourse: async (courseData) => {
      await delay();
      const id = `c-${Date.now()}`;
      db.courses.push({ id, ...courseData });
      persistDb();
      return { success: true };
    },
    createSection: async (sectionData) => {
      await delay();
      const id = `s-${Date.now()}`;
      db.sections.push({ id, ...sectionData });
      persistDb();
      return { success: true };
    },
    getCourses: async () => {
      await delay();
      return { courses: clone(db.courses) };
    },
    getSections: async () => {
      await delay();
      return { sections: clone(db.sections.map(withCourse)) };
    },
    assignFaculty: async ({ sectionId, facultyId }) => {
      await delay();
      const section = db.sections.find((item) => item.id === sectionId);
      if (!section) throw new Error('Section not found');
      section.facultyId = facultyId;
      persistDb();
      return { success: true };
    },
    enrollStudent: async ({ studentId, sectionId }) => {
      await delay();
      const exists = db.enrollments.some((item) => item.studentId === studentId && item.sectionId === sectionId);
      if (!exists) {
        db.enrollments.push({ id: `e-${Date.now()}`, studentId, sectionId });
        persistDb();
      }
      return { success: true };
    },
    getUsers: async (role) => {
      await delay();
      return {
        users: clone(role ? db.users.filter((user) => user.role === role) : db.users),
      };
    },
  },

  faculty: {
    getMySections: async () => {
      await delay();
      return {
        sections: db.sections
          .filter((section) => section.facultyId === currentFacultyId)
          .map(withCourseAndFaculty)
          .map((section) => clone(section)),
      };
    },
    getSectionStudents: async (sectionId) => {
      await delay();
      const studentIds = db.enrollments
        .filter((enrollment) => enrollment.sectionId === sectionId)
        .map((enrollment) => enrollment.studentId);
      return {
        students: clone(db.users.filter((user) => studentIds.includes(user.id))),
      };
    },
    createLecture: async ({ sectionId, date, topic }) => {
      await delay();
      db.lectures.push({
        id: `l-${Date.now()}`,
        sectionId,
        date,
        topic,
        status: 'draft',
      });
      persistDb();
      return { success: true };
    },
    getLectures: async (sectionId) => {
      await delay();
      return {
        lectures: clone(db.lectures.filter((lecture) => lecture.sectionId === sectionId)),
      };
    },
    markAttendance: async ({ lectureId, studentId, status }) => {
      await delay();
      const existing = db.attendance.find(
        (item) => item.lectureId === lectureId && item.studentId === studentId
      );
      if (existing) {
        existing.status = status;
      } else {
        db.attendance.push({ lectureId, studentId, status });
      }
      persistDb();
      return { success: true };
    },
    getLectureAttendance: async (lectureId) => {
      await delay();
      return {
        attendance: clone(db.attendance.filter((item) => item.lectureId === lectureId)),
      };
    },
    finalizeLecture: async (lectureId) => {
      await delay();
      const lecture = db.lectures.find((item) => item.id === lectureId);
      if (!lecture) throw new Error('Lecture not found');
      lecture.status = 'finalized';
      persistDb();
      return { success: true };
    },
    getAttendanceReport: async (sectionId) => {
      await delay();
      const lectures = db.lectures.filter((lecture) => lecture.sectionId === sectionId && lecture.status === 'finalized');
      return { lectures: clone(lectures) };
    },
  },

  student: {
    getMyCourses: async () => {
      await delay();
      const enrolledSections = db.enrollments
        .filter((enrollment) => enrollment.studentId === currentStudentId)
        .map((enrollment) => db.sections.find((section) => section.id === enrollment.sectionId))
        .filter(Boolean);

      return {
        courses: clone(enrolledSections.map((section) => ({
          sectionId: section.id,
          section,
          course: db.courses.find((course) => course.id === section.courseId) || null,
          faculty: db.users.find((user) => user.id === section.facultyId) || null,
        }))),
      };
    },
    getMyAttendance: async (sectionId) => {
      await delay();
      const lectures = db.lectures.filter((lecture) => lecture.sectionId === sectionId && lecture.status === 'finalized');
      const attendanceHistory = lectures.map((lecture) => {
        const record = db.attendance.find(
          (item) => item.lectureId === lecture.id && item.studentId === currentStudentId
        );
        return {
          lectureId: lecture.id,
          date: lecture.date,
          topic: lecture.topic,
          status: record?.status || 'absent',
        };
      });

      const totalLectures = attendanceHistory.length;
      const attendedLectures = attendanceHistory.filter((item) => item.status === 'present').length;
      const percentage = totalLectures === 0 ? 0 : (attendedLectures / totalLectures) * 100;

      return {
        statistics: {
          totalLectures,
          attendedLectures,
          percentage: percentage.toFixed(2),
        },
        attendance: attendanceHistory,
      };
    },
  },
};
