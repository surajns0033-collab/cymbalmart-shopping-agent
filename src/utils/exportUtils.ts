import { PartyPlan } from '../types';
import { computeBudgetBreakdown, STORE_LABELS, CATEGORY_LABELS } from './calculator';

export function generateStoreGroupedText(party: PartyPlan): string {
  const breakdown = computeBudgetBreakdown(party);
  let output = `🎉 PARTY SHOPPING LIST: ${party.title.toUpperCase()}\n`;
  output += `📅 Date: ${party.eventDate || 'TBD'} | 👥 Guests: ${party.adultCount} adults, ${party.childCount} kids | ⏱️ Duration: ${party.durationHours} hrs\n`;
  output += `💰 Estimated Total: $${breakdown.estimatedTotal.toFixed(2)} (Budget: $${party.budget})\n`;
  output += `====================================================\n\n`;

  // Group items by store
  const storeGroups: Record<string, typeof party.items> = {};
  for (const item of party.items) {
    if (!storeGroups[item.store]) {
      storeGroups[item.store] = [];
    }
    storeGroups[item.store].push(item);
  }

  for (const [storeKey, items] of Object.entries(storeGroups)) {
    const storeInfo = STORE_LABELS[storeKey as keyof typeof STORE_LABELS];
    const storeName = storeInfo ? storeInfo.label : storeKey.toUpperCase();
    output += `🏬 [ ${storeName.toUpperCase()} ]\n`;
    
    let subtotal = 0;
    for (const item of items) {
      const check = item.isPurchased ? '[X]' : '[ ]';
      const dietary = item.dietaryTags?.length ? ` (${item.dietaryTags.join(', ')})` : '';
      const notes = item.notes ? ` - Note: ${item.notes}` : '';
      output += `  ${check} ${item.name} - Qty: ${item.quantity} ${item.unit} (~$${item.estimatedPrice.toFixed(2)})${dietary}${notes}\n`;
      subtotal += item.estimatedPrice;
    }
    output += `  Subtotal: ~$${subtotal.toFixed(2)}\n\n`;
  }

  output += `====================================================\n`;
  output += `Generated with Party Planner Shopping Agent\n`;
  return output;
}

export function generateCategoryGroupedText(party: PartyPlan): string {
  const breakdown = computeBudgetBreakdown(party);
  let output = `🎉 ${party.title.toUpperCase()} - SHOPPING CHECKLIST\n`;
  output += `Theme: ${party.theme} | Target Budget: $${party.budget} | Estimated: $${breakdown.estimatedTotal.toFixed(2)}\n\n`;

  const catGroups: Record<string, typeof party.items> = {};
  for (const item of party.items) {
    if (!catGroups[item.category]) {
      catGroups[item.category] = [];
    }
    catGroups[item.category].push(item);
  }

  for (const [catKey, items] of Object.entries(catGroups)) {
    const catInfo = CATEGORY_LABELS[catKey as keyof typeof CATEGORY_LABELS];
    const catName = catInfo ? catInfo.label : catKey.toUpperCase();
    output += `📋 ${catName}:\n`;
    for (const item of items) {
      const check = item.isPurchased ? '✅' : '⬜';
      output += `  ${check} ${item.name} (${item.quantity} ${item.unit}) - $${item.estimatedPrice.toFixed(2)}\n`;
    }
    output += `\n`;
  }

  return output;
}
