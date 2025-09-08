import Link from 'next/link';
import { getBrandName } from '@/lib/brand-context';

export default async function Navigation() {
  const brandName = await getBrandName();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '🏠' },
    { href: '/personality', label: 'Personality', icon: '🧠' },
    { href: '/adjectives', label: 'Adjectives', icon: '🎯' },
    { href: '/rules', label: 'Rules', icon: '📝' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Brand name */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              {brandName || 'Brand Manager'}
            </Link>
          </div>

          {/* Navigation items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 
                         transition-colors duration-200"
              >
                <span>{icon}</span>
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button - you can implement this later */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}