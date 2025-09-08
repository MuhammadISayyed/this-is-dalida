import { db } from '@/db/drizzle'
import { personality, adjectives, rules } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { getCurrentBrand, getCurrentBrandId } from './brand-context'

/**
 * Get all personality answers for the current brand
 * Returns empty array if no brand or no personality data
 */
export async function getBrandPersonality() {
  try {
    const brandId = await getCurrentBrandId()
    if (!brandId) return []

    const personalityData = await db
      .select({
        id: personality.id,
        questionIndex: personality.questionIndex,
        answer: personality.answer,
        createdAt: personality.createdAt,
        updatedAt: personality.updatedAt,
      })
      .from(personality)
      .where(eq(personality.brandId, brandId))
      .orderBy(personality.questionIndex)

    return personalityData
  } catch (error) {
    console.error('Failed to fetch personality data:', error)
    return []
  }
}

/**
 * Get all adjectives for the current brand
 * Should return exactly 3 adjectives when fully set up
 */
export async function getBrandAdjectives() {
  try {
    const brandId = await getCurrentBrandId()
    if (!brandId) return []
    const adjectivesData = await db
      .select({
        id: adjectives.id,
        name: adjectives.name,
        description: adjectives.description,
        subtleExample: adjectives.subtleExample,
        obviousExample: adjectives.obviousExample,
        intenseExample: adjectives.intenseExample,
        createdAt: adjectives.createdAt,
        updatedAt: adjectives.updatedAt,
      })
      .from(adjectives)
      .where(eq(adjectives.brandId, brandId))
      .orderBy(adjectives.createdAt)

    return adjectivesData
  } catch (error) {
    console.error('Failed to fetch adjectives data:', error)
    return []
  }
}

/**
 * Get all rules for the current brand
 */
export async function getBrandRules() {
  try {
    const brandId = await getCurrentBrandId()
    if (!brandId) return []

    const rulesData = await db
      .select({
        id: rules.id,
        title: rules.title,
        description: rules.description,
        doExample: rules.doExample,
        dontExample: rules.dontExample,
        isActive: rules.isActive,
        createdAt: rules.createdAt,
        updatedAt: rules.updatedAt,
      })
      .from(rules)
      .where(eq(rules.brandId, brandId))
      .orderBy(desc(rules.createdAt))

    return rulesData
  } catch (error) {
    console.error('Failed to fetch rules data:', error)
    return []
  }
}

/**
 * Get a specific rule by ID (must belong to current brand)
 */
export async function getRuleById(ruleId: number) {
  try {
    const brandId = await getCurrentBrandId()
    if (!brandId) return null

    const [ruleData] = await db
      .select()
      .from(rules)
      .where(and(eq(rules.id, ruleId), eq(rules.brandId, brandId)))
      .limit(1)

    return ruleData || null
  } catch (error) {
    console.error('Failed to fetch rule by ID:', error)
    return null
  }
}

/**
 * Get complete dashboard data for the current brand
 * Returns all brand-related data in one call
 */
export async function getBrandDashboardData() {
  try {
    const brand = await getCurrentBrand()
    if (!brand) return null

    // Fetch all related data in parallel
    const [personalityData, adjectivesData, rulesData] = await Promise.all([
      getBrandPersonality(),
      getBrandAdjectives(),
      getBrandRules(),
    ])

    // Calculate completion stats
    const personalityCompletion = personalityData.length
    const adjectivesCompletion = adjectivesData.length
    const totalRules = rulesData.length
    const activeRulesCount = rulesData.filter((r) => r.isActive).length

    return {
      brand,
      personality: personalityData,
      adjectives: adjectivesData,
      rules: rulesData,
      stats: {
        personalityCompletion, // 0-9
        adjectivesCompletion, // 0-3
        totalRules,
        activeRulesCount,
        isPersonalityComplete: personalityCompletion === 9,
        areAdjectivesComplete: adjectivesCompletion === 3,
      },
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
    return null
  }
}

/**
 * Check if brand setup is complete
 * Used to determine if onboarding should continue
 */
export async function isBrandSetupComplete() {
  try {
    const dashboardData = await getBrandDashboardData()
    if (!dashboardData) return false

    return (
      dashboardData.stats.isPersonalityComplete &&
      dashboardData.stats.areAdjectivesComplete
    )
  } catch (error) {
    console.error('Error checking brand setup completion:', error)
    return false
  }
}
