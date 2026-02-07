import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/store/baseQuery';
import type {
  AttendanceSession,
  AttendanceSessionCreate,
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
    createAttendanceSession: builder.mutation<
      AttendanceSession,
      { department_id: number; body: AttendanceSessionCreate }
    >({
      query: ({ department_id, body }) => ({
        url: '/attendance/sessions/',
        method: 'POST',
        params: { department_id },
        body,
      }),
      invalidatesTags: ['AttendanceSession'],
    }),

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
      transformResponse: (
        response: Student[] | { data?: Student[]; items?: Student[]; results?: Student[] }
      ): Student[] =>
        Array.isArray(response)
          ? response
          : (response.data ?? response.items ?? response.results ?? []),
      providesTags: ['EligibleStudents'],
    }),

    addSessionRecord: builder.mutation<
      AttendanceRecordResponse,
      { session_id: number; department_id: number; body: AttendanceRecordCreate }
    >({
      query: ({ session_id, department_id, body }) => ({
        url: `/attendance/sessions/${session_id}/records/`,
        method: 'POST',
        params: { department_id },
        body,
      }),
      invalidatesTags: (_result, _error, { session_id }) => [
        { type: 'AttendanceSession', id: session_id },
      ],
    }),

    createAttendanceBatch: builder.mutation<
      string,
      { department_id: number; body: AttendanceBatchCreate }
    >({
      query: ({ department_id, body }) => ({
        url: '/attendance/sessions/batch',
        method: 'POST',
        params: { department_id },
        body,
      }),
      invalidatesTags: ['AttendanceSession'],
    }),

    collectAttendance: builder.mutation<
      AttendanceRecordResponse,
      { session_id: number; department_id: number; body: AttendanceRecordCreate }
    >({
      query: ({ session_id, department_id, body }) => ({
        url: `/attendance/sessions/${session_id}/collect/`,
        method: 'POST',
        params: { department_id },
        body,
      }),
      invalidatesTags: (_result, _error, { session_id }) => [
        { type: 'AttendanceSession', id: session_id },
      ],
    }),
  }),
});

export const {
  useCreateAttendanceSessionMutation,
  useListAttendanceSessionsQuery,
  useGetAttendanceSessionQuery,
  useGetEligibleStudentsQuery,
  useAddSessionRecordMutation,
  useCreateAttendanceBatchMutation,
  useCollectAttendanceMutation,
} = attendanceApi;
