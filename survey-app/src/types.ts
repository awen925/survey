export interface BaseQuestion {
  id: number;
  title: string;
  description: string;
  required: boolean;
  order: number;
}

export interface TextQuestion extends BaseQuestion {
  type: 'text';
  options: {
    multiline: boolean;
    maxLength: number;
  };
}

export interface RatingQuestion extends BaseQuestion {
  type: 'rating';
  options: {
    min: number;
    max: number;
    labels: Record<number, string>;
  };
}

export interface ChoiceQuestion extends BaseQuestion {
  type: 'radio' | 'checkbox';
  options: {
    choices: string[];
  };
}

export type Question = TextQuestion | RatingQuestion | ChoiceQuestion;

export interface SurveyResponse {
  questionId: number;
  answer: string | number | string[];
}

export interface SurveySubmission {
  id: number;
  responses: SurveyResponse[];
  submittedAt: Date;
} 