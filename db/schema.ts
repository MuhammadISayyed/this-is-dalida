import { integer, text, pgTable, timestamp, boolean } from 'drizzle-orm/pg-core'

export const brand = pgTable('brand', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const personality = pgTable('personality', {
  id: integer('id').primaryKey(),
  brandId: integer('brand_id')
    .references(() => brand.id)
    .notNull(),
  questionIndex: integer('question_index').notNull(),
  answer: text('answer').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const adjectives = pgTable('adjectives', {
  id: integer('id').primaryKey(),
  brandId: integer('brand_id')
    .references(() => brand.id)
    .notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  subtleExample: text('subtle_example').notNull(),
  obviousExample: text('obvious_example').notNull(),
  intenseExample: text('intense_example').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const rules = pgTable('rules', {
  id: integer('id').primaryKey(),
  brandId: integer('brand_id')
    .references(() => brand.id)
    .notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  doExample: text('do_example').notNull(),
  dontExample: text('dont_example').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
