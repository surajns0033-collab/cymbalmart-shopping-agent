import React, { useState } from 'react';
import { PartyPlan } from '../types';
import { Sparkles, Users, Clock, DollarSign, Utensils, Loader2 } from 'lucide-react';

interface PartySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPartyCreated: (newParty: PartyPlan) => void;
}

export const PartySetupModal: React.FC<PartySetupModalProps> = ({
  isOpen,
  onClose,
  onPartyCreated
}) => {
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('');
  const [adultCount, setAdultCount] = useState(12);
  const [childCount, setChildCount] = useState(0);
  const [durationHours, setDurationHours] = useState(4);
  const [partyStyle, setPartyStyle] = useState<PartyPlan['partyStyle']>('buffet');
  const [budget, setBudget] = useState(250);
  const [dietaryOptions, setDietaryOptions] = useState<string[]>([]);
  const [vibeAndNotes, setVibeAndNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const toggleDietary = (item: string) => {
    setDietaryOptions((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/plan-party', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || `${theme || 'Custom'} Celebration`,
          theme: theme.trim() || 'Festive Celebration',
          adultCount,
          childCount,
          durationHours,
          partyStyle,
          budget,
          dietaryRestrictions: dietaryOptions,
          vibeAndNotes
        })
      });

      const data = await res.json();
      if (data.success && data.party) {
        onPartyCreated(data.party);
        onClose();
      } else {
        setError(data.error || 'Failed to generate party plan');
      }
    } catch (err: any) {
      setError('Network error connecting to Party AI backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">Plan New Party with AI Agent</h2>
              <p className="text-xs text-stone-500">
                Gemini will calculate portions, items, store routing, and budget
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-2 rounded-xl hover:bg-stone-100 text-sm font-medium"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleGenerate} className="mt-6 space-y-5">
          
          {/* Party Title & Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Party Name / Event Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Leo's 30th Birthday Bash"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Theme / Atmosphere
              </label>
              <input
                type="text"
                placeholder="e.g. 90s Retro Disco, Mexican Fiesta, Italian Pizza Night"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Headcount & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-stone-400" /> Adult Guests (21+)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={adultCount}
                onChange={(e) => setAdultCount(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-stone-400" /> Kids / Minors
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={childCount}
                onChange={(e) => setChildCount(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" /> Duration (Hours)
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Party Style & Target Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5 text-stone-400" /> Serving Style
              </label>
              <select
                value={partyStyle}
                onChange={(e) => setPartyStyle(e.target.value as any)}
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                <option value="buffet">Buffet / Self-Serve Spread</option>
                <option value="cocktail_party">Cocktail Hour & Passed Bites</option>
                <option value="bbq_cookout">Outdoor BBQ / Grillout</option>
                <option value="casual_snacks">Casual Snacks & Finger Foods</option>
                <option value="sit_down">Formal Sit-Down Dinner</option>
                <option value="kids_party">Kids Fun & Party Foods</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-stone-400" /> Target Budget ($ USD)
              </label>
              <input
                type="number"
                min="20"
                max="5000"
                step="10"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Dietary Restrictions checkboxes */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Dietary Considerations & Allergies
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Vegetarian Options',
                'Vegan Options',
                'Gluten-Free Options',
                'Dairy-Free',
                'Nut Allergy Safe',
                'Non-Alcoholic Drinkers',
                'Halal Options',
                'Kosher Options'
              ].map((opt) => {
                const isSelected = dietaryOptions.includes(opt);
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => toggleDietary(opt)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      isSelected
                        ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {isSelected ? `✓ ${opt}` : `+ ${opt}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Extra Notes & Vibe */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Special Requests, Favorite Dishes or Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Include a signature spicy margarita, lots of chips and dips, fairy lights, and an ice cream sundae bar."
              value={vibeAndNotes}
              onChange={(e) => setVibeAndNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Complete Shopping Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Generate Party & Shopping Plan</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
