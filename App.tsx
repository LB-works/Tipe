
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header.tsx';
import InputSection from './components/InputSection.tsx';
import OutputSection from './components/OutputSection.tsx';
import { useSpeechRecognition } from './hooks/useSpeechRecognition.ts';
import { refineTranscript } from './services/geminiService.ts';
import { AlertCircle, RefreshCw, MicOff, Settings, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  const [rawText, setRawText] = useState('');
  const [refinedText, setRefinedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    isListening,
    transcript,
    interimTranscript,
    error: speechError,
    startListening,
    stopListening,
    setTranscript,
    setError: setSpeechError
  } = useSpeechRecognition();

  const displayError = apiError || speechError;

  useEffect(() => {
    if (transcript) {
      setRawText(transcript);
    }
  }, [transcript]);

  const handleRefine = async () => {
    if (!rawText.trim()) return;

    setApiError(null);
    setSpeechError(null);
    setIsProcessing(true);
    setRefinedText('');

    try {
      const result = await refineTranscript(rawText);
      setRefinedText(result);
    } catch (err: any) {
      setApiError(err.message || "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setRawText('');
    setRefinedText('');
    setTranscript('');
    setApiError(null);
    setSpeechError(null);
  };

  const handleRetryMic = useCallback(() => {
    setSpeechError(null);
    startListening();
  }, [startListening, setSpeechError]);

  const isPermissionError =
    speechError?.toLowerCase().includes('denied') ||
    speechError?.toLowerCase().includes('permission') ||
    speechError?.toLowerCase().includes('blocked') ||
    speechError?.toLowerCase().includes('not-allowed');

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-slate-50 to-white selection:bg-indigo-100 selection:text-indigo-900">
      <Header />

      <main>
        <div className="max-w-4xl mx-auto px-4 mb-8">
          <div className="bg-indigo-600/5 border border-indigo-100 rounded-2xl p-4 sm:p-6 text-indigo-900 mb-8 shadow-sm">
            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
              Transform Spoken Chaos into Clear Text
            </h3>
            <p className="text-indigo-700/80 leading-relaxed text-sm">
              Our engine understands the <em>intent</em> behind your messy speech. Simply dictate or paste your raw thoughts,
              and we'll strip away the filler words, fix the structure, and deliver polished writing.
            </p>
          </div>
        </div>

        <InputSection
          value={rawText}
          onChange={setRawText}
          isListening={isListening}
          isProcessing={isProcessing}
          interimTranscript={interimTranscript}
          onStartRecord={startListening}
          onStopRecord={stopListening}
          onSubmit={handleRefine}
          onClear={handleClear}
        />

        {displayError && (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className={`border rounded-2xl px-6 py-5 shadow-md flex flex-col gap-3 transition-all animate-in fade-in slide-in-from-top-2 ${isPermissionError
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-red-50 border-red-200 text-red-900'
              }`}>
              <div className="flex items-center gap-3 font-bold">
                {isPermissionError ? <MicOff className="text-amber-600" size={22} /> : <AlertCircle className="text-red-600" size={22} />}
                <span className="text-lg">{isPermissionError ? 'Microphone Access Issue' : 'Attention'}</span>
              </div>

              <p className="text-sm leading-relaxed font-medium opacity-90">
                {displayError}
              </p>

              {isPermissionError ? (
                <div className="flex flex-col gap-4 mt-2 p-4 bg-white/50 rounded-xl border border-amber-200/50">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
                      <Settings size={14} />
                      How to fix:
                    </div>
                    <ol className="text-xs space-y-2 list-decimal list-inside text-amber-800 font-medium">
                      <li>Check your browser address bar for a <strong>lock (🔒)</strong> or blocked microphone icon.</li>
                      <li>Select <strong>"Allow"</strong> for the microphone.</li>
                      <li>Click <strong>"Try Mic Again"</strong> below.</li>
                    </ol>
                  </div>
                  <button
                    onClick={handleRetryMic}
                    className="flex items-center justify-center gap-2 w-full sm:w-fit bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-200 active:scale-95"
                  >
                    <RefreshCw size={16} />
                    Try Mic Again
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={() => { setApiError(null); setSpeechError(null); }}
                    className="flex items-center justify-center gap-2 w-full sm:w-fit bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 mt-2"
                  >
                    <RotateCcw size={16} />
                    Dismiss & Reset
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <OutputSection refined={refinedText} />
      </main>

      <footer className="mt-20 py-8 text-center text-slate-400 text-sm border-t border-slate-100">
        <p>© 2024 ThoughtRefine AI • Professional Thought Polishing • v2.5</p>
      </footer>
    </div>
  );
};

export default App;
