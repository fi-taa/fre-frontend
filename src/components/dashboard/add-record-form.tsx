'use client';

import { useState, useMemo } from 'react';
import { useCreateStudentMutation } from '@/store/slices/studentsApi';
import { useListDepartmentsQuery } from '@/store/slices/departmentsApi';
import { getFormConfigByCategory } from '@/lib/form-config';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RECORD_CATEGORIES, CATEGORY_LABELS, CATEGORY_API_VALUES } from '@/types';
import type {
  RecordCategory,
  StudentCreate,
  ChildDetails,
  ChildFamily,
  ChildEducation,
  ChildSpirituality,
  ChildHealth,
  AdultDetails,
  YouthDetails,
} from '@/types';
import { useI18n } from '@/i18n/I18nProvider';

interface AddRecordFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const debirOptions = [
  'ደብረ አድኅኖ ቅዱስ ገብርኤል',
  'ጥንተ አድባራት ወገዳማት አቦከር ደብረ ፀሐይ ቅዱስ ጊዪርጊስ ቤተክርስቲያን',
];

const SEX_OPTIONS = [
  { value: 'MALE', labelKey: 'enum.gender.MALE' },
  { value: 'FEMALE', labelKey: 'enum.gender.FEMALE' },
];

const CATEGORY_DETAILS_KEYS: Record<RecordCategory, string> = {
  child: 'child',
  youth: 'youth',
  adolescent: 'adolescent',
  adult: 'adult',
};

function toBool(v: string): boolean {
  return v === 'true' || v === 'on' || v === '1';
}

function toStr(v: string | undefined): string | null {
  const s = v?.trim();
  return s === '' || s == null ? null : s;
}

function buildChildDetails(formData: Record<string, string>): ChildDetails {
  const family: ChildFamily = {
    father_alive: toBool(formData.family_father_alive),
    father_name: toStr(formData.family_father_name),
    father_phone: toStr(formData.family_father_phone),
    father_occupation: toStr(formData.family_father_occupation),
    father_dob: toStr(formData.family_father_dob),
    father_pob: toStr(formData.family_father_pob),
    father_education_level: toStr(formData.family_father_education_level),
    father_disability: toStr(formData.family_father_disability),
    mother_alive: toBool(formData.family_mother_alive),
    mother_name: toStr(formData.family_mother_name),
    mother_phone: toStr(formData.family_mother_phone),
    mother_occupation: toStr(formData.family_mother_occupation),
    mother_dob: toStr(formData.family_mother_dob),
    mother_pob: toStr(formData.family_mother_pob),
    mother_education_level: toStr(formData.family_mother_education_level),
    mother_disability: toStr(formData.family_mother_disability),
    guardian_name: toStr(formData.family_guardian_name),
    guardian_relation: toStr(formData.family_guardian_relation),
    guardian_phone: toStr(formData.family_guardian_phone),
    parents_church_freq: toStr(formData.family_parents_church_freq),
    parents_have_spiritual_father: toBool(formData.family_parents_have_spiritual_father),
    parents_spiritual_visit_freq: toStr(formData.family_parents_spiritual_visit_freq),
    family_members_living_together: toStr(formData.family_family_members_living_together),
    orthodox_awareness_level: toStr(formData.family_orthodox_awareness_level),
  };
  const education: ChildEducation = {
    level: formData.education_level?.trim() ?? '',
    occupation: formData.education_occupation?.trim() ?? '',
    college_name: toStr(formData.education_college_name),
    department_name: toStr(formData.education_department_name),
    entry_year: toStr(formData.education_entry_year),
    certificate_type: toStr(formData.education_certificate_type),
    languages: [],
  };
  const spirituality: ChildSpirituality = {
    baptism_name: toStr(formData.spirituality_baptism_name),
    baptism_place: toStr(formData.spirituality_baptism_place),
    has_spiritual_father: toBool(formData.spirituality_has_spiritual_father),
    spiritual_father_name: toStr(formData.spirituality_spiritual_father_name),
    spiritual_father_phone: toStr(formData.spirituality_spiritual_father_phone),
    has_holy_orders: toBool(formData.spirituality_has_holy_orders),
  };
  const health: ChildHealth = {
    has_disability: toBool(formData.health_has_disability),
    disability_details: toStr(formData.health_disability_details),
    has_trauma: toBool(formData.health_has_trauma),
    trauma_details: toStr(formData.health_trauma_details),
    health_issues: toStr(formData.health_health_issues),
    mental_status: toStr(formData.health_mental_status),
    emergency_name: formData.health_emergency_name?.trim() ?? '',
    emergency_phone: formData.health_emergency_phone?.trim() ?? '',
    emergency_relation: formData.health_emergency_relation?.trim() ?? '',
  };
  return {
    family,
    education,
    spirituality,
    health,
  };
}

