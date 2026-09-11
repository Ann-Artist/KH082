import { UserProfile, GreenPersonaTitle } from '../../types';

export const LEVEL_THRESHOLDS = [
  { level: 1, title: 'Eco Seedling', minXP: 0, maxXP: 149 },
  { level: 2, title: 'Green Sprout', minXP: 150, maxXP: 399 },
  { level: 3, title: 'Eco Explorer', minXP: 400, maxXP: 799 },
  { level: 4, title: 'Eco Guardian', minXP: 800, maxXP: 1399 },
  { level: 5, title: 'Eco Warrior', minXP: 1400, maxXP: 2199 },
  { level: 6, title: 'Planet Champion', minXP: 2200, maxXP: 99999 },
];

export function calculateLevelFromXP(xp: number): {
  level: number;
  levelTitle: GreenPersonaTitle;
  currentLevelXP: number;
  nextLevelXP: number;
  progressPercent: number;
} {
  let currentTier = LEVEL_THRESHOLDS[0];
  for (const tier of LEVEL_THRESHOLDS) {
    if (xp >= tier.minXP) {
      currentTier = tier;
    }
  }

  const nextTierIndex = LEVEL_THRESHOLDS.findIndex((t) => t.level === currentTier.level) + 1;
  const nextTier = LEVEL_THRESHOLDS[nextTierIndex] || currentTier;

  const xpInCurrentTier = xp - currentTier.minXP;
  const totalTierRange = Math.max(1, nextTier.minXP - currentTier.minXP);
  const progressPercent = currentTier.level === 6 ? 100 : Math.min(100, Math.round((xpInCurrentTier / totalTierRange) * 100));

  return {
    level: currentTier.level,
    levelTitle: currentTier.title as GreenPersonaTitle,
    currentLevelXP: xpInCurrentTier,
    nextLevelXP: nextTier.minXP - currentTier.minXP,
    progressPercent,
  };
}

export function awardQuestCompletion(profile: UserProfile, xpReward: number, co2SavedKg: number): {
  updatedProfile: UserProfile;
  leveledUp: boolean;
  previousLevel: number;
  newLevel: number;
} {
  const newXP = profile.ecoXP + xpReward;
  const previousLevel = profile.level;
  const levelInfo = calculateLevelFromXP(newXP);
  const leveledUp = levelInfo.level > previousLevel;

  const today = new Date().toISOString().split('T')[0];
  const lastActive = profile.lastActiveDate ? profile.lastActiveDate.split('T')[0] : '';
  
  let newStreak = profile.streakDays;
  if (lastActive !== today) {
    newStreak += 1;
  }

  const updatedProfile: UserProfile = {
    ...profile,
    ecoXP: newXP,
    level: levelInfo.level,
    levelTitle: levelInfo.levelTitle,
    streakDays: newStreak,
    bestStreakDays: Math.max(profile.bestStreakDays, newStreak),
    lastActiveDate: new Date().toISOString(),
    completedQuestsCount: profile.completedQuestsCount + 1,
    totalCO2AvoidedKg: Math.round((profile.totalCO2AvoidedKg + co2SavedKg) * 10) / 10,
  };

  return {
    updatedProfile,
    leveledUp,
    previousLevel,
    newLevel: levelInfo.level,
  };
}
