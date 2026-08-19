import React from 'react';
import { PartyPlan } from '../types';
import { PRESET_PARTIES } from '../data/presets';
import { Sparkles, Users, Clock, DollarSign, ArrowRight } from 'lucide-react';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (party: PartyPlan) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Curated Party Templates</h2>
            <p className="text-xs text-stone-500">
              Start in 1 click with pre-calculated grocery items, menus, and timelines
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-2 rounded-xl hover:bg-stone-100 text-sm font-medium"
          >
            ✕
          </button>
        </div>

        {/* Templates Grid */}
        <div className="mt-6 space-y-4">
          {PRESET_PARTIES.map((preset) => (
            <div
              key={preset.id}
              className="p-5 rounded-2xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                    {preset.title}
                  </h3>
                  <span className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-medium">
                    {preset.theme}
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {preset.vibeAndNotes}
                </p>

                <div className="flex items-center gap-3 pt-1 text-xs text-stone-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    {preset.adultCount + preset.childCount} Guests
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    {preset.durationHours} hrs
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    ${preset.budget} Budget
                  </span>
                  <span className="text-[11px] text-stone-400">
                    • {preset.items.length} items
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectPreset({
                    ...preset,
                    id: `party-preset-${Date.now()}`
                  });
                  onClose();
                }}
                className="px-4 py-2 bg-stone-900 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-2xs"
              >
                <span>Use Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
