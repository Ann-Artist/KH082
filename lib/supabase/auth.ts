import { UserProfile, PuneWard, AgeGroup } from '../../types';
import {
  getStoredUserDatabase,
  saveUserDatabase,
  getStoredSessionToken,
  saveSessionToken,
  clearSessionToken,
  DEFAULT_USER_PROFILE,
} from '../storage';

export interface DatabaseUserRecord {
  id: string;
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  ageGroup: AgeGroup;
  puneWard: PuneWard;
  createdAt: string;
  profile: UserProfile;
}

// Simple deterministic hash for password authentication simulation
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `eq_hash_${Math.abs(hash)}_${password.length}`;
}

export function registerDatabaseUser(
  name: string,
  email: string,
  password: string,
  ward: PuneWard = 'Kothrud',
  ageGroup: AgeGroup = 'Gen Z / Young Adult'
): { success: boolean; error?: string; user?: UserProfile; token?: string } {
  const db = getStoredUserDatabase();
  const normalizedEmail = email.trim().toLowerCase();

  // Check if email already exists in users database table
  const existing = db.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return { success: false, error: 'Account with this email already exists in database.' };
  }

  const userId = `usr_${Date.now()}`;
  const username = name ? name.toLowerCase().replace(/\s+/g, '_') : `citizen_${Math.floor(Math.random() * 1000)}`;

  const newProfile: UserProfile = {
    id: userId,
    name: name || 'Pune Eco Citizen',
    username,
    email: normalizedEmail,
    ageGroup,
    puneWard: ward,
    interests: ['Public Transit', 'Energy Conservation'],
    persona: 'Eco Beginner',
    ecoXP: 0,
    level: 1,
    levelTitle: 'Eco Seedling',
    streakDays: 0,
    bestStreakDays: 0,
    lastActiveDate: new Date().toISOString(),
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    completedQuestsCount: 0,
    totalCO2AvoidedKg: 0,
  };

  const newRecord: DatabaseUserRecord = {
    id: userId,
    name: name || 'Pune Eco Citizen',
    username,
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    ageGroup,
    puneWard: ward,
    createdAt: new Date().toISOString(),
    profile: newProfile,
  };

  db.push(newRecord);
  saveUserDatabase(db);

  // Generate session JWT token
  const token = `eq_jwt_${userId}_${Date.now()}`;
  saveSessionToken(token, newProfile);

  return { success: true, user: newProfile, token };
}

export function loginDatabaseUser(
  email: string,
  password: string
): { success: boolean; error?: string; user?: UserProfile; token?: string } {
  const db = getStoredUserDatabase();
  const normalizedEmail = email.trim().toLowerCase();

  const record = db.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!record) {
    return { success: false, error: 'No account found with this email in database.' };
  }

  const inputHash = hashPassword(password);
  if (record.passwordHash !== inputHash) {
    return { success: false, error: 'Invalid password. Please check your credentials.' };
  }

  const token = `eq_jwt_${record.id}_${Date.now()}`;
  saveSessionToken(token, record.profile);

  return { success: true, user: record.profile, token };
}

export function getCurrentDatabaseSession(): {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
} {
  const tokenData = getStoredSessionToken();
  if (tokenData && tokenData.token && tokenData.user) {
    return {
      user: tokenData.user,
      token: tokenData.token,
      isAuthenticated: true,
    };
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
}

export function logoutDatabaseUser(): void {
  clearSessionToken();
}
