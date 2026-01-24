import { getUsers, saveUser, findUserByUsername } from './storage';
import type { User } from '@/types';

const SESSION_KEY = 'currentUser';

export function signUp(username: string, password: string): { success: boolean; error?: string } {
  if (!username || username.trim().length === 0) {
    return { success: false, error: 'Username is required' };
  }

  if (username.trim().length < 3) {
    return { success: false, error: 'Username must be at least 3 characters' };
  }

  if (!password || password.trim().length === 0) {
    return { success: false, error: 'Password is required' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  const existingUser = findUserByUsername(username);
  if (existingUser) {
    return { success: false, error: 'Username already exists' };
  }

  const newUser: User = { username: username.trim(), password };
  saveUser(newUser);
  
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
  }

  return { success: true };
}

export function login(username: string, password: string): { success: boolean; error?: string } {
  if (!username || username.trim().length === 0) {
    return { success: false, error: 'Username is required' };
  }

  if (!password || password.trim().length === 0) {
    return { success: false, error: 'Password is required' };
  }

  const user = findUserByUsername(username);
  if (!user) {
    return { success: false, error: 'Invalid username or password' };
  }

  if (user.password !== password) {
    return { success: false, error: 'Invalid username or password' };
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
