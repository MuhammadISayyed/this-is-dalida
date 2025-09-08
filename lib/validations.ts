import { z } from 'zod'

export const brandSchema = z.object({
  name: z
    .string()
    .min(1, 'Brand name is required')
    .max(100, 'Brand name must be less than 100 characters')
    .trim(),
})

export const personalityAnswerSchema = z.object({
  questionIndex: z.number().min(0).max(8),
  answer: z.string().min(1, 'Answer is required').trim(),
})

export const personalitySchema = z.object({
  answers: z
    .array(personalityAnswerSchema)
    .length(9, 'Must have exactly 9 answers')
    .refine((answers) => {
      const indexes = answers.map((a) => a.questionIndex)
      const uniqueIndexes = new Set(indexes)
      return uniqueIndexes.size === 9 && indexes.every((i) => i >= 0 && i <= 8)
    }, 'Must have answers for all 9 questions (indexes 0-8)'),
})

// export const adjectiveSchema = z.object({
//   name: z.string().min(1, 'Adjective is required'),
//   description: z.string().min(10, 'Description must be at least 10 characters'),
//   subtleExample: z.string().min(1, 'Subtle example is required'),
//   obviousExample: z.string().min(1, 'Obvious example is required'),
//   intenseExample: z.string().min(1, 'Intense example is required'),
// })

export const adjectiveSchema = z.object({
  name: z.string().min(1, 'Adjective is required').max(50).trim(),
  description: z.string().min(1, 'Description is required').max(255).trim(),
  subtleExample: z
    .string()
    .min(1, 'Subtle example is required')
    .max(255)
    .trim(),
  obviousExample: z
    .string()
    .min(1, 'Obvious example is required')
    .max(255)
    .trim(),
  intenseExample: z
    .string()
    .min(1, 'Intense example is required')
    .max(255)
    .trim(),
})

export const adjectivesSchema = z.object({
  adjectives: z
    .array(adjectiveSchema)
    .length(3, 'Must have exactly 3 adjectives'),
})

export const ruleSchema = z.object({
  title: z
    .string()
    .min(1, 'Rule title is required')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .trim(),
  doExample: z
    .string()
    .min(5, 'Do example is required')
    .max(255, 'Do example must be less than 255 characters')
    .trim(),
  dontExample: z
    .string()
    .min(5, "Don't example is required")
    .max(255, "Don't example must be less than 255 characters")
    .trim(),
})
