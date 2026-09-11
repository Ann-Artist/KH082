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
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#121b16]/80 p-5 backdrop-blur-xl transition-all duration-300 hover:border-[#6bfb9a]/40 hover:shadow-[0_0_20px_rgba(107,251,154,0.08)]">
      <div>
        {/* Header Badges */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1 rounded-full border border-[#ffd23f]/30 bg-[#ffd23f]/10 px-2.5 py-0.5 font-mono text-xs font-bold text-[#ffd23f]">
            <span className="material-symbols-outlined text-sm">stars</span>
            +{quest.xpReward} XP
          </span>

          <span className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-xs font-semibold ${vBadge.color}`}>
            <span className="material-symbols-outlined text-sm">{vBadge.icon}</span>
            {vBadge.label}
          </span>
        </div>

        {/* Title & Icon */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6bfb9a]/10 text-[#6bfb9a]">
            <span className="material-symbols-outlined text-2xl">{quest.icon}</span>
          </div>
          <div>
            <h3 className="font-title-md text-base font-bold text-white group-hover:text-[#6bfb9a] transition-colors">
              {quest.title}
            </h3>
            <p className="mt-1 text-xs text-[#bccabb] line-clamp-2">{quest.description}</p>
          </div>
        </div>

        {/* Quest Info Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-mono text-[#bccabb]">
          <span className="rounded-md bg-white/5 px-2 py-0.5 uppercase">🌱 -{quest.co2ImpactKg} kg CO₂e</span>
          <span className="rounded-md bg-white/5 px-2 py-0.5 uppercase">⏱️ {quest.duration}</span>
          <span className="rounded-md bg-white/5 px-2 py-0.5 uppercase">⚡ {quest.difficulty}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-white/5 flex items-center gap-2">
        {status === 'completed' ? (
          <div className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 py-2 text-xs font-bold text-emerald-400">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>Completed</span>
          </div>
        ) : status === 'active' ? (
          <div className="flex w-full items-center gap-2">
            <button
              onClick={() => onComplete(quest)}
              className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#6bfb9a] py-2 text-xs font-bold text-[#003919] hover:bg-[#58e288] transition-colors"
            >
              <span className="material-symbols-outlined text-base">task_alt</span>
              <span>Submit Proof</span>
            </button>
            <button
              onClick={() => onCantDo(quest)}
              title="Can't do this - Get AI Alternative"
              className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-xs text-[#bccabb] hover:bg-white/10 hover:text-white"
            >
              <span className="material-symbols-outlined text-base">swap_horiz</span>
            </button>
          </div>
        ) : (
          <div className="flex w-full items-center gap-2">
            <button
              onClick={() => onAccept(quest.id)}
              className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-[#6bfb9a]/40 bg-[#6bfb9a]/10 py-2 text-xs font-bold text-[#6bfb9a] hover:bg-[#6bfb9a]/20 transition-colors"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>Accept Quest</span>
            </button>
            <button
              onClick={() => onCantDo(quest)}
              title="Can't do this - Get AI Alternative"
              className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-xs text-[#bccabb] hover:bg-white/10 hover:text-white"
            >
              <span className="material-symbols-outlined text-base">swap_horiz</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
