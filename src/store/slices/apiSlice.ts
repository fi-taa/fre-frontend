import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/store/baseQuery';
import type { User, UserCreate, UserUpdate } from '@/types';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Record', 'Event', 'Attendance'],
  endpoints: (builder) => ({
    // Auth endpoints
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

    // User endpoints
    getCurrentUser: builder.query<{ data: User }, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),

    listUsers: builder.query<{ data: User[] }, void>({
      query: () => '/users/',
      providesTags: ['User'],
    }),

    getUser: builder.query<{ data: User }, number>({
      query: (userId) => `/users/${userId}`,
      providesTags: ['User'],
    }),

    createUser: builder.mutation<{ data: User }, UserCreate>({
      query: (body) => ({
        url: '/users/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    createManager: builder.mutation<{ data: User }, { body: UserCreate; department_id: number }>({
      query: ({ body, department_id }) => ({
        url: `/users/admin/create-manager?department_id=${department_id}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    createAdmin: builder.mutation<{ data: User }, { body: UserCreate; department_id: number }>({
      query: ({ body, department_id }) => ({
        url: `/users/super-admin/create-admin?department_id=${department_id}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    updateUser: builder.mutation<{ data: User }, { userId: number; body: UserUpdate }>({
      query: ({ userId, body }) => ({
        url: `/users/${userId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    deleteUser: builder.mutation<void, number>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    deleteAdmin: builder.mutation<void, number>({
      query: (adminId) => ({
        url: `/users/super-admin/admins/${adminId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetCurrentUserQuery,
  useListUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useCreateManagerMutation,
  useCreateAdminMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useDeleteAdminMutation,
} = apiSlice;
