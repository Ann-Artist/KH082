export type AgeGroup = 'Child/Teen' | 'Gen Z / Young Adult' | 'Adult' | 'Senior';

export type PuneWard = 
  | 'Kothrud'
  | 'Viman Nagar'
  | 'Baner / Balewadi'
  | 'Deccan Gymkhana'
  | 'Hinjewadi'
  | 'Hadapsar'
  | 'Camp / Koregaon Park'
  | 'Pimpri-Chinchwad (PCMC)'
  | 'Shivajinagar'
  | 'Aundh';

export type GreenPersonaTitle = 
  | 'Eco Beginner'
  | 'Green Explorer'
  | 'Eco Guardian'
  | 'Eco Warrior'
  | 'Planet Champion'
  | 'Green Commuter'
  | 'Energy Saver'
  | 'Waste Warrior'
  | 'Conscious Consumer'
  | 'Balanced Eco'
  | '🌱 Eco Beginner'
  | '🚌 Green Commuter'
  | '⚡ Energy Saver'
  | '♻️ Waste Warrior'
  | '🥗 Conscious Consumer'
  | '🌍 Balanced Eco';

export type CarbonCategory = 'transportation' | 'electricity' | 'food' | 'shopping' | 'waste';

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface CategoryBreakdown {
  category: CarbonCategory;
  name: string;
  amountKg: number;
  percentage: number;
  priority: PriorityLevel;
  icon: string;
}

export interface LifestyleInputs {
  // Transportation
  carKmPerWeek: number;
  bikeKmPerWeek: number;
  busTripsPerWeek: number;
  metroTripsPerWeek: number;
  walkCycleKmPerWeek: number;
  
  // Electricity
  monthlyKwh: number;
  renewablePercentage: number;
  
  // Food
  dietType: 'vegan' | 'vegetarian' | 'balanced' | 'meat_heavy';
  wasteFrequency: 'never' | 'rarely' | 'sometimes' | 'frequently';
  
  // Shopping
  clothingItemsPerMonth: number;
  electronicsPerYear: number;
  generalShoppingLevel: 'low' | 'moderate' | 'high';
  
  // Waste
  plasticUsageLevel: 'low' | 'moderate' | 'high';
  segregatesWaste: boolean;
  compostsOrganic: boolean;
  recyclesPaperMetal: boolean;
}

export interface CarbonResult {
  totalMonthlyKgCO2e: number;
  yearlyBaselineTonnes: number;
  breakdown: CategoryBreakdown[];
  hotspotCategory: CarbonCategory;
  estimatedCO2AvoidedKg: number;
  calculatedAt: string;
}

export type VerificationType = 'level_1_self' | 'level_2_gps' | 'level_3_photo';

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: CarbonCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xpReward: number;
  co2ImpactKg: number;
  verificationType: VerificationType;
  duration: 'Daily' | 'Weekly' | 'Monthly' | 'Special';
  targetAudience?: AgeGroup[];
  icon: string;
  requirementsSummary: string;
}

export type QuestStatus = 'available' | 'active' | 'completed' | 'expired' | 'failed';

export interface UserQuestState {
  questId: string;
  status: QuestStatus;
  acceptedAt?: string;
  completedAt?: string;
  proofId?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: CarbonCategory | 'general';
  requiredXP?: number;
  requiredStreak?: number;
  requiredQuests?: number;
  unlockedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  ageGroup: AgeGroup;
  puneWard: PuneWard;
  collegeOrOrg?: string;
  interests: string[];
  persona: GreenPersonaTitle;
  ecoXP: number;
  level: number;
  levelTitle: string;
  streakDays: number;
  bestStreakDays: number;
  lastActiveDate: string;
  avatarUrl: string;
  completedQuestsCount: number;
  totalCO2AvoidedKg: number;
}

export interface ProofSubmission {
  id: string;
  questId: string;
  questTitle: string;
  userId: string;
  userName: string;
  verificationType: VerificationType;
  submittedAt: string;
  imageUrl?: string;
  gpsRoute?: {
    startLocation: string;
    endLocation: string;
    distanceKm: number;
    durationMinutes: number;
  };
  aiVerdict: 'Approved' | 'Needs Review' | 'Rejected';
  aiConfidence: number;
  aiNotes: string;
  ecoGuardFlagged: boolean;
  ecoGuardReason?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  username: string;
  avatarUrl: string;
  puneWard: PuneWard;
  persona: GreenPersonaTitle;
  level: number;
  ecoXP: number;
  streakDays: number;
  co2AvoidedKg: number;
  isCurrentUser?: boolean;
}

export interface RewardCampaign {
  id: string;
  title: string;
  sponsor: string;
  description: string;
  requiredXP: number;
  requiredActions: number;
  requiredStreak: number;
  rewardValue: string;
  validUntil: string;
  isEligible?: boolean;
}
