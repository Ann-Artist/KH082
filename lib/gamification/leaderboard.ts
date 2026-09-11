import { LeaderboardEntry, PuneWard, UserProfile } from '../../types';

export const SEEDED_PUNE_WARRIORS: Omit<LeaderboardEntry, 'rank'>[] = [
  {
    userId: 'pune_user_1',
    name: 'Aria Deshmukh',
    username: 'Aria_Leaf',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    puneWard: 'Kothrud',
    persona: 'Planet Champion',
    level: 6,
    ecoXP: 2450,
    streakDays: 18,
    co2AvoidedKg: 64,
  },
  {
    userId: 'pune_user_2',
    name: 'Rohan Joshi',
    username: 'Rohan_Cycle',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    puneWard: 'Viman Nagar',
    persona: 'Eco Warrior',
    level: 5,
    ecoXP: 1820,
    streakDays: 14,
    co2AvoidedKg: 48,
  },
  {
    userId: 'pune_user_3',
    name: 'Priya Kulkarni',
    username: 'Priya_Green',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    puneWard: 'Baner / Balewadi',
    persona: 'Eco Warrior',
    level: 5,
    ecoXP: 1560,
    streakDays: 12,
    co2AvoidedKg: 41,
  },
  {
    userId: 'pune_user_4',
    name: 'Aditya Patil',
    username: 'Adi_Metro',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    puneWard: 'Deccan Gymkhana',
    persona: 'Eco Guardian',
    level: 4,
    ecoXP: 1120,
    streakDays: 9,
    co2AvoidedKg: 32,
  },
  {
    userId: 'pune_user_5',
    name: 'Ananya Shinde',
    username: 'Ananya_Solar',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    puneWard: 'Hinjewadi',
    persona: 'Eco Guardian',
    level: 4,
    ecoXP: 980,
    streakDays: 7,
    co2AvoidedKg: 28,
  },
  {
    userId: 'pune_user_6',
    name: 'Vikram Mehta',
    username: 'Vikram_Recycle',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    puneWard: 'Aundh',
    persona: 'Green Explorer',
    level: 3,
    ecoXP: 640,
    streakDays: 5,
    co2AvoidedKg: 19,
  },
  {
    userId: 'pune_user_7',
    name: 'Tanvi Pawar',
    username: 'Tanvi_Plant',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    puneWard: 'Kothrud',
    persona: 'Green Explorer',
    level: 3,
    ecoXP: 510,
    streakDays: 4,
    co2AvoidedKg: 15,
  },
];

export function getPuneLeaderboard(
  currentUser: UserProfile,
  filterScope: 'city' | 'ward' | 'friends' = 'city'
): { entries: LeaderboardEntry[]; currentUserRank: number } {
  let rawList: Omit<LeaderboardEntry, 'rank'>[] = [...SEEDED_PUNE_WARRIORS];

  // Insert or update current user in the leaderboard array
  const existingIdx = rawList.findIndex((u) => u.userId === currentUser.id);
  const currentUserItem: Omit<LeaderboardEntry, 'rank'> = {
    userId: currentUser.id,
    name: currentUser.name,
    username: currentUser.username,
    avatarUrl: currentUser.avatarUrl,
    puneWard: currentUser.puneWard,
    persona: currentUser.persona,
    level: currentUser.level,
    ecoXP: currentUser.ecoXP,
    streakDays: currentUser.streakDays,
    co2AvoidedKg: currentUser.totalCO2AvoidedKg,
    isCurrentUser: true,
  };

  if (existingIdx >= 0) {
    rawList[existingIdx] = currentUserItem;
  } else {
    rawList.push(currentUserItem);
  }

  // Filter if ward scope selected
  if (filterScope === 'ward') {
    rawList = rawList.filter((u) => u.puneWard === currentUser.puneWard || u.isCurrentUser);
  } else if (filterScope === 'friends') {
    // Top active eco warriors as friends
    rawList = rawList.slice(0, 5);
  }

  // Sort descending by ecoXP
  rawList.sort((a, b) => b.ecoXP - a.ecoXP);

  // Assign ranks
  const entries: LeaderboardEntry[] = rawList.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  const userEntry = entries.find((e) => e.isCurrentUser);
  const currentUserRank = userEntry ? userEntry.rank : entries.length;

  return {
    entries,
    currentUserRank,
  };
}
