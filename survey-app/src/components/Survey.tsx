import React, { useState, useEffect } from 'react';
import { Question as QuestionType, SurveyResponse } from '../types';
import { Question } from './Question';
import { api } from '../services/api';

export const Survey: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [responses, setResponses] = useState<Record<number, any>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState<number | null>(null);
  const [submittedResponses, setSubmittedResponses] = useState<any[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await api.getQuestions();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  const handleResponseChange = (questionId: number, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    // Clear error when user makes a change
    setErrors((prev) => ({
      ...prev,
      [questionId]: '',
    }));
  };

  const validateResponses = (): boolean => {
    const newErrors: Record<number, string> = {};
    let isValid = true;

    questions.forEach((question) => {
      if (question.required) {
        const value = responses[question.id];
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[question.id] = 'This field is required';
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateResponses()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const surveyResponses: SurveyResponse[] = Object.entries(responses).map(
        ([questionId, answer]) => ({
          questionId: Number(questionId),
          answer,
        })
      );

      const { submissionId } = await api.submitSurvey(surveyResponses);
      setSubmissionId(submissionId);
      
      // Fetch submitted responses for review
      const submittedData = await api.getSubmission(submissionId);
      setSubmittedResponses(submittedData);
    } catch (error) {
      console.error('Error submitting survey:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionId) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Thank you for completing the survey!</h2>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Your Responses</h3>
          {submittedResponses.map((response) => (
            <div key={response.id} className="mb-4">
              <h4 className="font-medium">{response.title}</h4>
              <p className="text-gray-600">
                {Array.isArray(response.answer)
                  ? response.answer.join(', ')
                  : response.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Survey</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        {questions.map((question) => (
          <Question
            key={question.id}
            question={question}
            value={responses[question.id]}
            onChange={(value) => handleResponseChange(question.id, value)}
            error={errors[question.id]}
          />
        ))}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Survey'}
        </button>
      </form>
    </div>
  );
}; 