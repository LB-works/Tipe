
import { useState, useCallback, useEffect, useRef } from 'react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';

          // Collect ALL final results from the start
          for (let i = 0; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          setTranscript(finalTranscript.trim());
          setInterimTranscript(interimTranscript);
        };

        recognition.onerror = (event: any) => {
          console.warn('SpeechRecognition error state:', event.error);
          if (event.error === 'not-allowed') {
            setError('Microphone access blocked. Please click the lock or mic icon in your address bar and set to "Allow".');
          } else if (event.error === 'no-speech') {
            // No action needed for silence timeouts
          } else if (event.error === 'network') {
            setError('Network error during recognition. Check your internet connection.');
          } else {
            setError(`Recognition engine error: ${event.error}`);
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (e) {
        console.error('Failed to initialize SpeechRecognition object:', e);
      }
    } else {
      setError('Speech recognition is not supported in this browser. Please use a modern version of Chrome, Safari, or Edge.');
    }
  }, []);

  const startListening = useCallback(async () => {
    if (!recognitionRef.current) {
      setError('Speech recognition engine is not initialized.');
      return;
    }
    if (isListening) return;

    setError(null);

    // Secure context check
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setError('Microphone access requires a secure (HTTPS) connection.');
      return;
    }

    try {
      // Step 1: Explicitly trigger the browser's native permission dialog
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Release microphone immediately after permission check
      stream.getTracks().forEach(track => track.stop());

      setTranscript('');
      setInterimTranscript('');

      // Step 2: Start the high-level recognition engine
      setTimeout(() => {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (startErr: any) {
          if (!startErr.message?.includes('already started')) {
            console.error('Failed to start recognition:', startErr);
            setError('Could not start recognition. Try refreshing the page.');
          } else {
            setIsListening(true);
          }
        }
      }, 150);

    } catch (err: any) {
      console.error('Mic Access error caught:', err.name, err.message);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.message?.toLowerCase().includes('denied')) {
        setError('Microphone permission denied. To fix: click the lock icon in your address bar and change Microphone to "Allow".');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found on this device.');
      } else {
        setError(`Microphone error: ${err.message || err.name}`);
      }
      setIsListening(false);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('Error during manual stop:', e);
      }
      setIsListening(false);
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    setTranscript,
    setError
  };
};
