import type {
  PersonRecord,
  RecordCategory,
  SortField,
  SortDirection,
  Student,
  ChildDetails,
  AdultDetails,
  YouthDetails,
} from '@/types';
import { apiCategoryToSlug } from '@/types';

function flattenEducationSpiritualityHealth(
  e: { level: string; occupation: string; college_name: string | null; department_name: string | null; entry_year: string | null; certificate_type: string | null },
  s: { baptism_name: string | null; baptism_place: string | null; has_spiritual_father: boolean; spiritual_father_name: string | null; spiritual_father_phone: string | null; has_holy_orders: boolean },
  h: { has_disability: boolean; disability_details: string | null; has_trauma: boolean; trauma_details: string | null; health_issues: string | null; mental_status: string | null; emergency_name: string; emergency_phone: string; emergency_relation: string } | null
): Record<string, string | number | undefined> {
  return {
    education_level: e.level || undefined,
    education_occupation: e.occupation || undefined,
    education_college_name: e.college_name ?? undefined,
    education_department_name: e.department_name ?? undefined,
    education_entry_year: e.entry_year ?? undefined,
    education_certificate_type: e.certificate_type ?? undefined,
    spirituality_baptism_name: s.baptism_name ?? undefined,
    spirituality_baptism_place: s.baptism_place ?? undefined,
    spirituality_has_spiritual_father: s.has_spiritual_father ? 'true' : 'false',
    spirituality_spiritual_father_name: s.spiritual_father_name ?? undefined,
    spirituality_spiritual_father_phone: s.spiritual_father_phone ?? undefined,
    spirituality_has_holy_orders: s.has_holy_orders ? 'true' : 'false',
    health_has_disability: h ? (h.has_disability ? 'true' : 'false') : undefined,
    health_disability_details: h?.disability_details ?? undefined,
    health_has_trauma: h ? (h.has_trauma ? 'true' : 'false') : undefined,
    health_trauma_details: h?.trauma_details ?? undefined,
    health_health_issues: h?.health_issues ?? undefined,
    health_mental_status: h?.mental_status ?? undefined,
    health_emergency_name: h?.emergency_name,
    health_emergency_phone: h?.emergency_phone,
    health_emergency_relation: h?.emergency_relation,
  };
}

function flattenChildDetails(d: ChildDetails): Record<string, string | number | undefined> {
  const f = d.family;
  const e = d.education;
  const s = d.spirituality;
  const h = d.health;
  return {
    family_father_alive: f.father_alive ? 'true' : 'false',
    family_father_name: f.father_name ?? undefined,
    family_father_phone: f.father_phone ?? undefined,
    family_father_occupation: f.father_occupation ?? undefined,
    family_father_dob: f.father_dob ?? undefined,
    family_father_pob: f.father_pob ?? undefined,
    family_father_education_level: f.father_education_level ?? undefined,
    family_father_disability: f.father_disability ?? undefined,
    family_mother_alive: f.mother_alive ? 'true' : 'false',
    family_mother_name: f.mother_name ?? undefined,
    family_mother_phone: f.mother_phone ?? undefined,
    family_mother_occupation: f.mother_occupation ?? undefined,
    family_mother_dob: f.mother_dob ?? undefined,
    family_mother_pob: f.mother_pob ?? undefined,
    family_mother_education_level: f.mother_education_level ?? undefined,
    family_mother_disability: f.mother_disability ?? undefined,
    family_guardian_name: f.guardian_name ?? undefined,
    family_guardian_relation: f.guardian_relation ?? undefined,
    family_guardian_phone: f.guardian_phone ?? undefined,
    family_parents_church_freq: f.parents_church_freq ?? undefined,
    family_parents_have_spiritual_father: f.parents_have_spiritual_father ? 'true' : 'false',
    family_parents_spiritual_visit_freq: f.parents_spiritual_visit_freq ?? undefined,
    family_family_members_living_together: f.family_members_living_together ?? undefined,
    family_orthodox_awareness_level: f.orthodox_awareness_level ?? undefined,
    education_level: e?.level,
    education_occupation: e?.occupation,
    education_college_name: e?.college_name ?? undefined,
    education_department_name: e?.department_name ?? undefined,
    education_entry_year: e?.entry_year ?? undefined,
    education_certificate_type: e?.certificate_type ?? undefined,
    spirituality_baptism_name: s?.baptism_name ?? undefined,
    spirituality_baptism_place: s?.baptism_place ?? undefined,
    spirituality_has_spiritual_father: s?.has_spiritual_father ? 'true' : 'false',
    spirituality_spiritual_father_name: s?.spiritual_father_name ?? undefined,
    spirituality_spiritual_father_phone: s?.spiritual_father_phone ?? undefined,
    spirituality_has_holy_orders: s?.has_holy_orders ? 'true' : 'false',
    health_has_disability: h?.has_disability ? 'true' : 'false',
    health_disability_details: h?.disability_details ?? undefined,
    health_has_trauma: h?.has_trauma ? 'true' : 'false',
    health_trauma_details: h?.trauma_details ?? undefined,
    health_health_issues: h?.health_issues ?? undefined,
    health_mental_status: h?.mental_status ?? undefined,
    health_emergency_name: h?.emergency_name,
    health_emergency_phone: h?.emergency_phone,
    health_emergency_relation: h?.emergency_relation,
  };
}

