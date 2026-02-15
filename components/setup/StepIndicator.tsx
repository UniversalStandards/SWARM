'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SetupStep } from '@/types';

interface StepIndicatorProps {
  steps: SetupStep[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            {/* Step Circle */}
            <div
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                step.completed
                  ? 'bg-green-500 border-green-500'
                  : currentStep === step.id
                  ? 'bg-cyan-600 border-cyan-600 animate-pulse'
                  : 'bg-slate-800 border-slate-700'
              )}
            >
              {step.completed ? (
                <Check className="w-6 h-6 text-white" />
              ) : (
                <span className="text-white font-semibold">{step.id}</span>
              )}
            </div>

            {/* Step Title */}
            <div className="mt-3 text-center">
              <p
                className={cn(
                  'text-sm font-medium',
                  currentStep === step.id
                    ? 'text-cyan-400'
                    : step.completed
                    ? 'text-green-400'
                    : 'text-gray-500'
                )}
              >
                {step.title}
              </p>
              <p className="text-xs text-gray-600 mt-1 max-w-[150px]">
                {step.description}
              </p>
            </div>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                'h-0.5 flex-1 mx-4 transition-all duration-300',
                step.completed ? 'bg-green-500' : 'bg-slate-700'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
