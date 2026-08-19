import React, { useState, useRef, useEffect } from 'react';
import { PartyPlan, ChatMessage, ShoppingItem } from '../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Check, 
  Plus, 
  Minus, 
  TrendingDown, 
  Users, 
  Wine, 
  Loader2,
  X
} from 'lucide-react';

interface AgentChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  party: PartyPlan;
  onApplyAgentAction: (action: ChatMessage['actionProposal']) => void;
}

export const AgentChatDrawer: React.FC<AgentChatDrawerProps> = ({
  isOpen,
  onClose,
  party,
  onApplyAgentAction
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'agent',
      text: `Hello! I'm your **CymbalMart Assistant** for **${party.title}**. 

I can help you:
• **Optimize Your Budget**: Find CymbalMart store brand swaps & cut costs
• **Adjust Portions**: Scale quantities for extra guests or longer duration
• **Plan Drink Pairings**: Calculate beer, wine, ice, and signature cocktail batches
• **Dietary Filters**: Spot allergen flags and recommend gluten-free/vegan substitutes
• **Navigate Aisles**: Find exact shelf locations at your local CymbalMart!

How can I assist your party planning today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [appliedActions, setAppliedActions] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          currentParty: party,
          chatHistory: messages.slice(-6)
        })
      });

      const data = await res.json();
      if (data.success) {
        const agentMsg: ChatMessage = {
          id: `agent-${Date.now()}`,
          sender: 'agent',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionProposal: data.actionProposal
        };
        setMessages((prev) => [...prev, agentMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          sender: 'agent',
          text: `Sorry, I encountered an issue: ${data.error || 'Please try again.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'agent',
        text: 'Network error communicating with party agent. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyProposal = (msgId: string, proposal: ChatMessage['actionProposal']) => {
    if (!proposal) return;
    onApplyAgentAction(proposal);
    setAppliedActions((prev) => ({ ...prev, [msgId]: true }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[420px] bg-white border-l border-stone-200 shadow-2xl flex flex-col">
      
      {/* Drawer Header */}
      <div className="p-4 border-b border-stone-200 bg-amber-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs font-bold text-xs">
            CM
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-xs text-stone-900">CymbalMart Assistant</h3>
              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded-full">Online</span>
            </div>
            <p className="text-[10px] text-stone-500">Live AI shopping, budget & aisle concierge</p>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Close CymbalMart Assistant"
          className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg text-xs cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="px-4 py-2 bg-stone-50 border-b border-stone-100 flex gap-1.5 overflow-x-auto no-scrollbar">
        {[
          'Cut $30 from budget',
          'Swap to Cymbal brands',
          'Add 5 more guests',
          'Suggest signature drinks',
          'Aisle navigator tips'
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={loading}
            className="text-[10px] whitespace-nowrap bg-white hover:bg-amber-100 border border-stone-200 text-stone-700 px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isAgent = msg.sender === 'agent';
          const isActionApplied = appliedActions[msg.id];

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  isAgent
                    ? 'bg-stone-100 text-stone-900 rounded-tl-xs'
                    : 'bg-stone-900 text-white rounded-tr-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Interactive Action Proposal Card */}
                {msg.actionProposal && (
                  <div className="mt-3 p-3 bg-white text-stone-900 rounded-xl border border-stone-200 shadow-xs space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{msg.actionProposal.description}</span>
                    </div>

                    {msg.actionProposal.itemsToAdd && msg.actionProposal.itemsToAdd.length > 0 && (
                      <ul className="text-[11px] text-stone-600 space-y-1 pl-1">
                        {msg.actionProposal.itemsToAdd.map((it, iIdx) => (
                          <li key={iIdx} className="flex justify-between">
                            <span>+ {it.name} ({it.quantity} {it.unit})</span>
                            <span className="font-semibold text-stone-800">${it.estimatedPrice.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {msg.actionProposal.itemIdsToRemove && msg.actionProposal.itemIdsToRemove.length > 0 && (
                      <p className="text-[11px] text-rose-600">
                        Removes {msg.actionProposal.itemIdsToRemove.length} non-essential items
                      </p>
                    )}

                    <div className="pt-1">
                      {isActionApplied ? (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                          <Check className="w-3.5 h-3.5" /> Applied to Shopping List
                        </div>
                      ) : (
                        <button
                          onClick={() => handleApplyProposal(msg.id, msg.actionProposal)}
                          className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Apply Changes to List
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-stone-400 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-stone-400 p-2">
            <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
            <span>Agent is crafting recommendations...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-stone-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="input-chat-agent"
            type="text"
            placeholder="Ask anything or request adjustments..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
            className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
          <button
            id="btn-send-chat"
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="p-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
