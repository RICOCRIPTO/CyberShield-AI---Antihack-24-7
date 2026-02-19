
export enum SecurityStatus {
  SAFE = 'SAFE',
  SCANNING = 'SCANNING',
  WARNING = 'WARNING',
  BREACH = 'BREACH'
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  message: string;
  level: 'info' | 'warning' | 'critical';
}

export interface SecurityAdvice {
  summary: string;
  steps: string[];
}
