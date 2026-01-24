import type { RecordCategory } from '@/types';

export interface FieldConfig {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

export interface SectionConfig {
  title: string;
  description?: string;
  fields: FieldConfig[];
}

export interface CategoryFormConfig {
  category: RecordCategory;
  sections: SectionConfig[];
}

const commonPersonalFields: FieldConfig[] = [
  { id: 'name', label: 'ስም', type: 'text', required: true, placeholder: 'Enter name' },
  { id: 'age', label: 'እድሜ', type: 'number', required: true, placeholder: 'Enter age' },
  { id: 'phone', label: 'ስልክ', type: 'text', placeholder: 'Enter phone number' },
  { id: 'email', label: 'ኢሜይል', type: 'text', placeholder: 'Enter email' },
  { id: 'address', label: 'አድራሻ', type: 'text', placeholder: 'Enter address' },
];

export const categoryFormConfigs: CategoryFormConfig[] = [
  {
    category: 'ሰራተኛ',
    sections: [
      {
        title: 'Personal Information',
        description: 'Basic personal details',
        fields: [
          ...commonPersonalFields,
          { id: 'position', label: 'Position', type: 'text', required: true },
          { id: 'department', label: 'Department', type: 'text' },
          { id: 'startDate', label: 'Start Date', type: 'text' },
          { id: 'salary', label: 'Salary', type: 'number' },
        ],
      },
      {
        title: 'Work Details',
        description: 'Employment information',
        fields: [
          { id: 'workPhone', label: 'Work Phone', type: 'text' },
          { id: 'workEmail', label: 'Work Email', type: 'text' },
          { id: 'supervisor', label: 'Supervisor', type: 'text' },
          { id: 'workLocation', label: 'Work Location', type: 'text' },
          { id: 'notes', label: 'Notes', type: 'textarea' },
        ],
      },
      {
        title: 'Additional Information',
        description: 'Extra details',
        fields: [
          { id: 'emergencyContact', label: 'Emergency Contact', type: 'text' },
          { id: 'emergencyPhone', label: 'Emergency Phone', type: 'text' },
          { id: 'skills', label: 'Skills', type: 'textarea' },
          { id: 'certifications', label: 'Certifications', type: 'textarea' },
          { id: 'languages', label: 'Languages', type: 'text' },
        ],
      },
    ],
  },
  {
    category: 'ወጣት',
    sections: [
      {
        title: 'Personal Information',
        description: 'Basic personal details',
        fields: [
          ...commonPersonalFields,
          { id: 'education', label: 'Education', type: 'text' },
          { id: 'occupation', label: 'Occupation', type: 'text' },
          { id: 'maritalStatus', label: 'Marital Status', type: 'select', options: ['Single', 'Married', 'Divorced'] },
        ],
      },
      {
        title: 'Youth Program Details',
        description: 'Program participation',
        fields: [
          { id: 'programName', label: 'Program Name', type: 'text', required: true },
          { id: 'programRole', label: 'Program Role', type: 'text' },
          { id: 'participationDate', label: 'Participation Date', type: 'text' },
          { id: 'leadershipRole', label: 'Leadership Role', type: 'text' },
          { id: 'activities', label: 'Activities', type: 'textarea' },
        ],
      },
      {
        title: 'Additional Information',
        description: 'Extra details',
        fields: [
          { id: 'interests', label: 'Interests', type: 'textarea' },
          { id: 'volunteerWork', label: 'Volunteer Work', type: 'textarea' },
          { id: 'achievements', label: 'Achievements', type: 'textarea' },
          { id: 'goals', label: 'Goals', type: 'textarea' },
          { id: 'notes', label: 'Notes', type: 'textarea' },
        ],
      },
    ],
  },
  {
    category: 'አዳጊ',
    sections: [
      {
        title: 'Personal Information',
        description: 'Basic personal details',
        fields: [
          ...commonPersonalFields,
          { id: 'profession', label: 'Profession', type: 'text' },
          { id: 'experience', label: 'Years of Experience', type: 'number' },
          { id: 'specialization', label: 'Specialization', type: 'text' },
        ],
      },
      {
        title: 'Professional Details',
        description: 'Professional information',
        fields: [
          { id: 'company', label: 'Company/Organization', type: 'text' },
          { id: 'businessType', label: 'Business Type', type: 'text' },
          { id: 'businessAddress', label: 'Business Address', type: 'text' },
          { id: 'businessPhone', label: 'Business Phone', type: 'text' },
          { id: 'yearsInBusiness', label: 'Years in Business', type: 'number' },
        ],
      },
      {
        title: 'Additional Information',
        description: 'Extra details',
        fields: [
          { id: 'mentorship', label: 'Mentorship Provided', type: 'textarea' },
          { id: 'contributions', label: 'Contributions', type: 'textarea' },
          { id: 'network', label: 'Professional Network', type: 'textarea' },
          { id: 'resources', label: 'Resources Provided', type: 'textarea' },
          { id: 'notes', label: 'Notes', type: 'textarea' },
        ],
      },
    ],
  },
  {
    category: 'ህጻናት',
    sections: [
      {
        title: 'Child Information',
        description: 'Basic child details',
        fields: [
          { id: 'name', label: 'ስም', type: 'text', required: true, placeholder: 'Enter name' },
          { id: 'age', label: 'እድሜ', type: 'number', required: true, placeholder: 'Enter age' },
          { id: 'dateOfBirth', label: 'Date of Birth', type: 'text' },
          { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
          { id: 'grade', label: 'Grade/Class', type: 'text' },
        ],
      },
      {
        title: 'Parent/Guardian Information',
        description: 'Parent or guardian details',
        fields: [
          { id: 'parentName', label: 'Parent/Guardian Name', type: 'text', required: true },
          { id: 'parentPhone', label: 'Parent Phone', type: 'text', required: true },
          { id: 'parentEmail', label: 'Parent Email', type: 'text' },
          { id: 'parentAddress', label: 'Parent Address', type: 'text' },
          { id: 'relationship', label: 'Relationship', type: 'text' },
        ],
      },
      {
        title: 'Program Information',
        description: 'Children program details',
        fields: [
          { id: 'programName', label: 'Program Name', type: 'text' },
          { id: 'enrollmentDate', label: 'Enrollment Date', type: 'text' },
          { id: 'schoolName', label: 'School Name', type: 'text' },
          { id: 'specialNeeds', label: 'Special Needs', type: 'textarea' },
          { id: 'notes', label: 'Notes', type: 'textarea' },
        ],
      },
    ],
  },
];

export function getFormConfigByCategory(category: RecordCategory): CategoryFormConfig {
  return categoryFormConfigs.find((config) => config.category === category) || categoryFormConfigs[0];
}
