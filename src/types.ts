export const CATEGORY_LABELS = {
  child: 'category.child',
  youth: 'category.youth',
  adolescent: 'category.adolescent',
  adult: 'category.adult',
} as const;

export type RecordCategory = keyof typeof CATEGORY_LABELS;

export const RECORD_CATEGORIES: RecordCategory[] = Object.keys(CATEGORY_LABELS) as RecordCategory[];

export const CATEGORY_API_VALUES: Record<RecordCategory, string> = {
  child: 'CHILDREN',
  youth: 'YOUTH',
  adolescent: 'ADOLESCENT',
  adult: 'ADULT',
};

const API_CATEGORY_MAP: Record<string, RecordCategory> = {
  CHILDREN: 'child',
  YOUTH: 'youth',
  ADOLESCENT: 'adolescent',
  ADULT: 'adult',
};

export function apiCategoryToSlug(apiCategory: string): RecordCategory {
  return API_CATEGORY_MAP[apiCategory] ?? 'adult';
}

export type SortField = 'name' | 'church' | 'age';

export type SortDirection = 'asc' | 'desc';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'staff';

export interface LocalAuthUser {
  username: string;
  password: string;
}

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

export interface Department {
  id: number;
  name: string;
  description?: string;
}

export interface DepartmentCreate {
  name: string;
  description?: string;
}

export interface DepartmentUpdate {
  name?: string;
  description?: string;
}

export interface ChildFamily {
  father_alive: boolean;
  father_name: string | null;
  father_phone: string | null;
  father_occupation: string | null;
  father_dob: string | null;
  father_pob: string | null;
  father_education_level: string | null;
  father_disability: string | null;
  mother_alive: boolean;
  mother_name: string | null;
  mother_phone: string | null;
  mother_occupation: string | null;
  mother_dob: string | null;
  mother_pob: string | null;
  mother_education_level: string | null;
  mother_disability: string | null;
  guardian_name: string | null;
  guardian_relation: string | null;
  guardian_phone: string | null;
  parents_church_freq: string | null;
  parents_have_spiritual_father: boolean;
  parents_spiritual_visit_freq: string | null;
  family_members_living_together: string | null;
  orthodox_awareness_level: string | null;
}

export interface ChildEducation {
  level: string;
  occupation: string;
  college_name: string | null;
  department_name: string | null;
  entry_year: string | null;
  certificate_type: string | null;
  languages: Record<string, unknown>[];
}

export interface ChildSpirituality {
  baptism_name: string | null;
  baptism_place: string | null;
  has_spiritual_father: boolean;
  spiritual_father_name: string | null;
  spiritual_father_phone: string | null;
  has_holy_orders: boolean;
}

export interface ChildHealth {
  has_disability: boolean;
  disability_details: string | null;
  has_trauma: boolean;
  trauma_details: string | null;
  health_issues: string | null;
  mental_status: string | null;
  emergency_name: string;
  emergency_phone: string;
  emergency_relation: string;
}

export interface ChildDetails {
  family: ChildFamily;
  education: ChildEducation | null;
  spirituality: ChildSpirituality | null;
  health: ChildHealth | null;
}

export interface AdultDetails {
  marital_status: string;
  phone: string;
  email: string | null;
  education: ChildEducation;
  spirituality: ChildSpirituality;
  health: ChildHealth | null;
}

export interface YouthDetails {
  phone: string;
  education: ChildEducation;
  family: ChildFamily | null;
  spirituality: ChildSpirituality;
  health: ChildHealth | null;
}

export type AdolescentDetails = ChildDetails;

export type CategoryDetails = ChildDetails | AdultDetails | YouthDetails | AdolescentDetails | null;

export type CategoryDetailsPayload = Record<string, unknown>;

export interface Student {
  id: number;
  name: string;
  age: number;
  sex: string;
  church?: string | null;
  department_id: number;
  category: string;
  category_details?: CategoryDetails;
  created_by_id?: number;
  created_at?: string;
  updated_at?: string;
  qr_code?: string | null;
  qr_payload?: string | null;
}

export interface StudentAddress {
  birth_region?: string | null;
  birth_zone?: string | null;
  birth_city?: string | null;
  birth_woreda?: string | null;
  birth_kebele?: string | null;
  current_region: string;
  current_zone: string;
  current_city: string;
  current_woreda?: string | null;
  current_kebele?: string | null;
  nationality: string;
}

export interface StudentCreate {
  full_name: string;
  gender: 'MALE' | 'FEMALE';
  dob: string;
  photo_url?: string | null;
  department_id: number;
  category: string;
  address: StudentAddress;
  category_details: CategoryDetailsPayload;
}

export interface StudentUpdate {
  full_name?: string;
  gender?: 'MALE' | 'FEMALE';
  dob?: string;
  address?: StudentAddress;
  name?: string;
  age?: number;
  sex?: string;
  church?: string | null;
  department_id?: number;
  category?: string;
  category_details?: CategoryDetails;
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

export type ProgramType = 'REGULAR';

export interface Program {
  id: number;
  name: string;
  department_id: number;
  type: ProgramType;
  description: string;
  is_active: boolean;
}

export interface ProgramCreate {
  name: string;
  department_id: number;
  type: ProgramType;
  description?: string;
}

export interface Attendance {
  id: string;
  recordId: string;
  programId: string;
  date: string;
  time?: string;
  status: AttendanceStatus;
  notes?: string;
  createdAt: string;
}

export type AttendanceSessionType = 'REGULAR' | 'PROGRAM';

export type AttendanceRecordStatus = 'PRESENT' | 'ABSENT' | 'EXCUSED';

export interface AttendanceRecordResponse {
  id: number;
  student_id: number;
  status: AttendanceRecordStatus;
  remarks?: string | null;
}

export interface AttendanceRecordCreate {
  student_id: number;
  status: AttendanceRecordStatus;
  notes?: string | null;
}

export interface AttendanceSession {
  id: number;
  date: string;
  department_id: number;
  program_id: number;
  category: string;
  type: AttendanceSessionType;
  records: AttendanceRecordResponse[];
  is_active: boolean;
}

export interface AttendanceSessionListParams {
  program_id?: number | null;
  department_id?: number | null;
  category?: string | null;
  include_inactive?: boolean;
}

export interface EligibleStudentsParams {
  department_id: number;
  category: string;
}

export interface AttendanceBatchCreate {
  date: string;
  program_id: number;
  category: string;
  records: Array<{ student_id: number; status: AttendanceRecordStatus; notes?: string | null }>;
}
