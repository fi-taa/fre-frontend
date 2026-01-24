import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './slices/authApi';
import { usersApi } from './slices/usersApi';
import { departmentsApi } from './slices/departmentsApi';
import { studentsApi } from './slices/studentsApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [departmentsApi.reducerPath]: departmentsApi.reducer,
    [studentsApi.reducerPath]: studentsApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(usersApi.middleware)
      .concat(departmentsApi.middleware)
      .concat(studentsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
