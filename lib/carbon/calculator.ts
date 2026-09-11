export interface LifestyleInputs {
  carKm: number;
  bikeKm: number;
  busTr: number;
  metroTr: number;
  walkKm?: number;
  kwh: number;
  diet: 'vegan' | 'vegetarian' | 'balanced' | 'meat_heavy';
  clothing?: number;
  segregates: boolean;
  ageGroup?: string;
}

export interface CategoryBreakdown {
  cat: string;
  name: string;
  amt: number;
  pct: number;
  icon: string;
}

export interface CarbonResult {
  total: number;
  yearly: number;
  breakdown: CategoryBreakdown[];
  hotspot: string;
}

export function calculateCarbonFootprint(l: LifestyleInputs): CarbonResult {
  const transport = Math.max(5, (l.carKm * 52 * 0.21 / 12) + (l.bikeKm * 52 * 0.09 / 12) + (l.busTr * 4 * 0.75) + (l.metroTr * 4 * 0.35));
  const electricity = l.kwh * 0.82;
  const food = l.diet === 'vegan' ? 60 : l.diet === 'vegetarian' ? 95 : l.diet === 'meat_heavy' ? 210 : 140;
  const waste = l.segregates ? 20 : 35;
  const shopping = 35;

  const total = Math.round(transport + electricity + food + waste + shopping);
  const yearly = parseFloat((total * 12 / 1000).toFixed(2));

  const breakdown: CategoryBreakdown[] = [
    { cat: 'transportation', name: 'Transportation', amt: Math.round(transport), pct: Math.round((transport / total) * 100), icon: 'directions_car' },
    { cat: 'electricity', name: 'Electricity', amt: Math.round(electricity), pct: Math.round((electricity / total) * 100), icon: 'bolt' },
    { cat: 'food', name: 'Food & Diet', amt: Math.round(food), pct: Math.round((food / total) * 100), icon: 'restaurant' },
    { cat: 'waste', name: 'Waste & Recycling', amt: Math.round(waste + shopping), pct: Math.round(((waste + shopping) / total) * 100), icon: 'delete' },
  ];

  breakdown.sort((a, b) => b.amt - a.amt);
  const hotspot = breakdown[0].cat;

  return { total, yearly, breakdown, hotspot };
}
