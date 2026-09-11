import { CarbonResult, GreenPersonaTitle } from '../../types';

export interface PersonaProfile {
  title: GreenPersonaTitle;
  description: string;
  recommendedFocus: string;
  badgeTag: string;
}

export function classifyGreenPersona(result: CarbonResult, completedQuestsCount: number): PersonaProfile {
  if (completedQuestsCount < 2) {
    return {
      title: '🌱 Eco Beginner',
      description: 'Starting your sustainability journey across Pune. Ready to take first eco-steps.',
      recommendedFocus: 'Complete 3 simple beginner quests to establish your baseline streak.',
      badgeTag: 'Level 1 Baseline Persona'
    };
  }

  const top = result.breakdown[0];
  if (top.category === 'transportation') {
    return {
      title: '🚌 Green Commuter',
      description: 'Active Pune commuter focusing on low-emission transit (Metro, PMPML, Cycling).',
      recommendedFocus: 'Swap 2 weekly car/bike rides for Metro or cycling challenges.',
      badgeTag: 'Mobility Pioneer'
    };
  } else if (top.category === 'electricity') {
    return {
      title: '⚡ Energy Saver',
      description: 'Focused on reducing home standby power, HVAC energy, and water heating.',
      recommendedFocus: 'Execute household energy audits and smart power cutoffs.',
      badgeTag: 'Grid Optimizer'
    };
  } else if (top.category === 'food') {
    return {
      title: '🥗 Conscious Consumer',
      description: 'Mindful about dietary emissions, local organic sourcing, and plant-based nutrition.',
      recommendedFocus: 'Incorporate vegetarian day challenges and zero-food-waste meals.',
      badgeTag: 'Dietary Defender'
    };
  } else if (top.category === 'waste') {
    return {
      title: '♻️ Waste Warrior',
      description: 'Dedicated to wet/dry waste segregation, zero plastic, and composting.',
      recommendedFocus: 'Maintain 7-day waste segregation and plastic-free challenges.',
      badgeTag: 'Circular Champion'
    };
  }

  return {
    title: '🌍 Balanced Eco',
    description: 'Well-rounded eco-champion maintaining balanced reductions across all 5 carbon categories.',
    recommendedFocus: 'Target Level 4 Eco Guardian and PMC Reward eligibility.',
    badgeTag: 'Holistic Guardian'
  };
}
