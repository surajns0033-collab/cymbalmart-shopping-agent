import React from 'react';
import { MenuItem } from '../types';
import { Utensils, Wine, Clock, ChefHat, Sparkles } from 'lucide-react';

interface MenuPlanViewProps {
  menu: MenuItem[];
  onAddCustomDish?: (dish: MenuItem) => void;
}

export const MenuPlanView: React.FC<MenuPlanViewProps> = ({ menu }) => {
  if (!menu || menu.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center">
        <ChefHat className="w-10 h-10 text-stone-300 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-stone-800">No Menu Items Listed</h3>
        <p className="text-xs text-stone-500 mt-1">
          Ask the AI Shopping Agent to generate signature dishes or cocktail recipes!
        </p>
      </div>
    );
  }

  const typeLabels: Record<string, { label: string; badge: string }> = {
    appetizer: { label: 'Appetizer / Grazing', badge: 'bg-amber-100 text-amber-800' },
    main: { label: 'Main Course', badge: 'bg-rose-100 text-rose-800' },
    side: { label: 'Side Dish', badge: 'bg-emerald-100 text-emerald-800' },
    dessert: { label: 'Sweet / Dessert', badge: 'bg-pink-100 text-pink-800' },
    cocktail: { label: 'Signature Cocktail', badge: 'bg-purple-100 text-purple-800' },
    beverage: { label: 'Beverage / Refresher', badge: 'bg-sky-100 text-sky-800' },
    snack: { label: 'Party Snack', badge: 'bg-yellow-100 text-yellow-800' }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Curated Menu & Recipe Guide</h2>
          <p className="text-xs text-stone-500">
            Dishes, cocktail ratios, and serving preparations for your party
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menu.map((dish) => {
          const typeInfo = typeLabels[dish.type] || { label: dish.type, badge: 'bg-stone-100 text-stone-800' };

          return (
            <div
              key={dish.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-100">
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${typeInfo.badge}`}>
                      {typeInfo.label}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 mt-1">
                      {dish.name}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-stone-500 bg-stone-50 px-2 py-1 rounded-md shrink-0">
                    {dish.servings} Servings
                  </span>
                </div>

                {dish.dietaryNotes && dish.dietaryNotes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {dish.dietaryNotes.map((d, i) => (
                      <span key={i} className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-medium">
                        {d}
                      </span>
                    ))}
                  </div>
                )}

                {dish.ingredientsList && dish.ingredientsList.length > 0 && (
                  <div className="mt-3">
                    <span className="text-[11px] font-semibold text-stone-700 block mb-1">Key Ingredients:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {dish.ingredientsList.map((ing, iIdx) => (
                        <span key={iIdx} className="text-xs bg-stone-50 border border-stone-200 text-stone-700 px-2 py-0.5 rounded-md">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {dish.prepNotes && (
                  <div className="mt-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-xs text-stone-700 leading-relaxed">
                    <span className="font-semibold text-amber-900 block mb-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-700" /> Prep Tips:
                    </span>
                    {dish.prepNotes}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
