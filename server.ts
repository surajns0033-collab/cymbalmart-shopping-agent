import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Fallback generators for party planning and shopping agent logic
function generatePartyPlanFallback(params: {
  title?: string;
  theme?: string;
  adultCount?: number;
  childCount?: number;
  durationHours?: number;
  partyStyle?: string;
  budget?: number;
  dietaryRestrictions?: string[];
  vibeAndNotes?: string;
}) {
  const adultCount = Number(params.adultCount) || 10;
  const childCount = Number(params.childCount) || 0;
  const totalGuests = Math.max(1, adultCount + childCount);
  const targetBudget = Number(params.budget) || 200;
  const title = params.title || params.theme || "Party Celebration";
  const theme = params.theme || "Festive Gathering";
  const partyStyle = params.partyStyle || "buffet";
  const dietary = params.dietaryRestrictions || [];
  const timestamp = Date.now();

  const isBBQ = theme.toLowerCase().includes("bbq") || partyStyle === "bbq_cookout";
  const isTaco = theme.toLowerCase().includes("taco") || theme.toLowerCase().includes("mexican") || title.toLowerCase().includes("fiesta");
  const isTropical = theme.toLowerCase().includes("tropical") || theme.toLowerCase().includes("luau") || theme.toLowerCase().includes("island") || title.toLowerCase().includes("tropical");
  const isCocktail = partyStyle === "cocktail_party" || theme.toLowerCase().includes("cocktail");
  const isKids = partyStyle === "kids_party" || childCount > adultCount;

  // Curated shopping templates
  let itemsTemplate = [];

  if (isTropical) {
    itemsTemplate = [
      { name: "Cymbal Fresh Hawaiian Teriyaki Glazed Chicken Thighs & Skewers (6 lbs)", category: "meat_seafood", store: "supermarket", quantity: 6, unit: "lbs", price: 28.0, aisle: "Aisle 5 - Cymbal Fresh Meat & Seafood", isCymbal: true, tier: "Cymbal Fresh", savings: 7.0 },
      { name: "Cymbal Fresh Wild Caught Jumbo Coconut Shrimp & Sweet Chili Dip", category: "meat_seafood", store: "supermarket", quantity: 2, unit: "lbs", price: 18.0, aisle: "Aisle 5 - Cymbal Fresh Meat & Seafood", isCymbal: true, tier: "Cymbal Fresh", savings: 4.5 },
      { name: "Cymbal Bakery Sweet Hawaiian King Dinner Rolls (3 packs)", category: "bakery_grains", store: "supermarket", quantity: 3, unit: "packs", price: 9.0, aisle: "Aisle 1 - Cymbal Bakery", isCymbal: true, tier: "Cymbal Select", savings: 2.5 },
      { name: "Cymbal Fresh Golden Pineapples, Mangoes, Kiwi & Passionfruit (Bulk)", category: "produce", store: "supermarket", quantity: 1, unit: "bulk crate", price: 16.5, aisle: "Aisle 3 - Cymbal Fresh Produce", isCymbal: true, tier: "Cymbal Fresh", savings: 4.0 },
      { name: "Cymbal Select Tropical Mango Guacamole & Plantain Chips", category: "snacks_appetizers", store: "supermarket", quantity: 3, unit: "bags", price: 9.5, aisle: "Aisle 12 - Snacks & Appetizers", isCymbal: true, tier: "Cymbal Select", savings: 2.5 },
      { name: "Cymbal Bakery Custom Tropical Birthday Cake (Mango & Passionfruit)", category: "bakery_grains", store: "supermarket", quantity: 1, unit: "cake (10 inch)", price: 26.0, aisle: "Aisle 1 - Cymbal Bakery", isCymbal: true, tier: "Cymbal Select", savings: 6.0 },
      { name: "Spiced Island Rum & Tropical Mai Tai Cocktail Mixers (750ml)", category: "beverages_alcoholic", store: "liquor_store", quantity: 2, unit: "bottles", price: 32.0, aisle: "Aisle 16 - Beer & Wine", isCymbal: false, tier: "National Brand", savings: 0 },
      { name: "Cymbal Pure 100% Coconut Water & Sparkling Guava Punch (24 cans)", category: "beverages_nonalcoholic", store: "supermarket", quantity: 1, unit: "case", price: 12.5, aisle: "Aisle 14 - Cold Beverages", isCymbal: true, tier: "Cymbal Essentials", savings: 3.5 },
      { name: "Cymbal Pure Party Ice (30 lbs)", category: "ice_cooler", store: "supermarket", quantity: 3, unit: "bags", price: 9.0, aisle: "Aisle 14 - Cold Beverages", isCymbal: true, tier: "Cymbal Essentials", savings: 2.5 },
      { name: "Cymbal Essentials Tropical Palm Leaf Plates, Bamboo Cutlery & Napkins (100 ct)", category: "tableware_disposables", store: "supermarket", quantity: 1, unit: "combo pack", price: 15.0, aisle: "Aisle 18 - Party Tableware", isCymbal: true, tier: "Cymbal Essentials", savings: 4.5 },
      { name: "Tropical Hibiscus Flower Leis, Tiki Torches & String Lights", category: "decor_ambiance", store: "party_store", quantity: 1, unit: "decor kit", price: 14.0, aisle: "Aisle 20 - Party Decor", isCymbal: false, tier: "National Brand", savings: 0 },
      { name: "Cymbal Heavy Duty Drawstring Trash Bags & Disinfecting Wipes", category: "cleanup_essentials", store: "supermarket", quantity: 1, unit: "pack", price: 7.0, aisle: "Aisle 22 - Cleanup & Household", isCymbal: true, tier: "Cymbal Essentials", savings: 2.0 }
    ];
  } else if (isTaco) {
    itemsTemplate = [
      { name: "Cymbal Fresh Seasoned Pork Carnitas & Chicken (4 lbs)", category: "meat_seafood", store: "supermarket", quantity: 4, unit: "lbs", price: 22.0, aisle: "Aisle 5 - Cymbal Fresh Meat & Seafood", isCymbal: true, tier: "Cymbal Fresh", savings: 5.5 },
      { name: "Cymbal Select Corn & Flour Tortillas (3 packs)", category: "bakery_grains", store: "supermarket", quantity: 3, unit: "packs", price: 7.5, aisle: "Aisle 1 - Cymbal Bakery", isCymbal: true, tier: "Cymbal Select", savings: 2.0 },
      { name: "Cymbal Fresh Hass Avocados for Guacamole (8 ct)", category: "produce", store: "supermarket", quantity: 8, unit: "ct", price: 10.0, aisle: "Aisle 3 - Cymbal Fresh Produce", isCymbal: true, tier: "Cymbal Fresh", savings: 3.0 },
      { name: "Cymbal Fresh Roma Tomatoes, Jalapenos & Limes (2 lbs)", category: "produce", store: "supermarket", quantity: 2, unit: "lbs", price: 6.5, aisle: "Aisle 3 - Cymbal Fresh Produce", isCymbal: true, tier: "Cymbal Fresh", savings: 1.5 },
      { name: "Cymbal Select Mexican Blend Shredded Cheese (32 oz)", category: "dairy_refrigerated", store: "supermarket", quantity: 2, unit: "packs", price: 8.5, aisle: "Aisle 8 - Dairy & Refrigerated", isCymbal: true, tier: "Cymbal Select", savings: 2.5 },
      { name: "Cymbal Select Organic Black Beans & Spanish Rice (4 cans)", category: "pantry_condiments", store: "supermarket", quantity: 4, unit: "cans", price: 5.5, aisle: "Aisle 10 - Pantry Essentials", isCymbal: true, tier: "Cymbal Select", savings: 1.8 },
      { name: "Cymbal Select Restaurant Style Tortilla Chips (3 bags)", category: "snacks_appetizers", store: "supermarket", quantity: 3, unit: "bags", price: 9.0, aisle: "Aisle 12 - Snacks & Appetizers", isCymbal: true, tier: "Cymbal Select", savings: 2.5 },
      { name: "Silver Tequila & Triple Sec Margarita Mix (750ml)", category: "beverages_alcoholic", store: "liquor_store", quantity: 1, unit: "bottle", price: 24.0, aisle: "Aisle 16 - Beer & Wine", isCymbal: false, tier: "National Brand", savings: 0 },
      { name: "Cymbal Sparkling Flavored Seltzers & Soda (24 pack)", category: "beverages_nonalcoholic", store: "supermarket", quantity: 1, unit: "case", price: 8.5, aisle: "Aisle 14 - Cold Beverages", isCymbal: true, tier: "Cymbal Essentials", savings: 3.5 },
      { name: "Cymbal Pure Party Ice (20 lbs)", category: "ice_cooler", store: "supermarket", quantity: 2, unit: "bags", price: 6.0, aisle: "Aisle 14 - Cold Beverages", isCymbal: true, tier: "Cymbal Essentials", savings: 2.0 },
      { name: "Cymbal Essentials Heavy Duty Plates, Bowls & Napkins (100 ct)", category: "tableware_disposables", store: "supermarket", quantity: 1, unit: "combo pack", price: 11.0, aisle: "Aisle 18 - Party Tableware", isCymbal: true, tier: "Cymbal Essentials", savings: 3.0 },
      { name: "Festive Papel Picado Banner & Colorful Table Runner", category: "decor_ambiance", store: "party_store", quantity: 1, unit: "set", price: 9.5, aisle: "Aisle 20 - Party Decor", isCymbal: false, tier: "National Brand", savings: 0 },
      { name: "Cymbal Heavy Duty Drawstring Trash Bags & Disinfecting Wipes", category: "cleanup_essentials", store: "supermarket", quantity: 1, unit: "pack", price: 7.0, aisle: "Aisle 22 - Cleanup & Household", isCymbal: true, tier: "Cymbal Essentials", savings: 2.0 }
    ];
  } else if (isBBQ) {
    itemsTemplate = [
      { name: "Cymbal Fresh Prime Beef Patties & Smoked Sausages (5 lbs)", category: "meat_seafood", store: "supermarket", quantity: 5, unit: "lbs", price: 28.0, aisle: "Aisle 5 - Cymbal Fresh Meat & Seafood", isCymbal: true, tier: "Cymbal Fresh", savings: 6.0 },
      { name: "Cymbal Fresh Brioche Burger & Hot Dog Buns (2 packs)", category: "bakery_grains", store: "supermarket", quantity: 2, unit: "packs", price: 7.0, aisle: "Aisle 1 - Cymbal Bakery", isCymbal: true, tier: "Cymbal Select", savings: 2.0 },
      { name: "Cymbal Fresh Sweet Corn on the Cob & Watermelon", category: "produce", store: "supermarket", quantity: 1, unit: "bulk", price: 9.5, aisle: "Aisle 3 - Cymbal Fresh Produce", isCymbal: true, tier: "Cymbal Fresh", savings: 2.5 },
      { name: "Cymbal Select Creamy Coleslaw & Potato Salad (32 oz)", category: "dairy_refrigerated", store: "supermarket", quantity: 2, unit: "tubs", price: 8.0, aisle: "Aisle 8 - Dairy & Refrigerated", isCymbal: true, tier: "Cymbal Select", savings: 2.5 },
      { name: "Cymbal Select Smoky Bourbon BBQ Sauce & Condiments Trio", category: "pantry_condiments", store: "supermarket", quantity: 1, unit: "set", price: 7.5, aisle: "Aisle 10 - Pantry Essentials", isCymbal: true, tier: "Cymbal Select", savings: 2.0 },
      { name: "Cymbal Select Kettle Cooked BBQ Potato Chips (2 large bags)", category: "snacks_appetizers", store: "supermarket", quantity: 2, unit: "bags", price: 7.0, aisle: "Aisle 12 - Snacks & Appetizers", isCymbal: true, tier: "Cymbal Select", savings: 2.0 },
      { name: "Craft IPA & Golden Ale Beer (12 pack)", category: "beverages_alcoholic", store: "liquor_store", quantity: 1, unit: "case", price: 18.0, aisle: "Aisle 16 - Beer & Wine", isCymbal: false, tier: "National Brand", savings: 0 },
      { name: "Cymbal Lemonade & Sweet Iced Tea Jugs (2 gallons)", category: "beverages_nonalcoholic", store: "supermarket", quantity: 2, unit: "jugs", price: 6.5, aisle: "Aisle 14 - Cold Beverages", isCymbal: true, tier: "Cymbal Essentials", savings: 2.5 },
      { name: "Cymbal Pure Party Ice (20 lbs)", category: "ice_cooler", store: "supermarket", quantity: 2, unit: "bags", price: 6.0, aisle: "Aisle 14 - Cold Beverages", isCymbal: true, tier: "Cymbal Essentials", savings: 2.0 },
      { name: "Cymbal Essentials Compostable Plates, Utensils & Napkins", category: "tableware_disposables", store: "supermarket", quantity: 1, unit: "pack", price: 12.0, aisle: "Aisle 18 - Party Tableware", isCymbal: true, tier: "Cymbal Essentials", savings: 3.5 },
      { name: "Cymbal Heavy Duty Charcoal Briquettes & Wood Chips", category: "decor_ambiance", store: "supermarket", quantity: 1, unit: "bag", price: 11.0, aisle: "Aisle 22 - Cleanup & Household", isCymbal: true, tier: "Cymbal Essentials", savings: 3.0 },
      { name: "Cymbal Heavy Duty Grill Scrub Brush & Trash Bags", category: "cleanup_essentials", store: "supermarket", quantity: 1, unit: "kit", price: 8.5, aisle: "Aisle 22 - Cleanup & Household", isCymbal: true, tier: "Cymbal Essentials", savings: 2.0 }
    ];
  } else {
    itemsTemplate = [
      { name: "Cymbal Fresh Artisan Charcuterie & Cheeses Platter", category: "dairy_refrigerated", store: "supermarket", quantity: 2, unit: "platters", price: 24.0, aisle: "Aisle 8 - Dairy & Refrigerated", isCymbal: true, tier: "Cymbal Select", savings: 6.0 },
      { name: "Cymbal Bakery Fresh Baguettes & Crostini Crisps", category: "bakery_grains", store: "supermarket", quantity: 2, unit: "packs", price: 7.0, aisle: "Aisle 1 - Cymbal Bakery", isCymbal: true, tier: "Cymbal Select", savings: 2.0 },
      { name: "Cymbal Fresh Organic Grapes, Berries & Fig Jam", category: "produce", store: "supermarket", quantity: 1, unit: "set", price: 10.5, aisle: "Aisle 3 - Cymbal Fresh Produce", isCymbal: true, tier: "Cymbal Fresh", savings: 3.0 },
      { name: "Cymbal Select Gourmet Cocktail Meatballs & Glaze", category: "meat_seafood", store: "supermarket", quantity: 2, unit: "lbs", price: 14.0, aisle: "Aisle 5 - Cymbal Fresh Meat & Seafood", isCymbal: true, tier: "Cymbal Select", savings: 3.5 },
      { name: "Cymbal Select Roasted Mixed Nuts & Olive Medley", category: "snacks_appetizers", store: "supermarket", quantity: 2, unit: "jars", price: 8.5, aisle: "Aisle 12 - Snacks & Appetizers", isCymbal: true, tier: "Cymbal Select", savings: 2.5 },
      { name: "Prosecco Sparkling Wine & Pinot Noir (3 bottles)", category: "beverages_alcoholic", store: "liquor_store", quantity: 3, unit: "bottles", price: 36.0, aisle: "Aisle 16 - Beer & Wine", isCymbal: false, tier: "National Brand", savings: 0 },
      { name: "Cymbal Sparkling Botanical Waters & Mixers (12 pack)", category: "beverages_nonalcoholic", store: "supermarket", quantity: 1, unit: "pack", price: 7.5, aisle: "Aisle 14 - Cold Beverages", isCymbal: true, tier: "Cymbal Essentials", savings: 2.5 },
      { name: "Cymbal Pure Party Ice (20 lbs)", category: "ice_cooler", store: "supermarket", quantity: 2, unit: "bags", price: 6.0, aisle: "Aisle 14 - Cold Beverages", isCymbal: true, tier: "Cymbal Essentials", savings: 2.0 },
      { name: "Cymbal Essentials Elegant Disposable Stemware & Plates", category: "tableware_disposables", store: "supermarket", quantity: 1, unit: "combo set", price: 14.0, aisle: "Aisle 18 - Party Tableware", isCymbal: true, tier: "Cymbal Essentials", savings: 4.0 },
      { name: "Warm String Lights & Scented Table Decor", category: "decor_ambiance", store: "party_store", quantity: 1, unit: "set", price: 11.0, aisle: "Aisle 20 - Party Decor", isCymbal: false, tier: "National Brand", savings: 0 },
      { name: "Cymbal Heavy Duty Trash Bags & Quick Clean Towels", category: "cleanup_essentials", store: "supermarket", quantity: 1, unit: "pack", price: 7.0, aisle: "Aisle 22 - Cleanup & Household", isCymbal: true, tier: "Cymbal Essentials", savings: 2.0 }
    ];
  }

  // Scale total prices proportionally to target budget
  const rawSum = itemsTemplate.reduce((sum, it) => sum + it.price, 0);
  const scale = targetBudget / Math.max(1, rawSum);

  const items = itemsTemplate.map((it, idx) => {
    const adjustedPrice = Math.max(2, Math.round(it.price * scale * 100) / 100);
    const savings = it.isCymbal ? Math.round(adjustedPrice * 0.22 * 100) / 100 : 0;
    return {
      id: `item-${timestamp}-${idx}`,
      name: it.name,
      category: it.category as any,
      store: it.store as any,
      quantity: Math.max(1, Math.round(it.quantity * (totalGuests / 10))),
      unit: it.unit,
      estimatedPrice: adjustedPrice,
      isPurchased: false,
      notes: `Optimal for ${totalGuests} guests with 1.25x buffer`,
      dietaryTags: dietary.length ? dietary : ["Fresh Pick"],
      isEssential: idx < 6,
      servingsCount: totalGuests,
      cymbalAisle: it.aisle,
      isCymbalBrand: it.isCymbal,
      brandTier: it.tier,
      cymbalSavings: savings
    };
  });

  const menu = [
    {
      id: `menu-${timestamp}-1`,
      name: isTropical ? "Hawaiian Teriyaki Chicken Skewers & Coconut Shrimp" : isTaco ? "Slow-Simmered Carnitas & Chicken Taco Bar" : isBBQ ? "Smoky Gourmet Burger & Bratwurst Grill" : "Artisan Charcuterie & Warm Glazed Meatballs",
      type: "main" as const,
      servings: totalGuests,
      dietaryNotes: dietary.length ? dietary : ["Gluten-Free Options"],
      ingredientsList: ["Premium protein", "Seasoning blend", "Sweet rolls/tortillas", "Tropical teriyaki glaze"],
      prepNotes: "Prepare proteins 2 hours before event; keep in warming dishes."
    },
    {
      id: `menu-${timestamp}-2`,
      name: isTropical ? "Fresh Mango Passionfruit Guacamole & Plantain Crisps" : isTaco ? "Fresh Guacamole & Charred Salsa Trio" : isBBQ ? "Crisp Coleslaw & Sweet Corn with Herb Butter" : "Fresh Berry, Fig & Gourmet Cracker Medley",
      type: "appetizer" as const,
      servings: totalGuests,
      dietaryNotes: ["Vegetarian", "Gluten-Free"],
      ingredientsList: ["Avocados / Fresh produce", "Plantain chips / crackers", "Citrus zest"],
      prepNotes: "Prep dips 1 hour before arrival to ensure peak freshness."
    },
    {
      id: `menu-${timestamp}-3`,
      name: isTropical ? "Island Spiced Mai Tais & Sparkling Guava Punch" : isTaco ? "Signature Lime Agave Margaritas & Agua Fresca" : isBBQ ? "Craft Ale & Fresh Berry Lemonade" : "Sparkling Wine & Citrus Botanical Spritz",
      type: "cocktail" as const,
      servings: totalGuests,
      dietaryNotes: ["Alcoholic & Non-Alcoholic options"],
      ingredientsList: ["Spirit / Wine", "Mixers & Seltzers", "Fresh citrus garnish", "Party Ice"],
      prepNotes: "Batch in beverage dispenser 30 minutes before party kickoff."
    }
  ];

  const prepSchedule = [
    { id: `prep-${timestamp}-1`, timeframe: "3_days_before" as const, task: "Confirm RSVP headcount, finalize CymbalMart curbside order or delivery slot.", category: "shopping" as const, isCompleted: false },
    { id: `prep-${timestamp}-2`, timeframe: "1_day_before" as const, task: "Pick up order, marinate meats/proteins, batch cocktail base in fridge.", category: "food_prep" as const, isCompleted: false },
    { id: `prep-${timestamp}-3`, timeframe: "day_of_morning" as const, task: "Set up buffet station, layout tableware and thematic decor.", category: "decor" as const, isCompleted: false },
    { id: `prep-${timestamp}-4`, timeframe: "1_hour_before" as const, task: "Fill ice buckets, prepare guacamole/fresh cuts, warm main dishes.", category: "drinks" as const, isCompleted: false },
    { id: `prep-${timestamp}-5`, timeframe: "during_party" as const, task: "Refresh ice and signature drinks; swap serving trays at midpoint.", category: "cleanup" as const, isCompleted: false }
  ];

  return {
    id: `party-${timestamp}`,
    title,
    theme,
    createdAt: new Date().toISOString(),
    adultCount,
    childCount,
    durationHours: Number(params.durationHours) || 3,
    partyStyle: partyStyle as any,
    budget: targetBudget,
    dietaryRestrictions: dietary,
    vibeAndNotes: params.vibeAndNotes || "Budget-conscious, stylish hosting with CymbalMart",
    items,
    menu,
    prepSchedule
  };
}

