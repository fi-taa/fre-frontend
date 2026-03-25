import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/store/baseQuery';
import type { Student, StudentCreate, StudentUpdate } from '@/types';

interface ListStudentsParams {
  skip?: number;
  limit?: number;
  department_id?: number | null;
  category?: 'CHILDREN' | 'ADOLESCENT' | 'YOUTH' | 'ADULT' | null;
}

interface StudentListResponseItem {
  id: number;
  full_name: string;
  name?: string;
  category: 'CHILDREN' | 'ADOLESCENT' | 'YOUTH' | 'ADULT';
  gender: 'MALE' | 'FEMALE';
  dob: string;
  photo_url: string | null;
  department_id: number;
  address: unknown | null;
}

function calculateAge(dob: string): number {
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return Math.max(0, age);
}

export const studentsApi = createApi({
  reducerPath: 'studentsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Student'],
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    createStudent: builder.mutation<Student, StudentCreate>({
      query: (body) => ({
        url: '/students/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Student'],
    }),

    listStudents: builder.query<Student[], ListStudentsParams | void>({
      query: (params) => ({
        url: '/students/',
        params: params ?? undefined,
      }),
      transformResponse: (
        response:
          | StudentListResponseItem[]
          | { data?: StudentListResponseItem[]; items?: StudentListResponseItem[]; results?: StudentListResponseItem[] }
      ): Student[] => {
        const list = Array.isArray(response) ? response : (response.data ?? response.items ?? response.results ?? []);
        return list.map((s) => ({
          id: s.id,
          name: s.full_name || s.name || '',
          age: calculateAge(s.dob),
          sex: s.gender,
          church: null,
          department_id: s.department_id,
          category: s.category,
          category_details: null,
          created_at: undefined,
          updated_at: undefined,
        }));
      },
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
