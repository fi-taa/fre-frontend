interface User {
  codeId: string;
  password: string;
}

const STORAGE_KEY = 'users';

export function getUsers(): User[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return [];
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveUser(user: User): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const users = getUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function findUserByCodeId(codeId: string): User | undefined {
  const users = getUsers();
  return users.find((user) => user.codeId === codeId);
}
