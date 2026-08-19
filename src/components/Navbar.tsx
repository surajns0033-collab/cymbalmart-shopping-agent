import React from 'react';
import { PartyPlan } from '../types';
import { computeBudgetBreakdown } from '../utils/calculator';
import { 
  Sparkles, 
  Plus, 
  Share2, 
  Bot, 
  Calculator, 
  FolderHeart,
  PartyPopper,
  DollarSign,
  CheckCircle2,
  Navigation,
  Mic
} from 'lucide-react';

interface NavbarProps {
  currentParty: PartyPlan;
  allParties: PartyPlan[];
  onSelectParty: (partyId: string) => void;
  onOpenNewPartyModal: () => void;
  onOpenPresetsModal: () => void;
  onOpenExportModal: () => void;
  onOpenCheckoutModal: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  activeTab: 'shopping' | 'route' | 'menu' | 'timeline' | 'formulas';
  onSelectTab: (tab: 'shopping' | 'route' | 'menu' | 'timeline' | 'formulas') => void;
  isVoiceActive?: boolean;
  onToggleVoice?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentParty,
  allParties,
  onSelectParty,
  onOpenNewPartyModal,
  onOpenPresetsModal,
  onOpenExportModal,
  onOpenCheckoutModal,
  onToggleChat,
  isChatOpen,
  activeTab,
  onSelectTab,
  isVoiceActive,
  onToggleVoice
}) => {
  const breakdown = computeBudgetBreakdown(currentParty);
  const percentBought = breakdown.totalCount > 0 
    ? Math.round((breakdown.purchasedCount / breakdown.totalCount) * 100) 
    : 0;

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs mb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Party selector */}
          <div className="flex flex-col justify-center gap-1 min-w-0 py-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs shrink-0 font-black text-sm tracking-tight">
                CM
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-stone-900 text-base tracking-tight">
                    CymbalMart
                  </span>
                  <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold hidden sm:inline">
                    Party Planner Agent
                  </span>
                </div>
              </div>
            </div>
            
            {/* Dropdown position adjusted underneath with spacing */}
            <div className="flex items-center mt-1 pl-1">
              <select
                id="party-selector-dropdown"
                value={currentParty.id}
                onChange={(e) => onSelectParty(e.target.value)}
                aria-label="Select Party Plan"
                className="text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-md px-2 py-1 max-w-[200px] sm:max-w-[260px] cursor-pointer focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                {allParties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            <button
              id="tab-btn-shopping"
              onClick={() => onSelectTab('shopping')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'shopping'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
              Aisles & Items ({breakdown.purchasedCount}/{breakdown.totalCount})
            </button>
            <button
              id="tab-btn-route"
              onClick={() => onSelectTab('route')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'route'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              Smart Route Map
            </button>
            <button
              id="tab-btn-menu"
              onClick={() => onSelectTab('menu')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'menu'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Menu & Recipes ({currentParty.menu?.length || 0})
            </button>
            <button
              id="tab-btn-timeline"
              onClick={() => onSelectTab('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Prep Schedule
            </button>
            <button
              id="tab-btn-formulas"
              onClick={() => onSelectTab('formulas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'formulas'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-stone-500" />
              Portion Calculator
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            
            {/* Presets Button */}
            <button
              id="btn-open-presets"
              onClick={onOpenPresetsModal}
              title="Load Party Template"
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg text-xs font-medium transition-colors hidden sm:flex items-center gap-1"
            >
              <FolderHeart className="w-4 h-4 text-rose-500" />
              <span className="hidden md:inline">Templates</span>
            </button>

            {/* Export Button */}
            <button
              id="btn-open-export"
              onClick={onOpenExportModal}
              title="Export & Share Shopping List"
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
            >
              <Share2 className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* Hands-Free Voice Control Button */}
            {onToggleVoice && (
              <button
                id="btn-nav-toggle-voice"
                onClick={onToggleVoice}
                aria-label="Toggle Hands-Free Voice Control"
                title="Hands-Free Voice Control"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${
                  isVoiceActive
                    ? 'bg-rose-600 text-white shadow-rose-600/20 ring-2 ring-rose-500/50 animate-pulse'
                    : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Voice Control</span>
              </button>
            )}

            {/* AI Assistant Drawer Toggle */}
            <button
              id="btn-toggle-ai-agent"
              onClick={onToggleChat}
              aria-label="Toggle CymbalMart AI Shopping Agent Concierge"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 ${
                isChatOpen
                  ? 'bg-amber-600 text-white shadow-amber-600/20 ring-2 ring-amber-500/50'
                  : 'bg-amber-500/10 text-amber-900 border border-amber-300/80 hover:bg-amber-500/20 hover:border-amber-400'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isChatOpen ? 'text-white' : 'text-amber-600'} transition-transform`} />
              <span className="font-semibold tracking-tight">AI Shopping Agent</span>
            </button>

            {/* Checkout Button */}
            <button
              id="btn-nav-checkout"
              onClick={onOpenCheckoutModal}
              className="bg-stone-900 hover:bg-stone-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
            >
              <span>Checkout</span>
              <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded-full font-extrabold">
                ${breakdown.estimatedTotal.toFixed(0)}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-stone-100 no-scrollbar">
          <button
            id="mobile-tab-shopping"
            onClick={() => onSelectTab('shopping')}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'shopping' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700'
            }`}
          >
            Shopping List ({breakdown.purchasedCount}/{breakdown.totalCount})
          </button>
          <button
            id="mobile-tab-menu"
            onClick={() => onSelectTab('menu')}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'menu' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700'
            }`}
          >
            Menu & Recipes
          </button>
          <button
            id="mobile-tab-timeline"
            onClick={() => onSelectTab('timeline')}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'timeline' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700'
            }`}
          >
            Prep Timeline
          </button>
          <button
            id="mobile-tab-formulas"
            onClick={() => onSelectTab('formulas')}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'formulas' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700'
            }`}
          >
            Drink & Food Calculator
          </button>
        </div>
      </div>
    </header>
  );
};
