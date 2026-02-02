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

const commonFields: FieldConfig[] = [
  { id: 'name', label: 'ስም', type: 'text', required: true, placeholder: 'Enter name' },
  { id: 'age', label: 'እድሜ', type: 'number', required: true, placeholder: 'Enter age' },
];

export const categoryFormConfigs: CategoryFormConfig[] = [
  {
    category: 'child',
    sections: [
      {
        title: 'Child Information',
        description: 'Basic child details',
        fields: [
          ...commonFields,
          { id: 'grade', label: 'Grade/Class', type: 'text', placeholder: 'Enter grade' },
          { id: 'schoolName', label: 'School Name', type: 'text', placeholder: 'Enter school' },
        ],
      },
      {
        title: 'Parent/Guardian Information',
        description: 'Parent or guardian details (required for child category)',
        fields: [
          { id: 'parentName', label: 'Parent/Guardian Name', type: 'text', required: true },
          { id: 'parentPhone', label: 'Parent Phone', type: 'text', required: true },
        ],
      },
    ],
  },
  {
    category: 'youth',
    sections: [
      {
        title: 'Youth Information',
        description: 'Youth contact and education details',
        fields: [
          ...commonFields,
          { id: 'phone', label: 'ስልክ', type: 'text', placeholder: 'Enter phone' },
          { id: 'email', label: 'ኢሜይል', type: 'text', placeholder: 'Enter email' },
          { id: 'education', label: 'Education', type: 'text', placeholder: 'Enter education level' },
          { id: 'occupation', label: 'Occupation', type: 'text', placeholder: 'Enter occupation' },
        ],
      },
    ],
  },
  {
    category: 'adolescent',
    sections: [
      {
        title: 'Adolescent Information',
        description: 'Basic details',
        fields: [
          ...commonFields,
          { id: 'grade', label: 'Grade/Class', type: 'text', placeholder: 'Enter grade' },
          { id: 'schoolName', label: 'School Name', type: 'text', placeholder: 'Enter school' },
          { id: 'phone', label: 'ስልክ', type: 'text', placeholder: 'Enter phone' },
        ],
      },
      {
        title: 'Parent/Guardian Information',
        description: 'Parent or guardian details (required for adolescent category)',
        fields: [
          { id: 'parentName', label: 'Parent/Guardian Name', type: 'text', required: true },
          { id: 'parentPhone', label: 'Parent Phone', type: 'text', required: true },
        ],
      },
    ],
  },
  {
    category: 'adult',
    sections: [
      {
        title: 'Adult Information',
        description: 'Contact and professional details',
        fields: [
          ...commonFields,
          { id: 'phone', label: 'ስልክ', type: 'text', placeholder: 'Enter phone' },
          { id: 'email', label: 'ኢሜይል', type: 'text', placeholder: 'Enter email' },
          { id: 'maritalStatus', label: 'Marital Status', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed'] },
          { id: 'occupation', label: 'Occupation', type: 'text', placeholder: 'Enter occupation' },
          { id: 'education', label: 'Education', type: 'text', placeholder: 'Enter education level' },
        ],
      },
    ],
  },
];

export function getFormConfigByCategory(category: RecordCategory): CategoryFormConfig {
  return categoryFormConfigs.find((config) => config.category === category) || categoryFormConfigs[0];
}
