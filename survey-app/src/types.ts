export interface Question {
  id: number;
  title: string;
  description: string;
  type: 'text' | 'number' | 'select' | 'radio' | 'checkbox';
  options?: string[];
  required: boolean;
  order: number;
}

export interface SurveyResponse {
  questionId: number;
  answer: string | number | string[];
}

export interface SurveySubmission {
  id: number;
  responses: SurveyResponse[];
  submittedAt: Date;
} 