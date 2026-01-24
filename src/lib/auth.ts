import { getUsers, saveUser, findUserByCodeId } from './storage';

const SESSION_KEY = 'currentUser';

export interface User {
  codeId: string;
  password: string;
}

export function generateCodeId(): string {
  return crypto.randomUUID();
}

export function signUp(codeId: string, password: string): { success: boolean; error?: string } {
  if (!password || password.trim().length === 0) {
    return { success: false, error: 'Password is required' };
  }

  const existingUser = findUserByCodeId(codeId);
  if (existingUser) {
    return { success: false, error: 'User with this code already exists' };
  }

  const newUser: User = { codeId, password };
  saveUser(newUser);
  
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
  }

  return { success: true };
}

export function login(codeId: string, password: string): { success: boolean; error?: string } {
  if (!codeId || codeId.trim().length === 0) {
    return { success: false, error: 'Code ID is required' };
  }

  if (!password || password.trim().length === 0) {
    return { success: false, error: 'Password is required' };
  }

  const user = findUserByCodeId(codeId);
  if (!user) {
    return { success: false, error: 'Invalid code ID or password' };
  }

  if (user.password !== password) {
    return { success: false, error: 'Invalid code ID or password' };
  }

  if (typeof window !== 'undefined') {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  return { success: true };
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = sessionStorage.getItem(SESSION_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(SESSION_KEY);
  }
}
