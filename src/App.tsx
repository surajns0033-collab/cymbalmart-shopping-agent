import React, { useState, useEffect } from 'react';
import { PartyPlan, ShoppingItem, ChatMessage, StoreType, CUJStep, OrderCheckoutSummary } from './types';
import { PRESET_PARTIES } from './data/presets';
import { computeBudgetBreakdown } from './utils/calculator';
import { Navbar } from './components/Navbar';
import { CujStepper } from './components/CujStepper';
import { BudgetSummaryCard } from './components/BudgetSummaryCard';
import { ShoppingListView } from './components/ShoppingListView';
import { StoreNavigatorView } from './components/StoreNavigatorView';
import { MenuPlanView } from './components/MenuPlanView';
import { PrepTimelineView } from './components/PrepTimelineView';
import { QuantityEstimatorWidget } from './components/QuantityEstimatorWidget';
import { AgentChatDrawer } from './components/AgentChatDrawer';
import { PartySetupModal } from './components/PartySetupModal';
import { PresetsModal } from './components/PresetsModal';
import { ExportModal } from './components/ExportModal';
import { ItemSubstituteModal } from './components/ItemSubstituteModal';
import { CheckoutModal } from './components/CheckoutModal';
import { VoiceControlFloatingHUD } from './components/VoiceControlFloatingHUD';
import { Sparkles, MessageSquare } from 'lucide-react';

const STORAGE_KEY = 'party_planner_agent_plans_v1';

