import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const AUTH_STORAGE_KEY = 'auth_token';

function loadStoredAuth(): { access_token: string | null; token_type: string | null; isAuthenticated: boolean } {
  if (typeof window === 'undefined') {
    return { access_token: null, token_type: null, isAuthenticated: false };
  }
  try {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return { access_token: null, token_type: null, isAuthenticated: false };
    const { access_token, token_type } = JSON.parse(stored);
    if (access_token) return { access_token, token_type: token_type || 'Bearer', isAuthenticated: true };
  } catch {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }
  return { access_token: null, token_type: null, isAuthenticated: false };
}

interface AuthState {
  access_token: string | null;
  token_type: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = loadStoredAuth();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<{ access_token: string; token_type: string }>) => {
      state.access_token = action.payload.access_token;
      state.token_type = action.payload.token_type;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(action.payload));
      }
    },
    clearAuth: (state) => {
      state.access_token = null;
      state.token_type = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      }
    },
  },
});

export const { setAuthToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
