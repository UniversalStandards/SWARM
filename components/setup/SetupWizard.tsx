'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Step1Authentication } from './Step1Authentication';
import { Step2Repository } from './Step2Repository';
import { Step3Agents } from './Step3Agents';
import { Step4Mission } from './Step4Mission';
import { StepIndicator } from './StepIndicator';
import { useSetupStore } from '@/store/setup-store';
import { Card, CardContent } from '@/components/ui/card';

export function SetupWizard() {
  const router = useRouter();
  const { currentStep, setStep, isComplete } = useSetupStore();

  const steps = [
    { id: 1, title: 'Authentication', component: Step1Authentication },
    { id: 2, title: 'Repository', component: Step2Repository },
    { id: 3, title: 'AI Configuration', component: Step3Agents },
    { id: 4, title: 'Mission Setup', component: Step4Mission },
  ];

  const CurrentStepComponent = steps[currentStep - 1]?.component;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setStep(currentStep + 1);
    } else {
      router.push('/setup/complete');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to SWARM</h1>
          <p className="text-gray-400">Let's set up your AI agent orchestration platform</p>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={steps} currentStep={currentStep} />

        {/* Step Content */}
        <Card className="bg-slate-900 border-slate-800 mt-8">
          <CardContent className="p-8">
            {CurrentStepComponent && (
              <CurrentStepComponent onNext={handleNext} onBack={handleBack} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
