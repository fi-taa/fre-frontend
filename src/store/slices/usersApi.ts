import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/store/baseQuery';
import type { User, UserCreate, UserUpdate } from '@/types';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
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
  useGetCurrentUserQuery,
  useListUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useCreateManagerMutation,
  useCreateAdminMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useDeleteAdminMutation,
} = usersApi;
