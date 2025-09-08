export const PERSONALITY_QUESTIONS = [
  "What's your brand's primary tone of voice?",
  'How formal should your communications be?',
  'What emotions should your brand evoke in customers?',
  'How do you want customers to perceive your brand?',
  "What's your brand's personality archetype?",
  'How should your brand handle conflict or criticism?',
  "What's your preferred communication style?",
  'How does your brand demonstrate authority and expertise?',
  'What makes your brand unique in your industry?',
] as const

// Type-safe question count
export const QUESTIONS_COUNT = PERSONALITY_QUESTIONS.length

// Compile-time verification we have exactly 9 questions
if (QUESTIONS_COUNT !== 9) {
  throw new Error(`Expected exactly 9 personality questions, got
  ${QUESTIONS_COUNT}`)
}

// Helper function to get question by index
export function getQuestionByIndex(index: number): string | null {
  if (index < 0 || index >= QUESTIONS_COUNT) {
    return null
  }
  return PERSONALITY_QUESTIONS[index]
}

// Helper to map personality data with questions
export function mapPersonalityWithQuestions(
  personalityData: Array<{ questionIndex: number; answer: string }>
) {
  return PERSONALITY_QUESTIONS.map((question, index) => {
    const personalityItem = personalityData.find(
      (p) => p.questionIndex === index
    )
    return {
      questionIndex: index,
      question,
      answer: personalityItem?.answer || '',
      isAnswered: !!personalityItem?.answer,
    }
  })
}
