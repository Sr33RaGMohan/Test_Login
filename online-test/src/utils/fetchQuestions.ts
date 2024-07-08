// utils/fetchQuestions.ts
import questionsData from './questions.json';

export interface Question {
  category: string;
  question: string;
  options: { id: number; value: string }[];
  correct_option: number;
}

export const fetchQuestions = (category: string): Question[] => {
  return questionsData.filter(q => q.category === category);
};
