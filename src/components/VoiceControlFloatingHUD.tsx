import React, { useState, useEffect, useRef } from 'react';
import { PartyPlan, ShoppingItem } from '../types';
import { parseVoiceCommand, speakAloud, VoiceCommandResult } from '../utils/voiceCommander';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Radio, 
  HelpCircle, 
  X, 
  Check, 
  AlertCircle,
  Command,
  ArrowRight,
  Zap
} from 'lucide-react';

interface VoiceControlFloatingHUDProps {
  party: PartyPlan;
  onAddItem: (newItem: Omit<ShoppingItem, 'id' | 'isPurchased'>) => void;
  onDeleteItem: (itemId: string) => void;
  onTogglePurchased: (itemId: string) => void;
  onUpdateItem: (itemId: string, updates: Partial<ShoppingItem>) => void;
  onUpdatePartyBudget: (budget: number) => void;
  onUpdatePartyGuests: (adults: number, kids: number) => void;
  onSelectTab: (tab: 'shopping' | 'route' | 'menu' | 'timeline' | 'formulas') => void;
  onSwapAllCymbalBrands: () => void;
  onOpenCheckout: () => void;
  onAdvanceCUJ: () => void;
  isVoiceActive: boolean;
  setIsVoiceActive: (active: boolean) => void;
}

// Example voice commands for instant testing and user guidance
const SAMPLE_VOICE_COMMANDS = [
  { label: 'Add Item', phrase: 'Add 2 packs of organic avocados for 6 dollars' },
  { label: 'Add Beverage', phrase: 'Add 3 bottles of sparkling lemonade' },
  { label: 'Check Off Item', phrase: 'Check off limes' },
  { label: 'Swap Store Brand', phrase: 'Swap all items to Cymbal brand' },
  { label: 'Change Quantity', phrase: 'Change tortilla chips quantity to 4' },
  { label: 'Remove Item', phrase: 'Remove guacamole' },
  { label: 'View Route Map', phrase: 'Show route map' },
  { label: 'View Menu & Recipes', phrase: 'Show menu plan' },
  { label: 'View Prep Schedule', phrase: 'Show timeline' },
  { label: 'Check Budget', phrase: 'What is my total cost?' },
  { label: 'Update Budget', phrase: 'Set budget to 300 dollars' },
  { label: 'Update Guests', phrase: '25 adults and 5 kids' },
  { label: 'Proceed to Checkout', phrase: 'Open checkout' }
];

