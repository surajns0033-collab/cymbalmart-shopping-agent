import React, { useState } from 'react';
import { PartyPlan, OrderCheckoutSummary } from '../types';
import { computeBudgetBreakdown } from '../utils/calculator';
import { 
  ShoppingCart, 
  Check, 
  Truck, 
  MapPin, 
  Clock, 
  Sparkles, 
  CreditCard, 
  Printer, 
  Store, 
  ShieldCheck,
  CheckCircle2,
  Navigation
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  party: PartyPlan;
  onOrderPlaced?: (order: OrderCheckoutSummary) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  party,
  onOrderPlaced
}) => {
  const breakdown = computeBudgetBreakdown(party);
  const [fulfillment, setFulfillment] = useState<'curbside_pickup' | 'express_delivery' | 'in_store_smart_cart'>('curbside_pickup');
  const [selectedSlot, setSelectedSlot] = useState('Today, 2:00 PM - 3:00 PM');
  const [paymentMethod, setPaymentMethod] = useState('CymbalPay (•••• 4821)');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderSummary, setOrderSummary] = useState<OrderCheckoutSummary | null>(null);

  if (!isOpen) return null;

  const fulfillmentFee = fulfillment === 'express_delivery' ? 5.99 : 0.0;
  const estimatedTax = Math.round(breakdown.estimatedTotal * 0.075 * 100) / 100;
  const finalTotal = Math.round((breakdown.estimatedTotal + fulfillmentFee + estimatedTax) * 100) / 100;

  const handlePlaceOrder = () => {
    const summary: OrderCheckoutSummary = {
      orderId: `CYM-${Math.floor(100000 + Math.random() * 900000)}`,
      partyTitle: party.title,
      itemCount: party.items.length,
      subtotal: breakdown.estimatedTotal,
      cymbalSavings: breakdown.cymbalBrandSavingsTotal,
      estimatedTax,
      fulfillmentFee,
      finalTotal,
      fulfillmentMethod: fulfillment,
      scheduledTime: selectedSlot,
      pickupLocation: 'CymbalMart Supercenter #104 (Bayshore Blvd)',
      paymentMethod,
      items: party.items
    };

    setOrderSummary(summary);
    setIsSubmitted(true);
    if (onOrderPlaced) {
      onOrderPlaced(summary);
    }

    try {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 }
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                {isSubmitted ? 'CymbalMart Order Confirmed!' : 'Finalize & Checkout with CymbalMart'}
              </h2>
              <p className="text-xs text-stone-500">
                {isSubmitted
                  ? `Order #${orderSummary?.orderId} is being prepped for your event`
                  : `Curated shopping list for "${party.title}" ready for fulfillment`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-2 rounded-xl hover:bg-stone-100 text-sm font-medium"
          >
            ✕
          </button>
        </div>

        {isSubmitted && orderSummary ? (
          /* Confirmation View */
          <div className="mt-6 space-y-6">
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-900">Order Placed Successfully!</h3>
              <p className="text-xs text-emerald-700">
                Your party groceries are confirmed. Our personal shoppers at CymbalMart Supercenter #104 are packing your order.
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 text-xs">
              <div className="flex justify-between font-bold text-stone-900 pb-2 border-b border-stone-200">
                <span>Order Reference</span>
                <span className="font-mono text-amber-700">{orderSummary.orderId}</span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Fulfillment Type</span>
                <span className="font-semibold capitalize text-stone-800">
                  {orderSummary.fulfillmentMethod.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Ready Window</span>
                <span className="font-semibold text-stone-800">{orderSummary.scheduledTime}</span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Location</span>
                <span className="font-semibold text-stone-800">{orderSummary.pickupLocation}</span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Items Ordered</span>
                <span className="font-semibold text-stone-800">{orderSummary.itemCount} items</span>
              </div>

              <div className="flex justify-between text-emerald-700 font-semibold pt-2 border-t border-stone-200">
                <span>CymbalMart Brand Savings</span>
                <span>-${orderSummary.cymbalSavings.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-stone-900 font-bold text-sm pt-1">
                <span>Total Paid</span>
                <span>${orderSummary.finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Receipt
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Formulation Form */
          <div className="mt-6 space-y-6">
            
            {/* Fulfillment Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-2">
                Choose CymbalMart Fulfillment Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfillment('curbside_pickup')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    fulfillment === 'curbside_pickup'
                      ? 'bg-amber-50/50 border-amber-500 ring-2 ring-amber-500/20'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <Store className="w-5 h-5 text-amber-600 mb-1.5" />
                  <div className="text-xs font-bold text-stone-900">Curbside Pickup</div>
                  <div className="text-[10px] text-stone-500">Free • Ready in 1 hr</div>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillment('express_delivery')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    fulfillment === 'express_delivery'
                      ? 'bg-amber-50/50 border-amber-500 ring-2 ring-amber-500/20'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <Truck className="w-5 h-5 text-amber-600 mb-1.5" />
                  <div className="text-xs font-bold text-stone-900">Express Delivery</div>
                  <div className="text-[10px] text-stone-500">$5.99 • To your door</div>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillment('in_store_smart_cart')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    fulfillment === 'in_store_smart_cart'
                      ? 'bg-amber-50/50 border-amber-500 ring-2 ring-amber-500/20'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <Navigation className="w-5 h-5 text-amber-600 mb-1.5" />
                  <div className="text-xs font-bold text-stone-900">In-Store Smart Aisle</div>
                  <div className="text-[10px] text-stone-500">Fast self-shop map</div>
                </button>
              </div>
            </div>

            {/* Time Slot & Store Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" /> Fulfillment Time Window
                </label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                >
                  <option value="Today, 2:00 PM - 3:00 PM">Today, 2:00 PM - 3:00 PM (Recommended)</option>
                  <option value="Today, 4:00 PM - 5:00 PM">Today, 4:00 PM - 5:00 PM</option>
                  <option value="Tomorrow, 10:00 AM - 11:00 AM">Tomorrow, 10:00 AM - 11:00 AM</option>
                  <option value="Day of Event, 9:00 AM - 10:00 AM">Day of Event, 9:00 AM - 10:00 AM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" /> CymbalMart Branch
                </label>
                <input
                  type="text"
                  readOnly
                  value="CymbalMart Supercenter #104 (Bayshore Blvd)"
                  className="w-full px-3 py-2 text-xs bg-stone-100 border border-stone-200 rounded-xl text-stone-700 font-medium cursor-not-allowed"
                />
              </div>
            </div>

            {/* Order Price Breakdown & Cymbal Savings */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Party List Items ({party.items.length} items)</span>
                <span className="font-semibold text-stone-800">${breakdown.estimatedTotal.toFixed(2)}</span>
              </div>

              {breakdown.cymbalBrandSavingsTotal > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Cymbal Brand Savings Applied
                  </span>
                  <span>-${breakdown.cymbalBrandSavingsTotal.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>Fulfillment Fee</span>
                <span className="font-semibold text-stone-800">
                  {fulfillmentFee === 0 ? 'FREE' : `$${fulfillmentFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Estimated Sales Tax (7.5%)</span>
                <span className="font-semibold text-stone-800">${estimatedTax.toFixed(2)}</span>
              </div>

              <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-stone-900 block">Final Order Total</span>
                  <span className="text-[10px] text-stone-500">
                    Host Budget: ${party.budget.toFixed(2)}
                  </span>
                </div>
                <div className="text-base font-extrabold text-stone-900">
                  ${finalTotal.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Backed by CymbalMart Freshness Guarantee</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Place CymbalMart Order (${finalTotal.toFixed(2)})</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
