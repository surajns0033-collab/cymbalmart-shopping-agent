export type ItemCategory =
  | 'produce'
  | 'meat_seafood'
  | 'dairy_refrigerated'
  | 'bakery_grains'
  | 'pantry_condiments'
  | 'beverages_alcoholic'
  | 'beverages_nonalcoholic'
  | 'snacks_appetizers'
  | 'tableware_disposables'
  | 'decor_ambiance'
  | 'ice_cooler'
  | 'entertainment_favors'
  | 'cleanup_essentials';

export type StoreType =
  | 'supermarket'
  | 'wholesale_club'
  | 'liquor_store'
  | 'party_store'
  | 'specialty_bakery'
  | 'online_delivery';

export interface ShoppingItem {
  id: string;
  name: string;
  category: ItemCategory;
  store: StoreType;
  quantity: number;
  unit: string;
  estimatedPrice: number;
  actualPrice?: number;
  isPurchased: boolean;
  notes?: string;
  dietaryTags?: string[]; // e.g. ['Gluten-Free', 'Vegan', 'Nut-Free']
  isEssential?: boolean;
  suggestedAlternative?: string;
  servingsCount?: number;
  cymbalAisle?: string;
  isCymbalBrand?: boolean;
  brandTier?: 'Cymbal Select' | 'Cymbal Fresh' | 'Cymbal Essentials' | 'National Brand' | 'cymbal_select' | 'cymbal_fresh' | 'cymbal_essentials' | string;
  cymbalSavings?: number;
  sku?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  type: 'appetizer' | 'main' | 'side' | 'dessert' | 'cocktail' | 'beverage' | 'snack';
  servings: number;
  dietaryNotes?: string[];
  ingredientsList: string[];
  prepNotes?: string;
}

export interface PrepTask {
  id: string;
  timeframe: '3_days_before' | '1_day_before' | 'day_of_morning' | '1_hour_before' | 'during_party';
  task: string;
  category: 'shopping' | 'food_prep' | 'decor' | 'drinks' | 'cleanup';
  isCompleted: boolean;
  assignedTo?: string;
}

export interface PartyPlan {
  id: string;
  title: string;
  theme: string;
  createdAt: string;
  eventDate?: string;
  adultCount: number;
  childCount: number;
  durationHours: number;
  partyStyle: 'casual_snacks' | 'buffet' | 'sit_down' | 'cocktail_party' | 'bbq_cookout' | 'kids_party';
  budget: number;
  dietaryRestrictions: string[];
  vibeAndNotes: string;
  items: ShoppingItem[];
  menu: MenuItem[];
  prepSchedule: PrepTask[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  actionProposal?: {
    type: 'add_items' | 'remove_items' | 'modify_items' | 'update_budget' | 'swap_item';
    description: string;
    itemsToAdd?: Omit<ShoppingItem, 'id' | 'isPurchased'>[];
    itemIdsToRemove?: string[];
    itemsToUpdate?: {
      id: string;
      name?: string;
      quantity?: number;
      estimatedPrice?: number;
      notes?: string;
      cymbalAisle?: string;
      isCymbalBrand?: boolean;
      cymbalSavings?: number;
      changes?: Partial<ShoppingItem>;
    }[];
  };
}

export interface BudgetBreakdown {
  targetBudget: number;
  estimatedTotal: number;
  actualSpent: number;
  purchasedCount: number;
  totalCount: number;
  byCategory: Record<ItemCategory, number>;
  byStore: Record<StoreType, number>;
  costPerGuest: number;
  cymbalBrandSavingsTotal: number;
}

export type CUJStep = 'define' | 'review' | 'refine_checkout';

export interface OrderCheckoutSummary {
  orderId: string;
  partyTitle: string;
  itemCount: number;
  subtotal: number;
  cymbalSavings: number;
  estimatedTax: number;
  fulfillmentFee: number;
  finalTotal: number;
  fulfillmentMethod: 'curbside_pickup' | 'express_delivery' | 'in_store_smart_cart';
  scheduledTime: string;
  pickupLocation: string;
  paymentMethod: string;
  items: ShoppingItem[];
}
