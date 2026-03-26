import { categoryFormConfigs } from '@/lib/form-config';

export interface StudentFieldOption {
  value: string;
  label: string;
}

const studentCoreFields = [
  'full_name',
  'gender',
  'dob',
  'photo_url',
  'department_id',
  'category',
] as const;

const studentAddressFields = [
  'address.birth_region',
  'address.birth_zone',
  'address.birth_city',
  'address.birth_woreda',
  'address.birth_kebele',
  'address.current_region',
  'address.current_zone',
  'address.current_city',
  'address.current_woreda',
  'address.current_kebele',
  'address.nationality',
] as const;

const categoryDetailFieldIds = Array.from(
  new Set(categoryFormConfigs.flatMap((config) => config.sections.flatMap((section) => section.fields.map((field) => field.id))))
)
  .map((fieldId) => `category_details.${fieldId}`)
  .sort((a, b) => a.localeCompare(b));

export const STUDENT_SCHEMA_FIELD_OPTIONS: StudentFieldOption[] = [
  ...studentCoreFields.map((field) => ({ value: field, label: field })),
  ...studentAddressFields.map((field) => ({ value: field, label: field })),
  ...categoryDetailFieldIds.map((field) => ({ value: field, label: field })),
];

