import { getAttendanceColor, getAttendanceBgColor, getAttendanceStatus } from '../utils/attendanceCalculator';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const AttendancePercentageCard = ({ percentage, present, total, courseName, className = '' }) => {
  const status = getAttendanceStatus(percentage);
  const colorClass = getAttendanceColor(percentage);
  const bgColorClass = getAttendanceBgColor(percentage);

  const getTrendIcon = () => {
    if (percentage >= 90) return <TrendingUp className="text-green-600" size={20} />;
    if (percentage >= 75) return <Minus className="text-yellow-600" size={20} />;
    return <TrendingDown className="text-red-600" size={20} />;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{courseName}</h3>
        {getTrendIcon()}
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className={`text-4xl font-bold ${colorClass}`}>{percentage}%</span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${bgColorClass} ${colorClass}`}>
          {status}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mt-4">
        <span>Present: {present}</span>
        <span>Total: {total}</span>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              percentage >= 90 ? 'bg-green-600' : percentage >= 75 ? 'bg-yellow-600' : 'bg-red-600'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePercentageCard;
