import { CarbonResult } from './calculator';

export interface HotspotAnalysis {
  primaryHotspot: string;
  categoryName: string;
  percentage: number;
  insight: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

export function analyzeHotspot(result: CarbonResult): HotspotAnalysis {
  const top = result.breakdown[0];
  let insight = '';
  if (top.cat === 'transportation') {
    insight = '🚗 Your biggest carbon hotspot is transportation. Replacing private vehicle trips with Pune Metro or PMPML buses could drop your footprint by up to 25%.';
  } else if (top.cat === 'electricity') {
    insight = '⚡ Your main emissions stem from household electricity consumption. Swapping standby devices and optimizing water heating energy will have immediate impact.';
  } else if (top.cat === 'food') {
    insight = '🥗 Food emissions represent your top carbon category. Shifting 2 meals per week to plant-based choices will reduce your footprint significantly.';
  } else {
    insight = '♻️ Waste management is your key focus area. Segregating wet and dry waste consistently reduces municipal landfill methane.';
  }

  return {
    primaryHotspot: top.cat,
    categoryName: top.name,
    percentage: top.pct,
    insight,
    severity: top.pct > 40 ? 'HIGH' : top.pct > 25 ? 'MEDIUM' : 'LOW'
  };
}
