import React, { useState, useEffect } from 'react';
import { ShoppingItem, StoreType } from '../types';
import { STORE_LABELS } from '../utils/calculator';
import { Sparkles, ArrowRightLeft, Loader2, Check, DollarSign } from 'lucide-react';

interface ItemSubstituteModalProps {
  item: ShoppingItem | null;
  onClose: () => void;
  onReplaceItem: (oldItemId: string, substitute: {
    name: string;
    estimatedPrice: number;
    store: StoreType;
    notes: string;
    dietaryTags?: string[];
  }) => void;
}

export const ItemSubstituteModal: React.FC<ItemSubstituteModalProps> = ({
  item,
  onClose,
  onReplaceItem
}) => {
  const [loading, setLoading] = useState(false);
  const [dietaryGoal, setDietaryGoal] = useState('Best value / budget alternative');
  const [substitutes, setSubstitutes] = useState<Array<{
    name: string;
    estimatedPrice: number;
    store: string;
    reason: string;
    dietaryTags?: string[];
  }>>([]);

  const fetchSubstitutes = async (goal: string) => {
    if (!item) return;
    setLoading(true);
    try {
      const res = await fetch('/api/suggest-substitutes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: item.name,
          category: item.category,
          dietaryGoal: goal
        })
      });
      const data = await res.json();
      if (data.success && data.data?.substitutes) {
        setSubstitutes(data.data.substitutes);
      }
    } catch (err) {
      console.error('Failed to fetch substitutes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (item) {
      fetchSubstitutes(dietaryGoal);
    }
  }, [item]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-stone-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Find Smart Substitute</h3>
              <p className="text-xs text-stone-500">
                Replace <span className="font-semibold text-stone-800">"{item.name}"</span> (${item.estimatedPrice.toFixed(2)})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 text-sm"
          >
            ✕
          </button>
        </div>

        {/* Goal Selector */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            Substitution Goal:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {[
              'Best value / budget alternative',
              'Gluten-Free swap',
              'Vegan / Plant-Based alternative',
              'Nut-Free safe swap',
              'Gourmet / High-end upgrade'
            ].map((goal) => (
              <button
                key={goal}
                onClick={() => {
                  setDietaryGoal(goal);
                  fetchSubstitutes(goal);
                }}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  dietaryGoal === goal
                    ? 'bg-purple-600 text-white border-purple-600 font-medium'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="mt-5 space-y-3">
          {loading ? (
            <div className="py-12 text-center text-stone-400 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              <span className="text-xs">Searching store alternatives & dietary options...</span>
            </div>
          ) : substitutes.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-500">
              No substitutes found. Try choosing a different goal above.
            </div>
          ) : (
            substitutes.map((sub, idx) => {
              const priceDiff = sub.estimatedPrice - item.estimatedPrice;
              const storeKey = (sub.store as StoreType) || 'supermarket';
              const storeLabel = STORE_LABELS[storeKey]?.label || sub.store;

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-stone-200 hover:border-purple-300 bg-stone-50/50 hover:bg-purple-50/20 transition-all flex flex-col justify-between gap-2"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-stone-900">{sub.name}</h4>
                      <div className="text-right">
                        <span className="text-xs font-bold text-stone-900">
                          ${sub.estimatedPrice.toFixed(2)}
                        </span>
                        <span
                          className={`text-[10px] block font-medium ${
                            priceDiff < 0 ? 'text-emerald-600' : 'text-stone-500'
                          }`}
                        >
                          {priceDiff < 0
                            ? `-$${Math.abs(priceDiff).toFixed(2)}`
                            : `+$${priceDiff.toFixed(2)}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded-md font-medium">
                        {storeLabel}
                      </span>
                      {sub.dietaryTags?.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      {sub.reason}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onReplaceItem(item.id, {
                        name: sub.name,
                        estimatedPrice: sub.estimatedPrice,
                        store: storeKey,
                        notes: `Swapped from "${item.name}": ${sub.reason}`,
                        dietaryTags: sub.dietaryTags
                      });
                      onClose();
                    }}
                    className="mt-1 self-end px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Replace in Shopping List
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-5 pt-3 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl text-xs font-medium"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
