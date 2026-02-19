/**
 * Calculate attendance percentage
 * @param {Array} attendanceRecords - Array of attendance records
 * @param {boolean} includeMedicalApproved - Whether to count approved medical as present
 * @returns {Object} - { percentage, present, total, absent, medicalApproved }
 */
export const calculateAttendancePercentage = (attendanceRecords, includeMedicalApproved = true) => {
  if (!attendanceRecords || attendanceRecords.length === 0) {
    return {
      percentage: 0,
      present: 0,
      total: 0,
      absent: 0,
      medicalApproved: 0,
    };
  }

  let present = 0;
  let absent = 0;
  let medicalApproved = 0;

  attendanceRecords.forEach((record) => {
    if (record.is_present) {
      present++;
    } else if (record.medical_approved) {
      medicalApproved++;
    } else {
      absent++;
    }
  });

  const total = attendanceRecords.length;
  const numerator = includeMedicalApproved ? present + medicalApproved : present;
  const percentage = total > 0 ? ((numerator / total) * 100).toFixed(2) : 0;

  return {
    percentage: parseFloat(percentage),
    present,
    total,
    absent,
    medicalApproved,
  };
};

/**
 * Get attendance status color
 * @param {number} percentage - Attendance percentage
 * @returns {string} - Color class
 */
export const getAttendanceColor = (percentage) => {
  if (percentage >= 90) return 'text-green-600';
  if (percentage >= 85) return 'text-blue-600';
  if (percentage >= 75) return 'text-yellow-600';
  return 'text-red-600';
};

/**
 * Get attendance status background color
 * @param {number} percentage - Attendance percentage
 * @returns {string} - Background color class
 */
export const getAttendanceBgColor = (percentage) => {
  if (percentage >= 90) return 'bg-green-100';
  if (percentage >= 85) return 'bg-blue-100';
  if (percentage >= 75) return 'bg-yellow-100';
  return 'bg-red-100';
};

/**
 * Get attendance status label
 * @param {number} percentage - Attendance percentage
 * @returns {string} - Status label
 */
export const getAttendanceStatus = (percentage) => {
  if (percentage >= 90) return 'Excellent';
  if (percentage >= 85) return 'Good';
  if (percentage >= 75) return 'Satisfactory';
  return 'Critical';
};

/**
 * Calculate number of lectures needed to reach target percentage
 * @param {number} currentPresent - Current present count
 * @param {number} currentTotal - Current total lectures
 * @param {number} targetPercentage - Target percentage
 * @returns {number} - Number of lectures needed
 */
export const lecturesNeededForTarget = (currentPresent, currentTotal, targetPercentage = 75) => {
  if (currentTotal === 0) return 0;
  
  const currentPercentage = (currentPresent / currentTotal) * 100;
  if (currentPercentage >= targetPercentage) return 0;

  // Calculate: (current_present + x) / (current_total + x) >= target/100
  // Solving for x
  const lecturesNeeded = Math.ceil(
    (targetPercentage * currentTotal - 100 * currentPresent) / (100 - targetPercentage)
  );

  return Math.max(0, lecturesNeeded);
};
