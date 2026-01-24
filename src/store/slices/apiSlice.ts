import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User, Record, Event, Attendance } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Record', 'Event', 'Attendance'],
  endpoints: (builder) => ({
    // Auth endpoints
    signup: builder.mutation<{ success: boolean; user: User }, { username: string; password: string }>({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
    }),

    login: builder.mutation<{ success: boolean; user: User; token: string }, { username: string; password: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

    // Record endpoints
    getRecords: builder.query<
      { success: boolean; data: Record[]; pagination: { page: number; limit: number; total: number; totalPages: number } },
      { page?: number; limit?: number; category?: string; search?: string; sortBy?: string; sortOrder?: string }
    >({
      query: (params) => {
        const queryString = new URLSearchParams();
        if (params.page) queryString.append('page', String(params.page));
        if (params.limit) queryString.append('limit', String(params.limit));
        if (params.category) queryString.append('category', params.category);
        if (params.search) queryString.append('search', params.search);
        if (params.sortBy) queryString.append('sortBy', params.sortBy);
        if (params.sortOrder) queryString.append('sortOrder', params.sortOrder);
        return `/records?${queryString.toString()}`;
      },
      providesTags: ['Record'],
    }),

    getRecord: builder.query<{ success: boolean; data: Record }, string>({
      query: (id) => `/records/${id}`,
      providesTags: ['Record'],
    }),

    createRecord: builder.mutation<{ success: boolean; data: Record }, Partial<Record>>({
      query: (body) => ({
        url: '/records',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Record'],
    }),

    updateRecord: builder.mutation<{ success: boolean; data: Record }, { id: string; body: Partial<Record> }>({
      query: ({ id, body }) => ({
        url: `/records/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Record'],
    }),

    deleteRecord: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/records/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Record'],
    }),

    // Event endpoints
    getEvents: builder.query<{ success: boolean; data: Event[] }, { category?: string } | void>({
      query: (params) => {
        if (!params) return '/events';
        const queryString = new URLSearchParams();
        if (params.category) queryString.append('category', params.category);
        return `/events?${queryString.toString()}`;
      },
      providesTags: ['Event'],
    }),

    createEvent: builder.mutation<{ success: boolean; data: Event }, { name: string; category: string; description?: string }>({
      query: (body) => ({
        url: '/events',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Event'],
    }),

    deleteEvent: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Event'],
    }),

    // Attendance endpoints
    recordAttendance: builder.mutation<
      { success: boolean; data: Attendance[]; count: number },
      {
        eventId: string;
        date: string;
        time?: string;
        records: Array<{ recordId: string; status: 'present' | 'absent' | 'late' | 'excused' }>;
        notes?: string;
      }
    >({
      query: (body) => ({
        url: '/attendance',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Attendance'],
    }),

    getAttendance: builder.query<
      {
        success: boolean;
        data: Attendance[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
      },
      {
        page?: number;
        limit?: number;
        recordId?: string;
        eventId?: string;
        status?: string;
        category?: string;
        date?: string;
        dateFrom?: string;
        dateTo?: string;
        search?: string;
      }
    >({
      query: (params) => {
        const queryString = new URLSearchParams();
        if (params.page) queryString.append('page', String(params.page));
        if (params.limit) queryString.append('limit', String(params.limit));
        if (params.recordId) queryString.append('recordId', params.recordId);
        if (params.eventId) queryString.append('eventId', params.eventId);
        if (params.status) queryString.append('status', params.status);
        if (params.category) queryString.append('category', params.category);
        if (params.date) queryString.append('date', params.date);
        if (params.dateFrom) queryString.append('dateFrom', params.dateFrom);
        if (params.dateTo) queryString.append('dateTo', params.dateTo);
        if (params.search) queryString.append('search', params.search);
        return `/attendance?${queryString.toString()}`;
      },
      providesTags: ['Attendance'],
    }),

    getRecordAttendance: builder.query<
      {
        success: boolean;
        statistics: {
          total: number;
          present: number;
          absent: number;
          late: number;
          excused: number;
          attendanceRate: number;
        };
        data: Attendance[];
      },
      { recordId: string; status?: string; eventId?: string; date?: string }
    >({
      query: ({ recordId, ...params }) => {
        const queryString = new URLSearchParams();
        if (params.status) queryString.append('status', params.status);
        if (params.eventId) queryString.append('eventId', params.eventId);
        if (params.date) queryString.append('date', params.date);
        return `/attendance/record/${recordId}?${queryString.toString()}`;
      },
      providesTags: ['Attendance'],
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetRecordsQuery,
  useGetRecordQuery,
  useCreateRecordMutation,
  useUpdateRecordMutation,
  useDeleteRecordMutation,
  useGetEventsQuery,
  useCreateEventMutation,
  useDeleteEventMutation,
  useRecordAttendanceMutation,
  useGetAttendanceQuery,
  useGetRecordAttendanceQuery,
} = apiSlice;
