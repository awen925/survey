import axios from 'axios';
import { Question, SurveyResponse } from '../types';

const API_URL = 'http://localhost:3001/api';

export const api = {
  getQuestions: async (): Promise<Question[]> => {
    const response = await axios.get(`${API_URL}/survey/questions`);
    return response.data;
  },

  submitSurvey: async (responses: SurveyResponse[]): Promise<{ submissionId: number }> => {
    const response = await axios.post(`${API_URL}/survey/submit`, { responses });
    return response.data;
  },

  getSubmission: async (id: number): Promise<any> => {
    const response = await axios.get(`${API_URL}/survey/submissions/${id}`);
    return response.data;
  }
}; 