import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/store/baseQuery';
import type { Program, ProgramCreate } from '@/types';

export interface ListProgramsParams {
  department_id: number;
  include_inactive?: boolean;
}

export const programsApi = createApi({
  reducerPath: 'programsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Program'],
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    listPrograms: builder.query<Program[], ListProgramsParams>({
      query: (params) => ({
        url: '/programs/programs/',
        params: {
          department_id: params.department_id,
          ...(params.include_inactive !== undefined && { include_inactive: params.include_inactive }),
        },
      }),
      transformResponse: (response: Program[] | { data?: Program[] }): Program[] => {
        if (Array.isArray(response)) return response;
        return response.data ?? [];
      },
      providesTags: ['Program'],
    }),

    createProgram: builder.mutation<Program, ProgramCreate>({
      query: (body) => ({
        url: '/programs/programs/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Program'],
    }),
  }),
});

export const { useListProgramsQuery, useCreateProgramMutation } = programsApi;