function buildEducation(formData: Record<string, string>): ChildEducation {
  return {
    level: formData.education_level?.trim() ?? '',
    occupation: formData.education_occupation?.trim() ?? '',
    college_name: toStr(formData.education_college_name),
    department_name: toStr(formData.education_department_name),
    entry_year: toStr(formData.education_entry_year),
    certificate_type: toStr(formData.education_certificate_type),
    languages: [],
  };
}

function buildSpirituality(formData: Record<string, string>): ChildSpirituality {
  return {
    baptism_name: toStr(formData.spirituality_baptism_name),
    baptism_place: toStr(formData.spirituality_baptism_place),
    has_spiritual_father: toBool(formData.spirituality_has_spiritual_father),
    spiritual_father_name: toStr(formData.spirituality_spiritual_father_name),
    spiritual_father_phone: toStr(formData.spirituality_spiritual_father_phone),
    has_holy_orders: toBool(formData.spirituality_has_holy_orders),
  };
}

function buildHealth(formData: Record<string, string>): ChildHealth {
  return {
    has_disability: toBool(formData.health_has_disability),
    disability_details: toStr(formData.health_disability_details),
    has_trauma: toBool(formData.health_has_trauma),
    trauma_details: toStr(formData.health_trauma_details),
    health_issues: toStr(formData.health_health_issues),
    mental_status: toStr(formData.health_mental_status),
    emergency_name: formData.health_emergency_name?.trim() ?? '',
    emergency_phone: formData.health_emergency_phone?.trim() ?? '',
    emergency_relation: formData.health_emergency_relation?.trim() ?? '',
  };
}

function buildAdultDetails(formData: Record<string, string>): AdultDetails {
  return {
    marital_status: formData.adult_marital_status?.trim() ?? '',
    phone: formData.adult_phone?.trim() ?? '',
    email: toStr(formData.adult_email),
    education: buildEducation(formData),
    spirituality: buildSpirituality(formData),
    health: buildHealth(formData),
  };
}

function buildYouthDetails(formData: Record<string, string>): YouthDetails {
  const hasFamily =
    formData.family_father_name ||
    formData.family_mother_name ||
    formData.family_guardian_name;
  let family: ChildFamily | null = null;
  if (hasFamily) {
    family = {
      father_alive: toBool(formData.family_father_alive),
      father_name: toStr(formData.family_father_name),
      father_phone: toStr(formData.family_father_phone),
      father_occupation: toStr(formData.family_father_occupation),
      father_dob: toStr(formData.family_father_dob),
      father_pob: toStr(formData.family_father_pob),
      father_education_level: toStr(formData.family_father_education_level),
      father_disability: toStr(formData.family_father_disability),
      mother_alive: toBool(formData.family_mother_alive),
      mother_name: toStr(formData.family_mother_name),
      mother_phone: toStr(formData.family_mother_phone),
      mother_occupation: toStr(formData.family_mother_occupation),
      mother_dob: toStr(formData.family_mother_dob),
      mother_pob: toStr(formData.family_mother_pob),
      mother_education_level: toStr(formData.family_mother_education_level),
      mother_disability: toStr(formData.family_mother_disability),
      guardian_name: toStr(formData.family_guardian_name),
      guardian_relation: toStr(formData.family_guardian_relation),
      guardian_phone: toStr(formData.family_guardian_phone),
      parents_church_freq: toStr(formData.family_parents_church_freq),
      parents_have_spiritual_father: toBool(formData.family_parents_have_spiritual_father),
      parents_spiritual_visit_freq: toStr(formData.family_parents_spiritual_visit_freq),
      family_members_living_together: toStr(formData.family_family_members_living_together),
      orthodox_awareness_level: toStr(formData.family_orthodox_awareness_level),
    };
  }
  return {
    phone: formData.phone?.trim() ?? '',
    education: buildEducation(formData),
    family,
    spirituality: buildSpirituality(formData),
    health: buildHealth(formData),
  };
}