function generateChatAgentFallback(message: string, currentParty: any) {
  const text = message.toLowerCase();
  const partyTitle = currentParty?.title || "your party";
  const items = currentParty?.items || [];
  const totalBudget = currentParty?.budget || 200;

  // Intent 1: Cut or reduce budget
  if (text.includes("cut") || text.includes("save") || text.includes("reduce") || text.includes("budget") || text.includes("cheaper")) {
    const nonCymbalItems = items.filter((i: any) => !i.isCymbalBrand);
    const candidateToSwap = nonCymbalItems.slice(0, 3);
    const estimatedSavings = Math.round(candidateToSwap.reduce((acc: number, it: any) => acc + (it.estimatedPrice * 0.22), 0) + 12);

    const itemsToUpdate = candidateToSwap.map((it: any) => ({
      id: it.id,
      name: `Cymbal ${it.name}`,
      estimatedPrice: Math.max(1, Math.round(it.estimatedPrice * 0.78 * 100) / 100),
      notes: "Swapped to CymbalMart store brand (22% savings)",
      cymbalAisle: it.cymbalAisle || "Aisle 10 - Pantry Essentials",
      isCymbalBrand: true,
      cymbalSavings: Math.round(it.estimatedPrice * 0.22 * 100) / 100
    }));

    return {
      reply: `I've analyzed your shopping list for **${partyTitle}**. To reduce costs while keeping quality high:\n\n1. **Swap to CymbalMart Store Brands**: We can switch ${candidateToSwap.length || 'several'} national brand items to *Cymbal Select* or *Cymbal Essentials* for immediate savings.\n2. **Trim Disposable Buffers**: Buying bundled tableware packages rather than separate items.\n\nWould you like to apply these optimizations to save approximately **$${estimatedSavings}**?`,
      actionProposal: {
        type: "modify_items" as const,
        description: `Apply CymbalMart budget optimization to save ~$${estimatedSavings}`,
        itemsToUpdate
      }
    };
  }

  // Intent 2: Drinks & Cocktails
  if (text.includes("drink") || text.includes("cocktail") || text.includes("alcohol") || text.includes("wine") || text.includes("beer") || text.includes("margarita")) {
    const newCocktailItems = [
      { name: "Cymbal Fresh Limes & Organic Agave Nectar", category: "produce" as const, store: "supermarket" as const, quantity: 1, unit: "kit", estimatedPrice: 6.5, notes: "For fresh cocktail batching", dietaryTags: ["Vegan", "Gluten-Free"], isEssential: true, cymbalAisle: "Aisle 3 - Cymbal Fresh Produce", isCymbalBrand: true, brandTier: "Cymbal Fresh", cymbalSavings: 1.5 },
      { name: "Cymbal Sparkling Club Soda & Tonic (12 pack)", category: "beverages_nonalcoholic" as const, store: "supermarket" as const, quantity: 1, unit: "pack", estimatedPrice: 5.5, notes: "High fizz cocktail mixer", dietaryTags: ["Zero Sugar"], isEssential: true, cymbalAisle: "Aisle 14 - Cold Beverages", isCymbalBrand: true, brandTier: "Cymbal Essentials", cymbalSavings: 2.0 }
    ];

    return {
      reply: `For **${partyTitle}**, I recommend offering a signature self-serve cocktail alongside a refreshing non-alcoholic spritzer! A good rule of thumb is **2 drinks per guest for the first hour, and 1 drink per hour after**.\n\nI can add fresh citrus garnish, agave sweetener, and sparkling mixers to your CymbalMart cart.`,
      actionProposal: {
        type: "add_items" as const,
        description: "Add signature cocktail & mocktail mixers to shopping list",
        itemsToAdd: newCocktailItems
      }
    };
  }

  // Intent 3: Dietary / Vegan / Gluten-free
  if (text.includes("vegan") || text.includes("vegetarian") || text.includes("gluten") || text.includes("allergy") || text.includes("dietary")) {
    const dietaryItems = [
      { name: "Cymbal Fresh Organic Guacamole & Veggie Dipping Platter", category: "produce" as const, store: "supermarket" as const, quantity: 1, unit: "platter", estimatedPrice: 12.0, notes: "Certified Vegan & Gluten-Free", dietaryTags: ["Vegan", "Gluten-Free"], isEssential: true, cymbalAisle: "Aisle 3 - Cymbal Fresh Produce", isCymbalBrand: true, brandTier: "Cymbal Fresh", cymbalSavings: 3.0 },
      { name: "Cymbal Select Gluten-Free Seeded Artisan Crackers", category: "bakery_grains" as const, store: "supermarket" as const, quantity: 2, unit: "boxes", estimatedPrice: 7.0, notes: "Allergy-friendly guest staple", dietaryTags: ["Gluten-Free", "Nut-Free"], isEssential: true, cymbalAisle: "Aisle 1 - Cymbal Bakery", isCymbalBrand: true, brandTier: "Cymbal Select", cymbalSavings: 1.8 }
    ];

    return {
      reply: `Accommodating dietary preferences is effortless at CymbalMart! I've prepared two allergy-friendly additions (Certified Gluten-Free & Vegan) that delight all guests without requiring separate cooking stations.`,
      actionProposal: {
        type: "add_items" as const,
        description: "Add Vegan & Gluten-Free certified options to shopping list",
        itemsToAdd: dietaryItems
      }
    };
  }

  // Intent 4: Scale for more guests
  if (text.includes("guest") || text.includes("more people") || text.includes("scale") || text.includes("headcount") || text.includes("people")) {
    const itemsToUpdate = items.slice(0, 5).map((it: any) => ({
      id: it.id,
      quantity: Math.ceil((it.quantity || 1) * 1.35),
      estimatedPrice: Math.round((it.estimatedPrice || 1) * 1.35 * 100) / 100,
      notes: "Scaled +35% for additional attendee buffer"
    }));

    return {
      reply: `Scaling up! When guest count expands, main proteins, finger snacks, ice, and disposables should be scaled with a 1.25x safety margin so you never run out during the peak party rush.\n\nI have generated a proposal to scale up your core items.`,
      actionProposal: {
        type: "modify_items" as const,
        description: "Scale core ingredients and tableware for additional guests",
        itemsToUpdate
      }
    };
  }

  // Default helpful response with actionable recommendations
  return {
    reply: `I'm your **CymbalMart AI Party Shopping Agent**! I can help you fine-tune your event in several ways:\n\n• **Cut budget**: Switch items to *Cymbal Select* or *Cymbal Fresh* store brands to save 20%+.\n• **Portion math**: Calculate exact protein, drinks, and ice weights by guest count.\n• **Dietary additions**: Add allergen-friendly and plant-based items.\n• **Aisle navigation**: Organize your list for 20-minute rapid in-store checkout.\n\nWhat would you like to adjust on **${partyTitle}**?`,
    actionProposal: undefined
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // 1. Generate full party plan and shopping list
  app.post("/api/plan-party", async (req, res) => {
    try {
      const {
        title,
        theme,
        adultCount = 10,
        childCount = 0,
        durationHours = 3,
        partyStyle = "buffet",
        budget = 200,
        dietaryRestrictions = [],
        vibeAndNotes = ""
      } = req.body;

      const ai = getGeminiClient();

      if (!ai) {
        // Fallback generator when GEMINI_API_KEY is not configured
        const fallbackParty = generatePartyPlanFallback({
          title,
          theme,
          adultCount,
          childCount,
          durationHours,
          partyStyle,
          budget,
          dietaryRestrictions,
          vibeAndNotes
        });
        return res.json({ success: true, party: fallbackParty });
      }

      const prompt = `You are the AI Party Planner Shopping Agent for CymbalMart.
Create a curated, budget-conscious party shopping list, menu, and prep schedule for this event:
- Event Title / Concept: "${title || theme || 'Party Celebration'}"
- Theme: "${theme || 'Casual Party'}"
- Guests: ${adultCount} adults, ${childCount} kids
- Duration: ${durationHours} hours
- Party Style: ${partyStyle}
- Target Budget: $${budget} USD
- Dietary Restrictions: ${dietaryRestrictions.length ? dietaryRestrictions.join(', ') : 'None'}
- Special Vibes & Preferences: "${vibeAndNotes || 'Fun, seamless, budget-conscious host'}"

Provide a realistic, comprehensive, itemized CymbalMart shopping list accurately calculated for guest count and duration.
Include:
1. Fresh Produce & Groceries (Assign to 'Aisle 3 - Cymbal Fresh Produce')
2. Meat & Proteins (Assign to 'Aisle 5 - Cymbal Fresh Meat & Seafood')
3. Bakery & Breads (Assign to 'Aisle 1 - Cymbal Bakery')
4. Dairy & Cheeses (Assign to 'Aisle 8 - Dairy & Refrigerated')
5. Beverages (Alcoholic if adults present, non-alcoholic refreshers, Assign to 'Aisle 14 - Cold Beverages' or 'Aisle 16 - Beer & Wine')
6. Snacks & Finger Foods (Assign to 'Aisle 12 - Snacks & Appetizers')
7. Ice (at 1.5 lbs per person) & Coolers (Assign to 'Aisle 14 - Cold Beverages')
8. Tableware & Disposables (plates, cups, napkins, cutlery with a 1.5x buffer, Assign to 'Aisle 18 - Party Tableware')
9. Decor, Lighting & Ambiance (Assign to 'Aisle 20 - Party Decor')
10. Cleanup & Essentials (trash bags, paper towels, Assign to 'Aisle 22 - Cleanup & Household')

Store field can be 'supermarket' (CymbalMart Supercenter), 'wholesale_club' (Cymbal Club Bulk), 'liquor_store', 'party_store', etc.
Assign isCymbalBrand: true and brandTier ('Cymbal Fresh' | 'Cymbal Select' | 'Cymbal Essentials' | 'National Brand') where applicable.
Ensure total estimated price aligns closely with the target budget of $${budget}.`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            systemInstruction: "You are CymbalMart's AI party planner and grocery budget optimizer. Output strictly valid JSON matching the requested schema.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                theme: { type: Type.STRING },
                vibeSummary: { type: Type.STRING },
                menu: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      type: { type: Type.STRING, description: "appetizer | main | side | dessert | cocktail | beverage | snack" },
                      servings: { type: Type.NUMBER },
                      dietaryNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
                      ingredientsList: { type: Type.ARRAY, items: { type: Type.STRING } },
                      prepNotes: { type: Type.STRING }
                    },
                    required: ["name", "type", "servings", "ingredientsList"]
                  }
                },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      category: {
                        type: Type.STRING,
                        description: "One of: produce, meat_seafood, dairy_refrigerated, bakery_grains, pantry_condiments, beverages_alcoholic, beverages_nonalcoholic, snacks_appetizers, tableware_disposables, decor_ambiance, ice_cooler, entertainment_favors, cleanup_essentials"
                      },
                      store: {
                        type: Type.STRING,
                        description: "One of: supermarket, wholesale_club, liquor_store, party_store, specialty_bakery, online_delivery"
                      },
                      quantity: { type: Type.NUMBER },
                      unit: { type: Type.STRING, description: "e.g. lbs, packs, bottles, bags, cans, ct" },
                      estimatedPrice: { type: Type.NUMBER },
                      notes: { type: Type.STRING },
                      dietaryTags: { type: Type.ARRAY, items: { type: Type.STRING } },
                      isEssential: { type: Type.BOOLEAN },
                      servingsCount: { type: Type.NUMBER },
                      cymbalAisle: { type: Type.STRING, description: "e.g. Aisle 3 - Cymbal Fresh Produce" },
                      isCymbalBrand: { type: Type.BOOLEAN },
                      brandTier: { type: Type.STRING, description: "Cymbal Fresh | Cymbal Select | Cymbal Essentials | National Brand" },
                      cymbalSavings: { type: Type.NUMBER, description: "Savings in USD compared to national brand" }
                    },
                    required: ["name", "category", "store", "quantity", "unit", "estimatedPrice"]
                  }
                },
                prepSchedule: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      timeframe: {
                        type: Type.STRING,
                        description: "One of: 3_days_before, 1_day_before, day_of_morning, 1_hour_before, during_party"
                      },
                      task: { type: Type.STRING },
                      category: {
                        type: Type.STRING,
                        description: "One of: shopping, food_prep, decor, drinks, cleanup"
                      }
                    },
                    required: ["timeframe", "task", "category"]
                  }
                }
              },
              required: ["title", "theme", "menu", "items", "prepSchedule"]
            }
          }
        });

        const responseText = response.text || "{}";
        const parsedData = JSON.parse(responseText);

        const timestamp = Date.now();
        const itemsWithIds = (parsedData.items || []).map((it: any, idx: number) => ({
          ...it,
          id: `item-${timestamp}-${idx}`,
          isPurchased: false,
          estimatedPrice: Number(it.estimatedPrice) || 0
        }));

        const menuWithIds = (parsedData.menu || []).map((m: any, idx: number) => ({
          ...m,
          id: `menu-${timestamp}-${idx}`
        }));

        const prepWithIds = (parsedData.prepSchedule || []).map((p: any, idx: number) => ({
          ...p,
          id: `prep-${timestamp}-${idx}`,
          isCompleted: false
        }));

        res.json({
          success: true,
          party: {
            id: `party-${timestamp}`,
            title: parsedData.title || title,
            theme: parsedData.theme || theme,
            createdAt: new Date().toISOString(),
            adultCount: Number(adultCount),
            childCount: Number(childCount),
            durationHours: Number(durationHours),
            partyStyle,
            budget: Number(budget),
            dietaryRestrictions,
            vibeAndNotes: parsedData.vibeSummary || vibeAndNotes,
            items: itemsWithIds,
            menu: menuWithIds,
            prepSchedule: prepWithIds
          }
        });
      } catch (geminiError: any) {
        console.warn("Gemini API call failed in /api/plan-party, utilizing domain fallback engine:", geminiError.message);
        const fallbackParty = generatePartyPlanFallback({
          title,
          theme,
          adultCount,
          childCount,
          durationHours,
          partyStyle,
          budget,
          dietaryRestrictions,
          vibeAndNotes
        });
        res.json({ success: true, party: fallbackParty });
      }
    } catch (error: any) {
      console.error("Error in /api/plan-party:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to generate party plan"
      });
    }
  });

  // 2. Chat with Party Planner Shopping Agent
  app.post("/api/chat-agent", async (req, res) => {
    try {
      const { message, currentParty, chatHistory = [] } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        // Seamless fallback response with real action proposals
        const fallbackResult = generateChatAgentFallback(message || "", currentParty);
        return res.json({
          success: true,
          reply: fallbackResult.reply,
          actionProposal: fallbackResult.actionProposal
        });
      }

      const itemsSummary = (currentParty?.items || [])
        .map((i: any) => `- [ID:${i.id}] ${i.name} (Qty: ${i.quantity} ${i.unit}, Store: ${i.store}, Category: ${i.category}, Price: $${i.estimatedPrice}, Aisle: ${i.cymbalAisle || 'Aisle 10'})`)
        .join("\n");

      const systemPrompt = `You are the Party Planner Shopping Agent, an interactive concierge for CymbalMart hosting events.
The user is planning a party:
- Title: "${currentParty?.title}"
- Theme: "${currentParty?.theme}"
- Guests: ${currentParty?.adultCount || 0} adults, ${currentParty?.childCount || 0} kids
- Budget: $${currentParty?.budget || 0}
- Current Shopping List (${currentParty?.items?.length || 0} items):
${itemsSummary}

Your job is to assist with:
1. Answering questions about food/drink portions, timing, themes, recipes, and games.
2. Making concrete suggestions to add, remove, or modify shopping items in CymbalMart.
3. Helping reduce costs or swap ingredients for CymbalMart store brands (Cymbal Fresh, Cymbal Select, Cymbal Essentials).

When your answer involves concrete changes to the shopping list (adding new items, removing existing items, or adjusting quantities/prices), provide an "actionProposal" in the JSON response so the user can apply the changes with 1 click!

Format your response strictly in JSON matching the specified schema.`;

      const userPromptWithHistory = `User message: "${message}"`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: userPromptWithHistory,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                replyText: {
                  type: Type.STRING,
                  description: "Conversational, helpful, and friendly response to the user."
                },
                hasAction: {
                  type: Type.BOOLEAN,
                  description: "True if proposing shopping list modifications."
                },
                actionProposal: {
                  type: Type.OBJECT,
                  properties: {
                    type: {
                      type: Type.STRING,
                      description: "add_items | remove_items | modify_items | update_budget | swap_item"
                    },
                    description: {
                      type: Type.STRING,
                      description: "Short human-readable summary of the proposal, e.g. 'Add 3 signature cocktail ingredients'"
                    },
                    itemsToAdd: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          category: { type: Type.STRING },
                          store: { type: Type.STRING },
                          quantity: { type: Type.NUMBER },
                          unit: { type: Type.STRING },
                          estimatedPrice: { type: Type.NUMBER },
                          notes: { type: Type.STRING },
                          dietaryTags: { type: Type.ARRAY, items: { type: Type.STRING } },
                          isEssential: { type: Type.BOOLEAN },
                          cymbalAisle: { type: Type.STRING },
                          isCymbalBrand: { type: Type.BOOLEAN },
                          brandTier: { type: Type.STRING },
                          cymbalSavings: { type: Type.NUMBER }
                        },
                        required: ["name", "category", "store", "quantity", "unit", "estimatedPrice"]
                      }
                    },
                    itemIdsToRemove: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    itemsToUpdate: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          name: { type: Type.STRING },
                          quantity: { type: Type.NUMBER },
                          estimatedPrice: { type: Type.NUMBER },
                          notes: { type: Type.STRING },
                          cymbalAisle: { type: Type.STRING },
                          isCymbalBrand: { type: Type.BOOLEAN },
                          cymbalSavings: { type: Type.NUMBER }
                        },
                        required: ["id"]
                      }
                    }
                  },
                  required: ["type", "description"]
                }
              },
              required: ["replyText", "hasAction"]
            }
          }
        });

        const responseText = response.text || "{}";
        const parsed = JSON.parse(responseText);

        res.json({
          success: true,
          reply: parsed.replyText || "I'm here to help optimize your party shopping list!",
          actionProposal: parsed.hasAction ? parsed.actionProposal : undefined
        });
      } catch (geminiError: any) {
        console.warn("Gemini API call failed in /api/chat-agent, using fallback:", geminiError.message);
        const fallbackResult = generateChatAgentFallback(message || "", currentParty);
        res.json({
          success: true,
          reply: fallbackResult.reply,
          actionProposal: fallbackResult.actionProposal
        });
      }
    } catch (error: any) {
      console.error("Error in /api/chat-agent:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to communicate with shopping agent"
      });
    }
  });

  // 3. AI Budget Optimization Endpoint
  app.post("/api/optimize-budget", async (req, res) => {
    try {
      const { currentParty } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          success: true,
          optimization: {
            overallSummary: "Switching non-perishables and party essentials to CymbalMart store brands unlocks estimated savings of up to 24% without sacrificing taste or quality.",
            potentialSavingsTotal: 34.50,
            tips: [
              {
                title: "Swap to Cymbal Select & Cymbal Essentials",
                description: "Replace brand-name paper plates, napkins, cheese blends, and chips with CymbalMart private labels for instant 20%+ savings.",
                estimatedSavings: 18.00,
                affectedCategories: ["tableware_disposables", "snacks_appetizers", "dairy_refrigerated"]
              },
              {
                title: "Batch Signature DIY Drinks",
                description: "Prepare 2-gallon drink dispensers with seasonal citrus and club soda rather than buying individual canned craft sodas.",
                estimatedSavings: 11.50,
                affectedCategories: ["beverages_nonalcoholic"]
              },
              {
                title: "Consolidate to CymbalMart Curbside Pickup",
                description: "Group all grocery and disposable items into a single CymbalMart aisle-routed order to avoid multi-store transit fees.",
                estimatedSavings: 5.00,
                affectedCategories: ["produce", "bakery_grains", "cleanup_essentials"]
              }
            ]
          }
        });
      }

      const itemsList = (currentParty?.items || [])
        .map((i: any) => `${i.name} ($${i.estimatedPrice}, Store: ${i.store}, Category: ${i.category})`)
        .join("\n");

      const prompt = `Analyze this party shopping list with target budget $${currentParty?.budget || 200}:
${itemsList}

Provide 3 to 5 high-impact, practical cost-saving tips, such as:
- Smart store routing (e.g. buying dry snacks/paper goods at CymbalMart vs specialty stores)
- Batch DIY alternatives (e.g. making simple syrup or salsa from scratch)
- CymbalMart store brand swaps (Cymbal Fresh, Cymbal Select, Cymbal Essentials)
- Non-essential items that can be trimmed or substituted without diminishing guest experience.

Also return estimated dollar savings for each strategy.`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                overallSummary: { type: Type.STRING },
                potentialSavingsTotal: { type: Type.NUMBER },
                tips: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      estimatedSavings: { type: Type.NUMBER },
                      affectedCategories: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["title", "description", "estimatedSavings"]
                  }
                }
              },
              required: ["overallSummary", "potentialSavingsTotal", "tips"]
            }
          }
        });

        const parsed = JSON.parse(response.text || "{}");
        res.json({ success: true, optimization: parsed });
      } catch (geminiError) {
        res.json({
          success: true,
          optimization: {
            overallSummary: "Switching non-perishables and party essentials to CymbalMart store brands unlocks estimated savings of up to 24%.",
            potentialSavingsTotal: 28.50,
            tips: [
              {
                title: "1-Click Cymbal Brand Swap",
                description: "Switch all national brands to CymbalMart private labels to save immediately.",
                estimatedSavings: 18.00,
                affectedCategories: ["tableware_disposables", "snacks_appetizers"]
              },
              {
                title: "Batch Prepared Beverages",
                description: "Prepare fresh fruit-infused water or iced tea dispensers instead of single-serve cans.",
                estimatedSavings: 10.50,
                affectedCategories: ["beverages_nonalcoholic"]
              }
            ]
          }
        });
      }
    } catch (error: any) {
      console.error("Error in /api/optimize-budget:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to optimize budget" });
    }
  });

  // 4. AI Item Substitution Endpoint
  app.post("/api/suggest-substitutes", async (req, res) => {
    try {
      const { itemName, category, dietaryGoal } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          success: true,
          data: {
            originalItem: itemName,
            substitutes: [
              {
                name: `Cymbal Select ${itemName}`,
                estimatedPrice: 3.99,
                store: "supermarket",
                reason: "CymbalMart premium store-brand equivalent offering exact quality with 20% lower price point.",
                dietaryTags: ["Budget-Friendly"]
              },
              {
                name: `Cymbal Organic Farm Fresh ${itemName}`,
                estimatedPrice: 4.49,
                store: "supermarket",
                reason: "Certified organic local alternative with vibrant fresh flavor.",
                dietaryTags: ["Organic", "Locally Sourced"]
              },
              {
                name: `Cymbal Bulk Pack ${itemName}`,
                estimatedPrice: 7.99,
                store: "wholesale_club",
                reason: "Best value per serving for gatherings over 10 guests.",
                dietaryTags: ["Bulk Value"]
              }
            ]
          }
        });
      }

      const prompt = `Suggest 3 smart store alternatives for: "${itemName}" in category "${category}".
Goal/Preference: "${dietaryGoal || 'Budget-friendly, allergy-safe, or widely available'}".
Provide item name, estimated price difference (+/- $), store type, and why it works.`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                originalItem: { type: Type.STRING },
                substitutes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      estimatedPrice: { type: Type.NUMBER },
                      store: { type: Type.STRING },
                      reason: { type: Type.STRING },
                      dietaryTags: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["name", "estimatedPrice", "store", "reason"]
                  }
                }
              },
              required: ["originalItem", "substitutes"]
            }
          }
        });

        const parsed = JSON.parse(response.text || "{}");
        res.json({ success: true, data: parsed });
      } catch (geminiError) {
        res.json({
          success: true,
          data: {
            originalItem: itemName,
            substitutes: [
              {
                name: `Cymbal Select ${itemName}`,
                estimatedPrice: 3.99,
                store: "supermarket",
                reason: "CymbalMart premium store-brand alternative with 20% lower price point.",
                dietaryTags: ["Budget-Friendly"]
              }
            ]
          }
        });
      }
    } catch (error: any) {
      console.error("Error in /api/suggest-substitutes:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to suggest substitutes" });
    }
  });

  // Vite middleware in development vs Static serving in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Party Planner Shopping Agent server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fatal server startup error:", err);
  process.exit(1);
});

