import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/server';

const API_URL = 'https://fre-form.onrender.com/api/v1';

function createStorageMock() {
  const storage = new Map<string, string>();
  return {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.set(key, value);
    },
    removeItem: (key: string) => {
      storage.delete(key);
    },
    clear: () => {
      storage.clear();
    },
  };
}

async function createTestStore() {
  const authModule = await import('@/store/slices/authSlice');
  const usersApiModule = await import('@/store/slices/usersApi');
  const authReducer = authModule.default;
  const { usersApi } = usersApiModule;

  return configureStore({
    reducer: {
      auth: authReducer,
      [usersApi.reducerPath]: usersApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(usersApi.middleware),
  });
}

describe('baseQueryWithReauth integration', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createStorageMock());
    vi.stubGlobal('sessionStorage', createStorageMock());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('clears auth state on 401 when no refresh token is available', async () => {
    const authModule = await import('@/store/slices/authSlice');
    const usersApiModule = await import('@/store/slices/usersApi');
    const { setTokens } = authModule;
    const { usersApi } = usersApiModule;

    server.use(http.get(`${API_URL}/users/me`, () => new HttpResponse(null, { status: 401 })));

    const store = await createTestStore();
    store.dispatch(
      setTokens({
        access_token: 'expired-token',
        refresh_token: '',
        token_type: 'Bearer',
      })
    );

    await store.dispatch(usersApi.endpoints.getCurrentUser.initiate()).unwrap().catch(() => undefined);

    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.access_token).toBeNull();
  });

  it('does not clear auth state on 403 forbidden responses', async () => {
    const authModule = await import('@/store/slices/authSlice');
    const usersApiModule = await import('@/store/slices/usersApi');
    const { setTokens } = authModule;
    const { usersApi } = usersApiModule;

    server.use(http.get(`${API_URL}/users/me`, () => new HttpResponse(null, { status: 403 })));

    const store = await createTestStore();
    store.dispatch(
      setTokens({
        access_token: 'valid-token',
        refresh_token: 'refresh-token',
        token_type: 'Bearer',
      })
    );

    await store.dispatch(usersApi.endpoints.getCurrentUser.initiate()).unwrap().catch(() => undefined);

    expect(store.getState().auth.isAuthenticated).toBe(true);
    expect(store.getState().auth.access_token).toBe('valid-token');
  });
});
