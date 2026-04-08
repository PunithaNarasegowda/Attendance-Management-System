import { getAttendanceColor, getAttendanceBgColor, getAttendanceStatus } from '../utils/attendanceCalculator';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from './Card';

const AttendancePercentageCard = ({ percentage, present, total, courseName, className = '' }) => {
  const status = getAttendanceStatus(percentage);
  const colorClass = getAttendanceColor(percentage);
  const bgColorClass = getAttendanceBgColor(percentage);

  const getTrendIcon = () => {
    if (percentage >= 90) return <TrendingUp className="text-[color:var(--chart-2)]" size={20} />;
    if (percentage >= 75) return <Minus className="text-[color:var(--chart-3)]" size={20} />;
    return <TrendingDown className="text-[color:var(--destructive)]" size={20} />;
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">{courseName}</h3>
        {getTrendIcon()}
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className={`text-4xl font-bold ${colorClass}`}>{percentage}%</span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${bgColorClass} ${colorClass}`}>
          {status}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
        <span>Present: {present}</span>
        <span>Total: {total}</span>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-muted/60 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              percentage >= 90
                ? 'bg-[linear-gradient(90deg,#34D399,#10B981)]'
                : percentage >= 75
                  ? 'bg-[linear-gradient(90deg,#22D3EE,#38BDF8)]'
                  : 'bg-[linear-gradient(90deg,#FF6B6B,#FF9F43)]'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
};

export default AttendancePercentageCard;
