# Phase 1: Foundation - D&D 5e Character Sheet Manager

## Overview
This phase establishes the core foundation for the D&D 5e Character Sheet Manager, setting up the project structure, basic data storage, and fundamental UI components.

## Objectives
- Initialize SvelteKit project with TypeScript
- Set up local data storage layer
- Create basic character CRUD operations
- Establish core UI component library

## Technical Requirements

### Project Setup
- **Framework**: SvelteKit latest version
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS
- **Database**: SQLite (Tauri) + IndexedDB fallback
- **State Management**: Svelte 5 runes
- **Validation**: Zod schemas
- **Testing**: Vitest + @testing-library/svelte

### Core Dependencies
```json
{
  "dependencies": {
    "@sveltejs/kit": "^2.0.0",
    "svelte": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "zod": "^3.22.0",
    "better-sqlite3": "^9.0.0",
    "dexie": "^3.2.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0",
    "@testing-library/svelte": "^4.0.0"
  }
}
```

## Data Architecture

### Database Schema
```sql
-- Characters Table
CREATE TABLE characters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  data TEXT NOT NULL -- JSON blob for character data
);

-- Homebrew Content Tables
CREATE TABLE homebrew_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  data TEXT NOT NULL
);

CREATE TABLE homebrew_races (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  data TEXT NOT NULL
);
```

### TypeScript Interfaces
```typescript
// src/lib/types/character.ts
export interface Character {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  data: CharacterData;
}

export interface CharacterData {
  abilities: AbilityScores;
  race: string;
  class: string;
  level: number;
  hp: number;
  maxHp: number;
  ac: number;
  proficiency: number;
  speed: number;
}

export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}
```

### Zod Schemas
```typescript
// src/lib/schemas/character.ts
import { z } from 'zod';

export const abilityScoresSchema = z.object({
  strength: z.number().min(1).max(30),
  dexterity: z.number().min(1).max(30),
  constitution: z.number().min(1).max(30),
  intelligence: z.number().min(1).max(30),
  wisdom: z.number().min(1).max(30),
  charisma: z.number().min(1).max(30),
});

export const characterDataSchema = z.object({
  abilities: abilityScoresSchema,
  race: z.string(),
  class: z.string(),
  level: z.number().min(1).max(20),
  hp: z.number().min(0),
  maxHp: z.number().min(1),
  ac: z.number().min(1),
  proficiency: z.number().min(0),
  speed: z.number().min(0),
});

export const characterSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  createdAt: z.date(),
  updatedAt: z.date(),
  data: characterDataSchema,
});
```

## Component Library

### Core Components
1. **Layout Components**
   - `Layout.svelte` - Main app shell
   - `Header.svelte` - Navigation and branding
   - `Sidebar.svelte` - Navigation menu

2. **Form Components**
   - `CharacterForm.svelte` - Basic character creation/editing
   - `InputField.svelte` - Reusable form input
   - `NumberInput.svelte` - Numeric input with validation
   - `SelectInput.svelte` - Dropdown selection

3. **Data Components**
   - `CharacterCard.svelte` - Character preview card
   - `CharacterList.svelte` - Grid/list of characters
   - `AbilityScores.svelte` - Ability score display/edit

4. **UI Components**
   - `Button.svelte` - Styled button with variants
   - `Modal.svelte` - Modal dialog
   - `Toast.svelte` - Notification system

## File Structure
```
src/
├── lib/
│   ├── components/
│   │   ├── forms/
│   │   ├── layout/
│   │   └── ui/
│   ├── database/
│   │   ├── sqlite.ts
│   │   └── indexeddb.ts
│   ├── schemas/
│   │   ├── character.ts
│   │   └── homebrew.ts
│   ├── stores/
│   │   └── characters.ts
│   ├── types/
│   │   ├── character.ts
│   │   └── database.ts
│   └── utils/
│       └── database.ts
├── routes/
│   ├── +layout.svelte
│   ├── +page.svelte
│   ├── characters/
│   │   ├── +page.svelte
│   │   └── [id]/
│   │       └── +page.svelte
│   └── new/
│       └── +page.svelte
└── tests/
    ├── components/
    └── utils/
```

## Core Features

### Database Layer
- **Database Factory**: Automatically selects SQLite or IndexedDB
- **Connection Management**: Handle database initialization and errors
- **Migration System**: Schema versioning and updates
- **Query Builder**: Type-safe database operations

### Character CRUD Operations
1. **Create Character**
   - Form validation with Zod
   - Auto-generate character ID
   - Set creation timestamp
   - Initialize default character data

2. **Read Characters**
   - List all characters
   - Get single character by ID
   - Search/filter characters
   - Pagination support

3. **Update Character**
   - Partial updates supported
   - Auto-update timestamp
   - Validation before save
   - Change tracking (future feature)

4. **Delete Character**
   - Soft delete with confirmation
   - Hard delete option
   - Cascade handling for related data

### State Management
```typescript
// src/lib/stores/characters.ts
import { writable } from 'svelte/store';

interface CharacterStore {
  characters: Character[];
  loading: boolean;
  error: string | null;
}

export const characterStore = writable<CharacterStore>({
  characters: [],
  loading: false,
  error: null
});
```

## Routes Implementation

### Main Routes
1. **`/`** - Dashboard with character overview
2. **`/characters`** - Character list and management
3. **`/characters/new`** - Create new character
4. **`/characters/[id]`** - Character detail view
5. **`/characters/[id]/edit`** - Edit character

### Route Responsibilities
- **Load Functions**: Fetch data from database
- **Form Actions**: Handle form submissions
- **Error Handling**: Graceful error displays
- **Navigation**: Breadcrumbs and back navigation

## Testing Strategy

### Unit Tests
- Database operations
- Schema validation
- Utility functions
- Component logic

### Integration Tests
- Form submissions
- Data flow between components
- Database transactions

### E2E Tests (Future)
- Character creation workflow
- Navigation flows
- Data persistence

## Success Criteria
- [ ] SvelteKit project builds and runs successfully
- [ ] Database layer connects and performs CRUD operations
- [ ] Character creation, reading, updating, and deletion works
- [ ] All forms validate with Zod schemas
- [ ] Basic UI components render correctly
- [ ] Responsive design works on mobile and desktop
- [ ] Tests cover core functionality (>80% coverage)
- [ ] Error handling is comprehensive
- [ ] TypeScript types are correct and strict

## Next Steps
After completing Phase 1, the foundation will be ready for implementing D&D Beyond import functionality and more advanced character features in Phase 2.