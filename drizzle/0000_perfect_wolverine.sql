CREATE TABLE `diary_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text NOT NULL,
	`starred` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer
);
