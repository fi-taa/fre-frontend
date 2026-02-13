import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<
      { access_token: string; token_type: string; refresh_token?: string },
      {
        grant_type?: 'password';
        username: string;
        password: string;
        scope?: string;
        client_id?: string;
        client_secret?: string;
      }
    >({
      query: (body) => {
        const params = new URLSearchParams();
        params.append('grant_type', body.grant_type || 'password');
        params.append('username', body.username);
        params.append('password', body.password);

        if (body.scope) params.append('scope', body.scope);
        if (body.client_id) params.append('client_id', body.client_id);
        if (body.client_secret) params.append('client_secret', body.client_secret);

        return {
          url: '/auth/login',
          method: 'POST',
          body: params.toString(),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        };
      },
    }),
    refreshToken: builder.mutation<
      { access_token: string; refresh_token: string; token_type: string },
      { refresh_token: string }
    >({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation } = authApi;
