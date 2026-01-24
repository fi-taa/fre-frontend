# RTK Query API Management Setup

This project uses Redux Toolkit Query (RTK Query) for API management and state management.

## Installation

Redux Toolkit and React-Redux have been installed:
```bash
npm install @reduxjs/toolkit react-redux
```

## Directory Structure

```
src/
├── store/
│   ├── store.ts                    # Redux store configuration
│   └── slices/
│       └── apiSlice.ts             # RTK Query API slice
├── providers/
│   └── redux-provider.tsx          # Redux provider component
└── types.ts                        # Type definitions
```

## Setup in Root Layout

Update `src/app/layout.tsx` to include the Redux provider:

```tsx
import { ReduxProvider } from '@/providers/redux-provider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
```

## Available Hooks

### Authentication
- `useSignupMutation()` - Sign up new user
- `useLoginMutation()` - Login user
- `useLogoutMutation()` - Logout user

### Records
- `useGetRecordsQuery(params)` - Get all records with pagination/filtering
- `useGetRecordQuery(id)` - Get specific record
- `useCreateRecordMutation()` - Create new record
- `useUpdateRecordMutation()` - Update record
- `useDeleteRecordMutation()` - Delete record

### Events
- `useGetEventsQuery(params?)` - Get all events
- `useCreateEventMutation()` - Create new event
- `useDeleteEventMutation()` - Delete event

### Attendance
- `useRecordAttendanceMutation()` - Record attendance for multiple records
- `useGetAttendanceQuery(params)` - Get attendance records with filtering
- `useGetRecordAttendanceQuery(params)` - Get attendance history for specific record

## Usage Example

```tsx
'use client';

import { useGetRecordsQuery, useCreateRecordMutation } from '@/store/slices/apiSlice';

export function RecordList() {
  const { data, isLoading, error } = useGetRecordsQuery({
    page: 1,
    limit: 10,
    category: 'ወጣት',
    search: 'john',
  });

  const [createRecord, { isLoading: isCreating }] = useCreateRecordMutation();

  const handleCreate = async () => {
    try {
      const result = await createRecord({
        name: 'John Doe',
        church: 'Holy Trinity',
        age: 25,
        category: 'ወጣት',
      }).unwrap();
      console.log('Record created:', result);
    } catch (error) {
      console.error('Failed to create record:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading records</div>;

  return (
    <div>
      {data?.data.map((record) => (
        <div key={record.id}>{record.name}</div>
      ))}
      <button onClick={handleCreate} disabled={isCreating}>
        Create Record
      </button>
    </div>
  );
}
```

## Environment Variables

Add to `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Key Features

1. **Automatic Caching**: RTK Query automatically caches data
2. **Automatic Refetching**: Configurable refetch strategies
3. **Request Deduplication**: Multiple identical requests only make one API call
4. **Optimistic Updates**: Support for optimistic UI updates
5. **Invalidation**: Automatic cache invalidation on mutations
6. **Type Safety**: Full TypeScript support with generated hooks

## API Configuration

The API slice is configured in `src/store/slices/apiSlice.ts`:
- Base URL: `NEXT_PUBLIC_API_URL` environment variable
- Credentials: Included (for cookies)
- Authorization: Bearer token from sessionStorage
- Tag Types: User, Record, Event, Attendance

## Middleware

RTK Query adds its own middleware to handle:
- Request/response caching
- Background refetching
- Error handling
- Cache invalidation

## Next Steps

1. Update `src/app/layout.tsx` to wrap the app with `ReduxProvider`
2. Replace current localStorage-based data fetching with RTK Query hooks
3. Remove custom data fetching logic from components
4. Use RTK Query hooks for all API calls to the backend

## Documentation

- [RTK Query Docs](https://redux-toolkit.js.org/rtk-query/overview)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [React-Redux Hooks](https://react-redux.js.org/api/hooks)
