import React, { useState } from 'react';
import { ShoppingItem, PartyPlan } from '../types';
import { 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Sparkles, 
  Search, 
  Compass, 
  Store, 
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface StoreNavigatorViewProps {
  party: PartyPlan;
  items: ShoppingItem[];
  onTogglePurchased: (itemId: string) => void;
  onOpenAgentChat: (customPrompt?: string) => void;
}

interface AisleGroup {
  aisleNumber: string;
  aisleName: string;
  department: string;
  color: string;
  iconName: string;
  items: ShoppingItem[];
}

export const StoreNavigatorView: React.FC<StoreNavigatorViewProps> = ({
  party,
  items,
  onTogglePurchased,
  onOpenAgentChat
}) => {
  const [selectedAisle, setSelectedAisle] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Standard CymbalMart Supermarket Aisle Flow
  const aisleOrder = [
    { key: 'Aisle 1', name: 'Aisle 1 - Cymbal Bakery & Breads', dept: 'Bakery & Fresh Buns', color: 'bg-amber-50 text-amber-900 border-amber-200' },
    { key: 'Aisle 3', name: 'Aisle 3 - Cymbal Fresh Produce', dept: 'Fruits, Greens & Dips', color: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
    { key: 'Aisle 5', name: 'Aisle 5 - Cymbal Fresh Meat & Seafood', dept: 'Butcher & Protein Counter', color: 'bg-rose-50 text-rose-900 border-rose-200' },
    { key: 'Aisle 8', name: 'Aisle 8 - Dairy & Refrigerated', dept: 'Cheeses, Creams & Butter', color: 'bg-blue-50 text-blue-900 border-blue-200' },
    { key: 'Aisle 10', name: 'Aisle 10 - Pantry Essentials', dept: 'Sauces, Rice & Spices', color: 'bg-amber-50 text-amber-900 border-amber-200' },
    { key: 'Aisle 12', name: 'Aisle 12 - Snacks & Appetizers', dept: 'Chips, Nuts & Finger Foods', color: 'bg-orange-50 text-orange-900 border-orange-200' },
    { key: 'Aisle 14', name: 'Aisle 14 - Cold Beverages', dept: 'Seltzers, Sodas & Party Ice', color: 'bg-cyan-50 text-cyan-900 border-cyan-200' },
    { key: 'Aisle 16', name: 'Aisle 16 - Beer & Wine', dept: 'Craft Beers, Wine & Spirits', color: 'bg-purple-50 text-purple-900 border-purple-200' },
    { key: 'Aisle 18', name: 'Aisle 18 - Party Tableware', dept: 'Plates, Cups & Cutlery', color: 'bg-teal-50 text-teal-900 border-teal-200' },
    { key: 'Aisle 20', name: 'Aisle 20 - Party Decor', dept: 'Banners, Balloons & Lights', color: 'bg-fuchsia-50 text-fuchsia-900 border-fuchsia-200' },
    { key: 'Aisle 22', name: 'Aisle 22 - Cleanup & Household', dept: 'Trash Bags & Wipes', color: 'bg-stone-100 text-stone-900 border-stone-300' }
  ];

  // Group items by matched aisle
  const groupedAisles: AisleGroup[] = aisleOrder.map((aisle) => {
    const aisleItems = items.filter((item) => {
      const aisleString = (item.cymbalAisle || '').toLowerCase();
      const matchKey = aisle.key.toLowerCase();
      if (aisleString.includes(matchKey)) return true;

      // Fallback matching by category if aisle not explicitly tagged
      if (aisle.key === 'Aisle 1' && item.category === 'bakery_grains') return true;
      if (aisle.key === 'Aisle 3' && item.category === 'produce') return true;
      if (aisle.key === 'Aisle 5' && item.category === 'meat_seafood') return true;
      if (aisle.key === 'Aisle 8' && item.category === 'dairy_refrigerated') return true;
      if (aisle.key === 'Aisle 10' && item.category === 'pantry_condiments') return true;
      if (aisle.key === 'Aisle 12' && item.category === 'snacks_appetizers') return true;
      if (aisle.key === 'Aisle 14' && (item.category === 'beverages_nonalcoholic' || item.category === 'ice_cooler')) return true;
      if (aisle.key === 'Aisle 16' && item.category === 'beverages_alcoholic') return true;
      if (aisle.key === 'Aisle 18' && item.category === 'tableware_disposables') return true;
      if (aisle.key === 'Aisle 20' && (item.category === 'decor_ambiance' || item.category === 'entertainment_favors')) return true;
      if (aisle.key === 'Aisle 22' && item.category === 'cleanup_essentials') return true;

      return false;
    });

    return {
      aisleNumber: aisle.key,
      aisleName: aisle.name,
      department: aisle.dept,
      color: aisle.color,
      iconName: aisle.key,
      items: aisleItems
    };
  }).filter((group) => group.items.length > 0);

  const totalItemsCount = items.length;
  const purchasedCount = items.filter((i) => i.isPurchased).length;
  const progressPercent = totalItemsCount > 0 ? Math.round((purchasedCount / totalItemsCount) * 100) : 0;
  const estimatedWalkMinutes = Math.max(8, groupedAisles.length * 2 + 5);

  const filteredGroups = groupedAisles.map((group) => ({
    ...group,
    items: group.items.filter((it) => 
      it.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.aisleName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter((group) => group.items.length > 0);

  return (
    <div className="space-y-6">
      {/* Smart Route Header Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-stone-900">
              CymbalMart Smart Route Navigator
            </h2>
            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Optimized Walking Path
            </span>
          </div>
          <p className="text-xs text-stone-600 max-w-xl">
            Pre-sorted in sequence from store entrance to checkout lanes. Avoids backtracking across aisles for fast, efficient party shopping.
          </p>
        </div>

        {/* Stats Pills */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-left">
            <span className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider">Aisle Stops</span>
            <span className="text-sm font-black text-stone-900">{groupedAisles.length} Aisles</span>
          </div>
          <div className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-left">
            <span className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" /> Walk Time
            </span>
            <span className="text-sm font-black text-emerald-600">~{estimatedWalkMinutes} mins</span>
          </div>
          <button
            onClick={() => onOpenAgentChat('Can you help find aisle locations or substitute an item at CymbalMart?')}
            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-200 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Ask Assistant</span>
          </button>
        </div>
      </div>

      {/* Progress & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Progress bar */}
        <div className="w-full sm:w-1/2 bg-white border border-stone-200 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1.5">
            <span>In-Store Cart Progress</span>
            <span className="text-amber-600">{purchasedCount} of {totalItemsCount} items ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-amber-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Search input */}
        <div className="w-full sm:w-1/2 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items or aisles in your route..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-stone-200 rounded-xl shadow-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Sequential Aisle Pathway */}
      <div className="space-y-4">
        {filteredGroups.map((group, gIdx) => {
          const groupPurchased = group.items.filter((i) => i.isPurchased).length;
          const isAllChecked = groupPurchased === group.items.length && group.items.length > 0;

          return (
            <div
              key={group.aisleNumber}
              className={`bg-white border rounded-2xl overflow-hidden transition-all shadow-xs ${
                isAllChecked ? 'border-emerald-200 bg-emerald-50/20' : 'border-stone-200'
              }`}
            >
              {/* Aisle Banner */}
              <div className="p-4 border-b border-stone-100 flex items-center justify-between gap-3 bg-stone-50/50">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-stone-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {gIdx + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                      <span>{group.aisleName}</span>
                      {isAllChecked && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-stone-500">{group.department}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-stone-700">
                    {groupPurchased} / {group.items.length} collected
                  </span>
                </div>
              </div>

              {/* Items List in this Aisle */}
              <div className="divide-y divide-stone-100">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 flex items-center justify-between gap-3 transition-colors hover:bg-stone-50/60 ${
                      item.isPurchased ? 'bg-stone-50/50 text-stone-400' : 'text-stone-900'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => onTogglePurchased(item.id)}
                        className="text-stone-400 hover:text-amber-600 transition-colors cursor-pointer shrink-0"
                      >
                        {item.isPurchased ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-stone-300" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-semibold ${item.isPurchased ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                            {item.name}
                          </span>
                          {item.isCymbalBrand && (
                            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                              {item.brandTier || 'Cymbal Brand'}
                            </span>
                          )}
                          {item.isEssential && (
                            <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                              Essential
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500">
                          Qty: {item.quantity} {item.unit} {item.notes ? `• ${item.notes}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-stone-900">
                        ${(item.estimatedPrice || 0).toFixed(2)}
                      </span>
                      {item.cymbalSavings && item.cymbalSavings > 0 && (
                        <p className="text-[10px] font-semibold text-emerald-600">
                          Save ${item.cymbalSavings.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
