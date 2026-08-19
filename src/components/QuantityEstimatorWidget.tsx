import React, { useState } from 'react';
import { PartyPlan } from '../types';
import { calculatePartyFormulas } from '../utils/calculator';
import { 
  Wine, 
  Beer, 
  GlassWater, 
  Snowflake, 
  UtensilsCrossed, 
  Beef, 
  Layers, 
  Info,
  Sparkles,
  Calculator
} from 'lucide-react';

interface QuantityEstimatorWidgetProps {
  party: PartyPlan;
  onUpdateHeadcount?: (adults: number, kids: number, hours: number) => void;
}

export const QuantityEstimatorWidget: React.FC<QuantityEstimatorWidgetProps> = ({
  party,
  onUpdateHeadcount
}) => {
  const [adults, setAdults] = useState(party.adultCount || 10);
  const [kids, setKids] = useState(party.childCount || 0);
  const [hours, setHours] = useState(party.durationHours || 3);

  const estimates = calculatePartyFormulas(adults, kids, hours, party.partyStyle);

  return (
    <div className="space-y-6">
      
      {/* Header & Interactive Playground */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900">Party Portion & Quantity Calculator</h2>
            <p className="text-xs text-stone-500">
              Interactive hospitality formulas for drinks, ice, proteins, and tableware
            </p>
          </div>
        </div>

        {/* Live Headcount adjusters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Adult Guests: {adults}
            </label>
            <input
              type="range"
              min="1"
              max="60"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Kids / Minors: {kids}
            </label>
            <input
              type="range"
              min="0"
              max="40"
              value={kids}
              onChange={(e) => setKids(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Event Duration: {hours} Hours
            </label>
            <input
              type="range"
              min="1"
              max="8"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
          </div>
        </div>

        {onUpdateHeadcount && (adults !== party.adultCount || kids !== party.childCount || hours !== party.durationHours) && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => onUpdateHeadcount(adults, kids, hours)}
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Sync Headcount to Party ({adults + kids} Guests)
            </button>
          </div>
        )}
      </div>

      {/* Formula Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Beverages Calculator */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-stone-100">
            <Wine className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-sm text-stone-900">Beverage Formulas</h3>
          </div>
          
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
              <span className="text-stone-600">Total Drinks Needed:</span>
              <span className="font-bold text-stone-900 text-sm">{estimates.totalDrinksNeeded} drinks</span>
            </div>
            
            <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
              <span className="text-stone-600 flex items-center gap-1">
                <Wine className="w-3.5 h-3.5 text-purple-500" /> Wine (750ml):
              </span>
              <span className="font-semibold text-stone-900">{estimates.recommendedWineBottles} bottles</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
              <span className="text-stone-600 flex items-center gap-1">
                <Beer className="w-3.5 h-3.5 text-amber-500" /> Beer & Seltzers:
              </span>
              <span className="font-semibold text-stone-900">{estimates.recommendedBeerCans} cans</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
              <span className="text-stone-600 flex items-center gap-1">
                <GlassWater className="w-3.5 h-3.5 text-sky-500" /> Non-Alcoholic / Water:
              </span>
              <span className="font-semibold text-stone-900">~{estimates.recommendedNonAlcoholicLiters} Liters</span>
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed bg-purple-50/60 p-2 rounded-lg mt-2">
              Formula: 2 drinks per guest for hour 1, plus 1 drink per guest each additional hour. 1 bottle of wine = 5 glasses.
            </p>
          </div>
        </div>

        {/* Ice & Cooling Calculator */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-stone-100">
            <Snowflake className="w-4 h-4 text-cyan-600" />
            <h3 className="font-bold text-sm text-stone-900">Ice & Cooling Formula</h3>
          </div>
          
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
              <span className="text-stone-600">Total Ice Required:</span>
              <span className="font-bold text-stone-900 text-sm">{estimates.iceLbsNeeded} lbs</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
              <span className="text-stone-600">Standard 10 lb Bags:</span>
              <span className="font-semibold text-stone-900">{Math.ceil(estimates.iceLbsNeeded / 10)} bags</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
              <span className="text-stone-600">For Drink Glasses:</span>
              <span className="font-semibold text-stone-900">~{Math.round(estimates.iceLbsNeeded * 0.4)} lbs</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
              <span className="text-stone-600">For Coolers & Chilling:</span>
              <span className="font-semibold text-stone-900">~{Math.round(estimates.iceLbsNeeded * 0.6)} lbs</span>
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed bg-cyan-50/60 p-2 rounded-lg mt-2">
              Formula: 1.5 lbs of ice per attendee (1 lb for drink ice, 0.5 lb for keeping beer/soda tubs frosty).
            </p>
          </div>
        </div>

        {/* Food & Tableware Calculator */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-stone-100">
            <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-stone-900">Food & Tableware Buffer</h3>
          </div>
          
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
              <span className="text-stone-600 flex items-center gap-1">
                <Beef className="w-3.5 h-3.5 text-rose-500" /> Raw Protein / Meat:
              </span>
              <span className="font-bold text-stone-900">{estimates.proteinLbsNeeded} lbs total</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
              <span className="text-stone-600">Appetizer Finger Bites:</span>
              <span className="font-semibold text-stone-900">{estimates.appetizerBitesNeeded} pieces</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
              <span className="text-stone-600 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-500" /> Disposable Plates (1.5x):
              </span>
              <span className="font-semibold text-stone-900">{estimates.platesNeeded} plates</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
              <span className="text-stone-600">Cups (1.8x) & Napkins (2.5x):</span>
              <span className="font-semibold text-stone-900">{estimates.cupsNeeded} cups / {estimates.napkinsNeeded} napkins</span>
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed bg-emerald-50/60 p-2 rounded-lg mt-2">
              Buffers: Guests frequently misplace cups and use extra plates for dessert. Always budget a 1.5x-2x multiplier.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
