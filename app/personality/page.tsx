import Link from 'next/link';
import { getBrandPersonality, getBrandDashboardData } from '@/lib/queries';
import PersonalityForm from '@/components/forms/PersonalityForm';
import { redirect } from 'next/navigation';

export default async function PersonalityPage() {
  const dashboardData = await getBrandDashboardData();
  
  if (!dashboardData) {
    redirect('/setup');
  }

  const personalityData = await getBrandPersonality();

  return (
    <div className="container mx-auto px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">Brand Personality</h1>
          </div>
        </div>
        
        <p className="text-gray-600">
          Answer these 9 questions to define your brand's core personality. 
          These responses will inform your adjectives and writing rules.
        </p>
      </div>

      {/* Form */}
      <PersonalityForm initialData={personalityData} />
    </div>
  );
}