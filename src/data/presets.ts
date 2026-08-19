import { PartyPlan } from '../types';

export const PRESET_PARTIES: PartyPlan[] = [
  {
    id: 'preset-taco-fiesta',
    title: 'Fiesta Taco & Margarita Night',
    theme: 'Vibrant Mexican Fiesta',
    createdAt: new Date().toISOString(),
    eventDate: '2026-08-25',
    adultCount: 12,
    childCount: 2,
    durationHours: 4,
    partyStyle: 'buffet',
    budget: 220,
    dietaryRestrictions: ['Gluten-Free Options', 'Vegetarian Option'],
    vibeAndNotes: 'Lively, colorful music, build-your-own taco bar with fresh margaritas and churro bites.',
    menu: [
      {
        id: 'm1',
        name: 'Slow-Cooker Carnitas & Seasoned Chicken',
        type: 'main',
        servings: 14,
        dietaryNotes: ['Gluten-Free'],
        ingredientsList: ['Pork shoulder 4 lbs', 'Chicken thighs 3 lbs', 'Taco seasoning', 'Limes', 'Oranges'],
        prepNotes: 'Slow cook meat 6-8 hours ahead, shred and crisp in oven before serving.'
      },
      {
        id: 'm2',
        name: 'Cilantro Lime Black Beans & Spanish Rice',
        type: 'side',
        servings: 14,
        dietaryNotes: ['Vegetarian', 'Gluten-Free'],
        ingredientsList: ['Canned black beans', 'Jasmine rice', 'Fresh cilantro', 'Limes', 'Garlic'],
        prepNotes: 'Simmer 30 mins before party.'
      },
      {
        id: 'm3',
        name: 'Fresh Guacamole & Roasted Salsa Trio',
        type: 'appetizer',
        servings: 14,
        dietaryNotes: ['Vegan', 'Gluten-Free'],
        ingredientsList: ['Ripe avocados (8)', 'Roma tomatoes', 'Red onion', 'Jalapenos', 'Tortilla chips (3 bags)'],
        prepNotes: 'Make guacamole 1 hour before guests arrive to prevent browning.'
      },
      {
        id: 'm4',
        name: 'Classic Lime Margaritas & Agua Fresca',
        type: 'cocktail',
        servings: 14,
        dietaryNotes: ['Contains Alcohol (Margarita)', 'Non-Alcoholic (Watermelon Agua Fresca)'],
        ingredientsList: ['Blanco Tequila (750ml)', 'Triple Sec (375ml)', 'Fresh limes (15)', 'Agave syrup', 'Watermelon (1 large)'],
        prepNotes: 'Batch mix 2 pitchers of margarita base; blend watermelon agua fresca.'
      }
    ],
    items: [
      {
        id: 'tf-1',
        name: 'Boneless Pork Shoulder (4 lbs)',
        category: 'meat_seafood',
        store: 'supermarket',
        quantity: 4,
        unit: 'lbs',
        estimatedPrice: 18.0,
        isPurchased: false,
        dietaryTags: ['Gluten-Free'],
        isEssential: true,
        servingsCount: 14
      },
      {
        id: 'tf-2',
        name: 'Boneless Skinless Chicken Thighs (3 lbs)',
        category: 'meat_seafood',
        store: 'supermarket',
        quantity: 3,
        unit: 'lbs',
        estimatedPrice: 13.5,
        isPurchased: false,
        dietaryTags: ['Gluten-Free'],
        isEssential: true
      },
      {
        id: 'tf-3',
        name: 'Corn Tortillas (Pack of 40) & Flour Tortillas (Pack of 20)',
        category: 'bakery_grains',
        store: 'supermarket',
        quantity: 2,
        unit: 'packs',
        estimatedPrice: 6.5,
        isPurchased: false,
        dietaryTags: ['Gluten-Free (Corn)'],
        isEssential: true
      },
      {
        id: 'tf-4',
        name: 'Hass Avocados (Bag of 8)',
        category: 'produce',
        store: 'wholesale_club',
        quantity: 1,
        unit: 'bag (8 ct)',
        estimatedPrice: 7.99,
        isPurchased: false,
        dietaryTags: ['Vegan', 'Gluten-Free'],
        isEssential: true
      },
      {
        id: 'tf-5',
        name: 'Fresh Limes (2 lb bag)',
        category: 'produce',
        store: 'wholesale_club',
        quantity: 2,
        unit: 'bags',
        estimatedPrice: 8.0,
        isPurchased: false,
        isEssential: true
      },
      {
        id: 'tf-6',
        name: 'Cilantro & Jalapeños Bundle',
        category: 'produce',
        store: 'supermarket',
        quantity: 3,
        unit: 'bunches/packs',
        estimatedPrice: 3.5,
        isPurchased: false
      },
      {
        id: 'tf-7',
        name: 'Cotija Cheese & Shredded Mexican Blend Cheese',
        category: 'dairy_refrigerated',
        store: 'supermarket',
        quantity: 2,
        unit: 'packs',
        estimatedPrice: 8.5,
        isPurchased: false
      },
      {
        id: 'tf-8',
        name: 'Sour Cream (16 oz)',
        category: 'dairy_refrigerated',
        store: 'supermarket',
        quantity: 1,
        unit: 'tub',
        estimatedPrice: 2.8,
        isPurchased: false
      },
      {
        id: 'tf-9',
        name: 'Tortilla Chips (Restaurant Style Bulk)',
        category: 'snacks_appetizers',
        store: 'wholesale_club',
        quantity: 2,
        unit: 'large bags',
        estimatedPrice: 9.0,
        isPurchased: false,
        isEssential: true
      },
      {
        id: 'tf-10',
        name: 'Blanco Tequila (750ml bottle)',
        category: 'beverages_alcoholic',
        store: 'liquor_store',
        quantity: 1,
        unit: '750ml bottle',
        estimatedPrice: 26.0,
        isPurchased: false,
        isEssential: true
      },
      {
        id: 'tf-11',
        name: 'Triple Sec Orange Liqueur (375ml)',
        category: 'beverages_alcoholic',
        store: 'liquor_store',
        quantity: 1,
        unit: 'bottle',
        estimatedPrice: 9.0,
        isPurchased: false
      },
      {
        id: 'tf-12',
        name: 'Mexican Jarritos Sodas & Sparkling Water',
        category: 'beverages_nonalcoholic',
        store: 'supermarket',
        quantity: 2,
        unit: '12-packs',
        estimatedPrice: 14.0,
        isPurchased: false
      },
      {
        id: 'tf-13',
        name: 'Party Ice Bags (10 lbs each)',
        category: 'ice_cooler',
        store: 'supermarket',
        quantity: 2,
        unit: 'bags (20 lbs total)',
        estimatedPrice: 6.0,
        isPurchased: false,
        isEssential: true
      },
      {
        id: 'tf-14',
        name: 'Heavy Duty Fiesta Taco Plates & Napkins',
        category: 'tableware_disposables',
        store: 'party_store',
        quantity: 1,
        unit: 'set (50 count)',
        estimatedPrice: 12.0,
        isPurchased: false,
        isEssential: true
      },
      {
        id: 'tf-15',
        name: 'Papel Picado Banner Garland & Mini Maracas',
        category: 'decor_ambiance',
        store: 'party_store',
        quantity: 1,
        unit: 'pack',
        estimatedPrice: 11.5,
        isPurchased: false
      },
      {
        id: 'tf-16',
        name: 'Heavy Duty 30-Gallon Trash Bags',
        category: 'cleanup_essentials',
        store: 'supermarket',
        quantity: 1,
        unit: 'box',
        estimatedPrice: 7.0,
        isPurchased: false
      }
    ],
    prepSchedule: [
      {
        id: 'p1',
        timeframe: '3_days_before',
        task: 'Buy all liquor, non-perishables, tableware, and Papel Picado decor.',
        category: 'shopping',
        isCompleted: false
      },
      {
        id: 'p2',
        timeframe: '1_day_before',
        task: 'Buy fresh meats and produce. Season the pork shoulder and chicken thighs in marinade.',
        category: 'food_prep',
        isCompleted: false
      },
      {
        id: 'p3',
        timeframe: 'day_of_morning',
        task: 'Start carnitas in slow cooker on LOW (6 hours). Pick up 2 bags of ice.',
        category: 'food_prep',
        isCompleted: false
      },
      {
        id: 'p4',
        timeframe: '1_hour_before',
        task: 'Mash fresh guacamole, set out chips, warmup tortillas in foil, batch mix margarita pitcher.',
        category: 'drinks',
        isCompleted: false
      }
    ]
  },
  {
    id: 'preset-backyard-bbq',
    title: 'Summer Backyard Smoke & Sizzle BBQ',
    theme: 'Casual Outdoor Grillout',
    createdAt: new Date().toISOString(),
    eventDate: '2026-08-30',
    adultCount: 16,
    childCount: 4,
    durationHours: 5,
    partyStyle: 'bbq_cookout',
    budget: 280,
    dietaryRestrictions: ['Vegetarian Option (Veggie Burgers)'],
    vibeAndNotes: 'Lawn games, cold drinks, smoked sliders, grilled corn on the cob, and watermelon slices.',
    menu: [
      {
        id: 'bbq-m1',
        name: 'Gourmet Smash Burgers & Pulled Pork Sliders',
        type: 'main',
        servings: 20,
        dietaryNotes: [],
        ingredientsList: ['Ground beef 80/20 (5 lbs)', 'Brioche slider buns (32 ct)', 'Cheddar slices', 'BBQ sauce'],
        prepNotes: 'Shape burger patties ahead; smoke/warm pulled pork.'
      },
      {
        id: 'bbq-m2',
        name: 'Elote-Style Grilled Corn & Creamy Coleslaw',
        type: 'side',
        servings: 20,
        dietaryNotes: ['Vegetarian'],
        ingredientsList: ['Fresh sweet corn (16 ears)', 'Cotija cheese', 'Mayo/sour cream', 'Shredded cabbage blend'],
        prepNotes: 'Toss slaw 3 hours before so cabbage softens slightly.'
      },
      {
        id: 'bbq-m3',
        name: 'Chilled Sweet Watermelon & Kettle Chips',
        type: 'snack',
        servings: 20,
        dietaryNotes: ['Vegan', 'Gluten-Free'],
        ingredientsList: ['Large Seedless Watermelon (2)', 'Assorted Kettle Chips (3 bags)'],
        prepNotes: 'Slice watermelon into handheld triangles and chill overnight.'
      }
    ],
    items: [
      {
        id: 'bbq-1',
        name: 'Ground Chuck 80/20 (5 lbs)',
        category: 'meat_seafood',
        store: 'wholesale_club',
        quantity: 5,
        unit: 'lbs',
        estimatedPrice: 24.0,
        isPurchased: false,
        isEssential: true
      },
      {
        id: 'bbq-2',
        name: 'Beyond Burger Plant-Based Patties (8 ct)',
        category: 'meat_seafood',
        store: 'supermarket',
        quantity: 2,
        unit: 'packs',
        estimatedPrice: 15.0,
        isPurchased: false,
        dietaryTags: ['Vegetarian', 'Vegan']
      },
      {
        id: 'bbq-3',
        name: 'Brioche Slider Buns & Burger Buns',
        category: 'bakery_grains',
        store: 'wholesale_club',
        quantity: 2,
        unit: 'bulk packs (32 ct)',
        estimatedPrice: 11.0,
        isPurchased: false,
        isEssential: true
      },
      {
        id: 'bbq-4',
        name: 'Sweet Corn on the Cob (16 ears)',
        category: 'produce',
        store: 'supermarket',
        quantity: 16,
        unit: 'ears',
        estimatedPrice: 10.0,
        isPurchased: false
      },
      {
        id: 'bbq-5',
        name: 'Large Seedless Watermelons (2)',
        category: 'produce',
        store: 'supermarket',
        quantity: 2,
        unit: 'watermelons',
        estimatedPrice: 12.0,
        isPurchased: false
      },
      {
        id: 'bbq-6',
        name: 'Sharp Cheddar & Pepper Jack Slices',
        category: 'dairy_refrigerated',
        store: 'wholesale_club',
        quantity: 1,
        unit: 'variety pack (32 slices)',
        estimatedPrice: 9.5,
        isPurchased: false
      },
      {
        id: 'bbq-7',
        name: 'Craft Beer IPA & Crisp Lager Variety 24-Pack',
        category: 'beverages_alcoholic',
        store: 'wholesale_club',
        quantity: 1,
        unit: '24-pack cans',
        estimatedPrice: 32.0,
        isPurchased: false,
        isEssential: true
      },
      {
        id: 'bbq-8',
        name: 'Hard Seltzer Variety Pack (12 cans)',
        category: 'beverages_alcoholic',
        store: 'liquor_store',
        quantity: 1,
        unit: '12-pack',
        estimatedPrice: 18.0,
        isPurchased: false
      },
      {
        id: 'bbq-9',
        name: 'Iced Tea, Lemonade & Canned Soda Variety',
        category: 'beverages_nonalcoholic',
        store: 'supermarket',
        quantity: 3,
        unit: 'gallons/12-packs',
        estimatedPrice: 16.0,
        isPurchased: false,
        isEssential: true
      },
      {
        id: 'bbq-10',
        name: 'Party Ice Bags (10 lbs each - 3 bags for coolers)',
        category: 'ice_cooler',
        store: 'supermarket',
        quantity: 3,
        unit: 'bags (30 lbs total)',
        estimatedPrice: 9.0,
        isPurchased: false,
        isEssential: true
      },
      {
        id: 'bbq-11',
        name: 'Charcoal Briquettes & Grill Lighter Fluid',
        category: 'cleanup_essentials',
        store: 'supermarket',
        quantity: 1,
        unit: 'bag (16 lbs)',
        estimatedPrice: 14.0,
        isPurchased: false,
        isEssential: true
      },
      {
        id: 'bbq-12',
        name: 'Heavy Duty 10" Paper Plates, Red Solo Cups, & Wet Wipes',
        category: 'tableware_disposables',
        store: 'wholesale_club',
        quantity: 1,
        unit: 'combo pack',
        estimatedPrice: 17.5,
        isPurchased: false,
        isEssential: true
      }
    ],
    prepSchedule: [
      {
        id: 'bbq-p1',
        timeframe: '3_days_before',
        task: 'Confirm propane or buy charcoal, buy paper goods and lawn game equipment.',
        category: 'shopping',
        isCompleted: false
      },
      {
        id: 'bbq-p2',
        timeframe: '1_day_before',
        task: 'Slice watermelons, prep burger patties between wax paper, chill canned drinks in fridge.',
        category: 'food_prep',
        isCompleted: false
      },
      {
        id: 'bbq-p3',
        timeframe: 'day_of_morning',
        task: 'Pick up 30 lbs ice. Fill outdoor beverage coolers with ice and drinks 2 hours before start.',
        category: 'drinks',
        isCompleted: false
      },
      {
        id: 'bbq-p4',
        timeframe: '1_hour_before',
        task: 'Light grill charcoal, arrange condiment station, set music playlist.',
        category: 'food_prep',
        isCompleted: false
      }
    ]
  },
  {
    id: 'preset-cocktail-soiree',
    title: 'Sunset Velvet Cocktail Soirée',
    theme: 'Chic Evening Lounge & Hors d’Oeuvres',
    createdAt: new Date().toISOString(),
    eventDate: '2026-09-12',
    adultCount: 15,
    childCount: 0,
    durationHours: 3.5,
    partyStyle: 'cocktail_party',
    budget: 310,
    dietaryRestrictions: ['Vegetarian Options', 'Nut Allergy Awareness'],
    vibeAndNotes: 'Dim warm lighting, acoustic jazz, signature smoky bourbon cocktail, prosecco bar, charcuterie grazing board.',
    menu: [
      {
        id: 'cs-m1',
        name: 'Artisanal Charcuterie & Cheese Grazing Board',
        type: 'appetizer',
        servings: 15,
        dietaryNotes: ['Nut-Free Options'],
        ingredientsList: ['Prosciutto di Parma', 'Genoa Salami', 'Triple Creme Brie', 'Aged Gouda', 'Manchego', 'Fig jam', 'Artisan crackers'],
        prepNotes: 'Assemble board on marble slab 45 mins before.'
      },
      {
        id: 'cs-m2',
        name: 'Caprese Skewers with Balsamic Glaze Drizzle',
        type: 'appetizer',
        servings: 15,
        dietaryNotes: ['Vegetarian', 'Gluten-Free'],
        ingredientsList: ['Cherry tomatoes (2 pints)', 'Fresh mozzarella pearls', 'Fresh basil', 'Balsamic reduction glaze'],
        prepNotes: 'Thread onto bamboo toothpicks in advance.'
      },
      {
        id: 'cs-m3',
        name: 'Signature Smoked Rosemary Old Fashioned & Prosecco Bar',
        type: 'cocktail',
        servings: 15,
        dietaryNotes: ['Contains Alcohol'],
        ingredientsList: ['Bourbon Whiskey (750ml)', 'Angostura Bitters', 'Fresh Rosemary sprigs', 'Prosecco DOC (3 bottles)', 'Elderflower liqueur'],
        prepNotes: 'Prepare clear large ice cubes and rosemary garnish.'
      }
    ],
    items: [
      {
        id: 'cs-1',
        name: 'Bourbon Whiskey (High-End 750ml)',
        category: 'beverages_alcoholic',
        store: 'liquor_store',
        quantity: 1,
        unit: '750ml bottle',
        estimatedPrice: 38.0,
        isPurchased: false,
        isEssential: true
      },
      {
        id: 'cs-2',
        name: 'Prosecco DOC Sparkling Wine',
        category: 'beverages_alcoholic',
        store: 'liquor_store',
        quantity: 3,
        unit: '750ml bottles',
        estimatedPrice: 42.0,
        isPurchased: false,
        isEssential: true
      },
      {
        id: 'cs-3',
        name: 'San Pellegrino Sparkling Mineral Waters',
        category: 'beverages_nonalcoholic',
        store: 'supermarket',
        quantity: 2,
        unit: '6-packs (glass bottles)',
        estimatedPrice: 16.0,
        isPurchased: false
      },
      {
        id: 'cs-4',
        name: 'Charcuterie Cured Meats Trio (Prosciutto, Salami, Coppa)',
        category: 'meat_seafood',
        store: 'wholesale_club',
        quantity: 2,
        unit: 'packs (12 oz each)',
        estimatedPrice: 22.0,
        isPurchased: false,
        isEssential: true
      },
      {
        id: 'cs-5',
        name: 'Gourmet Cheese Trio (Brie, Manchego, Aged White Cheddar)',
        category: 'dairy_refrigerated',
        store: 'wholesale_club',
        quantity: 1,
        unit: 'variety wheel pack',
        estimatedPrice: 24.0,
        isPurchased: false,
        isEssential: true
      },
      {
        id: 'cs-6',
        name: 'Fresh Rosemary, Berries & Cherry Tomatoes',
        category: 'produce',
        store: 'supermarket',
        quantity: 3,
        unit: 'packs/pints',
        estimatedPrice: 14.5,
        isPurchased: false
      },
      {
        id: 'cs-7',
        name: 'Artisan Gourmet Crackers Variety (Water crackers, Rosemary crisps)',
        category: 'bakery_grains',
        store: 'supermarket',
        quantity: 2,
        unit: 'boxes',
        estimatedPrice: 9.0,
        isPurchased: false
      },
      {
        id: 'cs-8',
        name: 'Cocktail Napkins (Black & Gold Foil) & Bamboo Skewers',
        category: 'tableware_disposables',
        store: 'party_store',
        quantity: 1,
        unit: 'pack (100 ct)',
        estimatedPrice: 9.0,
        isPurchased: false
      },
      {
        id: 'cs-9',
        name: 'Crystal-look Recyclable Stemless Champagne & Cocktail Tumblers',
        category: 'tableware_disposables',
        store: 'party_store',
        quantity: 2,
        unit: 'packs (24 ct each)',
        estimatedPrice: 19.0,
        isPurchased: false,
        isEssential: true
      },
      {
        id: 'cs-10',
        name: 'Gourmet Clear Craft Ice Cubes (or 2 Ice Bags)',
        category: 'ice_cooler',
        store: 'supermarket',
        quantity: 2,
        unit: 'bags',
        estimatedPrice: 7.0,
        isPurchased: false,
        isEssential: true
      },
      {
        id: 'cs-11',
        name: 'Scentless Floating Votive Candles & Warm Fairy Lights',
        category: 'decor_ambiance',
        store: 'party_store',
        quantity: 1,
        unit: 'set',
        estimatedPrice: 15.0,
        isPurchased: false
      }
    ],
    prepSchedule: [
      {
        id: 'cs-p1',
        timeframe: '3_days_before',
        task: 'Buy spirits, sparkling wines, cocktail glasses and ambiance candles.',
        category: 'shopping',
        isCompleted: false
      },
      {
        id: 'cs-p2',
        timeframe: '1_day_before',
        task: 'Make simple syrup, prep rosemary garnishes, chill prosecco in refrigerator.',
        category: 'drinks',
        isCompleted: false
      },
      {
        id: 'cs-p3',
        timeframe: '1_hour_before',
        task: 'Slice gourmet cheeses (they taste best at room temp), arrange charcuterie board, light candles.',
        category: 'food_prep',
        isCompleted: false
      }
    ]
  }
];
