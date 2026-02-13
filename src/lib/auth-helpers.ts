import { Dispatch } from '@reduxjs/toolkit';
import { clearAuth } from '@/store/slices/authSlice';
import { usersApi } from '@/store/slices/usersApi';
import { studentsApi } from '@/store/slices/studentsApi';
import { departmentsApi } from '@/store/slices/departmentsApi';
import { attendanceApi } from '@/store/slices/attendanceApi';

export function handleLogout(dispatch: Dispatch) {
  dispatch(clearAuth());
  dispatch(usersApi.util.resetApiState());
  dispatch(studentsApi.util.resetApiState());
  dispatch(departmentsApi.util.resetApiState());
  dispatch(attendanceApi.util.resetApiState());
}
