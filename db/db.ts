import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";
import { entriesTable } from "./schema";
import { eq, desc } from "drizzle-orm/sqlite-core/expressions";
import { Note } from "@/types/Note";
import { InferSelectModel } from "drizzle-orm";

export const expo = SQLite.openDatabaseSync("db");
export const db = drizzle(expo);

type Entry = InferSelectModel<typeof entriesTable>;

export async function createEntry(content: string): Promise<{ id: number }> {
  const [result] = await db
    .insert(entriesTable)
    .values({
      content,
      // createdAt auto-generated, updatedAt is null initially
    })
    .returning({ id: entriesTable.id });

  return result;
}

function getEntry(id: number): Entry | undefined {
  return db.select().from(entriesTable).where(eq(entriesTable.id, id)).get();
}

export async function fetchAll(): Promise<Note[]> {
  return await db
    .select()
    .from(entriesTable)
    .orderBy(desc(entriesTable.createdAt));
}

export async function toggleStarred(id: number): Promise<void> {
  const entry = getEntry(id);

  await db
    .update(entriesTable)
    .set({
      starred: !entry?.starred,
      updatedAt: new Date(),
    })
    .where(eq(entriesTable.id, id));
}
