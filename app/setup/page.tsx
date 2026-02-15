'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useSetupStore } from '@/store/setup-store';
import { StepIndicator } from '@/components/setup/StepIndicator';
import { GitHubConnect } from '@/components/setup/GitHubConnect';
import { RepositorySelect } from '@/components/setup/RepositorySelect';
import { AIConfig } from '@/components/setup/AIConfig';
import { WorkflowBuilder } from '@/components/setup/WorkflowBuilder';

export default function SetupPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { currentStep, steps } = useSetupStore();

  useEffect(() => {
    if (session && currentStep === 1) {
      useSetupStore.getState().completeStep(1);
      useSetupStore.getState().setCurrentStep(2);
    }
  }, [session, currentStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <GitHubConnect />;
      case 2:
        return <RepositorySelect />;
      case 3:
        return <AIConfig />;
      case 4:
        return <WorkflowBuilder />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              AI Agent Orchestration Setup
            </h1>
            <p className="text-lg text-gray-400">
              Configure your autonomous development environment in 4 simple steps
            </p>
          </div>

          {/* Step Indicator */}
          <StepIndicator steps={steps} currentStep={currentStep} />

          {/* Step Content */}
          <div className="mt-12">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
}
