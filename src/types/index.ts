export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
}

export interface Session {
  userId: string;
  email: string;
  name: string;
}

export interface Profile {
  userId: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  role: string;
  department: string;
  avatarInitials: string;
  updatedAt: string;
}

export type ProjectStatus =
  | 'Planned'
  | 'Pending'
  | 'In Progress'
  | 'Blocked'
  | 'On Hold'
  | 'Completed'
  | 'Cancelled';

export const PROJECT_STATUSES: ProjectStatus[] = [
  'Planned',
  'Pending',
  'In Progress',
  'Blocked',
  'On Hold',
  'Completed',
  'Cancelled',
];

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  supervisor: string;
  createdAt: string;
  updatedAt: string;
}
