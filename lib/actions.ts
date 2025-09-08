'use server'

import { db } from '@/db/drizzle'
import { brand, personality, adjectives, rules } from '@/db/schema'
import {
  brandSchema,
  personalitySchema,
  adjectivesSchema,
  ruleSchema,
} from './validations'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getCurrentBrandId } from './utils'
import { redirect, RedirectType } from 'next/navigation'
import { ZodError } from 'zod'

/**
 * Set up the initial brand (one-time setup)
 * Only works if no brand exists yet
 */
export async function setupBrand(formData: FormData) {
  try {
    // check if brand already exists
    const existingBrandId = await getCurrentBrandId()
    if (existingBrandId) {
      return {
        error:
          'A brand already exists for this account. You can only have one brand.',
      }
    }

    const rawData = {
      name: formData.get('name') as string,
    }

    const validatedData = brandSchema.parse(rawData)

    const [newBrand] = await db
      .insert(brand)
      .values({
        name: validatedData.name,
      })
      .returning()

    revalidatePath('/')
    redirect('/')
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.errors[0].message }
    }
    console.error('Failed to set up brand:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

/**
 * Update the brand name
 * Only works if brand exists
 */
export async function updateBrandName(formData: FormData) {
  try {
    const brandId = await getCurrentBrandId()
    if (!brandId) {
      return { error: 'No brand found. Please set up your brand first.' }
    }

    const rawData = {
      name: formData.get('name') as string,
    }

    const validatedData = brandSchema.parse(rawData)

    const [updatedBrand] = await db
      .update(brand)
      .set({
        name: validatedData.name,
      })
      .where(eq(brand.id, brandId))
      .returning()

    revalidatePath('/')
    return { success: true, brand: updatedBrand }
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.errors[0].message }
    }
    console.error('Failed to update brand name:', error)
    return { error: 'Failed to update brand name. Please try again.' }
  }
}

/**
 * Update personality answers (all 9 questions at once)
 * Replaces all existing personality data
 */
export async function updatePersonality(
  answers: { questionIndexL: number; answer: string }[]
) {
  try {
    const brandId = await getCurrentBrandId()
    if (!brandId) {
      return { error: 'No brand found. Please set up your brand first.' }
    }

    const validatedData = personalitySchema.parse({ answers })

    await db.transaction(async (tx) => {
      await tx.delete(personality).where(eq(personality.brandId, brandId))

      if (validatedData.answers.length > 0) {
        await tx.insert(personality).values(
          validatedData.answers.map(({ questionIndex, answer }) => ({
            brandId,
            questionIndex,
            answer,
          }))
        )
      }
    })
    revalidatePath('/personality')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.errors[0].message }
    }
    console.error('Failed to update personality answers:', error)
    return { error: 'Failed to update personality. Please try again.' }
  }
}

/**
 * Update all adjectives (exactly 3 at once)
 * Replaces all existing adjectives
 */
export async function updateAdjectives(
  adjectiveData: Array<{
    name: string
    description: string
    subtleExample: string
    obviousExample: string
    intenseExample: string
  }>
) {
  try {
    const brandId = await getCurrentBrandId()
    if (!brandId) {
      return { error: 'No brand found. Please set up your brand first.' }
    }

    const validatedData = adjectivesSchema.parse({ adjectives: adjectiveData })

    // Use transaction to ensure data consistency
    await db.transaction(async (tx) => {
      // Delete all existing adjectives for this brand
      await tx.delete(adjectives).where(eq(adjectives.brandId, brandId))

      // Insert new adjectives
      await tx.insert(adjectives).values(
        validatedData.adjectives.map((adj) => ({
          brandId,
          name: adj.name,
          description: adj.description,
          subtleExample: adj.subtleExample,
          obviousExample: adj.obviousExample,
          intenseExample: adj.intenseExample,
        }))
      )
    })

    revalidatePath('/adjectives')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.errors[0].message }
    }
    console.error('Failed to update adjectives:', error)
    return { error: 'Failed to update adjectives. Please try again.' }
  }
}

