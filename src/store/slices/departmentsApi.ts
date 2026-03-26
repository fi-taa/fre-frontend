import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/store/baseQuery';
import type { Department, DepartmentCreate, DepartmentUpdate } from '@/types';

function normalizeDepartment(department: Department): Department {
  return {
    ...department,
    allowed_student_fields: Array.isArray(department.allowed_student_fields) ? department.allowed_student_fields : [],
  };
}

export const departmentsApi = createApi({
  reducerPath: 'departmentsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Department'],
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    listDepartments: builder.query<Department[], void>({
      query: () => '/departments/',
      transformResponse: (response: Department[] | { data?: Department[]; items?: Department[]; results?: Department[] }) => {
        if (Array.isArray(response)) return response.map(normalizeDepartment);
        return (response.data ?? response.items ?? response.results ?? []).map(normalizeDepartment);
      },
      providesTags: ['Department'],
    }),

    getDepartment: builder.query<Department, number>({
      query: (departmentId) => `/departments/${departmentId}`,
      transformResponse: (response: Department) => normalizeDepartment(response),
      providesTags: ['Department'],
    }),

    createDepartment: builder.mutation<Department, DepartmentCreate>({
      query: (body) => ({
        url: '/departments/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Department'],
    }),

    updateDepartment: builder.mutation<Department, { departmentId: number; body: DepartmentUpdate }>({
      query: ({ departmentId, body }) => ({
        url: `/departments/${departmentId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Department'],
    }),

    deleteDepartment: builder.mutation<void, number>({
      query: (departmentId) => ({
        url: `/departments/${departmentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Department'],
    }),
  }),
});

export const {
  useListDepartmentsQuery,
  useGetDepartmentQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentsApi;
