export interface QuestItem {
  id: string;
  title: string;
  category: string;
  icon: string;
  xp: number;
  co2: number;
  type: string;
  desc: string;
  proof: string;
}

export interface UserPayload {
  ageGroup: string;
  location: string;
  carbonFootprint: number;
  hotspotCat: string;
  ecoXP: number;
  streak: number;
  completedQuests: number;
}

export function generateAIRecommendations(payload: UserPayload): string[] {
  const recs: string[] = [];

  if (payload.hotspotCat === 'transportation') {
    recs.push('🚌 Take PMPML Bus or MahaMetro twice this week to cut your top carbon hotspot by ~9 kg CO₂e.');
    recs.push('🚲 Log 1 cycle commute trip on Hinjewadi/Kothrud routes for bonus +80 XP.');
  } else if (payload.hotspotCat === 'electricity') {
    recs.push('💡 Execute a 24-hour unnecessary standby device shutdown challenge.');
    recs.push('🚿 Take cold showers in the morning to save ~0.8 kg CO₂e water heating energy per day.');
  } else if (payload.hotspotCat === 'food') {
    recs.push('🥗 Complete a zero-food-waste meal challenge for +70 XP.');
    recs.push('🌿 Choose a fully vegetarian diet day today to save ~3.2 kg CO₂e.');
  } else {
    recs.push('♻️ Segregate wet organic and dry recyclable waste for 3 consecutive days.');
    recs.push('🛍️ Execute a Zero Plastic day challenge using cloth bags.');
  }

  if (payload.streak < 3) {
    recs.push('🔥 Build a 3-day action streak to unlock +50 XP bonus multipliers!');
  }

  return recs;
}

export function swapQuestCanNotDo(rejectedQuest: QuestItem, allQuests: QuestItem[]): QuestItem[] {
  // Find alternatives in same or lower friction category
  const alternatives = allQuests.filter(q => q.id !== rejectedQuest.id);
  
  if (rejectedQuest.category === 'transportation') {
    // If cycling is rejected, offer bus/metro or walking
    return alternatives.filter(q => q.id === 'q1' || q.id === 'q2');
  } else if (rejectedQuest.category === 'electricity') {
    return alternatives.filter(q => q.id === 'q6' || q.id === 'q9');
  } else if (rejectedQuest.category === 'waste' || rejectedQuest.category === 'greenery') {
    return alternatives.filter(q => q.id === 'q5' || q.id === 'q2');
  }

  return alternatives.slice(0, 2);
}
