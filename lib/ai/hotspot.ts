import { CarbonCategory, CarbonResult, CategoryBreakdown } from '../../types';

export function analyzeHotspots(result: CarbonResult): {
  primaryHotspot: CategoryBreakdown;
  secondaryHotspot: CategoryBreakdown;
  prioritySummary: string;
} {
  const sorted = [...result.breakdown].sort((a, b) => b.amountKg - a.amountKg);
  const primary = sorted[0];
  const secondary = sorted[1];

  let prioritySummary = `Your largest carbon emission contributor is ${primary.name} (${primary.amountKg} kg CO₂e/mo, ${primary.percentage}% of total). `;
  
  if (primary.category === 'transportation') {
    prioritySummary += 'Switching personal vehicle trips to Pune Metro or PMPML buses offers your highest reduction potential.';
  } else if (primary.category === 'electricity') {
    prioritySummary += 'Reducing standby power consumption and adopting renewable energy will significantly lower your footprint.';
  } else if (primary.category === 'food') {
    prioritySummary += 'Increasing plant-based meals and curbing food waste is your key area for quick carbon savings.';
  } else if (primary.category === 'waste') {
    prioritySummary += 'Proper waste segregation and plastic avoidance will deliver immediate environmental benefits.';
  } else {
    prioritySummary += 'Mindful consumption and reusing household items can cut your shopping footprint substantially.';
  }

  return {
    primaryHotspot: primary,
    secondaryHotspot: secondary,
    prioritySummary,
  };
}
