from enum import Enum 

class UserRole(str, Enum):
    ADMIN = "admin"
    FACULTY = "faculty"
    STUDENT = "student" 
    
    
class AttendanceStatus(str, Enum):
    PRESENT = "present"
    ABSENT = "absent"
    MEDICAL_LEAVE = "medical_leave" 
    
class TicketStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"