export const VoiceControlFloatingHUD: React.FC<VoiceControlFloatingHUDProps> = ({
  party,
  onAddItem,
  onDeleteItem,
  onTogglePurchased,
  onUpdateItem,
  onUpdatePartyBudget,
  onUpdatePartyGuests,
  onSelectTab,
  onSwapAllCymbalBrands,
  onOpenCheckout,
  onAdvanceCUJ,
  isVoiceActive,
  setIsVoiceActive
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isContinuous, setIsContinuous] = useState(true);
  const [voiceSpeechEnabled, setVoiceSpeechEnabled] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [lastFeedback, setLastFeedback] = useState<VoiceCommandResult | null>(null);
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const [waveformIntensity, setWaveformIntensity] = useState(0);

  const recognitionRef = useRef<any>(null);
  const keepListeningRef = useRef<boolean>(false);

  keepListeningRef.current = isListening && isContinuous;

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setMicSupported(false);
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setWaveformIntensity(1);
        };

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              currentInterim += event.results[i][0].transcript;
            }
          }

          const activeText = finalTranscript || currentInterim;
          if (activeText) {
            setTranscript(activeText);
            setWaveformIntensity(2);
          }

          if (finalTranscript) {
            executeVoiceCommand(finalTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            setIsListening(false);
            setMicSupported(false);
          }
        };

        recognition.onend = () => {
          if (keepListeningRef.current && isVoiceActive) {
            try {
              recognition.start();
            } catch (e) {
              // ignore
            }
          } else {
            setIsListening(false);
            setWaveformIntensity(0);
          }
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Failed to initialize speech recognition:', err);
        setMicSupported(false);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [isVoiceActive]);

  // Execute recognized command
  const executeVoiceCommand = (spokenText: string) => {
    const result = parseVoiceCommand(spokenText, party);
    setLastFeedback(result);

    // Speak audio confirmation
    speakAloud(result.feedbackSpeech, voiceSpeechEnabled);

    // Perform state action
    if (result.recognized && result.action) {
      const { type, payload } = result.action;
      switch (type) {
        case 'add_item':
          if (payload) onAddItem(payload);
          break;
        case 'remove_item':
          if (payload?.itemId) onDeleteItem(payload.itemId);
          break;
        case 'toggle_item':
          if (payload?.itemId) onTogglePurchased(payload.itemId);
          break;
        case 'update_quantity':
          if (payload?.itemId) {
            onUpdateItem(payload.itemId, {
              quantity: payload.quantity,
              estimatedPrice: payload.estimatedPrice
            });
          }
          break;
        case 'set_budget':
          if (payload?.budget) onUpdatePartyBudget(payload.budget);
          break;
        case 'set_guests':
          if (payload) onUpdatePartyGuests(payload.adultCount, payload.childCount);
          break;
        case 'switch_tab':
          if (payload?.tab) onSelectTab(payload.tab);
          break;
        case 'swap_cymbal':
          onSwapAllCymbalBrands();
          break;
        case 'open_checkout':
          onOpenCheckout();
          break;
        case 'advance_cuj':
          onAdvanceCUJ();
          break;
        default:
          break;
      }
    }
  };

  const toggleMic = () => {
    if (!isVoiceActive) {
      setIsVoiceActive(true);
    }

    if (isListening) {
      keepListeningRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      setIsListening(false);
    } else {
      keepListeningRef.current = true;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Error starting recognition', e);
        }
      } else {
        // Mock recognition state for browser environments without native speech
        setIsListening(true);
      }
    }
  };

  if (!isVoiceActive) {
    return null;
  }

  return (
    <>
      {/* Floating Hands-Free Voice Control HUD Bar */}
      <div 
        id="voice-control-hud"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-stone-900/95 text-white rounded-2xl p-3 shadow-2xl border border-stone-700/60 backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-4 duration-200"
      >
        <div className="flex items-center justify-between gap-3">
          
          {/* Left: Microphone Toggle & Live Pulse */}
          <div className="flex items-center gap-2.5">
            <button
              id="btn-hud-toggle-mic"
              onClick={toggleMic}
              aria-label={isListening ? 'Mute microphone' : 'Activate microphone'}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                isListening
                  ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30'
                  : 'bg-stone-700 hover:bg-stone-600 text-stone-200'
              }`}
            >
              {isListening ? (
                <Mic className="w-5 h-5" />
              ) : (
                <MicOff className="w-5 h-5" />
              )}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Hands-Free Voice Control
                </span>
                {isListening && (
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded-full font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                    LIVE
                  </span>
                )}
              </div>

              {/* Status or live transcript */}
              <p className="text-[11px] text-stone-300 max-w-sm sm:max-w-md truncate font-medium mt-0.5">
                {isListening
                  ? (transcript ? `"${transcript}"` : 'Listening for commands... Speak naturally')
                  : 'Microphone paused. Click mic or try a test phrase.'}
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            
            {/* Audio Speech Confirmation Toggle */}
            <button
              id="btn-voice-speaker-toggle"
              onClick={() => setVoiceSpeechEnabled(!voiceSpeechEnabled)}
              title={voiceSpeechEnabled ? 'Voice audio feedback enabled' : 'Voice audio feedback muted'}
              className={`p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                voiceSpeechEnabled
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                  : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
              }`}
            >
              {voiceSpeechEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Voice Command Cheatsheet / Simulation Prompt Button */}
            <button
              id="btn-voice-cheatsheet"
              onClick={() => setShowCheatsheet(true)}
              title="Voice Commands Guide & Instant Simulator"
              className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-700"
            >
              <Command className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Commands</span>
            </button>

            {/* Close HUD */}
            <button
              id="btn-close-voice-hud"
              onClick={() => {
                if (isListening) toggleMic();
                setIsVoiceActive(false);
              }}
              title="Close Voice Control"
              className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Live Feedback Notification Banner inside HUD */}
        {lastFeedback && (
          <div className={`mt-2.5 px-3 py-1.5 rounded-xl text-xs flex items-center justify-between gap-2 transition-all ${
            lastFeedback.recognized 
              ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-200'
              : 'bg-stone-800/90 border border-stone-700 text-stone-300'
          }`}>
            <div className="flex items-center gap-2 truncate">
              {lastFeedback.recognized ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
              <span className="truncate font-medium">{lastFeedback.feedbackText}</span>
            </div>
            <button
              onClick={() => setLastFeedback(null)}
              className="text-stone-400 hover:text-white text-[10px] shrink-0 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Voice Commands Guide & Simulator Modal */}
      {showCheatsheet && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">Hands-Free Voice Controls</h3>
                  <p className="text-xs text-stone-500">Speak naturally or tap any sample command to test</p>
                </div>
              </div>
              <button
                onClick={() => setShowCheatsheet(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-4 flex-1">
              
              <div>
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-2">
                  1-Click Voice Command Simulator
                </span>
                <p className="text-xs text-stone-500 mb-3">
                  Click any command below to execute it immediately as if spoken aloud:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SAMPLE_VOICE_COMMANDS.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setTranscript(sample.phrase);
                        executeVoiceCommand(sample.phrase);
                        setShowCheatsheet(false);
                      }}
                      className="text-left p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/60 transition-all group flex flex-col justify-between cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-md">
                          {sample.label}
                        </span>
                        <Zap className="w-3 h-3 text-stone-300 group-hover:text-amber-600 transition-colors" />
                      </div>
                      <span className="text-xs text-stone-800 font-semibold mt-1.5 leading-snug">
                        "{sample.phrase}"
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Supported Spoken Capabilities */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs space-y-2 text-stone-700">
                <span className="font-bold text-stone-900 block">Spoken Voice Capabilities:</span>
                <ul className="space-y-1 list-disc list-inside text-stone-600">
                  <li><strong>Add items:</strong> "Add 2 packs of limes for 4 dollars"</li>
                  <li><strong>Remove items:</strong> "Remove guacamole", "Delete chips"</li>
                  <li><strong>Cart checklist:</strong> "Check off cheddar cheese", "Buy burger buns"</li>
                  <li><strong>Store brand swaps:</strong> "Swap all to Cymbal brand"</li>
                  <li><strong>Navigate views:</strong> "Show route map", "Show timeline", "Show recipes"</li>
                  <li><strong>Party scaling:</strong> "Set budget to $350", "25 adults and 5 kids"</li>
                  <li><strong>Instant fulfillment:</strong> "Open checkout", "Place order"</li>
                </ul>
              </div>

            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-400">Web Speech API & Audio TTS synthesis</span>
              <button
                onClick={() => setShowCheatsheet(false)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
