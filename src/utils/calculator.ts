import { PartyPlan, BudgetBreakdown, ItemCategory, StoreType } from '../types';

export interface CalculatedEstimates {
  totalGuests: number;
  totalDrinksNeeded: number;
  recommendedWineBottles: number;
  recommendedBeerCans: number;
  recommendedLiquorBottles: number;
  recommendedNonAlcoholicLiters: number;
  iceLbsNeeded: number;
  appetizerBitesNeeded: number;
  proteinLbsNeeded: number;
  platesNeeded: number;
  cupsNeeded: number;
  napkinsNeeded: number;
}

export function calculatePartyFormulas(
  adults: number,
  kids: number,
  durationHours: number,
  style: PartyPlan['partyStyle']
): CalculatedEstimates {
  const totalGuests = adults + kids;
  const hours = Math.max(1, durationHours);

  // Standard beverage rule of thumb: 2 drinks first hour, 1 drink each subsequent hour
  const drinksPerAdult = 2 + (hours - 1) * 1;
  const drinksPerKid = 1.5 + (hours - 1) * 0.8;

  const totalAdultDrinks = Math.round(adults * drinksPerAdult);
  const totalKidDrinks = Math.round(kids * drinksPerKid);
  const totalDrinksNeeded = totalAdultDrinks + totalKidDrinks;

  // Assuming typical 60/40 alcoholic vs non-alcoholic split for adults when alcohol is served
  const alcoholicDrinks = Math.round(totalAdultDrinks * 0.7);
  // 1 bottle of wine = 5 glasses
  const recommendedWineBottles = Math.ceil((alcoholicDrinks * 0.4) / 5);
  // 1 can beer = 1 drink
  const recommendedBeerCans = Math.ceil(alcoholicDrinks * 0.4);
  // 1 bottle liquor 750ml = 16 standard cocktails
  const recommendedLiquorBottles = Math.ceil((alcoholicDrinks * 0.2) / 16);

  // Non alcoholic: water, sodas, juices
  const nonAlcoholicDrinks = totalKidDrinks + Math.round(totalAdultDrinks * 0.3);
  const recommendedNonAlcoholicLiters = Math.ceil((nonAlcoholicDrinks * 350) / 1000); // 350ml per drink

  // Ice formula: 1.5 lbs per person for chilling & drinks
  const iceLbsNeeded = Math.ceil(totalGuests * 1.5);

  // Food formulas
  let appetizerBitesNeeded = 0;
  let proteinLbsNeeded = 0;

  if (style === 'cocktail_party' || style === 'casual_snacks') {
    // 4-6 pieces per person per hour for cocktail party
    appetizerBitesNeeded = Math.round(totalGuests * Math.min(hours, 3) * 4);
    proteinLbsNeeded = Math.round(adults * 0.3 + kids * 0.2);
  } else if (style === 'bbq_cookout') {
    // 0.5 - 0.75 lb of raw meat per adult, 0.35 lb per kid
    proteinLbsNeeded = Math.round(adults * 0.6 + kids * 0.35);
    appetizerBitesNeeded = Math.round(totalGuests * 3);
  } else if (style === 'sit_down' || style === 'buffet') {
    proteinLbsNeeded = Math.round(adults * 0.5 + kids * 0.3);
    appetizerBitesNeeded = Math.round(totalGuests * 4);
  } else {
    // kids party
    proteinLbsNeeded = Math.round(adults * 0.4 + kids * 0.3);
    appetizerBitesNeeded = Math.round(totalGuests * 3);
  }

  // Tableware buffer
  const platesNeeded = Math.ceil(totalGuests * 1.5);
  const cupsNeeded = Math.ceil(totalGuests * 1.8);
  const napkinsNeeded = Math.ceil(totalGuests * 2.5);

  return {
    totalGuests,
    totalDrinksNeeded,
    recommendedWineBottles,
    recommendedBeerCans,
    recommendedLiquorBottles,
    recommendedNonAlcoholicLiters,
    iceLbsNeeded,
    appetizerBitesNeeded,
    proteinLbsNeeded,
    platesNeeded,
    cupsNeeded,
    napkinsNeeded
  };
}

