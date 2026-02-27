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
  { id: 'name', label: 'form.field.name', type: 'text', required: true, placeholder: 'form.placeholder.name' },
  { id: 'age', label: 'form.field.age', type: 'number', required: true, placeholder: 'form.placeholder.age' },
  { id: 'dob', label: 'form.field.dob', type: 'text', required: true, placeholder: 'form.placeholder.dob' },
  // Required address (always visible)
  { id: 'current_region', label: 'form.field.current_region', type: 'text', required: true, placeholder: 'form.placeholder.current_region' },
  { id: 'current_zone', label: 'form.field.current_zone', type: 'text', required: true, placeholder: 'form.placeholder.current_zone' },
  { id: 'current_city', label: 'form.field.current_city', type: 'text', required: true, placeholder: 'form.placeholder.current_city' },
  { id: 'nationality', label: 'form.field.nationality', type: 'text', required: true, placeholder: 'form.placeholder.nationality' },
  // Optional address (behind “More address details”)
  { id: 'birth_region', label: 'form.field.birth_region', type: 'text', placeholder: 'form.placeholder.optional' },
  { id: 'birth_zone', label: 'form.field.birth_zone', type: 'text', placeholder: 'form.placeholder.optional' },
  { id: 'birth_city', label: 'form.field.birth_city', type: 'text', placeholder: 'form.placeholder.optional' },
  { id: 'birth_woreda', label: 'form.field.birth_woreda', type: 'text', placeholder: 'form.placeholder.optional' },
  { id: 'birth_kebele', label: 'form.field.birth_kebele', type: 'text', placeholder: 'form.placeholder.optional' },
  { id: 'current_woreda', label: 'form.field.current_woreda', type: 'text', placeholder: 'form.placeholder.optional' },
  { id: 'current_kebele', label: 'form.field.current_kebele', type: 'text', placeholder: 'form.placeholder.optional' },
];

