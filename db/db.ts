import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";
import { entriesTable } from "./schema";
import { eq, desc } from "drizzle-orm/sqlite-core/expressions";
import { Note } from "@/types/Note";

export const expo = SQLite.openDatabaseSync("db");
export const db = drizzle(expo);

export const createEntry = async (content: string) => {
  return await db
    .insert(entriesTable)
    .values({
      content,
      // createdAt auto-generated, updatedAt is null initially
    })
    .returning();
};

export async function fetchAll(): Promise<Note[]> {
  return await db
    .select()
    .from(entriesTable)
    .orderBy(desc(entriesTable.createdAt));
}

export const toggleStarred = async (id: number) => {
  const entry = db
    .select()
    .from(entriesTable)
    .where(eq(entriesTable.id, id))
    .get();
  return await db
    .update(entriesTable)
    .set({
      starred: !entry?.starred,
      updatedAt: new Date(),
    })
    .where(eq(entriesTable.id, id));
};
