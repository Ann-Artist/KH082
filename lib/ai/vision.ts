export interface VisionVerificationResult {
  status: 'VERIFIED' | 'REJECTED' | 'MANUAL_REVIEW';
  confidenceScore: number; // e.g. 94
  detectedObjects: string[];
  isDuplicate: boolean;
  message: string;
}

export function analyzePhotoProof(questId: string, imageFileName: string): VisionVerificationResult {
  // Simulates AI Computer Vision model object & hash detection
  const confidenceScore = Math.floor(Math.random() * 10) + 90; // 90-99%

  if (questId === 'q3') {
    return {
      status: 'VERIFIED',
      confidenceScore,
      detectedObjects: ['Wet Organic Bin', 'Dry Recyclable Bin', 'Segregated Waste'],
      isDuplicate: false,
      message: `AI Vision Confidence: ${confidenceScore}% — Verified segregated waste bins detected ✓`
    };
  } else if (questId === 'q4') {
    return {
      status: 'VERIFIED',
      confidenceScore,
      detectedObjects: ['Native Sapling', 'Tree Soil', 'Water Can', 'Pune Geotag'],
      isDuplicate: false,
      message: `AI Vision Confidence: ${confidenceScore}% — Verified urban tree planting photo & Pune geotag ✓`
    };
  } else if (questId === 'q7') {
    return {
      status: 'VERIFIED',
      confidenceScore,
      detectedObjects: ['Cloth Tote Bag', 'Reusable Stainless Bottle', 'No Plastic Containers'],
      isDuplicate: false,
      message: `AI Vision Confidence: ${confidenceScore}% — Verified zero single-use plastic items detected ✓`
    };
  }

  return {
    status: 'VERIFIED',
    confidenceScore: 92,
    detectedObjects: ['Sustainable Eco Activity', 'Authentic Proof'],
    isDuplicate: false,
    message: 'AI Vision Confidence: 92% — Verified authentic eco proof ✓'
  };
}
