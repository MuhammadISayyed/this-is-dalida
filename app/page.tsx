import Link from 'next/link';
import { getBrandDashboardData } from '@/lib/queries';
import { PERSONALITY_QUESTIONS } from '@/lib/constants';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const dashboardData = await getBrandDashboardData();

  // If no brand exists, redirect to setup
  if (!dashboardData) {
    redirect('/setup');
  }

  const { brand, personality, adjectives, rules, stats } = dashboardData;

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      {/* Brand Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{brand.name}</h1>
          <p className="text-gray-600 mt-1">Brand personality management dashboard</p>
        </div>
        
        <Link
          href="/settings"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Settings
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className={`p-4 rounded-lg border-2 ${
          stats.isPersonalityComplete 
            ? 'bg-green-50 border-green-200' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <h3 className={`font-semibold ${
            stats.isPersonalityComplete ? 'text-green-800' : 'text-blue-800'
          }`}>
            Personality
          </h3>
          <p className={`text-2xl font-bold ${
            stats.isPersonalityComplete ? 'text-green-600' : 'text-blue-600'
          }`}>
            {stats.personalityCompletion}/9
          </p>
          <p className={`text-sm ${
            stats.isPersonalityComplete ? 'text-green-600' : 'text-blue-600'
          }`}>
            {stats.isPersonalityComplete ? 'Complete' : 'Questions answered'}
          </p>
        </div>
        
        <div className={`p-4 rounded-lg border-2 ${
          stats.areAdjectivesComplete 
            ? 'bg-green-50 border-green-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <h3 className={`font-semibold ${
            stats.areAdjectivesComplete ? 'text-green-800' : 'text-yellow-800'
          }`}>
            Adjectives
          </h3>
          <p className={`text-2xl font-bold ${
            stats.areAdjectivesComplete ? 'text-green-600' : 'text-yellow-600'
          }`}>
            {stats.adjectivesCompletion}/3
          </p>
          <p className={`text-sm ${
            stats.areAdjectivesComplete ? 'text-green-600' : 'text-yellow-600'
          }`}>
            {stats.areAdjectivesComplete ? 'Complete' : 'Defined'}
          </p>
        </div>
        
        <div className="bg-purple-50 border-2 border-purple-200 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800">Rules</h3>
          <p className="text-2xl font-bold text-purple-600">
            {stats.totalRules}
          </p>
          <p className="text-sm text-purple-600">Total created</p>
        </div>
        
        <div className="bg-indigo-50 border-2 border-indigo-200 p-4 rounded-lg">
          <h3 className="font-semibold text-indigo-800">Active Rules</h3>
          <p className="text-2xl font-bold text-indigo-600">
            {stats.activeRulesCount}
          </p>
          <p className="text-sm text-indigo-600">Currently active</p>
        </div>
      </div>

      {/* Setup Progress */}
      {(!stats.isPersonalityComplete || !stats.areAdjectivesComplete) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">Complete Your Brand Setup</h2>
          <div className="space-y-2">
            {!stats.isPersonalityComplete && (
              <div className="flex items-center justify-between">
                <span className="text-blue-800">Define brand personality (9 questions)</span>
                <Link href="/personality" className="text-blue-600 hover:text-blue-800 font-medium">
                  Complete →
                </Link>
              </div>
            )}
            {!stats.areAdjectivesComplete && (
              <div className="flex items-center justify-between">
                <span className="text-blue-800">Set brand adjectives (3 required)</span>
                <Link href="/adjectives" className="text-blue-600 hover:text-blue-800 font-medium">
                  Complete →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          href="/personality" 
          className="group border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">
              🧠 Personality
            </h2>
            {stats.isPersonalityComplete && (
              <span className="text-green-600 text-sm font-medium">✓</span>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Define your brand's core personality through 9 key questions that shape your voice and tone.
          </p>
          <div className="flex justify-between items-center">
            <span className="text-blue-600 group-hover:text-blue-800 font-medium">
              {stats.isPersonalityComplete ? 'Review & Edit' : 'Complete Setup'} →
            </span>
            <span className="text-xs text-gray-500">
              {stats.personalityCompletion}/9
            </span>
          </div>
        </Link>

        <Link 
          href="/adjectives" 
          className="group border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">
              🎯 Adjectives
            </h2>
            {stats.areAdjectivesComplete && (
              <span className="text-green-600 text-sm font-medium">✓</span>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Set 3 core adjectives with examples showing subtle, obvious, and intense expressions.
          </p>
          <div className="flex justify-between items-center">
            <span className="text-blue-600 group-hover:text-blue-800 font-medium">
              {stats.areAdjectivesComplete ? 'Review & Edit' : 'Complete Setup'} →
            </span>
            <span className="text-xs text-gray-500">
              {stats.adjectivesCompletion}/3
            </span>
          </div>
        </Link>

        <Link 
          href="/rules" 
          className="group border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">
              📝 Rules
            </h2>
            {stats.totalRules > 0 && (
              <span className="text-blue-600 text-sm font-medium">
                {stats.activeRulesCount} active
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Create and manage writing rules with do/don't examples. Toggle rules on/off as needed.
          </p>
          <div className="flex justify-between items-center">
            <span className="text-blue-600 group-hover:text-blue-800 font-medium">
              {stats.totalRules === 0 ? 'Create First Rule' : 'Manage Rules'} →
            </span>
            <span className="text-xs text-gray-500">
              {stats.totalRules} total
            </span>
          </div>
        </Link>
      </div>

      {/* Recent Activity Preview */}
      {stats.totalRules > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Rules</h2>
          <div className="space-y-3">
            {rules.slice(0, 3).map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${
                    rule.isActive ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  <span className="font-medium text-gray-900">{rule.title}</span>
                </div>
                <Link 
                  href="/rules" 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Manage
                </Link>
              </div>
            ))}
            
            {rules.length > 3 && (
              <Link 
                href="/rules"
                className="block text-center text-blue-600 hover:text-blue-800 text-sm font-medium py-2"
              >
                View all {rules.length} rules →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
