import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const entriesTable = sqliteTable("diary_entries", {
  id: int().primaryKey({ autoIncrement: true }),
  content: text().notNull(),
  starred: integer("starred", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});
