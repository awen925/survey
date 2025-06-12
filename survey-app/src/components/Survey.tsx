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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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

  const validateCurrentQuestion = (): boolean => {
    const question = questions[currentQuestionIndex];
    const value = responses[question.id];
    const newErrors: Record<number, string> = { ...errors };

    // Required field validation
    if (question.required && (!value || (Array.isArray(value) && value.length === 0))) {
      newErrors[question.id] = 'This field is required';
      setErrors(newErrors);
      return false;
    }

    // Type-specific validation
    if (value) {
      switch (question.type) {
        case 'text':
          if (question.options.maxLength && value.length > question.options.maxLength) {
            newErrors[question.id] = `Maximum length is ${question.options.maxLength} characters`;
            setErrors(newErrors);
            return false;
          }
          break;
        case 'rating':
          if (value < question.options.min || value > question.options.max) {
            newErrors[question.id] = `Rating must be between ${question.options.min} and ${question.options.max}`;
            setErrors(newErrors);
            return false;
          }
          break;
        case 'checkbox':
          if (Array.isArray(value) && value.length === 0 && question.required) {
            newErrors[question.id] = 'Please select at least one option';
            setErrors(newErrors);
            return false;
          }
          break;
      }
    }

    setErrors(newErrors);
    return true;
  };

  const handleNext = () => {
    if (validateCurrentQuestion()) {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
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
    setCurrentQuestionIndex(0);
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

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold">Survey</h2>
          <span className="text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <Question
          question={currentQuestion}
          value={responses[currentQuestion.id]}
          onChange={(value) => handleResponseChange(currentQuestion.id, value)}
          error={errors[currentQuestion.id]}
        />

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}; 