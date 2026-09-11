import { CarbonResult, CategoryBreakdown, LifestyleInputs, CarbonCategory } from '../../types';
import emissionFactors from '../../data/emission-factors.json';

export function calculateCarbonFootprint(inputs: LifestyleInputs): CarbonResult {
  // 1. Transportation
  const carCO2 = inputs.carKmPerWeek * 52 * emissionFactors.transportation.carKgCO2ePerKm / 12;
  const bikeCO2 = inputs.bikeKmPerWeek * 52 * emissionFactors.transportation.bikeKgCO2ePerKm / 12;
  const busCO2 = inputs.busTripsPerWeek * 4 * emissionFactors.transportation.busKgCO2ePerTrip;
  const metroCO2 = inputs.metroTripsPerWeek * 4 * emissionFactors.transportation.metroKgCO2ePerTrip;
  const walkOffset = inputs.walkCycleKmPerWeek * 52 * emissionFactors.transportation.walkCycleOffsetPerKm / 12;
  
  const transportTotal = Math.max(5, (carCO2 + bikeCO2 + busCO2 + metroCO2) - walkOffset);

  // 2. Electricity
  const renewableRatio = inputs.renewablePercentage / 100;
  const electricityTotal = inputs.monthlyKwh * emissionFactors.electricity.kgCO2ePerKwh * (1 - renewableRatio);

  // 3. Food
  let foodBase = emissionFactors.food.balancedBaseKg;
  if (inputs.dietType === 'vegan') foodBase = emissionFactors.food.veganBaseKg;
  if (inputs.dietType === 'vegetarian') foodBase = emissionFactors.food.vegetarianBaseKg;
  if (inputs.dietType === 'meat_heavy') foodBase = emissionFactors.food.meatHeavyBaseKg;
  
  const wasteMult = emissionFactors.food.wasteMultiplier[inputs.wasteFrequency] || 1.0;
  const foodTotal = foodBase * wasteMult;

  // 4. Shopping
  const clothingCO2 = inputs.clothingItemsPerMonth * emissionFactors.shopping.clothingKgPerItem;
  const techCO2 = (inputs.electronicsPerYear / 12) * emissionFactors.shopping.electronicsKgPerYear;
  const generalCO2 = emissionFactors.shopping.generalShoppingKg[inputs.generalShoppingLevel] || 35;
  const shoppingTotal = clothingCO2 + techCO2 + generalCO2;

  // 5. Waste
  let wasteBase = emissionFactors.waste.plasticKg[inputs.plasticUsageLevel] || 25;
  if (inputs.segregatesWaste) wasteBase *= (1 - emissionFactors.waste.segregationDiscount);
  if (inputs.compostsOrganic) wasteBase *= (1 - emissionFactors.waste.compostDiscount);
  if (inputs.recyclesPaperMetal) wasteBase *= (1 - emissionFactors.waste.recyclingDiscount);
  const wasteTotal = Math.max(5, wasteBase);

  // Totals & Breakdown
  const totalMonthlyKgCO2e = Math.round(transportTotal + electricityTotal + foodTotal + shoppingTotal + wasteTotal);
  const yearlyBaselineTonnes = parseFloat((totalMonthlyKgCO2e * 12 / 1000).toFixed(2));

  const rawCategories: { category: CarbonCategory; name: string; amountKg: number; icon: string }[] = [
    { category: 'transportation', name: 'Transportation', amountKg: Math.round(transportTotal), icon: 'directions_car' },
    { category: 'electricity', name: 'Electricity', amountKg: Math.round(electricityTotal), icon: 'bolt' },
    { category: 'food', name: 'Food & Diet', amountKg: Math.round(foodTotal), icon: 'restaurant' },
    { category: 'shopping', name: 'Shopping & Goods', amountKg: Math.round(shoppingTotal), icon: 'shopping_bag' },
    { category: 'waste', name: 'Waste Management', amountKg: Math.round(wasteTotal), icon: 'delete' },
  ];

  // Sort by highest amount to assign priorities
  const sorted = [...rawCategories].sort((a, b) => b.amountKg - a.amountKg);
  const highestCategory = sorted[0].category;

  const breakdown: CategoryBreakdown[] = rawCategories.map((item) => {
    let priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    if (item.category === sorted[0].category) priority = 'HIGH';
    else if (item.category === sorted[1].category) priority = 'MEDIUM';

    return {
      category: item.category,
      name: item.name,
      amountKg: item.amountKg,
      percentage: Math.round((item.amountKg / totalMonthlyKgCO2e) * 100),
      priority,
      icon: item.icon,
    };
  });

  return {
    totalMonthlyKgCO2e,
    yearlyBaselineTonnes,
    breakdown,
    hotspotCategory: highestCategory,
    estimatedCO2AvoidedKg: 0,
    calculatedAt: new Date().toISOString(),
  };
}
