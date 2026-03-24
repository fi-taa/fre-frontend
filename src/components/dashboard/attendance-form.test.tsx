import { render, screen } from '@testing-library/react';
import { AttendanceForm } from '@/components/dashboard/attendance-form';

vi.mock('@/i18n/I18nProvider', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@/store/slices/departmentsApi', () => ({
  useListDepartmentsQuery: () => ({
    data: [],
    isLoading: false,
  }),
}));

vi.mock('@/store/slices/usersApi', () => ({
  useGetCurrentUserQuery: () => ({
    data: {
      data: {
        role: 'admin',
        department_ids: [1],
      },
    },
  }),
}));

vi.mock('@/store/slices/programsApi', () => ({
  useListProgramsQuery: () => ({
    data: [],
    isLoading: false,
  }),
}));

vi.mock('@/store/slices/attendanceApi', () => ({
  useGetEligibleStudentsQuery: () => ({
    data: [],
    isLoading: false,
  }),
  useCreateAttendanceBatchMutation: () => [
    () => ({ unwrap: async () => undefined }),
    { isLoading: false },
  ],
}));

describe('AttendanceForm', () => {
  it('does not allow manual department ID entry when departments are unavailable', () => {
    render(<AttendanceForm onSuccess={vi.fn()} />);

    expect(screen.getByText('No departments available')).toBeInTheDocument();
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
  });
});