/**
 * Create a new rule
 */
export async function createRule(ruleData: {
  title: string
  description: string
  doExample: string
  dontExample: string
}) {
  try {
    const brandId = await getCurrentBrandId()
    if (!brandId) {
      return { error: 'No brand found. Please set up your brand first.' }
    }

    const validatedData = ruleSchema.parse(ruleData)

    const [newRule] = await db
      .insert(rules)
      .values({
        brandId,
        title: validatedData.title,
        description: validatedData.description,
        doExample: validatedData.doExample,
        dontExample: validatedData.dontExample,
        isActive: true, // New rules are active by default
      })
      .returning()

    revalidatePath('/rules')
    revalidatePath('/')
    return { success: true, rule: newRule }
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.errors[0].message }
    }
    console.error('Failed to create rule:', error)
    return { error: 'Failed to create rule. Please try again.' }
  }
}

/**
 * Toggle a rule's active status
 * Used for quick enable/disable from UI
 */
export async function toggleRule(ruleId: number, isActive: boolean) {
  try {
    const brandId = await getCurrentBrandId()
    if (!brandId) {
      return { error: 'No brand found.' }
    }

    // Verify rule belongs to current brand
    const [existingRule] = await db
      .select()
      .from(rules)
      .where(and(eq(rules.id, ruleId), eq(rules.brandId, brandId)))
      .limit(1)

    if (!existingRule) {
      return { error: 'Rule not found.' }
    }

    const [updatedRule] = await db
      .update(rules)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(rules.id, ruleId))
      .returning()

    revalidatePath('/rules')
    revalidatePath('/')
    return { success: true, rule: updatedRule }
  } catch (error) {
    console.error('Failed to toggle rule:', error)
    return { error: 'Failed to update rule status. Please try again.' }
  }
}

/**
 * Update an existing rule
 */
export async function updateRule(ruleUpdateData: {
  ruleId: number
  title: string
  description: string
  doExample: string
  dontExample: string
}) {
  try {
    const brandId = await getCurrentBrandId()
    if (!brandId) {
      return { error: 'No brand found. Please set up your brand first.' }
    }

    const validatedData = ruleUpdateSchema.parse(ruleUpdateData)

    // Verify rule belongs to current brand
    const [existingRule] = await db
      .select()
      .from(rules)
      .where(
        and(eq(rules.id, validatedData.ruleId), eq(rules.brandId, brandId))
      )
      .limit(1)

    if (!existingRule) {
      return { error: 'Rule not found.' }
    }

    const [updatedRule] = await db
      .update(rules)
      .set({
        title: validatedData.title,
        description: validatedData.description,
        doExample: validatedData.doExample,
        dontExample: validatedData.dontExample,
        updatedAt: new Date(),
      })
      .where(eq(rules.id, validatedData.ruleId))
      .returning()

    revalidatePath('/rules')
    revalidatePath('/')
    return { success: true, rule: updatedRule }
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.errors[0].message }
    }
    console.error('Failed to update rule:', error)
    return { error: 'Failed to update rule. Please try again.' }
  }
}

/**
 * Delete a rule permanently
 */
export async function deleteRule(ruleId: number) {
  try {
    const brandId = await getCurrentBrandId()
    if (!brandId) {
      return { error: 'No brand found.' }
    }

    // Verify rule belongs to current brand before deleting
    const [existingRule] = await db
      .select()
      .from(rules)
      .where(and(eq(rules.id, ruleId), eq(rules.brandId, brandId)))
      .limit(1)

    if (!existingRule) {
      return { error: 'Rule not found.' }
    }

    await db.delete(rules).where(eq(rules.id, ruleId))

    revalidatePath('/rules')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete rule:', error)
    return { error: 'Failed to delete rule. Please try again.' }
  }
}
