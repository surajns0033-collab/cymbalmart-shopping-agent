import React from 'react';
import { CUJStep, BudgetBreakdown, PartyPlan } from '../types';
import { Sparkles, CheckCircle2, SlidersHorizontal, ShoppingCart, DollarSign, CalendarCheck } from 'lucide-react';

interface CujStepperProps {
  currentStep: CUJStep;
  onSelectStep: (step: CUJStep) => void;
  party: PartyPlan;
  budgetBreakdown: BudgetBreakdown;
  onOpenDefineModal: () => void;
  onOpenCheckoutModal: () => void;
}

export const CujStepper: React.FC<CujStepperProps> = ({
  currentStep,
  onSelectStep,
  party,
  budgetBreakdown,
  onOpenDefineModal,
  onOpenCheckoutModal
}) => {
  const isOverBudget = budgetBreakdown.estimatedTotal > budgetBreakdown.targetBudget;
  const budgetDifference = Math.abs(budgetBreakdown.targetBudget - budgetBreakdown.estimatedTotal);

  const steps: {
    id: CUJStep;
    stepNumber: number;
    title: string;
    description: string;
    badge?: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'define',
      stepNumber: 1,
      title: 'Define Event',
      description: `${party.adultCount + party.childCount} guests • $${party.budget} budget • ${party.partyStyle.replace('_', ' ')}`,
      icon: <CalendarCheck className="w-4 h-4" />
    },
    {
      id: 'review',
      stepNumber: 2,
      title: 'Review List & Budget',
      description: isOverBudget
        ? `Over budget by $${budgetDifference.toFixed(2)}`
        : `Within budget ($${budgetBreakdown.estimatedTotal.toFixed(2)} / $${budgetBreakdown.targetBudget})`,
      badge: isOverBudget ? 'Align Budget' : 'On Track',
      icon: <DollarSign className="w-4 h-4" />
    },
    {
      id: 'refine_checkout',
      stepNumber: 3,
      title: 'Refine & Checkout',
      description: `Adjust constraints, swap Cymbal brands & order fulfillment`,
      badge: `${party.items.length} Items Ready`,
      icon: <ShoppingCart className="w-4 h-4" />
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-3 sm:p-4 shadow-xs mb-6">
      
      {/* Step Progress Track */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted =
            (step.id === 'define' && (currentStep === 'review' || currentStep === 'refine_checkout')) ||
            (step.id === 'review' && currentStep === 'refine_checkout');

          return (
            <button
              key={step.id}
              onClick={() => {
                if (step.id === 'define') {
                  onOpenDefineModal();
                } else {
                  onSelectStep(step.id);
                }
              }}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 relative group ${
                isActive
                  ? 'bg-amber-50/50 border-amber-500 ring-2 ring-amber-500/20'
                  : isCompleted
                  ? 'bg-stone-50/60 border-stone-200 hover:border-stone-300'
                  : 'bg-white border-stone-200 hover:border-amber-300'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-amber-600 text-white'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 text-stone-600 group-hover:bg-amber-100 group-hover:text-amber-800'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.stepNumber}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                    {step.title}
                  </span>
                  {step.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                        step.badge === 'Align Budget'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {step.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500 truncate mt-0.5">
                  {step.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
};