function flattenAdultDetails(d: AdultDetails): Record<string, string | number | undefined> {
  const flat = flattenEducationSpiritualityHealth(d.education, d.spirituality, d.health);
  return {
    adult_marital_status: d.marital_status,
    adult_phone: d.phone,
    adult_email: d.email ?? undefined,
    ...flat,
  };
}

function flattenYouthDetails(d: YouthDetails): Record<string, string | number | undefined> {
  const flat = flattenEducationSpiritualityHealth(d.education, d.spirituality, d.health);
  const out: Record<string, string | number | undefined> = {
    phone: d.phone,
    ...flat,
  };
  if (d.family) {
    const f = d.family;
    out.family_father_alive = f.father_alive ? 'true' : 'false';
    out.family_father_name = f.father_name ?? undefined;
    out.family_father_phone = f.father_phone ?? undefined;
    out.family_father_occupation = f.father_occupation ?? undefined;
    out.family_father_dob = f.father_dob ?? undefined;
    out.family_father_pob = f.father_pob ?? undefined;
    out.family_father_education_level = f.father_education_level ?? undefined;
    out.family_father_disability = f.father_disability ?? undefined;
    out.family_mother_alive = f.mother_alive ? 'true' : 'false';
    out.family_mother_name = f.mother_name ?? undefined;
    out.family_mother_phone = f.mother_phone ?? undefined;
    out.family_mother_occupation = f.mother_occupation ?? undefined;
    out.family_mother_dob = f.mother_dob ?? undefined;
    out.family_mother_pob = f.mother_pob ?? undefined;
    out.family_mother_education_level = f.mother_education_level ?? undefined;
    out.family_mother_disability = f.mother_disability ?? undefined;
    out.family_guardian_name = f.guardian_name ?? undefined;
    out.family_guardian_relation = f.guardian_relation ?? undefined;
    out.family_guardian_phone = f.guardian_phone ?? undefined;
    out.family_parents_church_freq = f.parents_church_freq ?? undefined;
    out.family_parents_have_spiritual_father = f.parents_have_spiritual_father ? 'true' : 'false';
    out.family_parents_spiritual_visit_freq = f.parents_spiritual_visit_freq ?? undefined;
    out.family_family_members_living_together = f.family_members_living_together ?? undefined;
    out.family_orthodox_awareness_level = f.orthodox_awareness_level ?? undefined;
  }
  return out;
}

export function studentToRecordView(student: Student): PersonRecord {
  const category = apiCategoryToSlug(student.category);
  const base: PersonRecord = {
    id: String(student.id),
    name: student.name,
    church: student.church ?? '',
    age: student.age,
    category,
  };
  const details = student.category_details;
  if (category === 'child' && details && 'family' in details) {
    Object.assign(base, flattenChildDetails(details as ChildDetails));
  }
  if (category === 'adolescent' && details && 'family' in details) {
    Object.assign(base, flattenChildDetails(details as ChildDetails));
  }
  if (category === 'youth' && details && 'education' in details) {
    Object.assign(base, flattenYouthDetails(details as YouthDetails));
  }
  if (category === 'adult' && details && 'education' in details) {
    Object.assign(base, flattenAdultDetails(details as AdultDetails));
  }
  return base;
}

export function sortRecords(
  records: PersonRecord[],
  field: SortField,
  direction: SortDirection
): PersonRecord[] {
  const sorted = [...records].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    if (field === 'age') {
      aValue = a.age;
      bValue = b.age;
    } else if (field === 'name') {
      aValue = a.name.toLowerCase();
      bValue = b.name.toLowerCase();
    } else {
      aValue = a.church.toLowerCase();
      bValue = b.church.toLowerCase();
    }

    if (aValue < bValue) {
      return direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return sorted;
}

export function filterRecords(
  records: PersonRecord[],
  category: RecordCategory | null,
  searchTerm: string
): PersonRecord[] {
  let filtered = records;

  if (category) {
    filtered = filtered.filter((record) => record.category === category);
  }

  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (record) =>
        record.name.toLowerCase().includes(term) ||
        record.church.toLowerCase().includes(term) ||
        record.age.toString().includes(term)
    );
  }

  return filtered;
}

export function getGreeting(): string {
  const now = new Date();
  const hour = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hour}:${minutes}`;
}
