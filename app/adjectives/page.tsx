import Link from 'next/link';
import { getBrandAdjectives, getBrandDashboardData } from '@/lib/queries';
import AdjectivesForm from '@/components/forms/AdjectivesForm';
import { redirect } from 'next/navigation';

export default async function AdjectivesPage() {
  const dashboardData = await getBrandDashboardData();
  
  if (!dashboardData) {
    redirect('/setup');
  }

  const adjectivesData = await getBrandAdjectives();

  return (
    <div className="container mx-auto px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">Brand Adjectives</h1>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">How This Works</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Choose exactly 3 adjectives that best describe your brand</li>
            <li>• Provide examples showing subtle, obvious, and intense expressions of each adjective</li>
            <li>• These will guide AI-generated content and writing rules</li>
          </ul>
        </div>
      </div>

      {/* Form */}
      <AdjectivesForm initialData={adjectivesData} />
    </div>
  );
}