export interface Milestone {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date string
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
}

export interface Subtopic {
  id: string;
  name: string;
  description?: string;
  learnt: number; // 0 or 1
  revised: number; // 0 or 1
}

export interface Subject {
  id: string;
  name: string;
  examBoard: string;
  level: string;
  iconColor: string;
  subtopics: Subtopic[];
}

export interface AvailableSubject {
  id: string;
  name: string;
  iconColor: string;
  subtopics: Omit<Subtopic, 'learnt' | 'revised'>[];
}

export interface AvailableExamBoard {
  id: string;
  name: string;
  launched: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  level: string;
  isTrial: boolean;
  isVerified: boolean;
  milestones: Milestone[];
  events: Event[];
  subjects: Subject[];
  availableSubjects: AvailableSubject[];
}
