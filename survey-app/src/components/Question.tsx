import React from 'react';
import { Question as QuestionType } from '../types';

interface QuestionProps {
  question: QuestionType;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export const Question: React.FC<QuestionProps> = ({
  question,
  value,
  onChange,
  error
}) => {
  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={question.options.multiline ? 4 : 1}
            maxLength={question.options.maxLength}
          />
        );
      case 'rating':
        return (
          <div className="flex items-center space-x-4">
            {Array.from({ length: question.options.max - question.options.min + 1 }, (_, i) => i + question.options.min).map((rating) => (
              <label key={rating} className="flex flex-col items-center">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={rating}
                  checked={value === rating}
                  onChange={(e) => onChange(Number(e.target.value))}
                  className="text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm mt-1">{question.options.labels[rating]}</span>
              </label>
            ))}
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {question.options.choices.map((choice) => (
              <label key={choice} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={choice}
                  checked={value === choice}
                  onChange={(e) => onChange(e.target.value)}
                  className="text-blue-500 focus:ring-blue-500"
                />
                <span>{choice}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options.choices.map((choice) => (
              <label key={choice} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={choice}
                  checked={Array.isArray(value) && value.includes(choice)}
                  onChange={(e) => {
                    const newValue = Array.isArray(value) ? [...value] : [];
                    if (e.target.checked) {
                      newValue.push(choice);
                    } else {
                      const index = newValue.indexOf(choice);
                      if (index > -1) {
                        newValue.splice(index, 1);
                      }
                    }
                    onChange(newValue);
                  }}
                  className="text-blue-500 focus:ring-blue-500"
                />
                <span>{choice}</span>
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">{question.title}</h3>
      {question.description && (
        <p className="text-gray-600 mb-4">{question.description}</p>
      )}
      {renderInput()}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}; 