export enum SecurityStatus {
  SAFE = "SEGURO",
  BREACH = "INVADIDO"
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
