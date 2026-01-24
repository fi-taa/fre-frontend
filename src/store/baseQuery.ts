import { fetchBaseQuery, FetchBaseQueryError, BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store/store';

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

    // Handle 401 Unauthorized
    if (error.status === 401) {
      // Token expired or invalid
      api.dispatch({ type: 'auth/clearAuth' });
    }
  }

  return result;
};
