'use client';

import React, { useState, useEffect } from 'react';
import { Quest, ProofSubmission } from '../../types';
import { runEcoGuardAudit } from '../../lib/verification/ecoguard';
import { simulateAIVisionScan, simulateGPSTrip } from '../../lib/verification/cv_sim';

interface VerificationModalProps {
  quest: Quest | null;
  isOpen: boolean;
  userId: string;
  userName: string;
  previousSubmissions: ProofSubmission[];
  onClose: () => void;
  onVerifiedSuccess: (quest: Quest, submission: ProofSubmission) => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  quest,
  isOpen,
  userId,
  userName,
  previousSubmissions,
  onClose,
  onVerifiedSuccess,
}) => {
  if (!isOpen || !quest) return null;

  // GPS Trip Stepper state for Level 2 GPS challenges (PDF 1 Section 18 & 19)
  const [gpsStage, setGpsStage] = useState<'idle' | 'permission' | 'recording' | 'completed'>('idle');
  const [gpsDistance, setGpsDistance] = useState(0);

  const [step, setStep] = useState<'input' | 'scanning' | 'result'>('input');
  const [selectedPhoto, setSelectedPhoto] = useState<string>(
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80'
  );
  const [auditResult, setAuditResult] = useState<any>(null);

  // Simulated GPS route counter
  useEffect(() => {
    let interval: any;
    if (gpsStage === 'recording') {
      interval = setInterval(() => {
        setGpsDistance((prev) => {
          if (prev >= 4.8) {
            clearInterval(interval);
            setGpsStage('completed');
            return 4.8;
          }
          return parseFloat((prev + 0.8).toFixed(1));
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [gpsStage]);

  const handleStartVerification = () => {
    setStep('scanning');

    setTimeout(() => {
      const visionResult = simulateAIVisionScan(quest, selectedPhoto);

      const gpsData = {
        startLocation: 'Kothrud, Pune',
        endLocation: 'Deccan Gymkhana, Pune',
        distanceKm: quest.verificationType === 'level_2_gps' ? (gpsDistance || 4.8) : 4.8,
        durationMinutes: 18,
      };

      const currentSubmission: Partial<ProofSubmission> = {
        questId: quest.id,
        imageUrl: quest.verificationType === 'level_3_photo' ? selectedPhoto : undefined,
        gpsRoute: quest.verificationType === 'level_2_gps' ? gpsData : undefined,
      };

      const timestamps = previousSubmissions.map((s) => new Date(s.submittedAt).getTime());
      const hashes = previousSubmissions.map((s) => s.imageUrl || '').filter(Boolean);
      if (selectedPhoto) hashes.push(selectedPhoto);

      const ecoGuardResult = runEcoGuardAudit(timestamps, hashes);
      const verdict: 'Approved' | 'Needs Review' = ecoGuardResult.isFlagged ? 'Needs Review' : 'Approved';
      const reason = ecoGuardResult.details;

      const submission: ProofSubmission = {
        id: `proof_${Date.now()}`,
        questId: quest.id,
        questTitle: quest.title,
        userId,
        userName,
        verificationType: quest.verificationType,
        submittedAt: new Date().toISOString(),
        imageUrl: quest.verificationType === 'level_3_photo' ? selectedPhoto : undefined,
        gpsRoute: quest.verificationType === 'level_2_gps' ? gpsData : undefined,
        aiVerdict: verdict,
        aiConfidence: visionResult.confidenceScore,
        aiNotes: reason || visionResult.aiNotes,
        ecoGuardFlagged: ecoGuardResult.isFlagged,
        ecoGuardReason: reason,
        status: verdict === 'Approved' ? 'approved' : 'pending',
      };

      setAuditResult({ ecoGuardResult, visionResult, submission });
      setStep('result');
    }, 1800);
  };

  const handleFinalSubmit = () => {
    if (auditResult && auditResult.submission) {
      onVerifiedSuccess(quest, auditResult.submission);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#6bfb9a]/30 bg-[#121b16] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#6bfb9a]">verified_user</span>
            <h2 className="font-headline-lg text-lg font-bold text-white">{quest.title}</h2>
          </div>
          <button onClick={onClose} className="text-[#bccabb] hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Step 1: Input / Upload */}
        {step === 'input' && (
          <div className="mt-4 space-y-4">
            <p className="text-xs text-[#bccabb]">
              Spec Verification Level: <strong className="text-[#6bfb9a] font-mono uppercase">{quest.verificationType.replace('_', ' ')}</strong>
            </p>

            {/* Level 1 Self-Report */}
            {quest.verificationType === 'level_1_self' && (
              <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-sm text-blue-200">
                <p className="font-semibold">Level 1 Self-Reported Action (Section 14)</p>
                <p className="mt-1 text-xs text-blue-300">
                  Confirm that you performed this simple low-risk action today. Direct completion accepted without photo proof.
                </p>
              </div>
            )}

            {/* Level 2 GPS Stepper Flow (Section 18 & 19 of PDF 1) */}
            {quest.verificationType === 'level_2_gps' && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-200 space-y-3">
                <p className="font-bold text-sm">Level 2 GPS Trip Flow (Section 18 Spec)</p>
                <p className="text-xs text-emerald-300">Flow: Permission → Start Trip → Travel → End Trip → Route Analysis → Verification</p>

                {gpsStage === 'idle' && (
                  <button
                    onClick={() => setGpsStage('permission')}
                    className="w-full rounded-xl bg-emerald-500/20 border border-emerald-500/40 py-2 font-mono font-bold text-emerald-300"
                  >
                    1. Request Location Permission
                  </button>
                )}

                {gpsStage === 'permission' && (
                  <div className="space-y-2">
                    <div className="rounded-lg bg-black/40 p-2 text-[11px] font-mono text-emerald-400">
                      📍 Geolocation Granted: Kothrud → Deccan Gymkhana Line
                    </div>
                    <button
                      onClick={() => setGpsStage('recording')}
                      className="w-full rounded-xl bg-emerald-500 py-2 font-mono font-bold text-[#003919]"
                    >
                      2. Start Trip (Record GPS Travel)
                    </button>
                  </div>
                )}

                {gpsStage === 'recording' && (
                  <div className="space-y-2 text-center">
                    <div className="text-base font-mono font-black text-[#6bfb9a] animate-pulse">
                      🚴 Traveling... {gpsDistance} km / 4.8 km
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div className="h-full bg-[#6bfb9a] transition-all" style={{ width: `${(gpsDistance / 4.8) * 100}%` }} />
                    </div>
                  </div>
                )}

                {gpsStage === 'completed' && (
                  <div className="rounded-lg bg-black/40 p-2.5 font-mono text-xs text-[#6bfb9a] text-center">
                    ✅ Trip Completed: 4.8 km logged! Ready for EcoGuard Route Validation.
                  </div>
                )}
              </div>
            )}

            {/* Level 3 Photo Proof Scanner */}
            {quest.verificationType === 'level_3_photo' && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-white">Level 3 Photo Proof (AI Computer Vision Scan)</p>
                <div className="relative h-44 w-full overflow-hidden rounded-2xl border border-white/20">
                  <img src={selectedPhoto} alt="Proof Sample" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                    <span className="text-xs font-mono text-[#6bfb9a]">📸 Sample Pune Photo Upload Attached</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleStartVerification}
              disabled={quest.verificationType === 'level_2_gps' && gpsStage !== 'completed'}
              className={`w-full rounded-2xl border border-[#6bfb9a]/40 bg-[#6bfb9a] py-3 font-bold text-[#003919] transition-all ${
                quest.verificationType === 'level_2_gps' && gpsStage !== 'completed' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#59e68a]'
              }`}
            >
              Run AI Vision & EcoGuard Anti-Cheat Check
            </button>
          </div>
        )}

        {/* Step 2: Scanning Simulation */}
        {step === 'scanning' && (
          <div className="py-12 text-center">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-[#6bfb9a]/20 border-t-[#6bfb9a]" />
            <p className="mt-4 font-mono text-sm text-[#6bfb9a] animate-pulse">Running AI Vision & EcoGuard Anti-Cheat Audit...</p>
            <p className="mt-1 text-xs text-[#bccabb]">Section 21 Checks: Duplicate images, suspicious timestamps, location mismatch</p>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 'result' && auditResult && (
          <div className="mt-4 space-y-4">
            <div
              className={`rounded-2xl border p-4 text-center ${
                auditResult.submission.aiVerdict === 'Approved'
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300'
              }`}
            >
              <span className="material-symbols-outlined text-4xl">
                {auditResult.submission.aiVerdict === 'Approved' ? 'check_circle' : 'warning'}
              </span>
              <h3 className="font-title-md text-lg font-bold">
                EcoGuard Verdict: {auditResult.submission.aiVerdict}
              </h3>
              <p className="mt-1 text-xs font-mono">
                AI Vision Confidence: {Math.round(auditResult.submission.aiConfidence * 100)}%
              </p>
              <p className="mt-2 text-xs">{auditResult.submission.aiNotes}</p>
            </div>

            <button
              onClick={handleFinalSubmit}
              className="w-full rounded-2xl border border-[#6bfb9a]/40 bg-[#6bfb9a] py-3 font-bold text-[#003919] hover:bg-[#59e68a] transition-all"
            >
              Claim +{quest.xpReward} EcoXP & Update Streak
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
