# Daily Note

A minimalist daily journaling app for mobile, built with Expo, React Native, and TypeScript. Quickly write, save, and review daily notes with a fast local SQLite backend using Drizzle ORM.

<img width="177" height="330" alt="diary1" src="https://github.com/user-attachments/assets/ce781e1a-205e-40a4-8fc9-b68fa25581b3" />
<img width="177" height="330" alt="diary2" src="https://github.com/user-attachments/assets/fff92b4d-4f43-456e-a99a-683300584ef8" />


## Features

- ✍️ **Daily journaling:** Write and save daily notes with a clean and simple interface.
- ⭐ **Starred entries:** Mark important entries for quick access.
- 📃 **Entry history:** Browse, search, and view all your previous notes with metadata (word count, timestamps).
- ⚡ **Offline-first:** All data is stored locally using SQLite for instant access and privacy.
- 🎨 **Light & dark themes:** UI adapts to your device color scheme.

## Tech Stack

- **Framework:** Expo (React Native)
- **Language:** TypeScript
- **Database:** SQLite (via [Drizzle ORM](https://orm.drizzle.team/quick-sqlite/expo)), with migrations
- **Navigation:** React Navigation
- **UI:** Custom theming, PlayfairDisplay font
- **Package Manager:** [Bun](https://bun.sh/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [Bun](https://bun.sh/) (recommended over npm/yarn)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/devldm/daily-note.git
   cd daily-note
   ```

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Start the app:**

   ```bash
   bunx expo start
   ```

4. **Run on device or emulator:**
   - Scan the QR code with the Expo Go app (iOS/Android)
   - Or run on an emulator via Expo Dev Tools

### Database & Migrations

- Uses [Drizzle ORM](https://orm.drizzle.team/quick-sqlite/expo) for schema and migrations.
- Migrations are auto-applied on launch. Schema is defined in `db/schema.ts`.

## Project Structure

- `app/` – Main React Native screens/components
- `db/` – SQLite DB setup, schema, and ORM logic
- `drizzle/` – Migrations for database schema
- `types/` – TypeScript types (e.g., `Note`)
- `constants/` – Color and theme definitions

## Scripts

- `bunx expo start` – Start Expo development server
- `bunx drizzle-kit generate:sqlite` – Generate new migration (see Drizzle docs)
