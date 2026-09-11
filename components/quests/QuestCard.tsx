import React from 'react';
import { Quest, QuestStatus } from '../../types';

interface QuestCardProps {
  quest: Quest;
  status: QuestStatus;
  onAccept: (questId: string) => void;
  onComplete: (quest: Quest) => void;
  onCantDo: (quest: Quest) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  status,
  onAccept,
  onComplete,
  onCantDo,
}) => {
  const getVerificationBadge = () => {
    if (quest.verificationType === 'level_1_self') {
      return { label: 'Self-Report', color: 'border-blue-500/30 bg-blue-500/10 text-blue-400', icon: 'verified_user' };
    }
    if (quest.verificationType === 'level_2_gps') {
      return { label: 'GPS / Route', color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400', icon: 'location_on' };
    }
    return { label: 'Photo Proof Required', color: 'border-purple-500/30 bg-purple-500/10 text-purple-300', icon: 'photo_camera' };
  };

  const vBadge = getVerificationBadge();

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e2e8e3] bg-white p-5 text-gray-900 shadow-sm transition-all duration-300 hover:shadow-md">
      <div>
        {/* Header Badges */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 font-mono text-xs font-extrabold text-amber-700">
            <span className="material-symbols-outlined text-sm text-amber-500">stars</span>
            +{quest.xpReward} XP
          </span>

          <span className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-xs font-semibold ${vBadge.color}`}>
            <span className="material-symbols-outlined text-sm">{vBadge.icon}</span>
            {vBadge.label}
          </span>
        </div>

        {/* Title & Icon */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#10b981] border border-emerald-200">
            <span className="material-symbols-outlined text-2xl">{quest.icon}</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 group-hover:text-[#10b981] transition-colors">
              {quest.title}
            </h3>
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">{quest.description}</p>
          </div>
        </div>

        {/* Quest Info Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-mono text-gray-600">
          <span className="rounded-md bg-gray-100 px-2 py-0.5 uppercase font-semibold">🌱 -{quest.co2ImpactKg} kg CO₂e</span>
          <span className="rounded-md bg-gray-100 px-2 py-0.5 uppercase font-semibold">⏱️ {quest.duration}</span>
          <span className="rounded-md bg-gray-100 px-2 py-0.5 uppercase font-semibold">⚡ {quest.difficulty}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-gray-100 flex items-center gap-2">
        {status === 'completed' ? (
          <div className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 py-2 text-xs font-bold text-emerald-700">
            <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
            <span>Completed</span>
          </div>
        ) : status === 'active' ? (
          <div className="flex w-full items-center gap-2">
            <button
              onClick={() => onComplete(quest)}
              className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#111827] py-2 text-xs font-bold text-white hover:bg-black transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-base text-[#10b981]">task_alt</span>
              <span>Submit Proof</span>
            </button>
            <button
              onClick={() => onCantDo(quest)}
              title="Can't do this - Get AI Alternative"
              className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-2 text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <span className="material-symbols-outlined text-base">swap_horiz</span>
            </button>
          </div>
        ) : (
          <div className="flex w-full items-center gap-2">
            <button
              onClick={() => onAccept(quest.id)}
              className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#111827] py-2 text-xs font-bold text-white hover:bg-black transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-base text-[#10b981]">add_circle</span>
              <span>Accept Quest</span>
            </button>
            <button
              onClick={() => onCantDo(quest)}
              title="Can't do this - Get AI Alternative"
              className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-2 text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <span className="material-symbols-outlined text-base">swap_horiz</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
