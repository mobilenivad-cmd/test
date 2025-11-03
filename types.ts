
export enum View {
  Dashboard = 'DASHBOARD',
  StudyLog = 'STUDY_LOG',
  Planner = 'PLANNER',
  Progress = 'PROGRESS',
  Exams = 'EXAMS',
  Pomodoro = 'POMODORO',
  AICounselor = 'AI_COUNSELOR',
}

export interface StudySession {
  id: string;
  date: string; // YYYY-MM-DD
  activityName: string;
  duration: number; // in minutes
  description: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export interface PlanItem {
    time: string;
    subject: string;
    duration: number; // in minutes
}
