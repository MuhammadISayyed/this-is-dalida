import { setupBrand } from '@/lib/actions';
import { hasBrand } from '@/lib/brand-context';
import { redirect } from 'next/navigation';

export default async function SetupPage() {
  // If brand already exists, redirect to dashboard
  const brandExists = await hasBrand();
  if (brandExists) {
    redirect('/');
  }

  async function handleSetup(formData: FormData) {
    'use server';
    
    const result = await setupBrand(formData);
    
    // setupBrand redirects on success, so we only get here on error
    if (result?.error) {
      throw new Error(result.error);
    }
  }

  return (
    <div className="container mx-auto px-4 max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome!</h1>
        <p className="text-gray-600">
          Let's set up your brand personality management system.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Your Brand</h2>
        <p className="text-gray-600 text-sm mb-6">
          Start by giving your brand a name. You can change this later in settings.
        </p>

        <form action={handleSetup} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Brand Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              minLength={2}
              maxLength={100}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       text-lg"
              placeholder="Enter your brand name"
            />
            <p className="text-xs text-gray-500 mt-1">
              2-100 characters required
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 
                     transition-colors duration-200 font-medium text-lg"
          >
            Create Brand & Get Started
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">What's next?</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Define your brand personality (9 questions)</li>
            <li>• Set 3 core adjectives with intensity examples</li>
            <li>• Create writing rules for consistent voice</li>
          </ul>
        </div>
      </div>
    </div>
  );
}