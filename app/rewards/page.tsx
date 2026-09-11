'use client';

import React, { useState } from 'react';
import { UserProfile, RewardCampaign } from '@/types';
import { getStoredUserProfile } from '../../lib/storage';
import { GlassCard } from '../../components/ui/GlassCard';

export default function RewardsPage(props: any) {
  const user = props?.user || getStoredUserProfile();
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
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Reward Campaign Simulation</h1>
        <p className="text-xs text-gray-600 font-medium">Simulated Pune municipal & green partner incentive campaigns.</p>
      </div>

      {/* Campaign Cards List */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((camp) => {
          const isClaimed = claimedCampaigns[camp.id];

          return (
            <GlassCard key={camp.id} glow={camp.isEligible} className="flex flex-col justify-between p-6">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 font-mono text-xs font-bold text-amber-700">
                    {camp.rewardValue}
                  </span>
                  <span className="text-[11px] font-mono text-gray-500 font-medium">Valid: {camp.validUntil}</span>
                </div>

                <h3 className="text-base font-extrabold text-gray-900">{camp.title}</h3>
                <p className="mt-1 font-mono text-xs text-emerald-700 font-bold">Sponsor: {camp.sponsor}</p>
                <p className="mt-3 text-xs text-gray-600 leading-relaxed font-medium">{camp.description}</p>

                {/* Requirements Progress */}
                <div className="mt-5 space-y-2 rounded-2xl border border-gray-200 bg-gray-50 p-3 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">EcoXP ({camp.requiredXP} XP):</span>
                    <span className={user.ecoXP >= camp.requiredXP ? 'text-emerald-700 font-extrabold' : 'text-rose-600 font-bold'}>
                      {user.ecoXP} / {camp.requiredXP}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Streak ({camp.requiredStreak} Days):</span>
                    <span className={user.streakDays >= camp.requiredStreak ? 'text-emerald-700 font-extrabold' : 'text-rose-600 font-bold'}>
                      {user.streakDays} / {camp.requiredStreak}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-gray-100">
                {isClaimed ? (
                  <div className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 py-3 text-xs font-bold text-emerald-700">
                    <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
                    <span>Reward Voucher Claimed!</span>
                  </div>
                ) : camp.isEligible ? (
                  <button
                    onClick={() => handleClaim(camp.id)}
                    className="w-full rounded-xl bg-[#111827] py-3 text-xs font-bold text-white hover:bg-black transition-all shadow-sm"
                  >
                    🎁 Claim Reward Voucher
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full rounded-xl border border-gray-200 bg-gray-100 py-3 text-xs font-bold text-gray-400 cursor-not-allowed"
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
}
