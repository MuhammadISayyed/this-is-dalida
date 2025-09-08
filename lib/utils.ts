import { db } from '@/db/drizzle'
import { brand } from '@/db/schema'

/**
   * Get the current brand for this account
   * In a real app, this would be filtered by user/account ID from
  authentication
   * For now, we assume one brand per deployment
   */
export async function getCurrentBrand() {
  try {
    const [currentBrand] = await db.select().from(brand).limit(1)
    return currentBrand || null
  } catch (error) {
    console.error('Error fetching current brand:', error)
    return null
  }
}

// get current brand id
export async function getCurrentBrandId(): Promise<number | null> {
  const currentBrand = await getCurrentBrand()
  return currentBrand?.id || null
}

// get current brand name
export async function getBrandName(): Promise<string | null> {
  const currentBrand = await getCurrentBrand()
  return currentBrand?.name || null
}
