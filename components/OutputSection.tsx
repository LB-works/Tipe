
import React, { useState } from 'react';
import { Copy, Check, Quote, Share2 } from 'lucide-react';

interface OutputSectionProps {
  refined: string;
}

const OutputSection: React.FC<OutputSectionProps> = ({ refined }) => {
  const [copied, setCopied] = useState(false);

  if (!refined) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(refined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        <div className="absolute -top-4 -left-4 text-indigo-100 opacity-50">
          <Quote size={120} />
        </div>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              Refined Thought
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-slate-100"
                title="Copy to clipboard"
              >
                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
              <button
                className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-slate-100"
                title="Share"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            {refined.split('\n').map((para, idx) => (
              para.trim() ? (
                <p key={idx} className="text-slate-800 text-xl leading-relaxed font-medium mb-4">
                  {para}
                </p>
              ) : null
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between text-slate-400 text-xs italic">
            <span>Intent captured & polished by Gemini 3</span>
            <span>Natural Language Output</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputSection;
