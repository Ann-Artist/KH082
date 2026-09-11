import { UserProfile, CarbonResult, LifestyleInputs, UserQuestState, ProofSubmission, Quest } from '../../types';
import { calculateCarbonFootprint } from '../carbon/engine';
import { classifyGreenPersona } from '../ai/persona';
import seededQuests from '../../data/quests.json';

const STORAGE_KEYS = {
  USER_DATABASE: 'ecoquest_db_users_table',
  SESSION_TOKEN: 'ecoquest_db_session_token',
  USER_PROFILE: 'ecoquest_user_profile',
  CARBON_RESULT: 'ecoquest_carbon_result',
  LIFESTYLE_INPUTS: 'ecoquest_lifestyle_inputs',
  USER_QUEST_STATES: 'ecoquest_user_quest_states',
  PROOF_SUBMISSIONS: 'ecoquest_proof_submissions',
  CUSTOM_QUESTS: 'ecoquest_custom_quests',
};

export const DEFAULT_LIFESTYLE_INPUTS: LifestyleInputs = {
  carKmPerWeek: 45,
  bikeKmPerWeek: 30,
  busTripsPerWeek: 6,
  metroTripsPerWeek: 4,
  walkCycleKmPerWeek: 8,
  monthlyKwh: 190,
  renewablePercentage: 0,
  dietType: 'balanced',
  wasteFrequency: 'sometimes',
  clothingItemsPerMonth: 2,
  electronicsPerYear: 1,
  generalShoppingLevel: 'moderate',
  plasticUsageLevel: 'moderate',
  segregatesWaste: true,
  compostsOrganic: false,
  recyclesPaperMetal: true,
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'user_pune_zero_baseline',
  name: 'Aarav Sharma',
  username: 'Aarav_Eco',
  email: 'aarav.sharma@pune.edu.in',
  ageGroup: 'Gen Z / Young Adult',
  puneWard: 'Kothrud',
  collegeOrOrg: 'COEP Technological University, Pune',
  interests: ['Public Transport', 'Tree Plantation', 'Energy Conservation'],
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

// --- Database Table Helpers ---
export function getStoredUserDatabase(): any[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEYS.USER_DATABASE);
  if (raw) return JSON.parse(raw);

  // Seed default admin and sample demo user records in database table
  const defaultDB = [
    {
      id: 'usr_admin',
      name: 'EcoQuest Admin',
      username: 'admin',
      email: 'admin@ecoquest.pune',
      passwordHash: 'eq_hash_123456_admin2026',
      ageGroup: 'Adult',
      puneWard: 'Shivajinagar',
      createdAt: new Date().toISOString(),
      profile: {
        ...DEFAULT_USER_PROFILE,
        id: 'usr_admin',
        name: 'EcoQuest Admin',
        username: 'admin',
        email: 'admin@ecoquest.pune',
      },
    },
    {
      id: 'user_pune_zero_baseline',
      name: 'Aarav Sharma',
      username: 'aarav_eco',
      email: 'aarav.sharma@pune.edu.in',
      passwordHash: 'eq_hash_987654_aarav2026',
      ageGroup: 'Gen Z / Young Adult',
      puneWard: 'Kothrud',
      createdAt: new Date().toISOString(),
      profile: DEFAULT_USER_PROFILE,
    },
  ];

  localStorage.setItem(STORAGE_KEYS.USER_DATABASE, JSON.stringify(defaultDB));
  return defaultDB;
}

export function saveUserDatabase(db: any[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USER_DATABASE, JSON.stringify(db));
  }
}

export function getStoredSessionToken(): { token: string; user: UserProfile } | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
  return raw ? JSON.parse(raw) : null;
}

export function saveSessionToken(token: string, user: UserProfile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, JSON.stringify({ token, user }));
    saveUserProfile(user);
  }
}

export function clearSessionToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
    saveUserProfile(DEFAULT_USER_PROFILE);
  }
}

export function getStoredLifestyleInputs(): LifestyleInputs {
  if (typeof window === 'undefined') return DEFAULT_LIFESTYLE_INPUTS;
  const raw = localStorage.getItem(STORAGE_KEYS.LIFESTYLE_INPUTS);
  return raw ? JSON.parse(raw) : DEFAULT_LIFESTYLE_INPUTS;
}

