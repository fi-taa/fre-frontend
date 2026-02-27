import type { RecordCategory } from '@/types';

export interface FieldConfig {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox';
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

const commonFields: FieldConfig[] = [
  { id: 'name', label: 'ስም', type: 'text', required: true, placeholder: 'Enter name' },
  { id: 'age', label: 'እድሜ', type: 'number', required: true, placeholder: 'Enter age' },
  { id: 'dob', label: 'DOB (dd/mm/yyyy)', type: 'text', required: true, placeholder: 'dd/mm/yyyy' },
  // Required address (always visible)
  { id: 'current_region', label: 'Current region', type: 'text', required: true, placeholder: 'Region' },
  { id: 'current_zone', label: 'Current zone', type: 'text', required: true, placeholder: 'Zone' },
  { id: 'current_city', label: 'Current city', type: 'text', required: true, placeholder: 'City' },
  { id: 'nationality', label: 'Nationality', type: 'text', required: true, placeholder: 'Nationality' },
  // Optional address (behind “More address details”)
  { id: 'birth_region', label: 'Birth region', type: 'text', placeholder: 'Optional' },
  { id: 'birth_zone', label: 'Birth zone', type: 'text', placeholder: 'Optional' },
  { id: 'birth_city', label: 'Birth city', type: 'text', placeholder: 'Optional' },
  { id: 'birth_woreda', label: 'Birth woreda', type: 'text', placeholder: 'Optional' },
  { id: 'birth_kebele', label: 'Birth kebele', type: 'text', placeholder: 'Optional' },
  { id: 'current_woreda', label: 'Current woreda', type: 'text', placeholder: 'Optional' },
  { id: 'current_kebele', label: 'Current kebele', type: 'text', placeholder: 'Optional' },
];

export const categoryFormConfigs: CategoryFormConfig[] = [
  {
    category: 'child',
    sections: [
      {
        title: 'Basic & Family – Father',
        description: 'Basic info and father information',
        fields: [
          ...commonFields,
          { id: 'family_father_alive', label: 'Father alive', type: 'checkbox' },
          { id: 'family_father_name', label: 'Father name', type: 'text', placeholder: 'Full name' },
          { id: 'family_father_phone', label: 'Father phone', type: 'text', placeholder: 'Phone' },
          { id: 'family_father_occupation', label: 'Father occupation', type: 'text', placeholder: 'Occupation' },
          { id: 'family_father_dob', label: 'Father date of birth', type: 'text', placeholder: 'YYYY-MM-DD' },
          { id: 'family_father_pob', label: 'Father place of birth', type: 'text', placeholder: 'Place' },
          { id: 'family_father_education_level', label: 'Father education level', type: 'text', placeholder: 'Level' },
          { id: 'family_father_disability', label: 'Father disability', type: 'text', placeholder: 'If any' },
        ],
      },
      {
        title: 'Family – Mother',
        description: 'Mother information',
        fields: [
          { id: 'family_mother_alive', label: 'Mother alive', type: 'checkbox' },
          { id: 'family_mother_name', label: 'Mother name', type: 'text', placeholder: 'Full name' },
          { id: 'family_mother_phone', label: 'Mother phone', type: 'text', placeholder: 'Phone' },
          { id: 'family_mother_occupation', label: 'Mother occupation', type: 'text', placeholder: 'Occupation' },
          { id: 'family_mother_dob', label: 'Mother date of birth', type: 'text', placeholder: 'YYYY-MM-DD' },
          { id: 'family_mother_pob', label: 'Mother place of birth', type: 'text', placeholder: 'Place' },
          { id: 'family_mother_education_level', label: 'Mother education level', type: 'text', placeholder: 'Level' },
          { id: 'family_mother_disability', label: 'Mother disability', type: 'text', placeholder: 'If any' },
        ],
      },
      {
        title: 'Family – Guardian & Church',
        description: 'Guardian and church participation',
        fields: [
          { id: 'family_guardian_name', label: 'Guardian name', type: 'text', placeholder: 'If applicable' },
          { id: 'family_guardian_relation', label: 'Guardian relation', type: 'text', placeholder: 'Relation to child' },
          { id: 'family_guardian_phone', label: 'Guardian phone', type: 'text', placeholder: 'Phone' },
          { id: 'family_parents_church_freq', label: 'Parents church frequency', type: 'text', placeholder: 'e.g. Weekly' },
          { id: 'family_parents_have_spiritual_father', label: 'Parents have spiritual father', type: 'checkbox' },
          { id: 'family_parents_spiritual_visit_freq', label: 'Spiritual visit frequency', type: 'text', placeholder: 'Frequency' },
          { id: 'family_family_members_living_together', label: 'Family members living together', type: 'text', placeholder: 'Description' },
          { id: 'family_orthodox_awareness_level', label: 'Orthodox awareness level', type: 'text', placeholder: 'Level' },
        ],
      },
      {
        title: 'Education',
        description: 'Education details',
        fields: [
          {
            id: 'education_level',
            label: 'Education level',
            type: 'select',
            required: true,
            options: ['ELEMENTARY', 'HIGH_SCHOOL', 'PREPARATORY', 'HIGHER_EDUCATION', 'ILLITERATE'],
          },
          {
            id: 'education_occupation',
            label: 'Occupation',
            type: 'select',
            required: true,
            options: [
              'STUDENT',
              'EMPLOYED_CIVIL',
              'EMPLOYED_PRIVATE',
              'WORKER_AND_STUDENT',
              'UNEMPLOYED',
              'SELF_EMPLOYED',
            ],
          },
          { id: 'education_college_name', label: 'College name', type: 'text', placeholder: 'If applicable' },
          { id: 'education_department_name', label: 'Department name', type: 'text', placeholder: 'Department' },
          { id: 'education_entry_year', label: 'Entry year', type: 'text', placeholder: 'Year' },
          { id: 'education_certificate_type', label: 'Certificate type', type: 'text', placeholder: 'Type' },
        ],
      },
      {
        title: 'Spirituality',
        description: 'Spiritual life',
        fields: [
          { id: 'spirituality_baptism_name', label: 'Baptism name', type: 'text', placeholder: 'Baptism name' },
          { id: 'spirituality_baptism_place', label: 'Baptism place', type: 'text', placeholder: 'Place' },
          { id: 'spirituality_has_spiritual_father', label: 'Has spiritual father', type: 'checkbox' },
          { id: 'spirituality_spiritual_father_name', label: 'Spiritual father name', type: 'text', placeholder: 'Name' },
          { id: 'spirituality_spiritual_father_phone', label: 'Spiritual father phone', type: 'text', placeholder: 'Phone' },
          { id: 'spirituality_has_holy_orders', label: 'Has holy orders', type: 'checkbox' },
        ],
      },
      {
        title: 'Health & Emergency',
        description: 'Health and emergency contact (required)',
        fields: [
          { id: 'health_has_disability', label: 'Has disability', type: 'checkbox' },
          { id: 'health_disability_details', label: 'Disability details', type: 'textarea', placeholder: 'If applicable' },
          { id: 'health_has_trauma', label: 'Has trauma', type: 'checkbox' },
          { id: 'health_trauma_details', label: 'Trauma details', type: 'textarea', placeholder: 'If applicable' },
          { id: 'health_health_issues', label: 'Health issues', type: 'textarea', placeholder: 'Any health issues' },
          { id: 'health_mental_status', label: 'Mental status', type: 'text', placeholder: 'Status' },
          { id: 'health_emergency_name', label: 'Emergency contact name', type: 'text', required: true, placeholder: 'Full name' },
          { id: 'health_emergency_phone', label: 'Emergency phone', type: 'text', required: true, placeholder: 'Phone' },
          { id: 'health_emergency_relation', label: 'Emergency relation', type: 'text', required: true, placeholder: 'Relation to child' },
        ],
      },
    ],
  },
  {
    category: 'youth',
    sections: [
      {
        title: 'Contact',
        description: 'Required contact',
        fields: [
          ...commonFields,
          { id: 'phone', label: 'ስልክ', type: 'text', required: true, placeholder: 'Phone' },
        ],
      },
      {
        title: 'Education',
        description: 'Education details',
        fields: [
          {
            id: 'education_level',
            label: 'Education level',
            type: 'select',
            required: true,
            options: ['ELEMENTARY', 'HIGH_SCHOOL', 'PREPARATORY', 'HIGHER_EDUCATION', 'ILLITERATE'],
          },
          {
            id: 'education_occupation',
            label: 'Occupation',
            type: 'select',
            required: true,
            options: [
              'STUDENT',
              'EMPLOYED_CIVIL',
              'EMPLOYED_PRIVATE',
              'WORKER_AND_STUDENT',
              'UNEMPLOYED',
              'SELF_EMPLOYED',
            ],
          },
          { id: 'education_college_name', label: 'College name', type: 'text', placeholder: 'If applicable' },
          { id: 'education_department_name', label: 'Department name', type: 'text', placeholder: 'Department' },
          { id: 'education_entry_year', label: 'Entry year', type: 'text', placeholder: 'Year' },
          { id: 'education_certificate_type', label: 'Certificate type', type: 'text', placeholder: 'Type' },
        ],
      },
      {
        title: 'Family – Father',
        description: 'Father information',
        fields: [
          { id: 'family_father_alive', label: 'Father alive', type: 'checkbox' },
          { id: 'family_father_name', label: 'Father name', type: 'text', placeholder: 'Full name' },
          { id: 'family_father_phone', label: 'Father phone', type: 'text', placeholder: 'Phone' },
          { id: 'family_father_occupation', label: 'Father occupation', type: 'text', placeholder: 'Occupation' },
          { id: 'family_father_dob', label: 'Father date of birth', type: 'text', placeholder: 'YYYY-MM-DD' },
          { id: 'family_father_pob', label: 'Father place of birth', type: 'text', placeholder: 'Place' },
          { id: 'family_father_education_level', label: 'Father education level', type: 'text', placeholder: 'Level' },
          { id: 'family_father_disability', label: 'Father disability', type: 'text', placeholder: 'If any' },
        ],
      },
      {
        title: 'Family – Mother',
        description: 'Mother information',
        fields: [
          { id: 'family_mother_alive', label: 'Mother alive', type: 'checkbox' },
          { id: 'family_mother_name', label: 'Mother name', type: 'text', placeholder: 'Full name' },
          { id: 'family_mother_phone', label: 'Mother phone', type: 'text', placeholder: 'Phone' },
          { id: 'family_mother_occupation', label: 'Mother occupation', type: 'text', placeholder: 'Occupation' },
          { id: 'family_mother_dob', label: 'Mother date of birth', type: 'text', placeholder: 'YYYY-MM-DD' },
          { id: 'family_mother_pob', label: 'Mother place of birth', type: 'text', placeholder: 'Place' },
          { id: 'family_mother_education_level', label: 'Mother education level', type: 'text', placeholder: 'Level' },
          { id: 'family_mother_disability', label: 'Mother disability', type: 'text', placeholder: 'If any' },
        ],
      },
      {
        title: 'Family – Guardian & Church',
        description: 'Guardian and church participation',
        fields: [
          { id: 'family_guardian_name', label: 'Guardian name', type: 'text', placeholder: 'If applicable' },
          { id: 'family_guardian_relation', label: 'Guardian relation', type: 'text', placeholder: 'Relation' },
          { id: 'family_guardian_phone', label: 'Guardian phone', type: 'text', placeholder: 'Phone' },
          { id: 'family_parents_church_freq', label: 'Parents church frequency', type: 'text', placeholder: 'e.g. Weekly' },
          { id: 'family_parents_have_spiritual_father', label: 'Parents have spiritual father', type: 'checkbox' },
          { id: 'family_parents_spiritual_visit_freq', label: 'Spiritual visit frequency', type: 'text', placeholder: 'Frequency' },
          { id: 'family_family_members_living_together', label: 'Family members living together', type: 'text', placeholder: 'Description' },
          { id: 'family_orthodox_awareness_level', label: 'Orthodox awareness level', type: 'text', placeholder: 'Level' },
        ],
      },
      {
        title: 'Spirituality',
        description: 'Spiritual life',
        fields: [
          { id: 'spirituality_baptism_name', label: 'Baptism name', type: 'text', placeholder: 'Baptism name' },
          { id: 'spirituality_baptism_place', label: 'Baptism place', type: 'text', placeholder: 'Place' },
          { id: 'spirituality_has_spiritual_father', label: 'Has spiritual father', type: 'checkbox' },
          { id: 'spirituality_spiritual_father_name', label: 'Spiritual father name', type: 'text', placeholder: 'Name' },
          { id: 'spirituality_spiritual_father_phone', label: 'Spiritual father phone', type: 'text', placeholder: 'Phone' },
          { id: 'spirituality_has_holy_orders', label: 'Has holy orders', type: 'checkbox' },
        ],
      },
      {
        title: 'Health & Emergency',
        description: 'Health and emergency contact (required)',
        fields: [
          { id: 'health_has_disability', label: 'Has disability', type: 'checkbox' },
          { id: 'health_disability_details', label: 'Disability details', type: 'textarea', placeholder: 'If applicable' },
          { id: 'health_has_trauma', label: 'Has trauma', type: 'checkbox' },
          { id: 'health_trauma_details', label: 'Trauma details', type: 'textarea', placeholder: 'If applicable' },
          { id: 'health_health_issues', label: 'Health issues', type: 'textarea', placeholder: 'Any health issues' },
          { id: 'health_mental_status', label: 'Mental status', type: 'text', placeholder: 'Status' },
          { id: 'health_emergency_name', label: 'Emergency contact name', type: 'text', required: true, placeholder: 'Full name' },
          { id: 'health_emergency_phone', label: 'Emergency phone', type: 'text', required: true, placeholder: 'Phone' },
          { id: 'health_emergency_relation', label: 'Emergency relation', type: 'text', required: true, placeholder: 'Relation' },
        ],
      },
    ],
  },
  {
    category: 'adolescent',
    sections: [
      {
        title: 'Basic & Family – Father',
        description: 'Basic info and father information',
        fields: [
          ...commonFields,
          { id: 'family_father_alive', label: 'Father alive', type: 'checkbox' },
          { id: 'family_father_name', label: 'Father name', type: 'text', placeholder: 'Full name' },
          { id: 'family_father_phone', label: 'Father phone', type: 'text', placeholder: 'Phone' },
          { id: 'family_father_occupation', label: 'Father occupation', type: 'text', placeholder: 'Occupation' },
          { id: 'family_father_dob', label: 'Father date of birth', type: 'text', placeholder: 'YYYY-MM-DD' },
          { id: 'family_father_pob', label: 'Father place of birth', type: 'text', placeholder: 'Place' },
          { id: 'family_father_education_level', label: 'Father education level', type: 'text', placeholder: 'Level' },
          { id: 'family_father_disability', label: 'Father disability', type: 'text', placeholder: 'If any' },
        ],
      },
      {
        title: 'Family – Mother',
        description: 'Mother information',
        fields: [
          { id: 'family_mother_alive', label: 'Mother alive', type: 'checkbox' },
          { id: 'family_mother_name', label: 'Mother name', type: 'text', placeholder: 'Full name' },
          { id: 'family_mother_phone', label: 'Mother phone', type: 'text', placeholder: 'Phone' },
          { id: 'family_mother_occupation', label: 'Mother occupation', type: 'text', placeholder: 'Occupation' },
          { id: 'family_mother_dob', label: 'Mother date of birth', type: 'text', placeholder: 'YYYY-MM-DD' },
          { id: 'family_mother_pob', label: 'Mother place of birth', type: 'text', placeholder: 'Place' },
          { id: 'family_mother_education_level', label: 'Mother education level', type: 'text', placeholder: 'Level' },
          { id: 'family_mother_disability', label: 'Mother disability', type: 'text', placeholder: 'If any' },
        ],
      },
      {
        title: 'Family – Guardian & Church',
        description: 'Guardian and church participation',
        fields: [
          { id: 'family_guardian_name', label: 'Guardian name', type: 'text', placeholder: 'If applicable' },
          { id: 'family_guardian_relation', label: 'Guardian relation', type: 'text', placeholder: 'Relation to child' },
          { id: 'family_guardian_phone', label: 'Guardian phone', type: 'text', placeholder: 'Phone' },
          { id: 'family_parents_church_freq', label: 'Parents church frequency', type: 'text', placeholder: 'e.g. Weekly' },
          { id: 'family_parents_have_spiritual_father', label: 'Parents have spiritual father', type: 'checkbox' },
          { id: 'family_parents_spiritual_visit_freq', label: 'Spiritual visit frequency', type: 'text', placeholder: 'Frequency' },
          { id: 'family_family_members_living_together', label: 'Family members living together', type: 'text', placeholder: 'Description' },
          { id: 'family_orthodox_awareness_level', label: 'Orthodox awareness level', type: 'text', placeholder: 'Level' },
        ],
      },
      {
        title: 'Education',
        description: 'Education details',
        fields: [
          { id: 'education_level', label: 'Education level', type: 'text', required: true, placeholder: 'Level' },
          { id: 'education_occupation', label: 'Occupation', type: 'text', required: true, placeholder: 'Occupation' },
          { id: 'education_college_name', label: 'College name', type: 'text', placeholder: 'If applicable' },
          { id: 'education_department_name', label: 'Department name', type: 'text', placeholder: 'Department' },
          { id: 'education_entry_year', label: 'Entry year', type: 'text', placeholder: 'Year' },
          { id: 'education_certificate_type', label: 'Certificate type', type: 'text', placeholder: 'Type' },
        ],
      },
      {
        title: 'Spirituality',
        description: 'Spiritual life',
        fields: [
          { id: 'spirituality_baptism_name', label: 'Baptism name', type: 'text', placeholder: 'Baptism name' },
          { id: 'spirituality_baptism_place', label: 'Baptism place', type: 'text', placeholder: 'Place' },
          { id: 'spirituality_has_spiritual_father', label: 'Has spiritual father', type: 'checkbox' },
          { id: 'spirituality_spiritual_father_name', label: 'Spiritual father name', type: 'text', placeholder: 'Name' },
          { id: 'spirituality_spiritual_father_phone', label: 'Spiritual father phone', type: 'text', placeholder: 'Phone' },
          { id: 'spirituality_has_holy_orders', label: 'Has holy orders', type: 'checkbox' },
        ],
      },
      {
        title: 'Health & Emergency',
        description: 'Health and emergency contact (required)',
        fields: [
          { id: 'health_has_disability', label: 'Has disability', type: 'checkbox' },
          { id: 'health_disability_details', label: 'Disability details', type: 'textarea', placeholder: 'If applicable' },
          { id: 'health_has_trauma', label: 'Has trauma', type: 'checkbox' },
          { id: 'health_trauma_details', label: 'Trauma details', type: 'textarea', placeholder: 'If applicable' },
          { id: 'health_health_issues', label: 'Health issues', type: 'textarea', placeholder: 'Any health issues' },
          { id: 'health_mental_status', label: 'Mental status', type: 'text', placeholder: 'Status' },
          { id: 'health_emergency_name', label: 'Emergency contact name', type: 'text', required: true, placeholder: 'Full name' },
          { id: 'health_emergency_phone', label: 'Emergency phone', type: 'text', required: true, placeholder: 'Phone' },
          { id: 'health_emergency_relation', label: 'Emergency relation', type: 'text', required: true, placeholder: 'Relation' },
        ],
      },
    ],
  },
  {
    category: 'adult',
    sections: [
      {
        title: 'Contact',
        description: 'Required contact and marital status',
        fields: [
          ...commonFields,
          {
            id: 'adult_marital_status',
            label: 'Marital status',
            type: 'select',
            required: true,
            options: ['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'MONK'],
          },
          { id: 'adult_phone', label: 'ስልክ', type: 'text', required: true, placeholder: 'Phone' },
          { id: 'adult_email', label: 'ኢሜይል', type: 'text', placeholder: 'Email' },
        ],
      },
      {
        title: 'Education',
        description: 'Education details',
        fields: [
          {
            id: 'education_level',
            label: 'Education level',
            type: 'select',
            required: true,
            options: ['ELEMENTARY', 'HIGH_SCHOOL', 'PREPARATORY', 'HIGHER_EDUCATION', 'ILLITERATE'],
          },
          {
            id: 'education_occupation',
            label: 'Occupation',
            type: 'select',
            required: true,
            options: [
              'STUDENT',
              'EMPLOYED_CIVIL',
              'EMPLOYED_PRIVATE',
              'WORKER_AND_STUDENT',
              'UNEMPLOYED',
              'SELF_EMPLOYED',
            ],
          },
          { id: 'education_college_name', label: 'College name', type: 'text', placeholder: 'If applicable' },
          { id: 'education_department_name', label: 'Department name', type: 'text', placeholder: 'Department' },
          { id: 'education_entry_year', label: 'Entry year', type: 'text', placeholder: 'Year' },
          { id: 'education_certificate_type', label: 'Certificate type', type: 'text', placeholder: 'Type' },
        ],
      },
      {
        title: 'Spirituality',
        description: 'Spiritual life',
        fields: [
          { id: 'spirituality_baptism_name', label: 'Baptism name', type: 'text', placeholder: 'Baptism name' },
          { id: 'spirituality_baptism_place', label: 'Baptism place', type: 'text', placeholder: 'Place' },
          { id: 'spirituality_has_spiritual_father', label: 'Has spiritual father', type: 'checkbox' },
          { id: 'spirituality_spiritual_father_name', label: 'Spiritual father name', type: 'text', placeholder: 'Name' },
          { id: 'spirituality_spiritual_father_phone', label: 'Spiritual father phone', type: 'text', placeholder: 'Phone' },
          { id: 'spirituality_has_holy_orders', label: 'Has holy orders', type: 'checkbox' },
        ],
      },
      {
        title: 'Health & Emergency',
        description: 'Health and emergency contact (required)',
        fields: [
          { id: 'health_has_disability', label: 'Has disability', type: 'checkbox' },
          { id: 'health_disability_details', label: 'Disability details', type: 'textarea', placeholder: 'If applicable' },
          { id: 'health_has_trauma', label: 'Has trauma', type: 'checkbox' },
          { id: 'health_trauma_details', label: 'Trauma details', type: 'textarea', placeholder: 'If applicable' },
          { id: 'health_health_issues', label: 'Health issues', type: 'textarea', placeholder: 'Any health issues' },
          { id: 'health_mental_status', label: 'Mental status', type: 'text', placeholder: 'Status' },
          { id: 'health_emergency_name', label: 'Emergency contact name', type: 'text', required: true, placeholder: 'Full name' },
          { id: 'health_emergency_phone', label: 'Emergency phone', type: 'text', required: true, placeholder: 'Phone' },
          { id: 'health_emergency_relation', label: 'Emergency relation', type: 'text', required: true, placeholder: 'Relation' },
        ],
      },
    ],
  },
];

export function getFormConfigByCategory(category: RecordCategory): CategoryFormConfig {
  return categoryFormConfigs.find((config) => config.category === category) || categoryFormConfigs[0];
}
