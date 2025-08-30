import { integer, text, pgTable } from "drizzle-orm/pg-core";

export const brand = pgTable("todo", {
  id: integer("id").primaryKey(),
  name: text("text").notNull(),
});
