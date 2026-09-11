export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export function queryEcoQuestAIChat(prompt: string, context: { ward: string; persona: string; xp: number }): string {
  const query = prompt.toLowerCase();

  if (query.includes('commute') || query.includes('bus') || query.includes('metro') || query.includes('transport')) {
    return `🚌 For your commute in ${context.ward}, taking the MahaMetro or PMPML electric buses reduces your trip emissions by up to 80% compared to private petrol cars. You also earn +100 EcoXP for logging 3 commute trips this week!`;
  }
  if (query.includes('waste') || query.includes('segregation') || query.includes('plastic')) {
    return `♻️ PMC (Pune Municipal Corporation) requires separating wet organic waste (green bin) from dry recyclables (blue bin). Segregating at home prevents methane production in landfills and earns you the 'Waste Warrior' badge!`;
  }
  if (query.includes('recipe') || query.includes('food') || query.includes('diet') || query.includes('veg')) {
    return `🥗 High-protein, low-carbon meal idea: Maharashtrian Usal (sprouted moong/matki) with bajra bhakri. Local Pune ingredients have a footprint under 0.6 kg CO₂e per serving!`;
  }
  if (query.includes('xp') || query.includes('level') || query.includes('reward')) {
    return `⭐ You currently have ${context.xp} EcoXP. Keep completing daily quests to reach Level 4 Eco Guardian and unlock the PMC Green Citizen Certificate & MahaMetro bonus points!`;
  }

  return `🌿 As your EcoQuest AI Assistant, I recommend focusing on your biggest emission hotspot in ${context.ward}. Try swapping 1 private vehicle ride for Pune public transport or completing a home energy audit today for bonus XP!`;
}
