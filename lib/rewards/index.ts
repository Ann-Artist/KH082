import { UserProfile, RewardCampaign } from '../../types';
import campaignsData from '../../data/rewards.json';

export function getEvaluatedRewardCampaigns(user: UserProfile): RewardCampaign[] {
  return (campaignsData as RewardCampaign[]).map((camp) => {
    const isEligible =
      user.ecoXP >= camp.requiredXP &&
      user.completedQuestsCount >= camp.requiredActions &&
      user.streakDays >= camp.requiredStreak;

    return {
      ...camp,
      isEligible,
    };
  });
}
