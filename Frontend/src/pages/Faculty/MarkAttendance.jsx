import { useState, useEffect } from 'react';
import { Save, Lock } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Select from '../../components/Select';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import lectureService from '../../services/lectureService';
import attendanceService from '../../services/attendanceService';
import sectionService from '../../services/sectionService';
import { formatDisplayDate } from '../../utils/dateUtils';
import { LECTURE_STATUS } from '../../constants';

const MarkAttendance = () => {
  const { user } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadLectures();
  }, []);

  const loadLectures = async () => {
    const result = await lectureService.getLecturesByFaculty(user.id);
    if (result.success) {
      setLectures(result.data);
    }
  };

  const loadStudentsAndAttendance = async (lectureId) => {
    setLoading(true);
    
    const lecture = lectures.find((l) => l.lecture_id === parseInt(lectureId));
    if (!lecture) return;

    const [studentsResult, attendanceResult] = await Promise.all([
      sectionService.getSectionStudents(lecture.section_id),
      attendanceService.getAttendanceByLecture(lectureId),
    ]);

    if (studentsResult.success) {
      setStudents(studentsResult.data);
    }

    if (attendanceResult.success) {
      const attendanceMap = {};
      attendanceResult.data.forEach((record) => {
        attendanceMap[record.roll_no] = record.is_present;
      });
      setAttendance(attendanceMap);
    } else {
      // Initialize all as absent if no attendance exists
      const initialAttendance = {};
      studentsResult.data.forEach((student) => {
        initialAttendance[student.roll_no] = false;
      });
      setAttendance(initialAttendance);
    }

    setLoading(false);
  };

  const handleLectureChange = (e) => {
    const lectureId = e.target.value;
    setSelectedLecture(lectureId);
    if (lectureId) {
      loadStudentsAndAttendance(lectureId);
    } else {
      setStudents([]);
      setAttendance({});
    }
  };

  const toggleAttendance = (rollNo) => {
    setAttendance({
      ...attendance,
      [rollNo]: !attendance[rollNo],
    });
  };

  const handleSave = async () => {
    if (!selectedLecture) return;

    const attendanceData = Object.entries(attendance).map(([rollNo, isPresent]) => ({
      roll_no: parseInt(rollNo),
      is_present: isPresent,
    }));

    const result = await attendanceService.markAttendance(selectedLecture, attendanceData);

    if (result.success) {
      setAlert({ type: 'success', message: 'Attendance saved successfully' });
    } else {
      setAlert({ type: 'error', message: result.error });
    }
  };

  const handleFinalize = async () => {
    if (!selectedLecture) return;
    if (!confirm('Are you sure you want to finalize this lecture? Once finalized attendance cannot be modified.')) return;

    const result = await lectureService.finalizeLecture(selectedLecture);

    if (result.success) {
      setAlert({ type: 'success', message: 'Lecture finalized successfully' });
      loadLectures();
    } else {
      setAlert({ type: 'error', message: result.error });
    }
  };

  const lectureOptions = lectures.map((lecture) => ({
    value: lecture.lecture_id,
    label: `${lecture.course_id} - ${lecture.section_id} - ${formatDisplayDate(lecture.lecture_date)}`,
  }));

  const selectedLectureData = lectures.find((l) => l.lecture_id === parseInt(selectedLecture));
  const isFinalized = selectedLectureData?.status === LECTURE_STATUS.FINALIZED;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mark Attendance</h1>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          className="mb-4"
        />
      )}

      <Card className="mb-6">
        <Select
          label="Select Lecture"
          id="lecture"
          value={selectedLecture}
          onChange={handleLectureChange}
          options={lectureOptions}
          placeholder="Choose a lecture"
        />
      </Card>

      {selectedLecture && !loading && (
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Student Roster</h2>
            <div className="flex space-x-3">
              <Button
                onClick={handleSave}
                variant="primary"
                disabled={isFinalized}
                className="flex items-center"
              >
                <Save size={18} className="mr-2" />
                Save Attendance
              </Button>
              <Button
                onClick={handleFinalize}
                variant="success"
                disabled={isFinalized}
                className="flex items-center"
              >
                <Lock size={18} className="mr-2" />
                {isFinalized ? 'Finalized' : 'Finalize'}
              </Button>
            </div>
          </div>

          {isFinalized && (
            <Alert
              type="warning"
              message="This lecture has been finalized. Attendance cannot be modified."
              className="mb-4"
            />
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Roll No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Department
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Present
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.roll_no} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.roll_no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <input
                        type="checkbox"
                        checked={attendance[student.roll_no] || false}
                        onChange={() => toggleAttendance(student.roll_no)}
                        disabled={isFinalized}
                        className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500 disabled:opacity-50"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {loading && <LoadingSpinner size="lg" className="py-12" />}
    </div>
  );
};

export default MarkAttendance;
