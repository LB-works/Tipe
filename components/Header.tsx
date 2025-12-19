
import React from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 mb-8">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
            <BrainCircuit size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">ThoughtRefine AI</h1>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Intent-Aware Intelligence</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100">
          <Sparkles size={16} />
          <span>Gemini 3 Powered</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
