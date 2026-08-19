import { PartyPlan, ShoppingItem, ItemCategory, StoreType } from '../types';

export interface VoiceCommandResult {
  recognized: boolean;
  intent: string;
  feedbackSpeech: string;
  feedbackText: string;
  action?: {
    type: 
      | 'add_item'
      | 'remove_item'
      | 'toggle_item'
      | 'update_quantity'
      | 'set_budget'
      | 'set_guests'
      | 'switch_tab'
      | 'swap_cymbal'
      | 'optimize_budget'
      | 'open_checkout'
      | 'advance_cuj'
      | 'read_summary'
      | 'general_query';
    payload?: any;
  };
}

// Speak aloud using Web Speech Synthesis if available
export function speakAloud(text: string, voiceEnabled: boolean = true) {
  if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }
  try {
    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    
    // Choose high quality English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Premium'))));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error:', e);
  }
}

// Parse natural spoken phrase into an actionable command
export function parseVoiceCommand(transcript: string, currentParty: PartyPlan): VoiceCommandResult {
  const text = transcript.trim().toLowerCase();

  // 1. Navigation / View switching
  if (text.includes('route') || text.includes('aisle') || text.includes('map') || text.includes('navigation') || text.includes('path')) {
    return {
      recognized: true,
      intent: 'switch_tab',
      feedbackSpeech: 'Opening the CymbalMart store route map and aisle navigation.',
      feedbackText: 'Switched to Smart Route Map',
      action: { type: 'switch_tab', payload: { tab: 'route' } }
    };
  }

  if (text.includes('menu') || text.includes('recipe') || text.includes('food plan') || text.includes('dishes')) {
    return {
      recognized: true,
      intent: 'switch_tab',
      feedbackSpeech: 'Showing the party menu and recipes.',
      feedbackText: 'Switched to Menu & Recipes',
      action: { type: 'switch_tab', payload: { tab: 'menu' } }
    };
  }

  if (text.includes('timeline') || text.includes('prep') || text.includes('schedule') || text.includes('to-do') || text.includes('todo')) {
    return {
      recognized: true,
      intent: 'switch_tab',
      feedbackSpeech: 'Opening your party prep schedule and timeline.',
      feedbackText: 'Switched to Prep Schedule',
      action: { type: 'switch_tab', payload: { tab: 'timeline' } }
    };
  }

  if (text.includes('calculator') || text.includes('portion') || text.includes('formula') || text.includes('estimator') || text.includes('drink count')) {
    return {
      recognized: true,
      intent: 'switch_tab',
      feedbackSpeech: 'Showing the portion and beverage calculator.',
      feedbackText: 'Switched to Portion Calculator',
      action: { type: 'switch_tab', payload: { tab: 'formulas' } }
    };
  }

  if (text.includes('shopping list') || text.includes('items') || text.includes('groceries') || text.includes('aisles and items')) {
    return {
      recognized: true,
      intent: 'switch_tab',
      feedbackSpeech: 'Showing your party shopping list.',
      feedbackText: 'Switched to Shopping List',
      action: { type: 'switch_tab', payload: { tab: 'shopping' } }
    };
  }

  // 2. Checkout / Place Order / Advance CUJ
  if (text.includes('checkout') || text.includes('place order') || text.includes('buy') || text.includes('order now') || text.includes('finish shopping')) {
    return {
      recognized: true,
      intent: 'open_checkout',
      feedbackSpeech: 'Opening checkout for CymbalMart instant order fulfillment.',
      feedbackText: 'Opening Checkout Modal',
      action: { type: 'open_checkout' }
    };
  }

  if (text.includes('next step') || text.includes('advance') || text.includes('proceed') || text.includes('continue')) {
    return {
      recognized: true,
      intent: 'advance_cuj',
      feedbackSpeech: 'Advancing to the next step in your party journey.',
      feedbackText: 'Advanced CUJ Step',
      action: { type: 'advance_cuj' }
    };
  }

  // 3. Swap to Cymbal Brands
  if (text.includes('swap all') || text.includes('switch to cymbal') || text.includes('store brand') || text.includes('save money with cymbal')) {
    return {
      recognized: true,
      intent: 'swap_cymbal',
      feedbackSpeech: 'Swapping eligible items to CymbalMart store brands for maximum savings.',
      feedbackText: 'Swapped all items to CymbalMart Brand',
      action: { type: 'swap_cymbal' }
    };
  }

  // 4. Optimize Budget
  if (text.includes('optimize budget') || text.includes('cut cost') || text.includes('reduce budget') || text.includes('save money') || text.includes('find savings')) {
    return {
      recognized: true,
      intent: 'optimize_budget',
      feedbackSpeech: 'Analyzing prices to optimize your budget.',
      feedbackText: 'Triggered AI Budget Optimizer',
      action: { type: 'optimize_budget' }
    };
  }

  // 5. Read Budget / Total Cost Summary
  if (text.includes('what is my budget') || text.includes('how much') || text.includes('total cost') || text.includes('read budget') || text.includes('spent')) {
    const total = currentParty.items.reduce((s, i) => s + (i.estimatedPrice || 0), 0);
    const guestCount = (currentParty.adultCount || 0) + (currentParty.childCount || 0) || 1;
    const perGuest = Math.round((total / guestCount) * 100) / 100;
    return {
      recognized: true,
      intent: 'read_summary',
      feedbackSpeech: `Your estimated total is $${total.toFixed(2)} for ${guestCount} guests, which comes out to $${perGuest.toFixed(2)} per person. Your budget ceiling is $${currentParty.budget}.`,
      feedbackText: `Total: $${total.toFixed(2)} ($${perGuest.toFixed(2)}/guest) • Budget: $${currentParty.budget}`,
      action: { type: 'read_summary' }
    };
  }

  // 6. Set Budget: e.g. "set budget to 300 dollars" or "budget 250"
  const budgetMatch = text.match(/(?:set |change |update )?budget (?:to )?\$?(\d+)/i);
  if (budgetMatch) {
    const newBudget = parseInt(budgetMatch[1], 10);
    if (!isNaN(newBudget) && newBudget > 0) {
      return {
        recognized: true,
        intent: 'set_budget',
        feedbackSpeech: `Updated party budget to $${newBudget}.`,
        feedbackText: `Budget set to $${newBudget}`,
        action: { type: 'set_budget', payload: { budget: newBudget } }
      };
    }
  }

  // 7. Set Guests / Headcount: e.g. "set guests to 25" or "20 adults and 5 kids" or "change headcount to 30"
  const adultKidMatch = text.match(/(\d+)\s*adults?(?:\s*(?:and|&)\s*(\d+)\s*kids?)?/i);
  if (adultKidMatch) {
    const adults = parseInt(adultKidMatch[1], 10);
    const kids = adultKidMatch[2] ? parseInt(adultKidMatch[2], 10) : currentParty.childCount;
    return {
      recognized: true,
      intent: 'set_guests',
      feedbackSpeech: `Updated party headcount to ${adults} adults and ${kids} children.`,
      feedbackText: `Headcount updated: ${adults} adults, ${kids} kids`,
      action: { type: 'set_guests', payload: { adultCount: adults, childCount: kids } }
    };
  }

  const singleGuestMatch = text.match(/(?:set |change )?(?:guests|people|attendees|headcount) (?:to )?(\d+)/i);
  if (singleGuestMatch) {
    const total = parseInt(singleGuestMatch[1], 10);
    return {
      recognized: true,
      intent: 'set_guests',
      feedbackSpeech: `Set total guest count to ${total} people.`,
      feedbackText: `Guest count set to ${total}`,
      action: { type: 'set_guests', payload: { adultCount: total, childCount: 0 } }
    };
  }

  // 8. Add Item: e.g. "add 2 packs of organic avocados for 6 dollars" or "add guacamole" or "add 3 bottles of sparkling water"
  const addMatch = text.match(/^add\s+(?:item\s+)?(?:(\d+)\s+)?(?:(packs?|bottles?|bags?|lbs?|cans?|boxes?|cases?)\s+of\s+)?(.+?)(?:\s+for\s+\$?(\d+(?:\.\d+)?))?$/i);
  if (addMatch) {
    const qty = addMatch[1] ? parseInt(addMatch[1], 10) : 1;
    const unit = addMatch[2] ? addMatch[2].trim() : 'pack';
    let rawName = addMatch[3].trim();
    // clean up price if included in name
    const price = addMatch[4] ? parseFloat(addMatch[4]) : (qty * 4.5);

    // Auto classify category & aisle
    let cat: ItemCategory = 'pantry_condiments';
    let aisle = 'Aisle 10 - Pantry Essentials';
    const lowerName = rawName.toLowerCase();

    if (lowerName.includes('avocado') || lowerName.includes('lime') || lowerName.includes('fruit') || lowerName.includes('salad') || lowerName.includes('onion') || lowerName.includes('tomato')) {
      cat = 'produce';
      aisle = 'Aisle 3 - Cymbal Fresh Produce';
    } else if (lowerName.includes('beef') || lowerName.includes('chicken') || lowerName.includes('meat') || lowerName.includes('pork') || lowerName.includes('shrimp')) {
      cat = 'meat_seafood';
      aisle = 'Aisle 5 - Meat & Seafood';
    } else if (lowerName.includes('cheese') || lowerName.includes('sour cream') || lowerName.includes('milk') || lowerName.includes('butter') || lowerName.includes('dip')) {
      cat = 'dairy_refrigerated';
      aisle = 'Aisle 8 - Dairy & Refrigerated';
    } else if (lowerName.includes('bread') || lowerName.includes('tortilla') || lowerName.includes('bun') || lowerName.includes('cake')) {
      cat = 'bakery_grains';
      aisle = 'Aisle 1 - Cymbal Bakery';
    } else if (lowerName.includes('beer') || lowerName.includes('wine') || lowerName.includes('tequila') || lowerName.includes('vodka') || lowerName.includes('margarita')) {
      cat = 'beverages_alcoholic';
      aisle = 'Aisle 16 - Beer, Wine & Spirits';
    } else if (lowerName.includes('water') || lowerName.includes('soda') || lowerName.includes('juice') || lowerName.includes('cola') || lowerName.includes('lemonade')) {
      cat = 'beverages_nonalcoholic';
      aisle = 'Aisle 14 - Cold Beverages & Mixers';
    } else if (lowerName.includes('chip') || lowerName.includes('snack') || lowerName.includes('cracker') || lowerName.includes('popcorn') || lowerName.includes('nuts')) {
      cat = 'snacks_appetizers';
      aisle = 'Aisle 12 - Snacks & Bites';
    } else if (lowerName.includes('plate') || lowerName.includes('cup') || lowerName.includes('napkin') || lowerName.includes('fork') || lowerName.includes('table')) {
      cat = 'tableware_disposables';
      aisle = 'Aisle 18 - Tableware & Decor';
    } else if (lowerName.includes('ice')) {
      cat = 'ice_cooler';
      aisle = 'Aisle 14 - Cold Storage & Ice';
    }

    const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

    return {
      recognized: true,
      intent: 'add_item',
      feedbackSpeech: `Added ${qty} ${unit} of ${formattedName} for $${price.toFixed(2)} to ${aisle}.`,
      feedbackText: `Added ${qty} ${unit} of ${formattedName} ($${price.toFixed(2)})`,
      action: {
        type: 'add_item',
        payload: {
          name: formattedName,
          category: cat,
          store: 'supermarket',
          quantity: qty,
          unit: unit,
          estimatedPrice: price,
          cymbalAisle: aisle,
          isEssential: true,
          isCymbalBrand: formattedName.toLowerCase().includes('cymbal')
        }
      }
    };
  }

  // 9. Remove / Delete Item: e.g. "remove guacamole" or "delete tortilla chips"
  const removeMatch = text.match(/^(?:remove|delete|drop)\s+(.+)$/i);
  if (removeMatch) {
    const query = removeMatch[1].trim().toLowerCase();
    const match = currentParty.items.find(i => i.name.toLowerCase().includes(query) || query.includes(i.name.toLowerCase()));
    if (match) {
      return {
        recognized: true,
        intent: 'remove_item',
        feedbackSpeech: `Removed ${match.name} from your shopping list.`,
        feedbackText: `Removed ${match.name}`,
        action: { type: 'remove_item', payload: { itemId: match.id } }
      };
    } else {
      return {
        recognized: false,
        intent: 'remove_item_not_found',
        feedbackSpeech: `Could not find an item matching ${query}.`,
        feedbackText: `No item found for "${query}"`
      };
    }
  }

  // 10. Check off / Mark purchased: e.g. "check off limes" or "mark guacamole as purchased" or "uncheck beer"
  const toggleMatch = text.match(/^(?:check(?:\s+off)?|mark|buy|purchased|uncheck|toggle)\s+(.+?)(?:\s+as\s+(?:purchased|bought|done))?$/i);
  if (toggleMatch) {
    const query = toggleMatch[1].trim().toLowerCase();
    const match = currentParty.items.find(i => i.name.toLowerCase().includes(query) || query.includes(i.name.toLowerCase()));
    if (match) {
      const willBePurchased = !match.isPurchased;
      return {
        recognized: true,
        intent: 'toggle_item',
        feedbackSpeech: willBePurchased 
          ? `Marked ${match.name} as purchased in your cart.`
          : `Unchecked ${match.name}.`,
        feedbackText: `${willBePurchased ? 'Checked off' : 'Unchecked'} ${match.name}`,
        action: { type: 'toggle_item', payload: { itemId: match.id } }
      };
    }
  }

  // 11. Update Quantity: e.g. "change limes to 4" or "increase chips to 3"
  const qtyMatch = text.match(/(?:change|set|increase|decrease|update)\s+(.+?)\s+(?:quantity\s+)?to\s+(\d+)/i);
  if (qtyMatch) {
    const query = qtyMatch[1].trim().toLowerCase();
    const newQty = parseInt(qtyMatch[2], 10);
    const match = currentParty.items.find(i => i.name.toLowerCase().includes(query) || query.includes(i.name.toLowerCase()));
    if (match && newQty > 0) {
      const unitPrice = (match.estimatedPrice || 0) / (match.quantity || 1);
      const newPrice = Math.round(unitPrice * newQty * 100) / 100;
      return {
        recognized: true,
        intent: 'update_quantity',
        feedbackSpeech: `Updated ${match.name} to ${newQty} ${match.unit} for $${newPrice.toFixed(2)}.`,
        feedbackText: `Updated ${match.name}: ${newQty} ${match.unit} ($${newPrice.toFixed(2)})`,
        action: {
          type: 'update_quantity',
          payload: { itemId: match.id, quantity: newQty, estimatedPrice: newPrice }
        }
      };
    }
  }

  // Fallback unrecognized command
  return {
    recognized: false,
    intent: 'unknown',
    feedbackSpeech: `I heard "${transcript}". Say things like "add guacamole", "show route", "swap to Cymbal", or "open checkout".`,
    feedbackText: `Heard: "${transcript}" (Try "add [item]", "show route", "checkout")`
  };
}
