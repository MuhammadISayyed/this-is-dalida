'use client';

import { useState, useTransition } from 'react';
import { updatePersonality } from '@/lib/actions';
import { PERSONALITY_QUESTIONS, mapPersonalityWithQuestions } from '@/lib/constants';

interface PersonalityFormProps {
  initialData: Array<{
    questionIndex: number;
    answer: string;
  }>;
}

export default function PersonalityForm({ initialData }: PersonalityFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Map initial data with questions
  const questionsWithAnswers = mapPersonalityWithQuestions(initialData);
  
  // State for form answers
  const [answers, setAnswers] = useState(() => {
    const initialAnswers: Record<number, string> = {};
    questionsWithAnswers.forEach(({ questionIndex, answer }) => {
      initialAnswers[questionIndex] = answer;
    });
    return initialAnswers;
  });

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value,
    }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Convert answers object to array format
    const answersArray = Object.entries(answers).map(([index, answer]) => ({
      questionIndex: parseInt(index),
      answer: answer.trim(),
    }));

    // Filter out empty answers
    const validAnswers = answersArray.filter(({ answer }) => answer.length > 0);

    startTransition(async () => {
      const result = await updatePersonality(validAnswers);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  };

  const answeredCount = Object.values(answers).filter(answer => answer.trim().length > 0).length;
  const progressPercentage = (answeredCount / 9) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Brand Personality Questions</h2>
          <span className="text-sm text-gray-600">
            {answeredCount}/9 completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">Personality updated successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {questionsWithAnswers.map(({ questionIndex, question }) => (
          <div key={questionIndex} className="border rounded-lg p-6">
            <label className="block">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-medium text-gray-900 pr-4">
                  {questionIndex + 1}. {question}
                </h3>
                {answers[questionIndex]?.trim() && (
                  <span className="text-green-600 text-sm font-medium">✓</span>
                )}
              </div>
              <textarea
                value={answers[questionIndex] || ''}
                onChange={(e) => handleAnswerChange(questionIndex, e.target.value)}
                placeholder="Enter your answer..."
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         resize-vertical min-h-[80px]"
              />
            </label>
          </div>
        ))}

        <div className="flex justify-between items-center pt-6 border-t">
          <div className="text-sm text-gray-600">
            {answeredCount === 9 
              ? "All questions completed! 🎉" 
              : `${9 - answeredCount} questions remaining`
            }
          </div>
          
          <button
            type="submit"
            disabled={isPending || answeredCount === 0}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200"
          >
            {isPending ? 'Saving...' : 'Save Personality'}
          </button>
        </div>
      </form>
    </div>
  );
}