function buildCategoryDetails(
  category: RecordCategory,
  formData: Record<string, string>
): Record<string, unknown> {
  const nestedKey = CATEGORY_DETAILS_KEYS[category];

  switch (category) {
    case 'child':
      return { [nestedKey]: buildChildDetails(formData) };
    case 'youth':
      return { [nestedKey]: buildYouthDetails(formData) };
    case 'adolescent':
      return { [nestedKey]: buildChildDetails(formData) };
    case 'adult':
      return { [nestedKey]: buildAdultDetails(formData) };
    default:
      return {};
  }
}

export function AddRecordForm({ onCancel, onSuccess }: AddRecordFormProps) {
  const { t } = useI18n();
  const [createStudent, { isLoading }] = useCreateStudentMutation();
  const { data: departments = [], isLoading: departmentsLoading } = useListDepartmentsQuery(undefined, { skip: false });
  const [currentSection, setCurrentSection] = useState(1);
  const [category, setCategory] = useState<RecordCategory>('adult');
  const [sex, setSex] = useState<string>('');
  const [debir, setDebir] = useState('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [showMoreAddress, setShowMoreAddress] = useState(false);

  const formConfig = useMemo(() => getFormConfigByCategory(category), [category]);
  const totalSections = formConfig.sections.length + 1;

  function updateField(fieldId: string, value: string) {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  }

  function handleCategoryChange(newCategory: RecordCategory) {
    setCategory(newCategory);
    setFormData({});
    setShowMoreAddress(false);
    if (currentSection > 1) setCurrentSection(1);
  }

  function handleNext() {
    if (currentSection < totalSections) {
      setCurrentSection((prev) => prev + 1);
      setError('');
    }
  }

  function handlePrevious() {
    if (currentSection > 1) {
      setCurrentSection((prev) => prev - 1);
      setError('');
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!sex) {
      setError(t('error.sexRequired'));
      setCurrentSection(1);
      return;
    }

    const deptId = parseInt(departmentId, 10);
    if (!departmentId || isNaN(deptId)) {
      setError(t('error.departmentRequired'));
      setCurrentSection(1);
      return;
    }

    const name = formData.name || '';
    const ageStr = formData.age || '';
    const dob = formData.dob || '';
    const birthRegion = formData.birth_region || '';
    const birthZone = formData.birth_zone || '';
    const birthCity = formData.birth_city || '';
    const birthWoreda = formData.birth_woreda || '';
    const birthKebele = formData.birth_kebele || '';
    const currentRegion = formData.current_region || '';
    const currentZone = formData.current_zone || '';
    const currentCity = formData.current_city || '';
    const currentWoreda = formData.current_woreda || '';
    const currentKebele = formData.current_kebele || '';
    const nationality = formData.nationality || '';

    if (!name.trim()) {
      setError(t('error.nameRequired'));
      const nameSection = formConfig.sections.findIndex((s) => s.fields.some((f) => f.id === 'name'));
      if (nameSection !== -1) setCurrentSection(nameSection + 2);
      return;
    }

    const age = parseInt(ageStr, 10);
    if (!ageStr || isNaN(age) || age < 0) {
      setError(t('error.ageRequired'));
      const ageSection = formConfig.sections.findIndex((s) => s.fields.some((f) => f.id === 'age'));
      if (ageSection !== -1) setCurrentSection(ageSection + 2);
      return;
    }

    if (!dob.trim()) {
      setError(t('error.dobRequired'));
      const dobSection = formConfig.sections.findIndex((s) => s.fields.some((f) => f.id === 'dob'));
      if (dobSection !== -1) setCurrentSection(dobSection + 2);
      return;
    }

    if (!currentRegion.trim() || !currentZone.trim() || !currentCity.trim() || !nationality.trim()) {
      setError(t('error.addressRequired'));
      const addrSection = formConfig.sections.findIndex((s) =>
        s.fields.some((f) => f.id === 'current_region')
      );
      if (addrSection !== -1) setCurrentSection(addrSection + 2);
      return;
    }

    if (category === 'child' || category === 'adolescent') {
      if (!formData.education_level?.trim() || !formData.education_occupation?.trim()) {
        setError(t('error.educationRequired'));
        const section = formConfig.sections.findIndex((s) =>
          s.fields.some((f) => f.id === 'education_level')
        );
        if (section !== -1) setCurrentSection(section + 2);
        return;
      }
      if (!formData.health_emergency_name?.trim() || !formData.health_emergency_phone?.trim() || !formData.health_emergency_relation?.trim()) {
        setError(t('error.emergencyContactRequired'));
        const section = formConfig.sections.findIndex((s) =>
          s.fields.some((f) => f.id === 'health_emergency_name')
        );
        if (section !== -1) setCurrentSection(section + 2);
        return;
      }
    }

    if (category === 'youth') {
      if (!formData.phone?.trim()) {
        setError(t('error.phoneRequired'));
        const section = formConfig.sections.findIndex((s) => s.fields.some((f) => f.id === 'phone'));
        if (section !== -1) setCurrentSection(section + 2);
        return;
      }
      if (!formData.education_level?.trim() || !formData.education_occupation?.trim()) {
        setError(t('error.educationRequired'));
        const section = formConfig.sections.findIndex((s) =>
          s.fields.some((f) => f.id === 'education_level')
        );
        if (section !== -1) setCurrentSection(section + 2);
        return;
      }
      if (!formData.health_emergency_name?.trim() || !formData.health_emergency_phone?.trim() || !formData.health_emergency_relation?.trim()) {
        setError(t('error.emergencyContactRequired'));
        const section = formConfig.sections.findIndex((s) =>
          s.fields.some((f) => f.id === 'health_emergency_name')
        );
        if (section !== -1) setCurrentSection(section + 2);
        return;
      }
    }

    if (category === 'adult') {
      if (!formData.adult_marital_status?.trim() || !formData.adult_phone?.trim()) {
        setError(t('error.maritalStatusPhoneRequired'));
        setCurrentSection(2);
        return;
      }
      if (!formData.education_level?.trim() || !formData.education_occupation?.trim()) {
        setError(t('error.educationRequired'));
        const section = formConfig.sections.findIndex((s) =>
          s.fields.some((f) => f.id === 'education_level')
        );
        if (section !== -1) setCurrentSection(section + 2);
        return;
      }
      if (!formData.health_emergency_name?.trim() || !formData.health_emergency_phone?.trim() || !formData.health_emergency_relation?.trim()) {
        setError(t('error.emergencyContactRequired'));
        const section = formConfig.sections.findIndex((s) =>
          s.fields.some((f) => f.id === 'health_emergency_name')
        );
        if (section !== -1) setCurrentSection(section + 2);
        return;
      }
    }

    const trimmedName = name.trim();
    const payload: StudentCreate = {
      full_name: trimmedName,
      gender: sex as 'MALE' | 'FEMALE',
      dob: dob.trim(),
      photo_url: null,
      department_id: deptId,
      category: CATEGORY_API_VALUES[category],
      address: {
        birth_region: birthRegion.trim() || null,
        birth_zone: birthZone.trim() || null,
        birth_city: birthCity.trim() || null,
        birth_woreda: birthWoreda.trim() || null,
        birth_kebele: birthKebele.trim() || null,
        current_region: currentRegion.trim(),
        current_zone: currentZone.trim(),
        current_city: currentCity.trim(),
        current_woreda: currentWoreda.trim() || null,
        current_kebele: currentKebele.trim() || null,
        nationality: nationality.trim(),
      },
      category_details: buildCategoryDetails(category, formData),
    };

    try {
      await createStudent(payload).unwrap();
      onSuccess();
    } catch (err) {
      const errObj = err as { data?: { detail?: string | { msg?: string }[] }; status?: number };
      let msg = t('error.createRecordFailed');
      if (errObj?.data?.detail) {
        const d = errObj.data.detail;
        msg = Array.isArray(d) ? d.map((x) => x?.msg || String(x)).join(', ') : String(d);
      }
      setError(msg);
    }
  }

  function renderSection1() {
    return (
      <div className="space-y-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2 text-text-primary">
            {t('ክፍል')} <span className="text-error">*</span>
          </label>
          <Select value={category} onValueChange={(v) => handleCategoryChange(v as RecordCategory)} required>
            <SelectTrigger id="category">
              <SelectValue placeholder={t('Select category')} />
            </SelectTrigger>
            <SelectContent>
              {RECORD_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {t(CATEGORY_LABELS[cat])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="sex" className="block text-sm font-medium mb-2 text-text-primary">
            {t('ጾታ')} <span className="text-error">*</span>
          </label>
          <Select value={sex} onValueChange={setSex} required>
            <SelectTrigger id="sex">
              <SelectValue placeholder={t('Choose')} />
            </SelectTrigger>
            <SelectContent>
              {SEX_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t(opt.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium mb-2 text-text-primary">
            {t('ክፍል / Department')} <span className="text-error">*</span>
          </label>
          {departmentsLoading ? (
              <div className="min-h-[44px] px-4 rounded-lg border border-border/50 bg-bg-beige-light flex items-center text-text-secondary text-sm">
                {t('Loading departments...')}
              </div>
          ) : departments.length === 0 ? (
            <input
              id="department"
              type="number"
              min={1}
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              placeholder={t('Enter department ID')}
              required
              className="w-full min-h-[44px] px-4 rounded-lg border border-border/50 bg-bg-beige-light text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-link/30 focus:border-link/30 transition-all duration-200"
            />
          ) : (
            <select
              id="department"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              required
              className="w-full min-h-[44px] px-4 rounded-lg border border-border/50 bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30 focus:border-link/30 transition-all duration-200"
            >
              <option value="">{t('Choose department')}</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label htmlFor="debir" className="block text-sm font-medium mb-2 text-text-primary">
            {t('በቋሚነት መርኃግብር የሚሳተፉበት ደብር')}
          </label>
          <Select value={debir} onValueChange={setDebir}>
            <SelectTrigger id="debir">
              <SelectValue placeholder={t('Choose')} />
            </SelectTrigger>
            <SelectContent>
              {debirOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

const OPTIONAL_ADDRESS_FIELD_IDS = new Set([
  'birth_region',
  'birth_zone',
  'birth_city',
  'birth_woreda',
  'birth_kebele',
  'current_woreda',
  'current_kebele',
]);

function renderDynamicSection(sectionIndex: number) {
    const section = formConfig.sections[sectionIndex - 1];
    let moreAddressRendered = false;
    return (
      <div className="space-y-4">
        {section.fields.map((field) => {
          const isOptionalAddress = OPTIONAL_ADDRESS_FIELD_IDS.has(field.id);
          if (isOptionalAddress) {
            if (!moreAddressRendered) {
              moreAddressRendered = true;
              if (!showMoreAddress) {
                return (
                  <div key="more-address" className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setShowMoreAddress(true)}
                      className="text-xs font-medium text-link hover:underline"
                    >
                      {t('More address details')}
                    </button>
                  </div>
                );
              }
              // showMoreAddress: render toggle + first optional field
              return (
                <div key={field.id}>
                  <div className="mb-1">
                    <button
                      type="button"
                      onClick={() => setShowMoreAddress(false)}
                      className="text-xs font-medium text-link hover:underline"
                    >
                      {t('Hide additional address details')}
                    </button>
                  </div>
                  <label htmlFor={field.id} className="block text-sm font-medium mb-2 text-text-primary">
                    {t(field.label)}
                    {field.required && <span className="text-error"> *</span>}
                  </label>
                  {field.type === 'checkbox' ? (
                    <input
                      id={field.id}
                      type="checkbox"
                      checked={formData[field.id] === 'true'}
                      onChange={(e) => updateField(field.id, e.target.checked ? 'true' : 'false')}
                      className="h-4 w-4 rounded border-border/50 text-accent focus:ring-link/30"
                    />
                  ) : field.id === 'dob' ? (
                    <input
                      id={field.id}
                      type="date"
                      value={formData[field.id] || ''}
                      onChange={(e) => updateField(field.id, e.target.value)}
                      className="w-full min-h-[44px] px-4 rounded-lg border border-border/50 bg-bg-beige-light text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-link/30 focus:border-link/30 transition-all duration-200"
                      required={field.required}
                    />
                  ) : field.type === 'select' ? (
                    <Select value={formData[field.id] || ''} onValueChange={(v) => updateField(field.id, v)} required={field.required}>
                      <SelectTrigger id={field.id}>
                        <SelectValue placeholder={t('Choose')} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((opt) => {
                          let labelKey = opt;
                          if (field.id === 'adult_marital_status') {
                            labelKey = `enum.maritalStatus.${opt}`;
                          } else if (field.id === 'education_level') {
                            labelKey = `enum.education.level.${opt}`;
                          } else if (field.id === 'education_occupation') {
                            labelKey = `enum.education.occupation.${opt}`;
                          }
                          return (
                            <SelectItem key={opt} value={opt}>
                              {t(labelKey)}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      id={field.id}
                      value={formData[field.id] || ''}
                      onChange={(e) => updateField(field.id, e.target.value)}
                      className="w-full min-h-[100px] px-4 py-3 rounded-lg border border-border/50 bg-bg-beige-light text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-link/30 focus:border-link/30 transition-all duration-200 resize-none"
                      placeholder={field.placeholder ? t(field.placeholder) : undefined}
                      required={field.required}
                    />
                  ) : (
                    <input
                      id={field.id}
                      type={field.type}
                      value={formData[field.id] || ''}
                      onChange={(e) => updateField(field.id, e.target.value)}
                      className="w-full min-h-[44px] px-4 rounded-lg border border-border/50 bg-bg-beige-light text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-link/30 focus:border-link/30 transition-all duration-200"
                      placeholder={field.placeholder ? t(field.placeholder) : undefined}
                      required={field.required}
                    />
                  )}
                </div>
              );
            }
            // subsequent optional address fields: only render when expanded
            if (!showMoreAddress) return null;
          }

          return (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-sm font-medium mb-2 text-text-primary">
                {t(field.label)}
                {field.required && <span className="text-error"> *</span>}
              </label>
              {field.type === 'checkbox' ? (
                <input
                  id={field.id}
                  type="checkbox"
                  checked={formData[field.id] === 'true'}
                  onChange={(e) => updateField(field.id, e.target.checked ? 'true' : 'false')}
                  className="h-4 w-4 rounded border-border/50 text-accent focus:ring-link/30"
                />
              ) : field.id === 'dob' ? (
                <input
                  id={field.id}
                  type="date"
                  value={formData[field.id] || ''}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  className="w-full min-h-[44px] px-4 rounded-lg border border-border/50 bg-bg-beige-light text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-link/30 focus:border-link/30 transition-all duration-200"
                  required={field.required}
                />
              ) : field.type === 'select' ? (
                <Select value={formData[field.id] || ''} onValueChange={(v) => updateField(field.id, v)} required={field.required}>
                  <SelectTrigger id={field.id}>
                    <SelectValue placeholder={t('Choose')} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((opt) => {
                      let labelKey = opt;
                      if (field.id === 'adult_marital_status') {
                        labelKey = `enum.maritalStatus.${opt}`;
                      } else if (field.id === 'education_level') {
                        labelKey = `enum.education.level.${opt}`;
                      } else if (field.id === 'education_occupation') {
                        labelKey = `enum.education.occupation.${opt}`;
                      }
                      return (
                        <SelectItem key={opt} value={opt}>
                          {t(labelKey)}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              ) : field.type === 'textarea' ? (
                <textarea
                  id={field.id}
                  value={formData[field.id] || ''}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  className="w-full min-h-[100px] px-4 py-3 rounded-lg border border-border/50 bg-bg-beige-light text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-link/30 focus:border-link/30 transition-all duration-200 resize-none"
                  placeholder={field.placeholder ? t(field.placeholder) : undefined}
                  required={field.required}
                />
              ) : (
                <input
                  id={field.id}
                  type={field.type}
                  value={formData[field.id] || ''}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  className="w-full min-h-[44px] px-4 rounded-lg border border-border/50 bg-bg-beige-light text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-link/30 focus:border-link/30 transition-all duration-200"
                  placeholder={field.placeholder ? t(field.placeholder) : undefined}
                  required={field.required}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-bg-beige border-b border-border/30">
        <div className="px-4 py-4 flex items-center justify-between">
          <button
            onClick={onCancel}
            className="p-2 -ml-2 rounded-lg hover:bg-bg-beige-light transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-link/20"
            aria-label={t('Back')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-primary">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-text-primary">{t('Add New Record')}</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              {Array.from({ length: totalSections }, (_, i) => i + 1).map((num) => (
                <div key={num} className="flex-1 items-center">
                  <div className="flex items-center">
                    <div className={`flex-1 h-1 rounded-full ${num <= currentSection ? 'bg-accent' : 'bg-border/30'}`} />
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-200 ${
                        num === currentSection ? 'bg-accent text-text-light' : num < currentSection ? 'bg-accent/20 text-accent' : 'bg-bg-beige-light text-text-secondary border border-border/50'
                      }`}
                    >
                      {num}
                    </div>
                    <div className={`flex-1 h-1 rounded-full ${num < currentSection ? 'bg-accent' : 'bg-border/30'}`} />
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <span className="text-sm font-medium text-text-secondary">
                {t('Section')} {currentSection} {t('of')} {totalSections}
              </span>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border/30 relative">
            <div
              className="absolute inset-0 opacity-[0.02] pointer-events-none rounded-lg"
              style={{ backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`, backgroundSize: '40px 40px' }}
            />
            <form onSubmit={handleSubmit} className="relative z-10 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-text-primary mb-1">
                  {currentSection === 1
                    ? t('Category & Details')
                    : formConfig.sections[currentSection - 2]?.title
                      ? t(formConfig.sections[currentSection - 2].title)
                      : `${t('Section')} ${currentSection}`}
                </h2>
                <p className="text-sm text-text-secondary">
                  {currentSection === 1
                    ? t('Select category, sex, and department')
                    : formConfig.sections[currentSection - 2]?.description
                      ? t(formConfig.sections[currentSection - 2].description as string)
                      : t('Please fill in all the fields in this section')}
                </p>
              </div>

              {currentSection === 1 ? renderSection1() : renderDynamicSection(currentSection - 1)}

              {error && <div className="mt-4 text-sm text-error">{error}</div>}

              <div className="flex gap-3 mt-8 pt-6 border-t border-border/30">
                {currentSection > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="flex-1 min-h-[44px] px-4 rounded-lg border border-border/50 text-text-primary hover:bg-bg-beige-light transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-link/20 font-medium"
                  >
                    {t('Previous')}
                  </button>
                )}
                {currentSection < totalSections ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 min-h-[44px] px-4 rounded-lg bg-accent text-text-light hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 font-medium"
                  >
                    {t('Next')}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 min-h-[44px] px-4 rounded-lg bg-accent text-text-light hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 font-medium disabled:opacity-60"
                  >
                    {isLoading ? t('Submitting...') : t('Submit')}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
