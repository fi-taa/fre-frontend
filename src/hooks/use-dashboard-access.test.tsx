import { render, screen, waitFor } from '@testing-library/react';
import { useDashboardAccess } from '@/hooks/use-dashboard-access';

const replaceMock = vi.fn();
const useSelectorMock = vi.fn();
const useGetCurrentUserQueryMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

vi.mock('react-redux', () => ({
  useSelector: (selector: (state: { auth: { isAuthenticated: boolean } }) => boolean) =>
    useSelectorMock(selector),
}));

vi.mock('@/store/slices/usersApi', () => ({
  useGetCurrentUserQuery: (...args: unknown[]) => useGetCurrentUserQueryMock(...args),
}));

function Harness({ allowedRoles }: { allowedRoles?: Array<'super_admin' | 'admin' | 'manager'> }) {
  const state = useDashboardAccess({ allowedRoles });
  return (
    <div>
      <span data-testid="ready">{String(state.isReady)}</span>
      <span data-testid="allowed">{String(state.isAllowed)}</span>
    </div>
  );
}

describe('useDashboardAccess', () => {
  beforeEach(() => {
    replaceMock.mockReset();
    useSelectorMock.mockReset();
    useGetCurrentUserQueryMock.mockReset();
  });

  it('redirects unauthenticated users to login', async () => {
    useSelectorMock.mockImplementation((selector: (state: { auth: { isAuthenticated: boolean } }) => boolean) =>
      selector({ auth: { isAuthenticated: false } })
    );
    useGetCurrentUserQueryMock.mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    render(<Harness allowedRoles={['super_admin']} />);

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/login'));
  });

  it('redirects authenticated but unauthorized users to dashboard', async () => {
    useSelectorMock.mockImplementation((selector: (state: { auth: { isAuthenticated: boolean } }) => boolean) =>
      selector({ auth: { isAuthenticated: true } })
    );
    useGetCurrentUserQueryMock.mockReturnValue({
      data: { data: { role: 'manager' } },
      isLoading: false,
    });

    render(<Harness allowedRoles={['admin']} />);

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/dashboard'));
    expect(screen.getByTestId('allowed')).toHaveTextContent('false');
  });

  it('allows authorized users and does not redirect', async () => {
    useSelectorMock.mockImplementation((selector: (state: { auth: { isAuthenticated: boolean } }) => boolean) =>
      selector({ auth: { isAuthenticated: true } })
    );
    useGetCurrentUserQueryMock.mockReturnValue({
      data: { data: { role: 'super_admin' } },
      isLoading: false,
    });

    render(<Harness allowedRoles={['super_admin']} />);

    await waitFor(() => expect(screen.getByTestId('allowed')).toHaveTextContent('true'));
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
