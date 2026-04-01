import type { Profile } from '../types';

function profileKey(userId: string): string {
  return `pm_profile_${userId}`;
}

export function getProfile(userId: string): Profile | null {
  try {
    return JSON.parse(localStorage.getItem(profileKey(userId)) ?? 'null');
  } catch {
    return null;
  }
}

export function saveProfile(profile: Profile): void {
  profile.updatedAt = new Date().toISOString();
  localStorage.setItem(profileKey(profile.userId), JSON.stringify(profile));
}
