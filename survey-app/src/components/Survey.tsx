import React, { useState, useEffect } from 'react';
import { Question as QuestionType, SurveyResponse } from '../types';
import { Question } from './Question';
import { api } from '../services/api';

export const Survey: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [responses, setResponses] = useState<Record<number, any>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);

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
      const value = responses[question.id];

      // Required field validation
      if (question.required && (!value || (Array.isArray(value) && value.length === 0))) {
        newErrors[question.id] = 'This field is required';
        isValid = false;
      }

      // Type-specific validation
      if (value) {
        switch (question.type) {
          case 'text':
            if (question.options.maxLength && value.length > question.options.maxLength) {
              newErrors[question.id] = `Maximum length is ${question.options.maxLength} characters`;
              isValid = false;
            }
            break;
          case 'rating':
            if (value < question.options.min || value > question.options.max) {
              newErrors[question.id] = `Rating must be between ${question.options.min} and ${question.options.max}`;
              isValid = false;
            }
            break;
          case 'checkbox':
            if (Array.isArray(value) && value.length === 0 && question.required) {
              newErrors[question.id] = 'Please select at least one option';
              isValid = false;
            }
            break;
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

      await api.submitSurvey(surveyResponses);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting survey:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setResponses({});
    setErrors({});
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Thank you for completing the survey!</h2>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Your Responses</h3>
          {questions.map((question) => {
            const response = responses[question.id];
            return (
              <div key={question.id} className="mb-4">
                <h4 className="font-medium">{question.title}</h4>
                <p className="text-gray-600">
                  {question.type === 'rating' && question.options.labels[response]
                    ? question.options.labels[response]
                    : Array.isArray(response)
                    ? response.join(', ')
                    : response}
                </p>
              </div>
            );
          })}
          <button
            onClick={handleReset}
            className="mt-6 w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Start New Survey
          </button>
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