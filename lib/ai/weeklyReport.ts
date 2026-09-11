export interface WeeklyReportData {
  userName: string;
  completedQuests: number;
  xpEarned: number;
  streakDays: number;
  co2Avoided: number;
  strongestArea: string;
  improvementArea: string;
  recommendation: string;
}

export function generateWeeklyReport(data: WeeklyReportData): string {
  return `
Your EcoQuest Week 🌱
━━━━━━━━━━━━━━━━━━━━━
✨ ${data.completedQuests} quests completed
⭐ ${data.xpEarned} EcoXP earned
🔥 ${data.streakDays}-day streak active

Estimated Impact:
🌿 ${data.co2Avoided} kg CO₂e avoided

Your Strongest Area:
${data.strongestArea}

Your Improvement Opportunity:
${data.improvementArea}

🤖 AI Recommendation:
${data.recommendation}
  `.trim();
}
