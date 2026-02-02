import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/store/baseQuery';
import type { Student, StudentCreate, StudentUpdate } from '@/types';

export const studentsApi = createApi({
  reducerPath: 'studentsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Student'],
  endpoints: (builder) => ({
    createStudent: builder.mutation<Student, StudentCreate>({
      query: (body) => ({
        url: '/students/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Student'],
    }),

    listStudents: builder.query<Student[], void>({
      query: () => '/students/',
      providesTags: ['Student'],
    }),

    getStudent: builder.query<Student, number>({
      query: (studentId) => `/students/${studentId}`,
      providesTags: ['Student'],
    }),

    updateStudent: builder.mutation<Student, { studentId: number; body: StudentUpdate }>({
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
  useCreateStudentMutation,
  useListStudentsQuery,
  useGetStudentQuery,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentsApi;
