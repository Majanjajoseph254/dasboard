import type { Project, ProjectStatus } from '../types';

function projectsKey(userId: string): string {
  return `pm_projects_${userId}`;
}

export function getProjects(userId: string): Project[] {
  try {
    return JSON.parse(localStorage.getItem(projectsKey(userId)) ?? '[]');
  } catch {
    return [];
  }
}

function saveProjects(userId: string, projects: Project[]): void {
  localStorage.setItem(projectsKey(userId), JSON.stringify(projects));
}

export function addProject(
  userId: string,
  data: { name: string; description: string; status: ProjectStatus; supervisor: string },
): Project {
  const projects = getProjects(userId);
  const now = new Date().toISOString();
  const project: Project = {
    id: crypto.randomUUID(),
    userId,
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  saveProjects(userId, [project, ...projects]);
  return project;
}

export function updateProject(userId: string, updated: Project): void {
  const projects = getProjects(userId).map((p) =>
    p.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : p,
  );
  saveProjects(userId, projects);
}

export function deleteProject(userId: string, projectId: string): void {
  const projects = getProjects(userId).filter((p) => p.id !== projectId);
  saveProjects(userId, projects);
}

export function getProjectById(userId: string, projectId: string): Project | null {
  return getProjects(userId).find((p) => p.id === projectId) ?? null;
}
