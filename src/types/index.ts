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
  iconColor: string;
  subtopics: Subtopic[];
}

export interface AvailableSubject {
  id: string;
  name: string;
  iconColor: string;
  subtopics: Omit<Subtopic, 'learnt' | 'revised'>[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  milestones: Milestone[];
  events: Event[];
  subjects: Subject[];
  availableSubjects: AvailableSubject[];
  level: string;
}
