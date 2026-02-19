export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  rationale: string;
  hint: string;
}

export interface QuizData {
  quizTitle: string;
  questions: QuizQuestion[];
}

export interface QuizProgress {
  currentIndex: number;
  answers: Record<number, number>; // questionId -> selectedOptionIndex
  completedAt: number | null; // timestamp when finished, null if in progress
}

export const QUIZ_STORAGE_KEY = 'lab-natty-quiz-progress';
