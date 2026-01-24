import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/store/baseQuery';
import type { User, UserCreate, UserUpdate, Student, StudentCreate, StudentUpdate } from '@/types';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Student', 'Record', 'Event', 'Attendance'],
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

    // Student endpoints
    createStudent: builder.mutation<{ data: Student }, StudentCreate>({
      query: (body) => ({
        url: '/students/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Student'],
    }),

    listStudents: builder.query<{ data: Student[] }, void>({
      query: () => '/students/',
      providesTags: ['Student'],
    }),

    getStudent: builder.query<{ data: Student }, number>({
      query: (studentId) => `/students/${studentId}`,
      providesTags: ['Student'],
    }),

    updateStudent: builder.mutation<{ data: Student }, { studentId: number; body: StudentUpdate }>({
      query: ({ studentId, body }) => ({
        url: `/students/${studentId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Student'],
    }),

    deleteStudent: builder.mutation<void, number>({
      query: (studentId) => ({
        url: `/students/${studentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Student'],
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
  useCreateStudentMutation,
  useListStudentsQuery,
  useGetStudentQuery,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = apiSlice;
