'use client';

import { useState, useTransition } from 'react';
import { updateAdjectives } from '@/lib/actions';

interface AdjectivesFormProps {
  initialData: Array<{
    id: number;
    name: string;
    description: string;
    subtleExample: string;
    obviousExample: string;
    intenseExample: string;
  }>;
}

interface AdjectiveData {
  name: string;
  description: string;
  subtleExample: string;
  obviousExample: string;
  intenseExample: string;
}

export default function AdjectivesForm({ initialData }: AdjectivesFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Initialize with existing data or empty template
  const [adjectives, setAdjectives] = useState<AdjectiveData[]>(() => {
    if (initialData.length === 3) {
      return initialData.map(adj => ({
        name: adj.name,
        description: adj.description,
        subtleExample: adj.subtleExample,
        obviousExample: adj.obviousExample,
        intenseExample: adj.intenseExample,
      }));
    }
    
    // Return 3 empty adjectives
    return Array(3).fill(null).map(() => ({
      name: '',
      description: '',
      subtleExample: '',
      obviousExample: '',
      intenseExample: '',
    }));
  });

  const updateAdjective = (index: number, field: keyof AdjectiveData, value: string) => {
    setAdjectives(prev => prev.map((adj, i) => 
      i === index ? { ...adj, [field]: value } : adj
    ));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await updateAdjectives(adjectives);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  };

  const completedCount = adjectives.filter(adj => 
    adj.name.trim() && 
    adj.description.trim() && 
    adj.subtleExample.trim() && 
    adj.obviousExample.trim() && 
    adj.intenseExample.trim()
  ).length;

  const isFormValid = completedCount === 3;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Brand Adjectives</h2>
          <span className="text-sm text-gray-600">
            {completedCount}/3 completed
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          Define exactly 3 adjectives that describe your brand, with examples showing different intensity levels.
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / 3) * 100}%` }}
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
          <p className="text-green-800 text-sm">Adjectives updated successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {adjectives.map((adjective, index) => (
          <div key={index} className="border rounded-lg p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Adjective {index + 1}</h3>
              {adjective.name && adjective.description && 
               adjective.subtleExample && adjective.obviousExample && adjective.intenseExample && (
                <span className="text-green-600 text-sm font-medium">✓ Complete</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Adjective Name *
                </label>
                <input
                  type="text"
                  value={adjective.name}
                  onChange={(e) => updateAdjective(index, 'name', e.target.value)}
                  placeholder="e.g., Professional"
                  className="w-full border border-gray-300 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={50}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  value={adjective.description}
                  onChange={(e) => updateAdjective(index, 'description', e.target.value)}
                  placeholder="Brief description of this adjective"
                  className="w-full border border-gray-300 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={200}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Intensity Examples</h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium mb-2 text-blue-800">
                    Subtle Example *
                  </label>
                  <textarea
                    value={adjective.subtleExample}
                    onChange={(e) => updateAdjective(index, 'subtleExample', e.target.value)}
                    placeholder="How this adjective appears subtly..."
                    rows={3}
                    className="w-full border border-blue-200 rounded-md px-3 py-2 bg-white
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                             resize-vertical"
                    maxLength={200}
                  />
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium mb-2 text-yellow-800">
                    Obvious Example *
                  </label>
                  <textarea
                    value={adjective.obviousExample}
                    onChange={(e) => updateAdjective(index, 'obviousExample', e.target.value)}
                    placeholder="How this adjective appears obviously..."
                    rows={3}
                    className="w-full border border-yellow-200 rounded-md px-3 py-2 bg-white
                             focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500
                             resize-vertical"
                    maxLength={200}
                  />
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium mb-2 text-red-800">
                    Intense Example *
                  </label>
                  <textarea
                    value={adjective.intenseExample}
                    onChange={(e) => updateAdjective(index, 'intenseExample', e.target.value)}
                    placeholder="How this adjective appears intensely..."
                    rows={3}
                    className="w-full border border-red-200 rounded-md px-3 py-2 bg-white
                             focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
                             resize-vertical"
                    maxLength={200}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center pt-6 border-t">
          <div className="text-sm text-gray-600">
            {isFormValid 
              ? "All adjectives completed! 🎉" 
              : `${3 - completedCount} adjectives need completion`
            }
          </div>
          
          <button
            type="submit"
            disabled={isPending || !isFormValid}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200"
          >
            {isPending ? 'Saving...' : 'Save Adjectives'}
          </button>
        </div>
      </form>
    </div>
  );
}