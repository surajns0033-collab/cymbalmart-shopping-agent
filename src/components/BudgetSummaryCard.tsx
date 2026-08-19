import React, { useState } from 'react';
import { PartyPlan } from '../types';
import { computeBudgetBreakdown, STORE_LABELS } from '../utils/calculator';
import { 
  DollarSign, 
  Sparkles, 
  TrendingDown, 
  Users, 
  Store, 
  ShoppingBag, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface BudgetSummaryCardProps {
  party: PartyPlan;
  onApplyOptimizationProposal?: (tipText: string) => void;
  onSwapAllCymbalBrands?: () => void;
  onOpenAgentChat?: () => void;
}

export const BudgetSummaryCard: React.FC<BudgetSummaryCardProps> = ({
  party,
  onApplyOptimizationProposal,
  onSwapAllCymbalBrands,
  onOpenAgentChat
}) => {
  const breakdown = computeBudgetBreakdown(party);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<{
    overallSummary: string;
    potentialSavingsTotal: number;
    tips: Array<{
      title: string;
      description: string;
      estimatedSavings: number;
      affectedCategories?: string[];
    }>;
  } | null>(null);
  const [showOptModal, setShowOptModal] = useState(false);

  const budgetDelta = party.budget - breakdown.estimatedTotal;
  const isOverBudget = budgetDelta < 0;

  const handleOptimizeBudget = async () => {
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/optimize-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentParty: party })
      });
      const data = await res.json();
      if (data.success && data.optimization) {
        setOptimizationResult(data.optimization);
        setShowOptModal(true);
      }
    } catch (err) {
      console.error('Failed to run budget optimizer', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Calculate percentage of budget used
  const percentUsed = party.budget > 0 
    ? Math.min(100, Math.round((breakdown.estimatedTotal / party.budget) * 100))
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs transition-all mb-6">
      
      {/* Top row: Title & AI Optimize Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              {party.title}
            </h2>
            <span className="text-xs bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
              {party.theme}
            </span>
            <span className="text-[11px] bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1.5 border border-stone-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Auto-Calculated Budget
            </span>
            {breakdown.cymbalBrandSavingsTotal > 0 && (
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                ${breakdown.cymbalBrandSavingsTotal.toFixed(2)} Cymbal Savings
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {party.adultCount} adults, {party.childCount} kids • {party.durationHours} hrs duration • Serving Style: {party.partyStyle.replace('_', ' ')}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {onSwapAllCymbalBrands && (
            <button
              onClick={onSwapAllCymbalBrands}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Swap Cymbal Brands</span>
            </button>
          )}

          <button
            id="btn-ai-optimize-budget"
            onClick={handleOptimizeBudget}
            disabled={isOptimizing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-2xs"
          >
            {isOptimizing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>Analyzing Prices...</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI Budget Optimizer</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-4">
        
        {/* Estimated Total */}
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
          <span className="text-xs font-medium text-stone-500 block mb-1">Estimated Total</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-stone-900">
              ${breakdown.estimatedTotal.toFixed(2)}
            </span>
            <span className="text-xs text-stone-400 font-medium">USD</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs">
            {isOverBudget ? (
              <span className="text-rose-600 font-medium flex items-center gap-0.5">
                <AlertCircle className="w-3 h-3" /> +${Math.abs(budgetDelta).toFixed(2)} over budget
              </span>
            ) : (
              <span className="text-emerald-600 font-medium flex items-center gap-0.5">
                <CheckCircle className="w-3 h-3" /> ${budgetDelta.toFixed(2)} under budget
              </span>
            )}
          </div>
        </div>

        {/* Target Budget */}
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
          <span className="text-xs font-medium text-stone-500 block mb-1">Target Budget</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-stone-800">
              ${party.budget.toFixed(2)}
            </span>
          </div>
          <span className="text-xs text-stone-500 mt-1 block">
            Max allocated ceiling
          </span>
        </div>

        {/* Actual Spent so far */}
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
          <span className="text-xs font-medium text-stone-500 block mb-1">Cart Spent So Far</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-amber-600">
              ${breakdown.actualSpent.toFixed(2)}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              ({breakdown.purchasedCount}/{breakdown.totalCount} items)
            </span>
          </div>
          <span className="text-xs text-stone-500 mt-1 block">
            Purchased checklist items
          </span>
        </div>

        {/* Cost per guest */}
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
          <span className="text-xs font-medium text-stone-500 block mb-1">Cost Per Guest</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-stone-900">
              ${breakdown.costPerGuest.toFixed(2)}
            </span>
            <span className="text-xs text-stone-400 font-medium">/ person</span>
          </div>
          <span className="text-xs text-stone-500 mt-1 block flex items-center gap-1">
            <Users className="w-3 h-3 text-stone-400" />
            {party.adultCount + party.childCount} Total Attendees
          </span>
        </div>
      </div>

      {/* Visual Budget Progress Bar */}
      <div className="mt-2">
        <div className="flex justify-between text-xs text-stone-600 mb-1.5 font-medium">
          <span>Budget Utilization ({percentUsed}%)</span>
          <span>${breakdown.estimatedTotal.toFixed(2)} / ${party.budget.toFixed(2)}</span>
        </div>
        <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden flex">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isOverBudget ? 'bg-rose-500' : 'bg-amber-500'
            }`}
            style={{ width: `${Math.min(100, percentUsed)}%` }}
          />
        </div>
      </div>

      {/* Store Breakdown Badges */}
      <div className="mt-4 pt-3 border-t border-stone-100">
        <span className="text-xs font-semibold text-stone-700 block mb-2 flex items-center gap-1.5">
          <Store className="w-3.5 h-3.5 text-stone-500" />
          Estimated Spend by Store:
        </span>
        <div className="flex flex-wrap gap-2">
          {Object.entries(breakdown.byStore)
            .filter(([_, amount]) => amount > 0)
            .map(([storeKey, amount]) => {
              const info = STORE_LABELS[storeKey as keyof typeof STORE_LABELS];
              return (
                <div
                  key={storeKey}
                  className="px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200 text-xs flex items-center gap-2"
                >
                  <span className="font-medium text-stone-800">{info ? info.label.split('/')[0] : storeKey}:</span>
                  <span className="font-bold text-stone-900">${amount.toFixed(2)}</span>
                </div>
              );
            })}
        </div>
      </div>

      {/* AI Budget Optimization Results Modal */}
      {showOptModal && optimizationResult && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">AI Smart Budget Cut Opportunities</h3>
                  <p className="text-xs text-stone-500">
                    Potential Savings: ~${optimizationResult.potentialSavingsTotal.toFixed(2)} USD
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowOptModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 mt-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
              {optimizationResult.overallSummary}
            </p>

            <div className="mt-4 space-y-3">
              {optimizationResult.tips.map((tip, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-stone-900">{tip.title}</h4>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                      Save ~${tip.estimatedSavings}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowOptModal(false)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold"
              >
                Got It, Thanks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
