import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const AUTH_STORAGE_KEY = 'auth_token';
const REFRESH_TOKEN_STORAGE_KEY = 'refresh_token';

function loadStoredAuth(): {
  access_token: string | null;
  token_type: string | null;
  refresh_token: string | null;
  isAuthenticated: boolean;
} {
  if (typeof window === 'undefined') {
    return { access_token: null, token_type: null, refresh_token: null, isAuthenticated: false };
  }
  try {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
    if (!stored) {
      return { access_token: null, token_type: null, refresh_token: refreshToken, isAuthenticated: false };
    }
    const { access_token, token_type } = JSON.parse(stored);
    if (access_token) {
      return {
        access_token,
        token_type: token_type || 'Bearer',
        refresh_token: refreshToken,
        isAuthenticated: true,
      };
    }
  } catch {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  }
  return { access_token: null, token_type: null, refresh_token: null, isAuthenticated: false };
}

interface AuthState {
  access_token: string | null;
  token_type: string | null;
  refresh_token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = loadStoredAuth();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken: (
      state,
      action: PayloadAction<{ access_token: string; token_type: string; refresh_token?: string }>
    ) => {
      state.access_token = action.payload.access_token;
      state.token_type = action.payload.token_type;
      state.isAuthenticated = true;
      if (action.payload.refresh_token) {
        state.refresh_token = action.payload.refresh_token;
      }
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ access_token: action.payload.access_token, token_type: action.payload.token_type })
        );
        if (action.payload.refresh_token) {
          localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, action.payload.refresh_token);
        }
      }
    },
    setTokens: (
      state,
      action: PayloadAction<{ access_token: string; token_type: string; refresh_token: string }>
    ) => {
      state.access_token = action.payload.access_token;
      state.token_type = action.payload.token_type;
      state.refresh_token = action.payload.refresh_token;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ access_token: action.payload.access_token, token_type: action.payload.token_type })
        );
        localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, action.payload.refresh_token);
      }
    },
    clearAuth: (state) => {
      state.access_token = null;
      state.token_type = null;
      state.refresh_token = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
      }
    },
  },
});

export const { setAuthToken, setTokens, clearAuth } = authSlice.actions;
export default authSlice.reducer;
