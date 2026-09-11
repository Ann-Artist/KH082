import { Quest, ProofSubmission } from '../../types';

export function simulateAIVisionScan(
  quest: Quest,
  imageUrl: string
): {
  detectedObjects: string[];
  relevanceMatch: boolean;
  confidenceScore: number;
  aiNotes: string;
} {
  if (quest.category === 'waste') {
    return {
      detectedObjects: ['Wet Waste Bin', 'Dry Waste Recyclables', 'Compost Bucket'],
      relevanceMatch: true,
      confidenceScore: 0.96,
      aiNotes: 'EcoQuest AI Vision verified organic/recyclable waste segregation with 96% confidence.',
    };
  }

  if (quest.category === 'transportation' || quest.title.toLowerCase().includes('tree') || quest.title.toLowerCase().includes('plant')) {
    return {
      detectedObjects: ['Young Sapling / Tree', 'Soil / Watering Can', 'Outdoor Environment'],
      relevanceMatch: true,
      confidenceScore: 0.94,
      aiNotes: 'EcoQuest AI Vision identified active plant/tree care in Pune location.',
    };
  }

  return {
    detectedObjects: ['Cloth Bag', 'Reusable Water Bottle'],
    relevanceMatch: true,
    confidenceScore: 0.91,
    aiNotes: 'EcoQuest AI Vision verified plastic avoidance items.',
  };
}

export function simulateGPSTrip(
  startLocation: string = 'Kothrud, Pune',
  endLocation: string = 'Deccan Gymkhana, Pune'
): {
  startLocation: string;
  endLocation: string;
  distanceKm: number;
  durationMinutes: number;
  co2SavedKg: number;
} {
  return {
    startLocation,
    endLocation,
    distanceKm: 4.8,
    durationMinutes: 18,
    co2SavedKg: 1.2,
  };
}