export function computeBudgetBreakdown(party: PartyPlan): BudgetBreakdown {
  const byCategory: Record<ItemCategory, number> = {
    produce: 0,
    meat_seafood: 0,
    dairy_refrigerated: 0,
    bakery_grains: 0,
    pantry_condiments: 0,
    beverages_alcoholic: 0,
    beverages_nonalcoholic: 0,
    snacks_appetizers: 0,
    tableware_disposables: 0,
    decor_ambiance: 0,
    ice_cooler: 0,
    entertainment_favors: 0,
    cleanup_essentials: 0
  };

  const byStore: Record<StoreType, number> = {
    supermarket: 0,
    wholesale_club: 0,
    liquor_store: 0,
    party_store: 0,
    specialty_bakery: 0,
    online_delivery: 0
  };

  let estimatedTotal = 0;
  let actualSpent = 0;
  let purchasedCount = 0;
  let cymbalBrandSavingsTotal = 0;

  for (const item of party.items) {
    const price = Number(item.estimatedPrice) || 0;
    const actual = item.actualPrice !== undefined ? Number(item.actualPrice) : price;

    estimatedTotal += price;
    if (item.cymbalSavings) {
      cymbalBrandSavingsTotal += Number(item.cymbalSavings);
    } else if (item.isCymbalBrand) {
      // Default 18% savings benchmark for Cymbal brand
      cymbalBrandSavingsTotal += Math.round(price * 0.18 * 100) / 100;
    }

    if (item.isPurchased) {
      purchasedCount++;
      actualSpent += actual;
    }

    if (byCategory[item.category] !== undefined) {
      byCategory[item.category] += price;
    } else {
      byCategory.pantry_condiments += price;
    }

    if (byStore[item.store] !== undefined) {
      byStore[item.store] += price;
    } else {
      byStore.supermarket += price;
    }
  }

  const totalGuests = (party.adultCount || 0) + (party.childCount || 0) || 1;
  const costPerGuest = Math.round((estimatedTotal / totalGuests) * 100) / 100;

  return {
    targetBudget: party.budget || 0,
    estimatedTotal: Math.round(estimatedTotal * 100) / 100,
    actualSpent: Math.round(actualSpent * 100) / 100,
    purchasedCount,
    totalCount: party.items.length,
    byCategory,
    byStore,
    costPerGuest,
    cymbalBrandSavingsTotal: Math.round(cymbalBrandSavingsTotal * 100) / 100
  };
}

export const CATEGORY_LABELS: Record<ItemCategory, { label: string; icon: string; color: string }> = {
  produce: { label: 'Fresh Produce', icon: 'Apple', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  meat_seafood: { label: 'Meat & Seafood', icon: 'Beef', color: 'text-rose-700 bg-rose-50 border-rose-200' },
  dairy_refrigerated: { label: 'Dairy & Cheese', icon: 'Milk', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  bakery_grains: { label: 'Bakery & Grains', icon: 'Croissant', color: 'text-orange-700 bg-orange-50 border-orange-200' },
  pantry_condiments: { label: 'Pantry & Sauces', icon: 'Package', color: 'text-stone-700 bg-stone-50 border-stone-200' },
  beverages_alcoholic: { label: 'Beer, Wine & Spirits', icon: 'Wine', color: 'text-purple-700 bg-purple-50 border-purple-200' },
  beverages_nonalcoholic: { label: 'Soft Drinks & Mixers', icon: 'GlassWater', color: 'text-sky-700 bg-sky-50 border-sky-200' },
  snacks_appetizers: { label: 'Snacks & Bites', icon: 'Cookie', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
  tableware_disposables: { label: 'Plates, Cups & Cutlery', icon: 'Utensils', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  decor_ambiance: { label: 'Decor & Ambiance', icon: 'Sparkles', color: 'text-pink-700 bg-pink-50 border-pink-200' },
  ice_cooler: { label: 'Ice & Cold Storage', icon: 'Snowflake', color: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
  entertainment_favors: { label: 'Games & Favors', icon: 'Gift', color: 'text-teal-700 bg-teal-50 border-teal-200' },
  cleanup_essentials: { label: 'Clean-up & Bags', icon: 'Trash2', color: 'text-zinc-700 bg-zinc-50 border-zinc-200' }
};

export const STORE_LABELS: Record<StoreType, { label: string; badge: string; example: string }> = {
  supermarket: { label: 'Supermarket / Grocery', badge: 'bg-emerald-100 text-emerald-800', example: 'Trader Joe\'s, Safeway, Kroger' },
  wholesale_club: { label: 'Wholesale Club (Bulk)', badge: 'bg-blue-100 text-blue-800', example: 'Costco, Sam\'s Club' },
  liquor_store: { label: 'Beverage / Liquor Store', badge: 'bg-purple-100 text-purple-800', example: 'Total Wine, BevMo, Local Wine Shop' },
  party_store: { label: 'Party & Craft Store', badge: 'bg-pink-100 text-pink-800', example: 'Party City, Target, Michaels' },
  specialty_bakery: { label: 'Specialty / Bakery', badge: 'bg-amber-100 text-amber-800', example: 'Local Bakery, Butcher' },
  online_delivery: { label: 'Online / Fast Delivery', badge: 'bg-indigo-100 text-indigo-800', example: 'Amazon, Instacart' }
};
