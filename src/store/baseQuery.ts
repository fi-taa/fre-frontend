import { fetchBaseQuery, FetchBaseQueryError, BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store/store';
import { setTokens, clearAuth } from './slices/authSlice';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fre-form.onrender.com/api/v1';

export const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const state: unknown = getState();
    if (state && typeof state === 'object' && 'auth' in state) {
      const authState = (state as { auth: { access_token?: string } }).auth;
      const token = authState?.access_token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<FetchArgs | string, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const error = result.error as FetchBaseQueryError;

    if (error.status === 401) {
      const state = api.getState() as RootState;
      const refreshToken = state.auth.refresh_token;

      if (refreshToken) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 401 Error detected, attempting token refresh...');
        }
        try {
          const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (refreshResponse.ok) {
            const data = (await refreshResponse.json()) as {
              access_token: string;
              refresh_token: string;
              token_type: string;
            };

            if (process.env.NODE_ENV === 'development') {
              console.log('✅ Token refresh successful! Retrying original request...');
            }

            api.dispatch(
              setTokens({
                access_token: data.access_token,
                refresh_token: data.refresh_token,
                token_type: data.token_type,
              })
            );

            result = await baseQuery(args, api, extraOptions);
          } else {
            if (process.env.NODE_ENV === 'development') {
              console.log('❌ Token refresh failed, logging out...');
            }
            api.dispatch(clearAuth());
          }
        } catch (err) {
          if (process.env.NODE_ENV === 'development') {
            console.error('❌ Token refresh error:', err);
          }
          api.dispatch(clearAuth());
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log('❌ No refresh token available, logging out...');
        }
        api.dispatch(clearAuth());
      }
    }
  }

  return result;
};
