import { Check } from 'lucide-react';
import React from 'react';
import { cn } from '../../lib/utils';

export interface Step {
  id: string;
  label: string;
  description?: string;
  isValid?: boolean;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export function Stepper({ steps, currentStep, onStepClick, className }: StepperProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex flex-row items-center justify-between w-full relative">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <React.Fragment key={step.id}>
              {/* Step Item */}
              <div 
                className={cn(
                  "flex flex-col items-center group relative z-10",
                  (isCompleted || isActive) && onStepClick ? "cursor-pointer" : "cursor-not-allowed"
                )}
                onClick={() => {
                  if (onStepClick && (isCompleted || isActive)) {
                    onStepClick(index);
                  }
                }}
              >
                {/* Indicator */}
                <div 
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold transition-colors duration-200",
                    isCompleted ? "bg-green-500 border-green-500 text-white" :
                    isActive ? "bg-purple-600 border-purple-600 text-white shadow-sm" :
                    "bg-slate-100 border-slate-200 text-slate-500 opacity-50"
                  )}
                >
                  {isCompleted ? <Check className="w-6 h-6" /> : index + 1}
                </div>
                
                {/* Label */}
                <div className="absolute top-12 mt-2 text-center w-32 -ml-11">
                  <p className={cn(
                    "text-sm font-medium",
                    isActive ? "text-purple-700" :
                    isCompleted ? "text-slate-700" :
                    "text-slate-400 opacity-50"
                  )}>
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-slate-500 hidden md:block">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connecting Line (don't render after the last item) */}
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    "h-0.5 flex-1 mx-4 transition-colors duration-200",
                    isCompleted ? "bg-green-500" : "bg-slate-200"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* Spacer to account for absolute positioned labels */}
      <div className="h-16 w-full"></div>
    </div>
  );
}

export default Stepper;
