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
import type { RecordCategory, StudentCreate } from '@/types';

interface AddRecordFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const debirOptions = [
  'ደብረ አድኅኖ ቅዱስ ገብርኤል',
  'ጥንተ አድባራት ወገዳማት አቦከር ደብረ ፀሐይ ቅዱስ ጊዪርጊስ ቤተክርስቲያን',
];

const SEX_OPTIONS = [
  { value: 'male', label: 'ወንድ' },
  { value: 'female', label: 'ሴት' },
];

const CATEGORY_DETAILS_KEYS: Record<RecordCategory, string> = {
  child: 'Children',
  youth: 'Youth',
  adolescent: 'Adolescent',
  adult: 'Adult',
};

function buildCategoryDetails(
  category: RecordCategory,
  formData: Record<string, string>
): Record<string, Record<string, string | null>> {
  const apiCategory = CATEGORY_API_VALUES[category];
  const nestedKey = CATEGORY_DETAILS_KEYS[category];

  switch (category) {
    case 'child':
      return {
        [nestedKey]: {
          photo_url: null,
          category: apiCategory,
          parentName: formData.parentName || '',
          parentPhone: formData.parentPhone || '',
          grade: formData.grade || null,
          schoolName: formData.schoolName || null,
        },
      };
    case 'youth':
      return {
        [nestedKey]: {
          photo_url: null,
          category: apiCategory,
          phone: formData.phone || null,
          email: formData.email || null,
          education: formData.education || null,
          occupation: formData.occupation || null,
        },
      };
    case 'adolescent':
      return {
        [nestedKey]: {
          photo_url: null,
          category: apiCategory,
          parentName: formData.parentName || '',
          parentPhone: formData.parentPhone || '',
          grade: formData.grade || null,
          schoolName: formData.schoolName || null,
          phone: formData.phone || null,
        },
      };
    case 'adult':
      return {
        [nestedKey]: {
          photo_url: null,
          category: apiCategory,
          phone: formData.phone || null,
          email: formData.email || null,
          maritalStatus: formData.maritalStatus || null,
          occupation: formData.occupation || null,
          education: formData.education || null,
        },
      };
    default:
      return {};
  }
}

