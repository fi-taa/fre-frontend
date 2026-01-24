import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/store/baseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<
      { access_token: string; token_type: string },
      {
        grant_type?: 'password';
        username: string;
        password: string;
        scope?: string;
        client_id?: string;
        client_secret?: string;
      }
    >({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
