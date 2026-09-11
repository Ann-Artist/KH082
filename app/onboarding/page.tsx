'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AgeGroup, PuneWard, LifestyleInputs, CarbonResult, UserProfile } from '@/types';
import { AgeGroupPage } from './age-group/page';
import { LocationPage } from './location/page';
import { LifestylePage } from './lifestyle/page';
import { ResultPage } from './result/page';
import { getStoredLifestyleInputs, saveLifestyleInputs, getStoredUserProfile, saveUserProfile } from '../../lib/storage';

export default function OnboardingHubPage(props: any) {
  const onNavigate = props?.onNavigate;
  const onCompleted = props?.onCompleted;
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('Gen Z / Young Adult');
  const [ward, setWard] = useState<PuneWard>('Kothrud');
  const [inputs, setInputs] = useState<LifestyleInputs>(getStoredLifestyleInputs());
  const [calcResult, setCalcResult] = useState<CarbonResult | null>(null);
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(getStoredUserProfile());

  const handleAgeGroupNext = (selectedAge: AgeGroup) => {
    setAgeGroup(selectedAge);
    setStep(2);
  };

  const handleLocationNext = (selectedWard: PuneWard) => {
    setWard(selectedWard);
    setStep(3);
  };

  const handleLifestyleNext = (submittedInputs: LifestyleInputs) => {
    setInputs(submittedInputs);

    // Save inputs & run Carbon Engine
    const { result, profile } = saveLifestyleInputs(submittedInputs);
    
    // Update profile with age group and ward
    const updatedProfile: UserProfile = {
      ...profile,
      ageGroup,
      puneWard: ward,
    };
    saveUserProfile(updatedProfile);

    setCalcResult(result);
    setCurrentProfile(updatedProfile);
    setStep(4);
  };

  const handleFinish = () => {
    if (typeof onCompleted === 'function') {
      onCompleted();
    }
    if (typeof onNavigate === 'function') {
      onNavigate('/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0b110e] px-4 py-10 text-white">
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#6bfb9a]/15 blur-3xl" />

      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-[#6bfb9a]/20 bg-[#121b16]/95 p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
        {step === 1 && <AgeGroupPage onNext={handleAgeGroupNext} />}
        {step === 2 && <LocationPage onNext={handleLocationNext} />}
        {step === 3 && <LifestylePage initialInputs={inputs} onNext={handleLifestyleNext} />}
        {step === 4 && calcResult && (
          <ResultPage result={calcResult} user={currentProfile} onFinishOnboarding={handleFinish} />
        )}
      </div>
    </div>
  );
}
