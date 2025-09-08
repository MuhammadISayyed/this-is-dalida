import { db } from '@/db/drizzle';
import { brand } from '@/db/schema';

/**
 * Get the current brand for this account
 * In a real app, this would be filtered by user/account ID from authentication
 * For now, we assume one brand per deployment
 */
export async function getCurrentBrand() {
  try {
    const [currentBrand] = await db.select().from(brand).limit(1);
    return currentBrand || null;
  } catch (error) {
    console.error('Failed to get current brand:', error);
    return null;
  }
}

/**
 * Get the current brand ID
 * Returns null if no brand exists
 */
export async function getCurrentBrandId(): Promise<number | null> {
  const currentBrand = await getCurrentBrand();
  return currentBrand?.id || null;
}

/**
 * Check if a brand exists for this account
 */
export async function hasBrand(): Promise<boolean> {
  const currentBrand = await getCurrentBrand();
  return !!currentBrand;
}

/**
 * Get brand name for display purposes
 */
export async function getBrandName(): Promise<string | null> {
  const currentBrand = await getCurrentBrand();
  return currentBrand?.name || null;
}