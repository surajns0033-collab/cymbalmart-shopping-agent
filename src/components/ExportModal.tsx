import React, { useState } from 'react';
import { PartyPlan } from '../types';
import { generateStoreGroupedText, generateCategoryGroupedText } from '../utils/exportUtils';
import { Copy, Check, Printer, Share2, Store, FileText } from 'lucide-react';

interface ExportModalProps {
  party: PartyPlan;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  party,
  isOpen,
  onClose
}) => {
  const [exportFormat, setExportFormat] = useState<'store' | 'category'>('store');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const textContent =
    exportFormat === 'store'
      ? generateStoreGroupedText(party)
      : generateCategoryGroupedText(party);

  const handleCopy = () => {
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">Export & Share Shopping List</h2>
              <p className="text-xs text-stone-500">
                Ready for messaging apps, grocery runs, or printing
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

        {/* Format Selector Tabs */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => setExportFormat('store')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              exportFormat === 'store'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            Organized by Store (Costco, Grocery, Liquor)
          </button>

          <button
            onClick={() => setExportFormat('category')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              exportFormat === 'category'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Organized by Food Category
          </button>
        </div>

        {/* Formatted Text Box */}
        <div className="mt-4 flex-1">
          <textarea
            readOnly
            value={textContent}
            rows={12}
            className="w-full p-4 text-xs font-mono bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 focus:outline-hidden resize-none leading-relaxed"
          />
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print List
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl text-xs font-semibold transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Formatted List</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
