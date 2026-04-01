import type { User, Session } from '../types';

const USERS_KEY = 'pm_users';
const SESSION_KEY = 'pm_session';

// ── Password hashing (SHA-256 via Web Crypto API) ──────────────────────────

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ── Users ──────────────────────────────────────────────────────────────────

export function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function registerUser(name: string, email: string, password: string): Promise<User | null> {
  const users = getUsers();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return null; // duplicate
  }
  const hashed = await hashPassword(password);
  const user: User = {
    id: crypto.randomUUID(),
    email,
    password: hashed,
    name,
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, user]);
  return user;
}

export async function loginUser(email: string, password: string): Promise<User | null> {
  const hashed = await hashPassword(password);
  const users = getUsers();
  return users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === hashed,
  ) ?? null;
}

// ── Session ────────────────────────────────────────────────────────────────

export function getSession(): Session | null {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null');
  } catch {
    return null;
  }
}

export function setSession(user: User): void {
  const session: Session = { userId: user.id, email: user.email, name: user.name };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
