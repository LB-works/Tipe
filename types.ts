
export interface RefinementResult {
  raw: string;
  refined: string;
  timestamp: number;
}

export type AppState = 'idle' | 'recording' | 'processing' | 'result';