export default function App() {
  const [parties, setParties] = useState<PartyPlan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load parties from localStorage', e);
    }
    return PRESET_PARTIES;
  });

  const [activePartyId, setActivePartyId] = useState<string>(() => {
    return parties[0]?.id || 'preset-taco-fiesta';
  });

  const [activeTab, setActiveTab] = useState<'shopping' | 'route' | 'menu' | 'timeline' | 'formulas'>('shopping');
  const [cujStep, setCujStep] = useState<CUJStep>('review');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(true);
  const [isNewPartyModalOpen, setIsNewPartyModalOpen] = useState(false);
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [substituteItem, setSubstituteItem] = useState<ShoppingItem | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parties));
    } catch (e) {
      console.warn('Failed to save parties to localStorage', e);
    }
  }, [parties]);

  const currentParty = parties.find((p) => p.id === activePartyId) || parties[0] || PRESET_PARTIES[0];
  const budgetBreakdown = computeBudgetBreakdown(currentParty);

  // Helper to update current active party in state
  const updateCurrentParty = (updater: (prev: PartyPlan) => PartyPlan) => {
    setParties((prevList) =>
      prevList.map((p) => (p.id === currentParty.id ? updater(p) : p))
    );
  };

  // Item Handlers
  const handleTogglePurchased = (itemId: string) => {
    updateCurrentParty((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.id === itemId ? { ...it, isPurchased: !it.isPurchased } : it
      )
    }));
  };

  const handleDeleteItem = (itemId: string) => {
    updateCurrentParty((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.id !== itemId)
    }));
  };

  const handleUpdateItem = (itemId: string, updates: Partial<ShoppingItem>) => {
    updateCurrentParty((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === itemId ? { ...it, ...updates } : it))
    }));
  };

  const handleAddItem = (newItem: Omit<ShoppingItem, 'id' | 'isPurchased'>) => {
    const itemWithId: ShoppingItem = {
      ...newItem,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      isPurchased: false
    };
    updateCurrentParty((prev) => ({
      ...prev,
      items: [itemWithId, ...prev.items]
    }));
  };

  // 1-Click Swap single item to CymbalMart store brand
  const handleSwapItemToCymbalBrand = (item: ShoppingItem) => {
    const originalPrice = Number(item.estimatedPrice) || 0;
    const discountedPrice = Math.max(1, Math.round(originalPrice * 0.8 * 100) / 100);
    const savings = Math.round((originalPrice - discountedPrice) * 100) / 100;
    const cymbalName = item.name.toLowerCase().startsWith('cymbal')
      ? item.name
      : `Cymbal ${item.name}`;

    updateCurrentParty((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.id === item.id
          ? {
              ...it,
              name: cymbalName,
              isCymbalBrand: true,
              brandTier: 'cymbal_select',
              estimatedPrice: discountedPrice,
              cymbalSavings: savings,
              cymbalAisle: it.cymbalAisle || 'Aisle 10 - Cymbal Groceries & Essentials'
            }
          : it
      )
    }));
  };

  // Swap ALL items to CymbalMart brand to optimize total party budget
  const handleSwapAllCymbalBrands = () => {
    updateCurrentParty((prev) => ({
      ...prev,
      items: prev.items.map((it) => {
        if (it.isCymbalBrand) return it;
        const originalPrice = Number(it.estimatedPrice) || 0;
        const discountedPrice = Math.max(1, Math.round(originalPrice * 0.8 * 100) / 100);
        const savings = Math.round((originalPrice - discountedPrice) * 100) / 100;
        const cymbalName = it.name.toLowerCase().startsWith('cymbal')
          ? it.name
          : `Cymbal ${it.name}`;

        return {
          ...it,
          name: cymbalName,
          isCymbalBrand: true,
          brandTier: 'cymbal_select',
          estimatedPrice: discountedPrice,
          cymbalSavings: savings,
          cymbalAisle: it.cymbalAisle || 'Aisle 10 - Cymbal Groceries & Essentials'
        };
      })
    }));
  };

  const handleReplaceItem = (
    oldItemId: string,
    substitute: {
      name: string;
      estimatedPrice: number;
      store: StoreType;
      notes: string;
      dietaryTags?: string[];
    }
  ) => {
    updateCurrentParty((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.id === oldItemId
          ? {
              ...it,
              name: substitute.name,
              estimatedPrice: substitute.estimatedPrice,
              store: substitute.store,
              notes: substitute.notes,
              dietaryTags: substitute.dietaryTags || it.dietaryTags,
              isCymbalBrand: substitute.name.toLowerCase().includes('cymbal')
            }
          : it
      )
    }));
  };

  // Timeline Task toggle
  const handleToggleTask = (taskId: string) => {
    updateCurrentParty((prev) => ({
      ...prev,
      prepSchedule: (prev.prepSchedule || []).map((task) =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    }));
  };

  // Sync Headcount from Quantity calculator
  const handleUpdateHeadcount = (adults: number, kids: number, hours: number) => {
    updateCurrentParty((prev) => ({
      ...prev,
      adultCount: adults,
      childCount: kids,
      durationHours: hours
    }));
  };

  // Handle Agent Action Proposals (Adding / Removing / Updating items directly from AI Chat)
  const handleApplyAgentAction = (proposal: ChatMessage['actionProposal']) => {
    if (!proposal) return;

    updateCurrentParty((prev) => {
      let updatedItems = [...prev.items];

      // 1. Remove items if requested
      if (proposal.itemIdsToRemove && proposal.itemIdsToRemove.length > 0) {
        const toRemoveSet = new Set(proposal.itemIdsToRemove);
        updatedItems = updatedItems.filter((it) => !toRemoveSet.has(it.id));
      }

      // 2. Add new items if requested
      if (proposal.itemsToAdd && proposal.itemsToAdd.length > 0) {
        const newFormatted = proposal.itemsToAdd.map((it, idx) => ({
          ...it,
          id: `ai-item-${Date.now()}-${idx}`,
          isPurchased: false
        }));
        updatedItems = [...newFormatted, ...updatedItems];
      }

      // 3. Update existing items
      if (proposal.itemsToUpdate && proposal.itemsToUpdate.length > 0) {
        const updateMap = new Map(proposal.itemsToUpdate.map((u) => [u.id, u]));
        updatedItems = updatedItems.map((it) => {
          const u = updateMap.get(it.id);
          if (u) {
            return {
              ...it,
              name: u.name || it.name,
              quantity: u.quantity !== undefined ? u.quantity : it.quantity,
              estimatedPrice: u.estimatedPrice !== undefined ? u.estimatedPrice : it.estimatedPrice,
              notes: u.notes || it.notes,
              cymbalAisle: u.cymbalAisle || it.cymbalAisle,
              isCymbalBrand: u.isCymbalBrand !== undefined ? u.isCymbalBrand : it.isCymbalBrand,
              cymbalSavings: u.cymbalSavings !== undefined ? u.cymbalSavings : it.cymbalSavings
            };
          }
          return it;
        });
      }

      return {
        ...prev,
        items: updatedItems
      };
    });
  };

  const handlePartyCreated = (newParty: PartyPlan) => {
    setParties((prev) => [newParty, ...prev]);
    setActivePartyId(newParty.id);
    setCujStep('review');
  };

  const handleSelectPreset = (preset: PartyPlan) => {
    setParties((prev) => [preset, ...prev]);
    setActivePartyId(preset.id);
    setCujStep('review');
  };

  const handleUpdatePartyBudget = (newBudget: number) => {
    updateCurrentParty((prev) => ({
      ...prev,
      budget: Math.max(10, newBudget)
    }));
  };

  const handleUpdatePartyGuests = (adults: number, kids: number) => {
    updateCurrentParty((prev) => ({
      ...prev,
      adultCount: Math.max(1, adults),
      childCount: Math.max(0, kids)
    }));
  };

  const handleAdvanceCUJ = () => {
    const steps: CUJStep[] = ['define', 'review', 'refine_checkout'];
    const currIdx = steps.indexOf(cujStep);
    if (currIdx < steps.length - 1) {
      const next = steps[currIdx + 1];
      setCujStep(next);
      if (next === 'refine_checkout') {
        setIsCheckoutModalOpen(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900 pb-20">
      
      {/* Top Navbar */}
      <Navbar
        currentParty={currentParty}
        allParties={parties}
        onSelectParty={setActivePartyId}
        onOpenNewPartyModal={() => setIsNewPartyModalOpen(true)}
        onOpenPresetsModal={() => setIsPresetsModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenCheckoutModal={() => setIsCheckoutModalOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isVoiceActive={isVoiceActive}
        onToggleVoice={() => setIsVoiceActive(!isVoiceActive)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* CUJ Stepper */}
        <CujStepper
          currentStep={cujStep}
          onSelectStep={(step) => {
            setCujStep(step);
            if (step === 'refine_checkout') {
              setIsCheckoutModalOpen(true);
            }
          }}
          party={currentParty}
          budgetBreakdown={budgetBreakdown}
          onOpenDefineModal={() => setIsNewPartyModalOpen(true)}
          onOpenCheckoutModal={() => setIsCheckoutModalOpen(true)}
        />

        {/* Top Summary Card with Budget & Spend */}
        <BudgetSummaryCard
          party={currentParty}
          onApplyOptimizationProposal={(tip) => {
            setIsChatOpen(true);
          }}
          onSwapAllCymbalBrands={handleSwapAllCymbalBrands}
          onOpenAgentChat={() => setIsChatOpen(true)}
        />

        {/* Tab Views */}
        {activeTab === 'shopping' && (
          <ShoppingListView
            items={currentParty.items || []}
            onTogglePurchased={handleTogglePurchased}
            onDeleteItem={handleDeleteItem}
            onUpdateItem={handleUpdateItem}
            onAddItem={handleAddItem}
            onOpenSubstituteModal={setSubstituteItem}
            onSwapItemToCymbalBrand={handleSwapItemToCymbalBrand}
          />
        )}

        {activeTab === 'route' && (
          <StoreNavigatorView
            party={currentParty}
            items={currentParty.items || []}
            onTogglePurchased={handleTogglePurchased}
            onOpenAgentChat={(prompt) => {
              setIsChatOpen(true);
            }}
          />
        )}

        {activeTab === 'menu' && (
          <MenuPlanView menu={currentParty.menu || []} />
        )}

        {activeTab === 'timeline' && (
          <PrepTimelineView
            tasks={currentParty.prepSchedule || []}
            onToggleTask={handleToggleTask}
          />
        )}

        {activeTab === 'formulas' && (
          <QuantityEstimatorWidget
            party={currentParty}
            onUpdateHeadcount={handleUpdateHeadcount}
          />
        )}
      </main>

      {/* Hands-Free Voice Control HUD */}
      <VoiceControlFloatingHUD
        party={currentParty}
        onAddItem={handleAddItem}
        onDeleteItem={handleDeleteItem}
        onTogglePurchased={handleTogglePurchased}
        onUpdateItem={handleUpdateItem}
        onUpdatePartyBudget={handleUpdatePartyBudget}
        onUpdatePartyGuests={handleUpdatePartyGuests}
        onSelectTab={setActiveTab}
        onSwapAllCymbalBrands={handleSwapAllCymbalBrands}
        onOpenCheckout={() => setIsCheckoutModalOpen(true)}
        onAdvanceCUJ={handleAdvanceCUJ}
        isVoiceActive={isVoiceActive}
        setIsVoiceActive={setIsVoiceActive}
      />

      {/* Floating CymbalMart Assistant Launcher Button */}
      {!isChatOpen && (
        <button
          id="btn-floating-assistant"
          onClick={() => setIsChatOpen(true)}
          aria-label="Open CymbalMart Assistant"
          className="fixed bottom-6 right-6 z-30 bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2.5 font-bold text-xs cursor-pointer active:scale-95 group"
        >
          <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
          </div>
          <span>CymbalMart Assistant</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      )}

      {/* Interactive AI Shopping Agent Chat Drawer */}
      <AgentChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        party={currentParty}
        onApplyAgentAction={handleApplyAgentAction}
      />

      {/* Modals */}
      <PartySetupModal
        isOpen={isNewPartyModalOpen}
        onClose={() => setIsNewPartyModalOpen(false)}
        onPartyCreated={handlePartyCreated}
      />

      <PresetsModal
        isOpen={isPresetsModalOpen}
        onClose={() => setIsPresetsModalOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      <ExportModal
        party={currentParty}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <ItemSubstituteModal
        item={substituteItem}
        onClose={() => setSubstituteItem(null)}
        onReplaceItem={handleReplaceItem}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        party={currentParty}
      />

    </div>
  );
}