export function saveLifestyleInputs(inputs: LifestyleInputs): { result: CarbonResult; profile: UserProfile } {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.LIFESTYLE_INPUTS, JSON.stringify(inputs));
  }

  const result = calculateCarbonFootprint(inputs);
  saveCarbonResult(result);

  const profile = getStoredUserProfile();
  const personaInfo = classifyGreenPersona(result, profile.ecoXP);

  const updatedProfile: UserProfile = {
    ...profile,
    persona: personaInfo.title,
  };

  saveUserProfile(updatedProfile);

  return { result, profile: updatedProfile };
}

export function getStoredCarbonResult(): CarbonResult {
  const inputs = getStoredLifestyleInputs();
  if (typeof window === 'undefined') return calculateCarbonFootprint(inputs);
  const raw = localStorage.getItem(STORAGE_KEYS.CARBON_RESULT);
  return raw ? JSON.parse(raw) : calculateCarbonFootprint(inputs);
}

export function saveCarbonResult(result: CarbonResult): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.CARBON_RESULT, JSON.stringify(result));
  }
}

export function getStoredUserProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_USER_PROFILE;
  const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  return raw ? JSON.parse(raw) : DEFAULT_USER_PROFILE;
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));

    // Sync profile to database table
    const db = getStoredUserDatabase();
    const index = db.findIndex((u) => u.id === profile.id || u.email === profile.email);
    if (index >= 0) {
      db[index].profile = profile;
      saveUserDatabase(db);
    }
  }
}

export function getUserQuestStateKey(userId?: string): string {
  const uid = userId || getStoredUserProfile()?.id || 'default_user';
  return `${STORAGE_KEYS.USER_QUEST_STATES}_${uid}`;
}

export function getStoredQuestStates(userId?: string): Record<string, UserQuestState> {
  if (typeof window === 'undefined') return {};
  const key = getUserQuestStateKey(userId);
  const raw = localStorage.getItem(key);
  const states: Record<string, UserQuestState> = raw ? JSON.parse(raw) : {};

  // Check for daily quest resets across days
  const todayStr = new Date().toISOString().split('T')[0];
  let changed = false;

  const allQ = getAllQuests();
  allQ.forEach((q) => {
    if (q.duration === 'Daily' && states[q.id]?.status === 'completed') {
      const completedDate = states[q.id]?.completedAt ? states[q.id].completedAt!.split('T')[0] : '';
      if (completedDate && completedDate !== todayStr) {
        // Daily quest from a previous day -> reset to available for today's fresh cycle
        delete states[q.id];
        changed = true;
      }
    }
  });

  if (changed) {
    saveQuestStates(states, userId);
  }

  return states;
}

export function saveQuestStates(states: Record<string, UserQuestState>, userId?: string): void {
  if (typeof window !== 'undefined') {
    const key = getUserQuestStateKey(userId);
    localStorage.setItem(key, JSON.stringify(states));
  }
}

export function getStoredProofSubmissions(userId?: string): ProofSubmission[] {
  if (typeof window === 'undefined') return [];
  const uid = userId || getStoredUserProfile()?.id || 'default_user';
  const key = `${STORAGE_KEYS.PROOF_SUBMISSIONS}_${uid}`;
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

export function saveProofSubmissions(submissions: ProofSubmission[], userId?: string): void {
  if (typeof window !== 'undefined') {
    const uid = userId || getStoredUserProfile()?.id || 'default_user';
    const key = `${STORAGE_KEYS.PROOF_SUBMISSIONS}_${uid}`;
    localStorage.setItem(key, JSON.stringify(submissions));
  }
}

export function getCustomQuests(): Quest[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTS);
  return raw ? JSON.parse(raw) : [];
}

export function saveCustomQuest(quest: Quest): void {
  const current = getCustomQuests();
  const updated = [quest, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTS, JSON.stringify(updated));
  }
}

export function getAllQuests(): Quest[] {
  const custom = getCustomQuests();
  return [...(seededQuests as Quest[]), ...custom];
}

export function resetDemoState(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.CARBON_RESULT);
    localStorage.removeItem(STORAGE_KEYS.LIFESTYLE_INPUTS);
    localStorage.removeItem(STORAGE_KEYS.USER_QUEST_STATES);
    localStorage.removeItem(STORAGE_KEYS.PROOF_SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_QUESTS);
  }
}
