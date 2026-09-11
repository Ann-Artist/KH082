'use client';

import React, { useState } from 'react';
import { UserProfile, RewardCampaign } from '@/types';
import { getStoredUserProfile } from '../../lib/storage';
import { GlassCard } from '../../components/ui/GlassCard';

interface RewardsPageProps {
  user?: UserProfile;
}

const RewardsPage: React.FC<RewardsPageProps> = ({ user: propUser }) => {
  const user = propUser || getStoredUserProfile();
  const [claimedCampaigns, setClaimedCampaigns] = useState<Record<string, boolean>>({});

  const campaigns: RewardCampaign[] = [
    {
      id: 'camp_pune_green_october',
      title: 'Pune Green October Citizen Campaign',
      sponsor: 'PMC & Pune Green Foundation',
      description: 'Complete 10 verified eco-quests + earn 500 EcoXP + maintain a 7-day streak to claim the Green Citizen E-Certificate & Bus Pass Voucher.',
      requiredXP: 500,
      requiredActions: 5,
      requiredStreak: 7,
      rewardValue: 'Pune Bus Pass 20% Discount + Certificate',
      validUntil: '31 Oct 2026',
      isEligible: user.ecoXP >= 500 && user.completedQuestsCount >= 5 && user.streakDays >= 7,
    },
    {
      id: 'camp_tree_pune_champion',
      title: 'Deccan Tree Guardian Campaign',
      sponsor: 'Pune Urban Forest Cell',
      description: 'Plant or care for at least 2 saplings in Pune and reach Level 3 Green Explorer status.',
      requiredXP: 400,
      requiredActions: 2,
      requiredStreak: 3,
      rewardValue: 'Free Native Sapling Kit & Organic Fertilizer',
      validUntil: '15 Nov 2026',
      isEligible: user.level >= 3,
    },
    {
      id: 'camp_metro_warrior',
      title: 'Pune Metro Eco Commuter Rewards',
      sponsor: 'MahaMetro Pune',
      description: 'Log 5 verified Metro trips using Level 2 GPS verification.',
      requiredXP: 750,
      requiredActions: 5,
      requiredStreak: 5,
      rewardValue: 'Pune Metro Card 50 Bonus Points',
      validUntil: '30 Nov 2026',
      isEligible: user.ecoXP >= 750,
    },
  ];

  const handleClaim = (campaignId: string) => {
    setClaimedCampaigns({ ...claimedCampaigns, [campaignId]: true });
  };

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Header */}
      <div>
        <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-white">Reward Campaign Simulation</h1>
        <p className="text-xs text-[#bccabb]">Simulated Pune municipal & green partner incentive campaigns.</p>
      </div>

      {/* Campaign Cards List */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((camp) => {
          const isClaimed = claimedCampaigns[camp.id];

          return (
            <GlassCard key={camp.id} glow={camp.isEligible} className="flex flex-col justify-between p-6">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full border border-[#ffd23f]/30 bg-[#ffd23f]/10 px-2.5 py-0.5 font-mono text-xs font-bold text-[#ffd23f]">
                    {camp.rewardValue}
                  </span>
                  <span className="text-[11px] font-mono text-[#bccabb]">Valid: {camp.validUntil}</span>
                </div>

                <h3 className="font-title-md text-base font-bold text-white">{camp.title}</h3>
                <p className="mt-1 font-mono text-xs text-[#6bfb9a]">Sponsor: {camp.sponsor}</p>
                <p className="mt-3 text-xs text-[#bccabb] leading-relaxed">{camp.description}</p>

                {/* Requirements Progress */}
                <div className="mt-5 space-y-2 rounded-2xl border border-white/5 bg-black/30 p-3 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#bccabb]">EcoXP ({camp.requiredXP} XP):</span>
                    <span className={user.ecoXP >= camp.requiredXP ? 'text-[#6bfb9a] font-bold' : 'text-red-400'}>
                      {user.ecoXP} / {camp.requiredXP}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#bccabb]">Streak ({camp.requiredStreak} Days):</span>
                    <span className={user.streakDays >= camp.requiredStreak ? 'text-[#6bfb9a] font-bold' : 'text-red-400'}>
                      {user.streakDays} / {camp.requiredStreak}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-white/5">
                {isClaimed ? (
                  <div className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 py-3 text-xs font-bold text-emerald-400">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    <span>Reward Voucher Claimed!</span>
                  </div>
                ) : camp.isEligible ? (
                  <button
                    onClick={() => handleClaim(camp.id)}
                    className="w-full rounded-xl bg-[#6bfb9a] py-3 text-xs font-bold text-[#003919] hover:bg-[#59e68a] transition-all"
                  >
                    🎁 Claim Reward Voucher
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-bold text-[#bccabb] cursor-not-allowed opacity-60"
                  >
                    🔒 Requirements Pending
                  </button>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

export default RewardsPage;
