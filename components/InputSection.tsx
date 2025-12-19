
import React from 'react';
import { Mic, Square, Send, Eraser } from 'lucide-react';

interface InputSectionProps {
  value: string;
  onChange: (val: string) => void;
  isListening: boolean;
  isProcessing: boolean;
  interimTranscript: string;
  onStartRecord: () => void;
  onStopRecord: () => void;
  onSubmit: () => void;
  onClear: () => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  value,
  onChange,
  isListening,
  isProcessing,
  interimTranscript,
  onStartRecord,
  onStopRecord,
  onSubmit,
  onClear
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 px-4">
      <div className="relative glass-panel rounded-3xl p-6 shadow-sm ring-1 ring-slate-200 transition-all focus-within:ring-2 focus-within:ring-indigo-500">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            Raw Thought or Transcript
          </label>
          <button 
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
          >
            <Eraser size={14} />
            Clear
          </button>
        </div>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Speak freely or type your messy thoughts here... (e.g., 'Um, so basically, I was thinking like, maybe we should, uh, update the UI design?')"
          className="w-full h-40 bg-transparent border-none resize-none focus:outline-none text-slate-800 text-lg leading-relaxed placeholder:text-slate-300"
          disabled={isProcessing}
        />
        
        {isListening && (
          <div className="absolute inset-0 bg-indigo-50/50 backdrop-blur-[2px] rounded-3xl p-6 flex flex-col items-center justify-center text-center pointer-events-none">
            <div className="bg-indigo-600 p-4 rounded-full text-white mb-4 shadow-xl shadow-indigo-200 animate-pulse">
              <Mic size={32} />
            </div>
            <p className="text-indigo-900 font-medium text-xl">Listening to your thoughts...</p>
            <p className="text-indigo-600/80 mt-2 italic px-8 max-w-md truncate">
              {interimTranscript || "Waiting for audio..."}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex gap-2">
            {!isListening ? (
              <button
                onClick={onStartRecord}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-2xl font-semibold transition-all group"
              >
                <Mic size={18} className="group-hover:scale-110 transition-transform" />
                <span>Dictate</span>
              </button>
            ) : (
              <button
                onClick={onStopRecord}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-2xl font-semibold transition-all animate-recording pointer-events-auto"
              >
                <Square size={18} />
                <span>Stop</span>
              </button>
            )}
          </div>

          <button
            onClick={onSubmit}
            disabled={!value.trim() || isProcessing}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold transition-all shadow-lg ${
              !value.trim() || isProcessing
                ? 'bg-slate-200 text-slate-400 shadow-none'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:-translate-y-0.5'
            }`}
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={18} />
            )}
            <span>Refine Thought</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputSection;
