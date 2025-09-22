export interface Note {
  id: number;
  content: string;
  starred: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}