export function AddRecordForm({ onCancel, onSuccess }: AddRecordFormProps) {
  const [createStudent, { isLoading }] = useCreateStudentMutation();
  const { data: departments = [], isLoading: departmentsLoading } = useListDepartmentsQuery(undefined, { skip: false });
  const [currentSection, setCurrentSection] = useState(1);
  const [category, setCategory] = useState<RecordCategory>('adult');
  const [sex, setSex] = useState<string>('');
  const [debir, setDebir] = useState('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const formConfig = useMemo(() => getFormConfigByCategory(category), [category]);
  const totalSections = formConfig.sections.length + 1;

  function updateField(fieldId: string, value: string) {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  }

  function handleCategoryChange(newCategory: RecordCategory) {
    setCategory(newCategory);
    setFormData({});
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
      setError('Sex is required');
      setCurrentSection(1);
      return;
    }

    const deptId = parseInt(departmentId, 10);
    if (!departmentId || isNaN(deptId)) {
      setError('Department is required');
      setCurrentSection(1);
      return;
    }

    const name = formData.name || '';
    const ageStr = formData.age || '';

    if (!name.trim()) {
      setError('Name is required');
      const nameSection = formConfig.sections.findIndex((s) => s.fields.some((f) => f.id === 'name'));
      if (nameSection !== -1) setCurrentSection(nameSection + 2);
      return;
    }

    const age = parseInt(ageStr, 10);
    if (!ageStr || isNaN(age) || age < 0) {
      setError('Valid age is required');
      const ageSection = formConfig.sections.findIndex((s) => s.fields.some((f) => f.id === 'age'));
      if (ageSection !== -1) setCurrentSection(ageSection + 2);
      return;
    }

    if ((category === 'child' || category === 'adolescent') && (!formData.parentName?.trim() || !formData.parentPhone?.trim())) {
      setError('Parent name and phone are required');
      const parentSection = formConfig.sections.findIndex((s) =>
        s.fields.some((f) => f.id === 'parentName')
      );
      if (parentSection !== -1) setCurrentSection(parentSection + 2);
      return;
    }

    const payload: StudentCreate = {
      name: name.trim(),
      age,
      sex,
      church: debir.trim() || undefined,
      department_id: deptId,
      category: CATEGORY_API_VALUES[category],
      category_details: buildCategoryDetails(category, formData),
    };

    try {
      await createStudent(payload).unwrap();
      onSuccess();
    } catch (err) {
      const errObj = err as { data?: { detail?: string | { msg?: string }[] }; status?: number };
      let msg = 'Failed to create record';
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
            ክፍል <span className="text-error">*</span>
          </label>
          <Select value={category} onValueChange={(v) => handleCategoryChange(v as RecordCategory)} required>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {RECORD_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="sex" className="block text-sm font-medium mb-2 text-text-primary">
            ጾታ <span className="text-error">*</span>
          </label>
          <Select value={sex} onValueChange={setSex} required>
            <SelectTrigger id="sex">
              <SelectValue placeholder="Choose" />
            </SelectTrigger>
            <SelectContent>
              {SEX_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium mb-2 text-text-primary">
            ክፍል / Department <span className="text-error">*</span>
          </label>
          {departmentsLoading ? (
            <div className="min-h-[44px] px-4 rounded-lg border border-border/50 bg-bg-beige-light flex items-center text-text-secondary text-sm">
              Loading departments...
            </div>
          ) : departments.length === 0 ? (
            <input
              id="department"
              type="number"
              min={1}
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              placeholder="Enter department ID"
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
              <option value="">Choose department</option>
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
            በቋሚነት መርኃግብር የሚሳተፉበት ደብር
          </label>
          <Select value={debir} onValueChange={setDebir}>
            <SelectTrigger id="debir">
              <SelectValue placeholder="Choose" />
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

  function renderDynamicSection(sectionIndex: number) {
    const section = formConfig.sections[sectionIndex - 1];
    return (
      <div className="space-y-4">
        {section.fields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium mb-2 text-text-primary">
              {field.label}
              {field.required && <span className="text-error"> *</span>}
            </label>
            {field.type === 'select' ? (
              <Select value={formData[field.id] || ''} onValueChange={(v) => updateField(field.id, v)} required={field.required}>
                <SelectTrigger id={field.id}>
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : field.type === 'textarea' ? (
              <textarea
                id={field.id}
                value={formData[field.id] || ''}
                onChange={(e) => updateField(field.id, e.target.value)}
                className="w-full min-h-[100px] px-4 py-3 rounded-lg border border-border/50 bg-bg-beige-light text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-link/30 focus:border-link/30 transition-all duration-200 resize-none"
                placeholder={field.placeholder}
                required={field.required}
              />
            ) : (
              <input
                id={field.id}
                type={field.type}
                value={formData[field.id] || ''}
                onChange={(e) => updateField(field.id, e.target.value)}
                className="w-full min-h-[44px] px-4 rounded-lg border border-border/50 bg-bg-beige-light text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-link/30 focus:border-link/30 transition-all duration-200"
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
          </div>
        ))}
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
            aria-label="Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-primary">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-text-primary">Add New Record</h1>
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
                Section {currentSection} of {totalSections}
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
                  {currentSection === 1 ? 'Category & Details' : formConfig.sections[currentSection - 2]?.title || `Section ${currentSection}`}
                </h2>
                <p className="text-sm text-text-secondary">
                  {currentSection === 1 ? 'Select category, sex, and department' : formConfig.sections[currentSection - 2]?.description || 'Please fill in all the fields in this section'}
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
                    Previous
                  </button>
                )}
                {currentSection < totalSections ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 min-h-[44px] px-4 rounded-lg bg-accent text-text-light hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 font-medium"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 min-h-[44px] px-4 rounded-lg bg-accent text-text-light hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 font-medium disabled:opacity-60"
                  >
                    {isLoading ? 'Submitting...' : 'Submit'}
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
