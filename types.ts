
export interface ScrapingProject {
  id: string;
  name: string;
  targetUrl: string;
  intent: string;
  status: 'active' | 'paused' | 'failed' | 'deploying';
  health: number; // 0-100
  lastRun: string;
  spiderCode: string;
  googleDriveEnabled?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  sources?: Array<{web: {uri: string, title: string}}>;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  WIZARD = 'WIZARD',
  PROJECT_DETAIL = 'PROJECT_DETAIL',
  INSIGHTS = 'INSIGHTS',
  LOGS = 'LOGS',
  HOW_TO_USE = 'HOW_TO_USE'
}
