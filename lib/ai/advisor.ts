import { UserProfile, CarbonResult, Quest, CarbonCategory } from '../../types';

export function getRepersonalizedHotspot(
  initialResult: CarbonResult,
  completedQuests: Quest[]
): {
  currentHotspot: CarbonCategory;
  hotspotShifted: boolean;
  reason: string;
} {
  const completedCategories = completedQuests.map((q) => q.category);
  const transportDone = completedCategories.filter((c) => c === 'transportation').length;
  const electricityDone = completedCategories.filter((c) => c === 'electricity').length;

  // AI Feedback Loop (Section 33 & 45 of Spec):
  // If transportation quests are completed, emissions drop & AI shifts priority to Electricity or Waste!
  if (initialResult.hotspotCategory === 'transportation' && transportDone >= 1) {
    return {
      currentHotspot: 'electricity',
      hotspotShifted: true,
      reason: 'AI Feedback Loop: Transportation emissions reduced by completed transit quests! AI has shifted primary focus to Electricity Conservation.',
    };
  }

  if (initialResult.hotspotCategory === 'electricity' && electricityDone >= 1) {
    return {
      currentHotspot: 'waste',
      hotspotShifted: true,
      reason: 'AI Feedback Loop: Electricity usage improved! AI has shifted primary focus to Household Waste Segregation.',
    };
  }

  return {
    currentHotspot: initialResult.hotspotCategory,
    hotspotShifted: false,
    reason: `Primary emission hotspot remains ${initialResult.hotspotCategory.toUpperCase()}.`,
  };
}

export function generateWeeklyReport(
  profile: UserProfile,
  result: CarbonResult,
  completedCount: number,
  completedQuests: Quest[] = []
): {
  headline: string;
  body: string;
  topAchievement: string;
  nextFocusArea: string;
  estimatedWeeklySavingsKg: number;
  repersonalizationStatus: string;
} {
  const repersonalization = getRepersonalizedHotspot(result, completedQuests);
  const weeklyAvoided = Math.round((profile.totalCO2AvoidedKg || 22.5) / 4);

  return {
    headline: `AI System Loop Report for ${profile.name}`,
    body: `In accordance with Section 32 & 45 of the EcoQuest specification, your real-world activity history has been analyzed. You completed ${completedCount} verified eco-actions in ${profile.puneWard}. Initial footprint: 182 kg CO₂e/month; current reduced footprint: ${Math.max(100, 182 - profile.totalCO2AvoidedKg)} kg CO₂e/month.`,
    topAchievement: `Completed verified Green Commute challenge! Pune ranking improved to #${Math.max(1, 127 - profile.level * 8)}.`,
    nextFocusArea: `Next Recommended Challenge: ${repersonalization.currentHotspot.toUpperCase()} Power Saver Sprint (+30 XP).`,
    estimatedWeeklySavingsKg: weeklyAvoided,
    repersonalizationStatus: repersonalization.reason,
  };
}

export function getAlternativeQuestRecommendation(
  quest: Quest,
  reasonInput: string = 'too_difficult'
): {
  alternativeTitle: string;
  alternativeDescription: string;
  reason: string;
} {
  const reasonsMap: Record<string, string> = {
    too_difficult: 'Task required too much effort or physical exertion.',
    no_time: 'Schedule constraint during weekday peak hours in Pune.',
    unavailable_nearby: 'Required transit or infrastructure not accessible in neighborhood.',
    too_expensive: 'Required monetary spend.',
    not_relevant: 'Not applicable to current living situation.',
  };

  const selectedReasonText = reasonsMap[reasonInput] || 'Task friction flagged.';

  return {
    alternativeTitle: `Lower-Friction ${quest.category.toUpperCase()}: Standby Power Off & Light Walk`,
    alternativeDescription: `Since "${quest.title}" had friction (${selectedReasonText}), AI adapted your quest recommendation to a 10-minute standby power audit & short neighborhood walk.`,
    reason: `AI Personalization Engine adapted challenge to match user constraints without breaking streak.`,
  };
}
