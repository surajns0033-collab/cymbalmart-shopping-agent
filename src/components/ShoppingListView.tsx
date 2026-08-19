import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { ShoppingItem, ItemCategory, StoreType } from '../types';
import { CATEGORY_LABELS, STORE_LABELS } from '../utils/calculator';
import { 
  Check, 
  Trash2, 
  Plus, 
  Minus,
  Search, 
  Sparkles, 
  Store, 
  Filter, 
  MoreVertical,
  CheckCircle2,
  Circle,
  Tag,
  Pencil,
  ArrowRightLeft,
  Save,
  X
} from 'lucide-react';

interface ShoppingListViewProps {
  items: ShoppingItem[];
  onTogglePurchased: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onUpdateItem: (itemId: string, updates: Partial<ShoppingItem>) => void;
  onAddItem: (newItem: Omit<ShoppingItem, 'id' | 'isPurchased'>) => void;
  onOpenSubstituteModal: (item: ShoppingItem) => void;
  onSwapItemToCymbalBrand?: (item: ShoppingItem) => void;
}

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  items,
  onTogglePurchased,
  onDeleteItem,
  onUpdateItem,
  onAddItem,
  onOpenSubstituteModal,
  onSwapItemToCymbalBrand
}) => {
  const [groupBy, setGroupBy] = useState<'aisle' | 'store' | 'category' | 'none'>('aisle');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStore, setFilterStore] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unpurchased' | 'purchased'>('all');
  
  // Add item form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ItemCategory>('produce');
  const [newItemStore, setNewItemStore] = useState<StoreType>('supermarket');
  const [newItemAisle, setNewItemAisle] = useState('Aisle 3 - Cymbal Fresh Produce');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('pack');
  const [newItemPrice, setNewItemPrice] = useState(5.0);

  // Edit item inline
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editQty, setEditQty] = useState(1);
  const [editUnit, setEditUnit] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editAisle, setEditAisle] = useState('');
  const [editCategory, setEditCategory] = useState<ItemCategory>('produce');

  const startEditing = (item: ShoppingItem) => {
    setEditingItemId(item.id);
    setEditName(item.name);
    setEditQty(item.quantity || 1);
    setEditUnit(item.unit || 'pack');
    setEditPrice(item.estimatedPrice || 0);
    setEditAisle(item.cymbalAisle || 'Aisle 10 - Pantry Essentials');
    setEditCategory(item.category);
  };

  const handleSaveEdit = (itemId: string) => {
    onUpdateItem(itemId, {
      name: editName.trim() || 'Item',
      quantity: Math.max(1, Number(editQty) || 1),
      unit: editUnit.trim() || 'pack',
      estimatedPrice: Math.max(0, Number(editPrice) || 0),
      cymbalAisle: editAisle,
      category: editCategory,
      isCymbalBrand: editName.toLowerCase().includes('cymbal')
    });
    setEditingItemId(null);
  };

  // Step quantity with proportional price recalculation
  const handleStepQuantity = (item: ShoppingItem, delta: number) => {
    const currentQty = Math.max(1, item.quantity || 1);
    const newQty = Math.max(1, currentQty + delta);
    if (newQty === currentQty) return;

    const unitPrice = (item.estimatedPrice || 0) / currentQty;
    const newPrice = Math.round(unitPrice * newQty * 100) / 100;
    const newSavings = item.cymbalSavings 
      ? Math.round((item.cymbalSavings / currentQty) * newQty * 100) / 100
      : undefined;

    onUpdateItem(item.id, {
      quantity: newQty,
      estimatedPrice: newPrice,
      cymbalSavings: newSavings
    });
  };

  const handleToggle = (item: ShoppingItem) => {
    onTogglePurchased(item.id);
    
    // Check if this was the last unpurchased item
    const unpurchasedCount = items.filter(i => !i.isPurchased).length;
    if (!item.isPurchased && unpurchasedCount === 1) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAddItem({
      name: newItemName.trim(),
      category: newItemCategory,
      store: newItemStore,
      cymbalAisle: newItemAisle,
      quantity: Number(newItemQty) || 1,
      unit: newItemUnit.trim() || 'pack',
      estimatedPrice: Number(newItemPrice) || 0,
      isEssential: true,
      isCymbalBrand: newItemName.toLowerCase().includes('cymbal')
    });

    setNewItemName('');
    setShowAddForm(false);
  };

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesNotes = item.notes?.toLowerCase().includes(q);
        const matchesAisle = item.cymbalAisle?.toLowerCase().includes(q);
        if (!matchesName && !matchesNotes && !matchesAisle) return false;
      }
      // Store filter
      if (filterStore !== 'all' && item.store !== filterStore) {
        return false;
      }
      // Category filter
      if (filterCategory !== 'all' && item.category !== filterCategory) {
        return false;
      }
      // Status filter
      if (filterStatus === 'unpurchased' && item.isPurchased) return false;
      if (filterStatus === 'purchased' && !item.isPurchased) return false;

      return true;
    });
  }, [items, searchQuery, filterStore, filterCategory, filterStatus]);

  // Grouping logic
  const groupedData: Record<string, ShoppingItem[]> = useMemo(() => {
    if (groupBy === 'aisle') {
      const groups: Record<string, ShoppingItem[]> = {};
      for (const item of filteredItems) {
        const aisleKey = item.cymbalAisle || 'Aisle 10 - Pantry & General Groceries';
        if (!groups[aisleKey]) groups[aisleKey] = [];
        groups[aisleKey].push(item);
      }
      return groups;
    } else if (groupBy === 'store') {
      const groups: Record<string, ShoppingItem[]> = {};
      for (const item of filteredItems) {
        if (!groups[item.store]) groups[item.store] = [];
        groups[item.store].push(item);
      }
      return groups;
    } else if (groupBy === 'category') {
      const groups: Record<string, ShoppingItem[]> = {};
      for (const item of filteredItems) {
        if (!groups[item.category]) groups[item.category] = [];
        groups[item.category].push(item);
      }
      return groups;
    }
    return { all: filteredItems };
  }, [filteredItems, groupBy]);

  return (
    <div className="space-y-4">
      
      {/* Controls Bar: Search, Filters, Group By & Add Item Button */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-shopping-items"
            type="text"
            placeholder="Search groceries, aisles, brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-colors"
          />
        </div>

        {/* Group By selector & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold text-stone-700">
            <span className="text-[11px] text-stone-400 px-1">View:</span>
            <button
              id="btn-group-by-aisle"
              onClick={() => setGroupBy('aisle')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                groupBy === 'aisle' ? 'bg-white shadow-2xs text-stone-900 font-bold' : 'hover:text-stone-900'
              }`}
            >
              Cymbal Aisles
            </button>
            <button
              id="btn-group-by-category"
              onClick={() => setGroupBy('category')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                groupBy === 'category' ? 'bg-white shadow-2xs text-stone-900' : 'hover:text-stone-900'
              }`}
            >
              Category
            </button>
            <button
              id="btn-group-by-store"
              onClick={() => setGroupBy('store')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                groupBy === 'store' ? 'bg-white shadow-2xs text-stone-900' : 'hover:text-stone-900'
              }`}
            >
              Store
            </button>
          </div>

          {/* Status Filter */}
          <select
            id="select-filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 font-medium text-stone-700 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Items ({items.length})</option>
            <option value="unpurchased">To Buy ({items.filter(i => !i.isPurchased).length})</option>
            <option value="purchased">In Cart ({items.filter(i => i.isPurchased).length})</option>
          </select>

          {/* Add Item Button */}
          <button
            id="btn-show-add-item-form"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Add Custom Item Modal / Inline Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddNewItem}
          className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between pb-2 border-b border-amber-200/50">
            <span className="text-xs font-bold text-amber-900">Add Item to CymbalMart List</span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-amber-700 hover:text-amber-900 text-xs"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Item Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Cymbal Fresh Guacamole or Tableware"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={newItemQty}
                onChange={(e) => setNewItemQty(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Unit</label>
              <input
                type="text"
                placeholder="pack, lbs, bottles"
                value={newItemUnit}
                onChange={(e) => setNewItemUnit(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Est. Price ($)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                Save Item
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">CymbalMart Aisle</label>
              <select
                value={newItemAisle}
                onChange={(e) => setNewItemAisle(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                <option value="Aisle 1 - Cymbal Bakery">Aisle 1 - Cymbal Bakery</option>
                <option value="Aisle 3 - Cymbal Fresh Produce">Aisle 3 - Cymbal Fresh Produce</option>
                <option value="Aisle 5 - Cymbal Fresh Meat & Seafood">Aisle 5 - Cymbal Fresh Meat & Seafood</option>
                <option value="Aisle 8 - Dairy & Refrigerated">Aisle 8 - Dairy & Refrigerated</option>
                <option value="Aisle 10 - Pantry & Condiments">Aisle 10 - Pantry & Condiments</option>
                <option value="Aisle 12 - Snacks & Appetizers">Aisle 12 - Snacks & Appetizers</option>
                <option value="Aisle 14 - Cold Beverages & Mixers">Aisle 14 - Cold Beverages & Mixers</option>
                <option value="Aisle 18 - Party Tableware & Decor">Aisle 18 - Party Tableware & Decor</option>
                <option value="Aisle 22 - Cleanup & Household">Aisle 22 - Cleanup & Household</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as ItemCategory)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                {Object.entries(CATEGORY_LABELS).map(([catKey, info]) => (
                  <option key={catKey} value={catKey}>{info.label}</option>
                ))}
              </select>
            </div>
          </div>
        </form>
      )}

      {/* Item Groups Listing */}
      {Object.keys(groupedData).length === 0 || filteredItems.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center">
          <p className="text-stone-500 text-sm font-medium">No shopping items match your filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterStore('all');
              setFilterCategory('all');
              setFilterStatus('all');
            }}
            className="mt-2 text-xs font-semibold text-amber-600 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedData).map(([groupKey, groupItems]) => {
            if (groupItems.length === 0) return null;

            let groupTitle = groupKey;
            let groupBadge = '';
            let subtotal = groupItems.reduce((acc, it) => acc + (Number(it.estimatedPrice) || 0), 0);

            if (groupBy === 'store') {
              const info = STORE_LABELS[groupKey as StoreType];
              groupTitle = info ? info.label : groupKey;
              groupBadge = info?.example || '';
            } else if (groupBy === 'category') {
              const info = CATEGORY_LABELS[groupKey as ItemCategory];
              groupTitle = info ? info.label : groupKey;
            } else {
              groupTitle = 'All Party Shopping Items';
            }

            return (
              <div key={groupKey} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                
                {/* Group Header */}
                <div className="bg-stone-50/80 px-4 py-2.5 border-b border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-stone-900 tracking-tight">
                      {groupTitle}
                    </span>
                    <span className="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full font-medium">
                      {groupItems.length} items
                    </span>
                    {groupBadge && (
                      <span className="text-[10px] text-stone-500 hidden sm:inline">
                        ({groupBadge})
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-stone-800">
                    Subtotal: ${subtotal.toFixed(2)}
                  </div>
                </div>

                {/* Group Items Rows */}
                <div className="divide-y divide-stone-100">
                  {groupItems.map((item) => {
                    const isEditing = editingItemId === item.id;
                    const catInfo = CATEGORY_LABELS[item.category];
                    const storeInfo = STORE_LABELS[item.store];

                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 flex flex-col gap-3 transition-colors ${
                          item.isPurchased ? 'bg-stone-50/50' : 'hover:bg-stone-50/40'
                        }`}
                      >
                        {isEditing ? (
                          /* Inline Edit Form */
                          <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                                <Pencil className="w-3.5 h-3.5 text-amber-600" />
                                Edit Shopping Item & Price
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleSaveEdit(item.id)}
                                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                  <span>Save</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingItemId(null)}
                                  className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-lg cursor-pointer"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                              <div className="sm:col-span-4">
                                <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Item Name</label>
                                <input
                                  type="text"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Quantity</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={editQty}
                                  onChange={(e) => setEditQty(Number(e.target.value))}
                                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Unit</label>
                                <input
                                  type="text"
                                  value={editUnit}
                                  onChange={(e) => setEditUnit(e.target.value)}
                                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Price ($)</label>
                                <input
                                  type="number"
                                  step="0.25"
                                  min="0"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(Number(e.target.value))}
                                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Category</label>
                                <select
                                  value={editCategory}
                                  onChange={(e) => setEditCategory(e.target.value as ItemCategory)}
                                  className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-xs"
                                >
                                  {Object.entries(CATEGORY_LABELS).map(([catKey, info]) => (
                                    <option key={catKey} value={catKey}>{info.label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Standard Item Row */
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            {/* Left: Checkbox + Name + Badges */}
                            <div className="flex items-start gap-3 min-w-0 flex-1">
                              
                              {/* Checkbox */}
                              <button
                                id={`btn-toggle-item-${item.id}`}
                                onClick={() => handleToggle(item)}
                                aria-label={`Toggle purchase for ${item.name}`}
                                className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                                  item.isPurchased
                                    ? 'bg-amber-600 border-amber-600 text-white'
                                    : 'border-stone-300 hover:border-amber-500 bg-white text-transparent'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </button>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span
                                    className={`text-xs font-semibold transition-all ${
                                      item.isPurchased
                                        ? 'line-through text-stone-400 font-normal'
                                        : 'text-stone-900'
                                    }`}
                                  >
                                    {item.name}
                                  </span>

                                  {/* Dietary Tags */}
                                  {item.dietaryTags?.map((tag, tIdx) => (
                                    <span
                                      key={tIdx}
                                      className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded-md font-medium"
                                    >
                                      {tag}
                                    </span>
                                  ))}

                                  {/* Cymbal Brand Badge */}
                                  {item.isCymbalBrand ? (
                                    <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded-md font-bold flex items-center gap-0.5">
                                      <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                                      {item.brandTier ? item.brandTier.replace('_', ' ') : 'Cymbal Brand'}
                                    </span>
                                  ) : null}

                                  {/* Cymbal Savings Pill */}
                                  {item.cymbalSavings && item.cymbalSavings > 0 ? (
                                    <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 rounded-md font-bold">
                                      Save ${item.cymbalSavings.toFixed(2)}
                                    </span>
                                  ) : null}

                                  {/* Aisle Badge if not grouped by aisle */}
                                  {groupBy !== 'aisle' && item.cymbalAisle && (
                                    <span className="text-[10px] bg-stone-100 text-stone-700 px-1.5 py-0.2 rounded-md font-medium border border-stone-200">
                                      {item.cymbalAisle}
                                    </span>
                                  )}

                                  {/* Category Badge if not grouped by category */}
                                  {groupBy !== 'category' && catInfo && (
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-medium border ${catInfo.color}`}>
                                      {catInfo.label}
                                    </span>
                                  )}

                                  {/* Store Badge if not grouped by store */}
                                  {groupBy !== 'store' && storeInfo && (
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-medium ${storeInfo.badge}`}>
                                      {storeInfo.label.split('/')[0]}
                                    </span>
                                  )}
                                </div>

                                {item.notes && (
                                  <p className="text-[11px] text-stone-500 mt-0.5 leading-tight">
                                    {item.notes}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Right: Quantity Stepper, Price & Actions */}
                            <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 self-end sm:self-auto w-full sm:w-auto pl-8 sm:pl-0">
                              
                              {/* Swap to Cymbal Brand 1-Click Action */}
                              {!item.isCymbalBrand && onSwapItemToCymbalBrand && (
                                <button
                                  onClick={() => onSwapItemToCymbalBrand(item)}
                                  title="Switch to CymbalMart store brand to save ~20%"
                                  className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <Sparkles className="w-3 h-3 text-amber-600" />
                                  <span>Switch to Cymbal</span>
                                </button>
                              )}

                              {/* Interactive Quantity Stepper with Auto-Recalculate */}
                              <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200 shadow-2xs">
                                <button
                                  type="button"
                                  onClick={() => handleStepQuantity(item, -1)}
                                  disabled={item.quantity <= 1}
                                  title="Decrease quantity (auto-recalculates budget)"
                                  className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-white rounded transition-colors disabled:opacity-30 cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => startEditing(item)}
                                  title="Click to edit quantity and price"
                                  className="text-xs font-semibold text-stone-800 px-2 hover:text-amber-600 transition-colors cursor-pointer"
                                >
                                  {item.quantity} {item.unit}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleStepQuantity(item, 1)}
                                  title="Increase quantity (auto-recalculates budget)"
                                  className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-white rounded transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Price */}
                              <div className="text-right min-w-[60px]">
                                <span className="text-xs font-bold text-stone-900">
                                  ${item.estimatedPrice.toFixed(2)}
                                </span>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-1">
                                
                                {/* Inline Edit button */}
                                <button
                                  id={`btn-edit-${item.id}`}
                                  onClick={() => startEditing(item)}
                                  title="Edit Item & Price"
                                  className="p-1 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>

                                {/* Substitute button */}
                                <button
                                  id={`btn-substitute-${item.id}`}
                                  onClick={() => onOpenSubstituteModal(item)}
                                  title="Find AI Substitute"
                                  className="p-1 text-stone-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors cursor-pointer"
                                >
                                  <ArrowRightLeft className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete button */}
                                <button
                                  id={`btn-delete-${item.id}`}
                                  onClick={() => onDeleteItem(item.id)}
                                  title="Remove Item"
                                  className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