export const categoryFormConfigs: CategoryFormConfig[] = [
  {
    category: 'child',
    sections: [
      {
        title: 'form.family.father.title_with_basic',
        description: 'form.family.father.description',
        fields: [
          ...commonFields,
          { id: 'family_father_alive', label: 'form.field.family_father_alive', type: 'checkbox' },
          { id: 'family_father_name', label: 'form.field.family_father_name', type: 'text', placeholder: 'form.placeholder.full_name' },
          { id: 'family_father_phone', label: 'form.field.family_father_phone', type: 'text', placeholder: 'form.placeholder.phone' },
          { id: 'family_father_occupation', label: 'form.field.family_father_occupation', type: 'text', placeholder: 'form.placeholder.occupation' },
          { id: 'family_father_dob', label: 'form.field.family_father_dob', type: 'text', placeholder: 'form.placeholder.date_iso' },
          { id: 'family_father_pob', label: 'form.field.family_father_pob', type: 'text', placeholder: 'form.placeholder.place' },
          { id: 'family_father_education_level', label: 'form.field.family_father_education_level', type: 'text', placeholder: 'form.placeholder.level' },
          { id: 'family_father_disability', label: 'form.field.family_father_disability', type: 'text', placeholder: 'form.placeholder.if_any' },
        ],
      },
      {
        title: 'form.family.mother.title',
        description: 'form.family.mother.description',
        fields: [
          { id: 'family_mother_alive', label: 'form.field.family_mother_alive', type: 'checkbox' },
          { id: 'family_mother_name', label: 'form.field.family_mother_name', type: 'text', placeholder: 'form.placeholder.full_name' },
          { id: 'family_mother_phone', label: 'form.field.family_mother_phone', type: 'text', placeholder: 'form.placeholder.phone' },
          { id: 'family_mother_occupation', label: 'form.field.family_mother_occupation', type: 'text', placeholder: 'form.placeholder.occupation' },
          { id: 'family_mother_dob', label: 'form.field.family_mother_dob', type: 'text', placeholder: 'form.placeholder.date_iso' },
          { id: 'family_mother_pob', label: 'form.field.family_mother_pob', type: 'text', placeholder: 'form.placeholder.place' },
          { id: 'family_mother_education_level', label: 'form.field.family_mother_education_level', type: 'text', placeholder: 'form.placeholder.level' },
          { id: 'family_mother_disability', label: 'form.field.family_mother_disability', type: 'text', placeholder: 'form.placeholder.if_any' },
        ],
      },
      {
        title: 'form.family.guardian.title',
        description: 'form.family.guardian.description',
        fields: [
          { id: 'family_guardian_name', label: 'form.field.family_guardian_name', type: 'text', placeholder: 'form.placeholder.if_applicable' },
          { id: 'family_guardian_relation', label: 'form.field.family_guardian_relation', type: 'text', placeholder: 'form.placeholder.relation_child' },
          { id: 'family_guardian_phone', label: 'form.field.family_guardian_phone', type: 'text', placeholder: 'form.placeholder.phone' },
          { id: 'family_parents_church_freq', label: 'form.field.family_parents_church_freq', type: 'text', placeholder: 'form.placeholder.church_frequency' },
          { id: 'family_parents_have_spiritual_father', label: 'form.field.family_parents_have_spiritual_father', type: 'checkbox' },
          { id: 'family_parents_spiritual_visit_freq', label: 'form.field.family_parents_spiritual_visit_freq', type: 'text', placeholder: 'form.placeholder.frequency' },
          { id: 'family_family_members_living_together', label: 'form.field.family_members_living_together', type: 'text', placeholder: 'form.placeholder.description' },
          { id: 'family_orthodox_awareness_level', label: 'form.field.family_orthodox_awareness_level', type: 'text', placeholder: 'form.placeholder.level' },
        ],
      },
      {
        title: 'form.education.title',
        description: 'form.education.description',
        fields: [
          {
            id: 'education_level',
            label: 'form.field.education_level',
            type: 'select',
            required: true,
            options: ['ELEMENTARY', 'HIGH_SCHOOL', 'PREPARATORY', 'HIGHER_EDUCATION', 'ILLITERATE'],
          },
          {
            id: 'education_occupation',
            label: 'form.field.education_occupation',
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
          { id: 'education_college_name', label: 'form.field.college_name', type: 'text', placeholder: 'form.placeholder.college_name' },
          { id: 'education_department_name', label: 'form.field.department_name', type: 'text', placeholder: 'form.placeholder.department_name' },
          { id: 'education_entry_year', label: 'form.field.entry_year', type: 'text', placeholder: 'form.placeholder.entry_year' },
          { id: 'education_certificate_type', label: 'form.field.certificate_type', type: 'text', placeholder: 'form.placeholder.certificate_type' },
        ],
      },
      {
        title: 'form.spirituality.title',
        description: 'form.spirituality.description',
        fields: [
          { id: 'spirituality_baptism_name', label: 'form.field.spirituality_baptism_name', type: 'text', placeholder: 'form.placeholder.baptism_name' },
          { id: 'spirituality_baptism_place', label: 'form.field.spirituality_baptism_place', type: 'text', placeholder: 'form.placeholder.place' },
          { id: 'spirituality_has_spiritual_father', label: 'form.field.spirituality_has_spiritual_father', type: 'checkbox' },
          { id: 'spirituality_spiritual_father_name', label: 'form.field.spirituality_spiritual_father_name', type: 'text', placeholder: 'form.placeholder.name' },
          { id: 'spirituality_spiritual_father_phone', label: 'form.field.spirituality_spiritual_father_phone', type: 'text', placeholder: 'form.placeholder.phone' },
          { id: 'spirituality_has_holy_orders', label: 'form.field.spirituality_has_holy_orders', type: 'checkbox' },
        ],
      },
      {
        title: 'form.health.title',
        description: 'form.health.description',
        fields: [
          { id: 'health_has_disability', label: 'form.field.health_has_disability', type: 'checkbox' },
          { id: 'health_disability_details', label: 'form.field.health_disability_details', type: 'textarea', placeholder: 'form.placeholder.if_applicable' },
          { id: 'health_has_trauma', label: 'form.field.health_has_trauma', type: 'checkbox' },
          { id: 'health_trauma_details', label: 'form.field.health_trauma_details', type: 'textarea', placeholder: 'form.placeholder.if_applicable' },
          { id: 'health_health_issues', label: 'form.field.health_health_issues', type: 'textarea', placeholder: 'form.placeholder.health_issues' },
          { id: 'health_mental_status', label: 'form.field.health_mental_status', type: 'text', placeholder: 'form.placeholder.status' },
          { id: 'health_emergency_name', label: 'form.field.health_emergency_name', type: 'text', required: true, placeholder: 'form.placeholder.full_name' },
          { id: 'health_emergency_phone', label: 'form.field.health_emergency_phone', type: 'text', required: true, placeholder: 'form.placeholder.phone' },
          { id: 'health_emergency_relation', label: 'form.field.health_emergency_relation', type: 'text', required: true, placeholder: 'form.placeholder.relation_child' },
        ],
      },
    ],
  },
  {
    category: 'youth',
    sections: [
      {
        title: 'form.adult.contact.title',
        description: 'form.adult.contact.description',
        fields: [
          ...commonFields,
          { id: 'phone', label: 'form.field.phone', type: 'text', required: true, placeholder: 'form.placeholder.phone' },
        ],
      },
      {
        title: 'form.education.title',
        description: 'form.education.description',
        fields: [
          {
            id: 'education_level',
            label: 'form.field.education_level',
            type: 'select',
            required: true,
            options: ['ELEMENTARY', 'HIGH_SCHOOL', 'PREPARATORY', 'HIGHER_EDUCATION', 'ILLITERATE'],
          },
          {
            id: 'education_occupation',
            label: 'form.field.education_occupation',
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
          { id: 'education_college_name', label: 'form.field.college_name', type: 'text', placeholder: 'form.placeholder.college_name' },
          { id: 'education_department_name', label: 'form.field.department_name', type: 'text', placeholder: 'form.placeholder.department_name' },
          { id: 'education_entry_year', label: 'form.field.entry_year', type: 'text', placeholder: 'form.placeholder.entry_year' },
          { id: 'education_certificate_type', label: 'form.field.certificate_type', type: 'text', placeholder: 'form.placeholder.certificate_type' },
        ],
      },
      {
        title: 'form.family.father.title',
        description: 'form.family.father.description',
        fields: [
          { id: 'family_father_alive', label: 'form.field.family_father_alive', type: 'checkbox' },
          { id: 'family_father_name', label: 'form.field.family_father_name', type: 'text', placeholder: 'form.placeholder.full_name' },
          { id: 'family_father_phone', label: 'form.field.family_father_phone', type: 'text', placeholder: 'form.placeholder.phone' },
          { id: 'family_father_occupation', label: 'form.field.family_father_occupation', type: 'text', placeholder: 'form.placeholder.occupation' },
          { id: 'family_father_dob', label: 'form.field.family_father_dob', type: 'text', placeholder: 'form.placeholder.date_iso' },
          { id: 'family_father_pob', label: 'form.field.family_father_pob', type: 'text', placeholder: 'form.placeholder.place' },
          { id: 'family_father_education_level', label: 'form.field.family_father_education_level', type: 'text', placeholder: 'form.placeholder.level' },
          { id: 'family_father_disability', label: 'form.field.family_father_disability', type: 'text', placeholder: 'form.placeholder.if_any' },
        ],
      },
      {
        title: 'form.family.mother.title',
        description: 'form.family.mother.description',
        fields: [
          { id: 'family_mother_alive', label: 'form.field.family_mother_alive', type: 'checkbox' },
          { id: 'family_mother_name', label: 'form.field.family_mother_name', type: 'text', placeholder: 'form.placeholder.full_name' },
          { id: 'family_mother_phone', label: 'form.field.family_mother_phone', type: 'text', placeholder: 'form.placeholder.phone' },
          { id: 'family_mother_occupation', label: 'form.field.family_mother_occupation', type: 'text', placeholder: 'form.placeholder.occupation' },
          { id: 'family_mother_dob', label: 'form.field.family_mother_dob', type: 'text', placeholder: 'form.placeholder.date_iso' },
          { id: 'family_mother_pob', label: 'form.field.family_mother_pob', type: 'text', placeholder: 'form.placeholder.place' },
          { id: 'family_mother_education_level', label: 'form.field.family_mother_education_level', type: 'text', placeholder: 'form.placeholder.level' },
          { id: 'family_mother_disability', label: 'form.field.family_mother_disability', type: 'text', placeholder: 'form.placeholder.if_any' },
        ],
      },
      {
        title: 'form.family.guardian.title',
        description: 'form.family.guardian.description',
        fields: [
          { id: 'family_guardian_name', label: 'form.field.family_guardian_name', type: 'text', placeholder: 'form.placeholder.if_applicable' },
          { id: 'family_guardian_relation', label: 'form.field.family_guardian_relation', type: 'text', placeholder: 'form.placeholder.relation_child' },
          { id: 'family_guardian_phone', label: 'form.field.family_guardian_phone', type: 'text', placeholder: 'form.placeholder.phone' },
          { id: 'family_parents_church_freq', label: 'form.field.family_parents_church_freq', type: 'text', placeholder: 'form.placeholder.church_frequency' },
          { id: 'family_parents_have_spiritual_father', label: 'form.field.family_parents_have_spiritual_father', type: 'checkbox' },
          { id: 'family_parents_spiritual_visit_freq', label: 'form.field.family_parents_spiritual_visit_freq', type: 'text', placeholder: 'form.placeholder.frequency' },
          { id: 'family_family_members_living_together', label: 'form.field.family_members_living_together', type: 'text', placeholder: 'form.placeholder.description' },
          { id: 'family_orthodox_awareness_level', label: 'form.field.family_orthodox_awareness_level', type: 'text', placeholder: 'form.placeholder.level' },
        ],
      },
      {
        title: 'form.spirituality.title',
        description: 'form.spirituality.description',
        fields: [
          { id: 'spirituality_baptism_name', label: 'form.field.spirituality_baptism_name', type: 'text', placeholder: 'form.placeholder.baptism_name' },
          { id: 'spirituality_baptism_place', label: 'form.field.spirituality_baptism_place', type: 'text', placeholder: 'form.placeholder.place' },
          { id: 'spirituality_has_spiritual_father', label: 'form.field.spirituality_has_spiritual_father', type: 'checkbox' },
          { id: 'spirituality_spiritual_father_name', label: 'form.field.spirituality_spiritual_father_name', type: 'text', placeholder: 'form.placeholder.name' },
          { id: 'spirituality_spiritual_father_phone', label: 'form.field.spirituality_spiritual_father_phone', type: 'text', placeholder: 'form.placeholder.phone' },
          { id: 'spirituality_has_holy_orders', label: 'form.field.spirituality_has_holy_orders', type: 'checkbox' },
        ],
      },
      {
        title: 'form.health.title',
        description: 'form.health.description',
        fields: [
          { id: 'health_has_disability', label: 'form.field.health_has_disability', type: 'checkbox' },
          { id: 'health_disability_details', label: 'form.field.health_disability_details', type: 'textarea', placeholder: 'form.placeholder.if_applicable' },
          { id: 'health_has_trauma', label: 'form.field.health_has_trauma', type: 'checkbox' },
          { id: 'health_trauma_details', label: 'form.field.health_trauma_details', type: 'textarea', placeholder: 'form.placeholder.if_applicable' },
          { id: 'health_health_issues', label: 'form.field.health_health_issues', type: 'textarea', placeholder: 'form.placeholder.health_issues' },
          { id: 'health_mental_status', label: 'form.field.health_mental_status', type: 'text', placeholder: 'form.placeholder.status' },
          { id: 'health_emergency_name', label: 'form.field.health_emergency_name', type: 'text', required: true, placeholder: 'form.placeholder.full_name' },
          { id: 'health_emergency_phone', label: 'form.field.health_emergency_phone', type: 'text', required: true, placeholder: 'form.placeholder.phone' },
          { id: 'health_emergency_relation', label: 'form.field.health_emergency_relation', type: 'text', required: true, placeholder: 'form.placeholder.relation_child' },
        ],
      },
    ],
  },
  {
    category: 'adolescent',
    sections: [
      {
        title: 'form.family.father.title_with_basic',
        description: 'form.family.father.description',
        fields: [
          ...commonFields,
          { id: 'family_father_alive', label: 'form.field.family_father_alive', type: 'checkbox' },
          { id: 'family_father_name', label: 'form.field.family_father_name', type: 'text', placeholder: 'form.placeholder.full_name' },
          { id: 'family_father_phone', label: 'form.field.family_father_phone', type: 'text', placeholder: 'form.placeholder.phone' },
          { id: 'family_father_occupation', label: 'form.field.family_father_occupation', type: 'text', placeholder: 'form.placeholder.occupation' },
          { id: 'family_father_dob', label: 'form.field.family_father_dob', type: 'text', placeholder: 'form.placeholder.date_iso' },
          { id: 'family_father_pob', label: 'form.field.family_father_pob', type: 'text', placeholder: 'form.placeholder.place' },
          { id: 'family_father_education_level', label: 'form.field.family_father_education_level', type: 'text', placeholder: 'form.placeholder.level' },
          { id: 'family_father_disability', label: 'form.field.family_father_disability', type: 'text', placeholder: 'form.placeholder.if_any' },
        ],
      },
      {
        title: 'form.family.mother.title',
        description: 'form.family.mother.description',
        fields: [
          { id: 'family_mother_alive', label: 'form.field.family_mother_alive', type: 'checkbox' },
          { id: 'family_mother_name', label: 'form.field.family_mother_name', type: 'text', placeholder: 'form.placeholder.full_name' },
          { id: 'family_mother_phone', label: 'form.field.family_mother_phone', type: 'text', placeholder: 'form.placeholder.phone' },
          { id: 'family_mother_occupation', label: 'form.field.family_mother_occupation', type: 'text', placeholder: 'form.placeholder.occupation' },
          { id: 'family_mother_dob', label: 'form.field.family_mother_dob', type: 'text', placeholder: 'form.placeholder.date_iso' },
          { id: 'family_mother_pob', label: 'form.field.family_mother_pob', type: 'text', placeholder: 'form.placeholder.place' },
          { id: 'family_mother_education_level', label: 'form.field.family_mother_education_level', type: 'text', placeholder: 'form.placeholder.level' },
          { id: 'family_mother_disability', label: 'form.field.family_mother_disability', type: 'text', placeholder: 'form.placeholder.if_any' },
        ],
      },
      {
        title: 'form.family.guardian.title',
        description: 'form.family.guardian.description',
        fields: [
          { id: 'family_guardian_name', label: 'form.field.family_guardian_name', type: 'text', placeholder: 'form.placeholder.if_applicable' },
          { id: 'family_guardian_relation', label: 'form.field.family_guardian_relation', type: 'text', placeholder: 'form.placeholder.relation_child' },
          { id: 'family_guardian_phone', label: 'form.field.family_guardian_phone', type: 'text', placeholder: 'form.placeholder.phone' },
          { id: 'family_parents_church_freq', label: 'form.field.family_parents_church_freq', type: 'text', placeholder: 'form.placeholder.church_frequency' },
          { id: 'family_parents_have_spiritual_father', label: 'form.field.family_parents_have_spiritual_father', type: 'checkbox' },
          { id: 'family_parents_spiritual_visit_freq', label: 'form.field.family_parents_spiritual_visit_freq', type: 'text', placeholder: 'form.placeholder.frequency' },
          { id: 'family_family_members_living_together', label: 'form.field.family_members_living_together', type: 'text', placeholder: 'form.placeholder.description' },
          { id: 'family_orthodox_awareness_level', label: 'form.field.family_orthodox_awareness_level', type: 'text', placeholder: 'form.placeholder.level' },
        ],
      },
      {
        title: 'form.education.title',
        description: 'form.education.description',
        fields: [
          { id: 'education_level', label: 'form.field.education_level', type: 'text', required: true, placeholder: 'form.placeholder.education_level' },
          { id: 'education_occupation', label: 'form.field.education_occupation', type: 'text', required: true, placeholder: 'form.placeholder.education_occupation' },
          { id: 'education_college_name', label: 'form.field.college_name', type: 'text', placeholder: 'form.placeholder.college_name' },
          { id: 'education_department_name', label: 'form.field.department_name', type: 'text', placeholder: 'form.placeholder.department_name' },
          { id: 'education_entry_year', label: 'form.field.entry_year', type: 'text', placeholder: 'form.placeholder.entry_year' },
          { id: 'education_certificate_type', label: 'form.field.certificate_type', type: 'text', placeholder: 'form.placeholder.certificate_type' },
        ],
      },
      {
        title: 'form.spirituality.title',
        description: 'form.spirituality.description',
        fields: [
          { id: 'spirituality_baptism_name', label: 'form.field.spirituality_baptism_name', type: 'text', placeholder: 'form.placeholder.baptism_name' },
          { id: 'spirituality_baptism_place', label: 'form.field.spirituality_baptism_place', type: 'text', placeholder: 'form.placeholder.place' },
          { id: 'spirituality_has_spiritual_father', label: 'form.field.spirituality_has_spiritual_father', type: 'checkbox' },
          { id: 'spirituality_spiritual_father_name', label: 'form.field.spirituality_spiritual_father_name', type: 'text', placeholder: 'form.placeholder.name' },
          { id: 'spirituality_spiritual_father_phone', label: 'form.field.spirituality_spiritual_father_phone', type: 'text', placeholder: 'form.placeholder.phone' },
          { id: 'spirituality_has_holy_orders', label: 'form.field.spirituality_has_holy_orders', type: 'checkbox' },
        ],
      },
      {
        title: 'form.health.title',
        description: 'form.health.description',
        fields: [
          { id: 'health_has_disability', label: 'form.field.health_has_disability', type: 'checkbox' },
          { id: 'health_disability_details', label: 'form.field.health_disability_details', type: 'textarea', placeholder: 'form.placeholder.if_applicable' },
          { id: 'health_has_trauma', label: 'form.field.health_has_trauma', type: 'checkbox' },
          { id: 'health_trauma_details', label: 'form.field.health_trauma_details', type: 'textarea', placeholder: 'form.placeholder.if_applicable' },
          { id: 'health_health_issues', label: 'form.field.health_health_issues', type: 'textarea', placeholder: 'form.placeholder.health_issues' },
          { id: 'health_mental_status', label: 'form.field.health_mental_status', type: 'text', placeholder: 'form.placeholder.status' },
          { id: 'health_emergency_name', label: 'form.field.health_emergency_name', type: 'text', required: true, placeholder: 'form.placeholder.full_name' },
          { id: 'health_emergency_phone', label: 'form.field.health_emergency_phone', type: 'text', required: true, placeholder: 'form.placeholder.phone' },
          { id: 'health_emergency_relation', label: 'form.field.health_emergency_relation', type: 'text', required: true, placeholder: 'form.placeholder.relation_child' },
        ],
      },
    ],
  },
  {
    category: 'adult',
    sections: [
      {
        title: 'form.adult.contact.title',
        description: 'form.adult.contact.description',
        fields: [
          ...commonFields,
          {
            id: 'adult_marital_status',
            label: 'form.field.marital_status',
            type: 'select',
            required: true,
            options: ['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'MONK'],
          },
          { id: 'adult_phone', label: 'form.field.phone', type: 'text', required: true, placeholder: 'form.placeholder.phone' },
          { id: 'adult_email', label: 'form.field.email', type: 'text', placeholder: 'form.placeholder.email' },
        ],
      },
      {
        title: 'form.education.title',
        description: 'form.education.description',
        fields: [
          {
            id: 'education_level',
            label: 'form.field.education_level',
            type: 'select',
            required: true,
            options: ['ELEMENTARY', 'HIGH_SCHOOL', 'PREPARATORY', 'HIGHER_EDUCATION', 'ILLITERATE'],
          },
          {
            id: 'education_occupation',
            label: 'form.field.education_occupation',
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
          { id: 'education_college_name', label: 'form.field.college_name', type: 'text', placeholder: 'form.placeholder.college_name' },
          { id: 'education_department_name', label: 'form.field.department_name', type: 'text', placeholder: 'form.placeholder.department_name' },
          { id: 'education_entry_year', label: 'form.field.entry_year', type: 'text', placeholder: 'form.placeholder.entry_year' },
          { id: 'education_certificate_type', label: 'form.field.certificate_type', type: 'text', placeholder: 'form.placeholder.certificate_type' },
        ],
      },
      {
        title: 'form.spirituality.title',
        description: 'form.spirituality.description',
        fields: [
          { id: 'spirituality_baptism_name', label: 'form.field.spirituality_baptism_name', type: 'text', placeholder: 'form.placeholder.baptism_name' },
          { id: 'spirituality_baptism_place', label: 'form.field.spirituality_baptism_place', type: 'text', placeholder: 'form.placeholder.place' },
          { id: 'spirituality_has_spiritual_father', label: 'form.field.spirituality_has_spiritual_father', type: 'checkbox' },
          { id: 'spirituality_spiritual_father_name', label: 'form.field.spirituality_spiritual_father_name', type: 'text', placeholder: 'form.placeholder.name' },
          { id: 'spirituality_spiritual_father_phone', label: 'form.field.spirituality_spiritual_father_phone', type: 'text', placeholder: 'form.placeholder.phone' },
          { id: 'spirituality_has_holy_orders', label: 'form.field.spirituality_has_holy_orders', type: 'checkbox' },
        ],
      },
      {
        title: 'form.health.title',
        description: 'form.health.description',
        fields: [
          { id: 'health_has_disability', label: 'form.field.health_has_disability', type: 'checkbox' },
          { id: 'health_disability_details', label: 'form.field.health_disability_details', type: 'textarea', placeholder: 'form.placeholder.if_applicable' },
          { id: 'health_has_trauma', label: 'form.field.health_has_trauma', type: 'checkbox' },
          { id: 'health_trauma_details', label: 'form.field.health_trauma_details', type: 'textarea', placeholder: 'form.placeholder.if_applicable' },
          { id: 'health_health_issues', label: 'form.field.health_health_issues', type: 'textarea', placeholder: 'form.placeholder.health_issues' },
          { id: 'health_mental_status', label: 'form.field.health_mental_status', type: 'text', placeholder: 'form.placeholder.status' },
          { id: 'health_emergency_name', label: 'form.field.health_emergency_name', type: 'text', required: true, placeholder: 'form.placeholder.full_name' },
          { id: 'health_emergency_phone', label: 'form.field.health_emergency_phone', type: 'text', required: true, placeholder: 'form.placeholder.phone' },
          { id: 'health_emergency_relation', label: 'form.field.health_emergency_relation', type: 'text', required: true, placeholder: 'form.placeholder.relation_child' },
        ],
      },
    ],
  },
];

export function getFormConfigByCategory(category: RecordCategory): CategoryFormConfig {
  return categoryFormConfigs.find((config) => config.category === category) || categoryFormConfigs[0];
}
