'use client';

import { useState, useTransition } from 'react';
import { toggleRule } from '@/lib/actions';

interface RuleCardProps {
  rule: {
    id: number;
    title: string;
    description: string;
    doExample: string;
    dontExample: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  onEdit?: (ruleId: number) => void;
  onDelete?: (ruleId: number) => void;
}

export default function RuleCard({ rule, onEdit, onDelete }: RuleCardProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [optimisticActive, setOptimisticActive] = useState(rule.isActive);

  const handleToggle = () => {
    setError(null);
    setOptimisticActive(!optimisticActive); // Optimistic update

    startTransition(async () => {
      const result = await toggleRule(rule.id, !rule.isActive);
      
      if (result.error) {
        setError(result.error);
        setOptimisticActive(rule.isActive); // Revert optimistic update
      }
    });
  };

  return (
    <div className={`border rounded-lg p-6 transition-all duration-200 ${
      optimisticActive 
        ? 'bg-green-50 border-green-200 shadow-sm' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 pr-4">
          {rule.title}
        </h3>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggle}
            disabled={isPending}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
              optimisticActive
                ? 'bg-green-200 text-green-800 hover:bg-green-300'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            } disabled:opacity-50`}
          >
            {isPending ? 'Updating...' : (optimisticActive ? 'Active' : 'Inactive')}
          </button>

          {/* Action buttons */}
          <div className="flex gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(rule.id)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={() => onDelete(rule.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium ml-2"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4">
        {rule.description}
      </p>

      {/* Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-green-600 font-medium text-sm">✓ DO:</span>
          </div>
          <p className="text-green-800 text-sm">
            {rule.doExample}
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-red-600 font-medium text-sm">✗ DON'T:</span>
          </div>
          <p className="text-red-800 text-sm">
            {rule.dontExample}
          </p>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
        <span>Created {rule.createdAt.toLocaleDateString()}</span>
        {rule.updatedAt.getTime() !== rule.createdAt.getTime() && (
          <span>Updated {rule.updatedAt.toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
}