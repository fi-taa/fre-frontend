export type RecordCategory = 'ሰራተኛ' | 'ወጣት' | 'አዳጊ' | 'ህጻናት';

export type SortField = 'name' | 'church' | 'age';

export type SortDirection = 'asc' | 'desc';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'staff';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  department_ids: number[];
}

export interface UserCreate {
  email: string;
  full_name: string;
  password: string;
  role: UserRole;
  department_ids: number[];
}

export interface UserUpdate {
  email?: string;
  full_name?: string;
  role?: UserRole;
  is_active?: boolean;
  department_ids?: number[];
}

export interface Student {
  id: number;
  name: string;
  age: number;
  sex: string;
  education_level: string;
  photo_url?: string;
  family_profile?: Record<string, unknown>;
  phone?: string;
  department_id: number;
  created_by_id: number;
  created_at: string;
  updated_at: string;
}

export interface StudentCreate {
  name: string;
  age: number;
  sex: string;
  education_level: string;
  photo_url?: string;
  family_profile?: Record<string, unknown>;
  phone?: string;
  department_id: number;
}

export interface StudentUpdate {
  name?: string;
  age?: number;
  sex?: string;
  education_level?: string;
  photo_url?: string;
  family_profile?: Record<string, unknown>;
  phone?: string;
  department_id?: number;
}

export interface PersonRecord {
  id: string;
  name: string;
  church: string;
  age: number;
  category: RecordCategory;
  phone?: string;
  email?: string;
  address?: string;
  position?: string;
  department?: string;
  startDate?: string;
  salary?: number;
  workPhone?: string;
  workEmail?: string;
  supervisor?: string;
  workLocation?: string;
  notes?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  skills?: string;
  certifications?: string;
  languages?: string;
  education?: string;
  occupation?: string;
  maritalStatus?: string;
  programName?: string;
  programRole?: string;
  participationDate?: string;
  leadershipRole?: string;
  activities?: string;
  interests?: string;
  volunteerWork?: string;
  achievements?: string;
  goals?: string;
  profession?: string;
  experience?: number;
  specialization?: string;
  company?: string;
  businessType?: string;
  businessAddress?: string;
  businessPhone?: string;
  yearsInBusiness?: number;
  mentorship?: string;
  contributions?: string;
  network?: string;
  resources?: string;
  dateOfBirth?: string;
  gender?: string;
  grade?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  parentAddress?: string;
  relationship?: string;
  enrollmentDate?: string;
  schoolName?: string;
  specialNeeds?: string;
  [key: string]: string | number | undefined;
}

export interface Event {
  id: string;
  name: string;
  category: RecordCategory;
  description?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Attendance {
  id: string;
  recordId: string;
  eventId: string;
  date: string;
  time?: string;
  status: AttendanceStatus;
  notes?: string;
  createdAt: string;
}
