import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/store/baseQuery';
import type { Department, DepartmentCreate, DepartmentUpdate } from '@/types';

export const departmentsApi = createApi({
  reducerPath: 'departmentsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Department'],
  endpoints: (builder) => ({
    listDepartments: builder.query<Department[], void>({
      query: () => '/departments/',
      providesTags: ['Department'],
    }),

    getDepartment: builder.query<Department, number>({
      query: (departmentId) => `/departments/${departmentId}`,
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
