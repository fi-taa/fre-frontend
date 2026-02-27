import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/store/baseQuery';
import type {
  AttendanceSession,
  AttendanceSessionListParams,
  AttendanceRecordCreate,
  AttendanceRecordResponse,
  EligibleStudentsParams,
  AttendanceBatchCreate,
  Student,
} from '@/types';

export const attendanceApi = createApi({
  reducerPath: 'attendanceApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['AttendanceSession', 'EligibleStudents'],
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    listAttendanceSessions: builder.query<AttendanceSession[], AttendanceSessionListParams | void>({
      query: (params) => ({
        url: '/attendance/sessions/',
        params: params ?? undefined,
      }),
      transformResponse: (
        response:
          | AttendanceSession[]
          | { data?: AttendanceSession[]; items?: AttendanceSession[]; results?: AttendanceSession[] }
      ): AttendanceSession[] =>
        Array.isArray(response)
          ? response
          : (response.data ?? response.items ?? response.results ?? []),
      providesTags: ['AttendanceSession'],
    }),

    getAttendanceSession: builder.query<AttendanceSession, number>({
      query: (sessionId) => `/attendance/sessions/${sessionId}`,
      providesTags: (_result, _error, sessionId) => [{ type: 'AttendanceSession', id: sessionId }],
    }),

    getEligibleStudents: builder.query<Student[], EligibleStudentsParams>({
      query: (params) => ({
        url: '/attendance/eligible-students/',
        params,
      }),
      transformResponse: (response: unknown): Student[] => {
        const list = Array.isArray(response) ? response : (response as { data?: unknown[] })?.data ?? [];
        return list.map((s: { id: number; full_name?: string; name?: string; [k: string]: unknown }) => ({
          ...s,
          name: s.full_name ?? s.name ?? '',
        })) as Student[];
      },
      providesTags: ['EligibleStudents'],
    }),

    createAttendanceBatch: builder.mutation<string, AttendanceBatchCreate>({
      query: (body) => ({
        url: '/attendance/sessions/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AttendanceSession'],
    }),

    collectAttendance: builder.mutation<
      AttendanceRecordResponse,
      { session_id: number; body: AttendanceRecordCreate }
    >({
      query: ({ session_id, body }) => ({
        url: `/attendance/sessions/${session_id}/collect/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { session_id }) => [
        { type: 'AttendanceSession', id: session_id },
      ],
    }),
  }),
});

export const {
  useListAttendanceSessionsQuery,
  useGetAttendanceSessionQuery,
  useGetEligibleStudentsQuery,
  useCreateAttendanceBatchMutation,
  useCollectAttendanceMutation,
} = attendanceApi;
