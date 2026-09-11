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
  const [uploadedFileMeta, setUploadedFileMeta] = useState<{
    name: string;
    size: string;
    hash: string;
  } | null>(null);
  const [auditResult, setAuditResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedPhoto(event.target.result as string);
        setUploadedFileMeta({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          hash: `SHA256_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        });
      }
    };
    reader.readAsDataURL(file);
  };

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
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#10b981]">verified_user</span>
            <h2 className="text-lg font-extrabold text-gray-900">{quest.title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
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

            {/* Level 3 Photo Proof Scanner with Interactive File Upload */}
            {quest.verificationType === 'level_3_photo' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-white">Upload Task Proof Photo (AI Computer Vision Scan)</p>
                  {uploadedFileMeta && (
                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                      ✓ Custom Photo Uploaded
                    </span>
                  )}
                </div>

                {/* Live Image Preview & Geotag Metadata */}
                <div className="relative h-44 w-full overflow-hidden rounded-2xl border border-white/20 bg-black/40">
                  <img src={selectedPhoto} alt="Proof Upload" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-3 flex flex-col justify-end">
                    {uploadedFileMeta ? (
                      <div className="font-mono text-[11px] text-[#6bfb9a] space-y-0.5">
                        <div className="font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          {uploadedFileMeta.name} ({uploadedFileMeta.size})
                        </div>
                        <div className="text-[10px] text-[#bccabb]">
                          📍 Geotag: 18.5204° N, 73.8567° E (Kothrud, Pune) • {uploadedFileMeta.hash}
                        </div>
                      </div>
                    ) : (
                      <div className="font-mono text-[11px] text-[#6bfb9a]">
                        📸 Sample Pune Photo (Click button below to select image from your device)
                      </div>
                    )}
                  </div>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  id="task-proof-file-input"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Upload Action Buttons */}
                <div className="flex gap-2">
                  <label
                    htmlFor="task-proof-file-input"
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#6bfb9a]/40 bg-[#6bfb9a]/10 px-4 py-2.5 font-mono text-xs font-bold text-[#6bfb9a] hover:bg-[#6bfb9a]/20 cursor-pointer transition-all text-center"
                  >
                    <span className="material-symbols-outlined text-lg">cloud_upload</span>
                    <span>{uploadedFileMeta ? 'Change / Upload New Photo' : '📷 Upload Photo from Device'}</span>
                  </label>

                  {uploadedFileMeta && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPhoto('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80');
                        setUploadedFileMeta(null);
                      }}
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 font-mono text-xs font-bold text-red-400 hover:bg-red-500/20"
                      title="Reset to sample photo"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleStartVerification}
              disabled={quest.verificationType === 'level_2_gps' && gpsStage !== 'completed'}
              className={`w-full rounded-2xl bg-[#111827] py-3 font-bold text-white transition-all shadow-sm ${
                quest.verificationType === 'level_2_gps' && gpsStage !== 'completed' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black'
              }`}
            >
              Run AI Vision & EcoGuard Anti-Cheat Check
            </button>
          </div>
        )}

        {/* Step 2: Scanning Simulation */}
        {step === 'scanning' && (
          <div className="py-12 text-center">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-[#10b981]" />
            <p className="mt-4 font-mono text-sm font-bold text-gray-900 animate-pulse">Running AI Vision & EcoGuard Anti-Cheat Audit...</p>
            <p className="mt-1 text-xs text-gray-500">Section 21 Checks: Duplicate images, suspicious timestamps, location mismatch</p>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 'result' && auditResult && (
          <div className="mt-4 space-y-4">
            <div
              className={`rounded-2xl border p-4 text-center ${
                auditResult.submission.aiVerdict === 'Approved'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                  : 'border-amber-200 bg-amber-50 text-amber-900'
              }`}
            >
              <span className="material-symbols-outlined text-4xl text-emerald-600">
                {auditResult.submission.aiVerdict === 'Approved' ? 'check_circle' : 'warning'}
              </span>
              <h3 className="text-lg font-extrabold text-gray-900">
                EcoGuard Verdict: {auditResult.submission.aiVerdict}
              </h3>
              <p className="mt-1 text-xs font-mono font-semibold text-emerald-700">
                AI Vision Confidence: {Math.round(auditResult.submission.aiConfidence * 100)}%
              </p>
              <p className="mt-2 text-xs text-gray-600">{auditResult.submission.aiNotes}</p>
            </div>

            <button
              onClick={handleFinalSubmit}
              className="w-full rounded-2xl bg-[#111827] py-3 font-bold text-white hover:bg-black transition-all shadow-sm"
            >
              Claim +{quest.xpReward} EcoXP & Update Streak
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
