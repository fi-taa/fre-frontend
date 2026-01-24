import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  access_token: string | null;
  token_type: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  access_token: null,
  token_type: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<{ access_token: string; token_type: string }>) => {
      state.access_token = action.payload.access_token;
      state.token_type = action.payload.token_type;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.access_token = null;
      state.token_type = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuthToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
