# Phase 1: Foundation - D&D 5e Character Sheet Manager

## Overview
This phase establishes the core foundation for the D&D 5e Character Sheet Manager, setting up the project structure, basic data storage, and fundamental UI components.

## Objectives
- Initialize SvelteKit project with TypeScript
- Set up local data storage layer
- Create basic character CRUD operations
- Establish core UI component library

## Database Strategy Decision

### **Phase 1 Approach: IndexedDB (PGlite)**
**Rationale:**
- **Immediate Value**: Users get working offline character management from day 1
- **Lower Barrier**: No 2-6MB WebAssembly download for initial setup  
- **Better PWA Experience**: Native service worker integration
- **Cross-Device Consistency**: Same behavior across all modern browsers
- **Simpler Debugging**: Built-in browser dev tools support

### **Data Structure for IndexedDB Approach:**
```typescript
// Optimized for IndexedDB strengths
interface LocalCharacter {
  id: UUID;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  // Denormalized for performance
  level: number;
  race: string;
  class: string;
  abilities: AbilityScores;
  // Flattened homebrew items for quick access
  homebrewItems: HomebrewItem[];
}

// Duplicate data in documents for fast searching
const searchIndex = {
  characterName: 'Aragorn',
  race: 'Human', 
  class: 'Fighter',
  level: 5,
  items: ['Longsword', 'Shield'],
  // Pre-computed for instant search results
  searchableText: 'Aragorn Human Fighter 5 Longsword Shield'
};
```

### **Migration Path Preserved:**
The Phase 1 specification includes SQLite fallback option, providing upgrade path when users need:
- Complex homebrew libraries (>1000 items)
- Advanced relationship queries  
- Performance optimizations for large datasets

### **Phase 1 Implementation Priority:**
1. **Core CRUD Operations** (Week 1-2)
2. **Basic Character Sheet UI** (Week 2-3)
3. **D&D Beyond Import** (Week 3-4)
4. **Basic Homebrew Items** (Week 4-5)

This phased approach delivers value quickly while maintaining solid technical foundation for future enhancements.

## Technical Requirements

### Project Setup
- **Framework**: SvelteKit latest version
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS
- **Database**: PGlite (WebAssembly PostgreSQL) + SQLite fallback
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
    "@electric-sql/pglite": "^0.2.0",
    "better-sqlite3": "^9.0.0",
    "dexie": "^3.2.0",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0",
    "@testing-library/svelte": "^4.0.0",
    "@types/uuid": "^9.0.0"
  }
}
```

## Data Architecture

### Database Schema
```sql
-- Primary schema for PGlite (WebAssembly PostgreSQL)
-- Fallback compatible with enhanced SQLite

-- Characters Table with native UUID support
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (length(name) >= 1 AND length(name) <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data JSONB NOT NULL
);

-- Homebrew Items Table
CREATE TABLE homebrew_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (length(name) >= 1 AND length(name) <= 100),
  type TEXT NOT NULL CHECK (type IN ('weapon', 'armor', 'equipment', 'consumable', 'tool', 'magic')),
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Homebrew Races Table
CREATE TABLE homebrew_races (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (length(name) >= 1 AND length(name) <= 100),
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Homebrew Classes Table
CREATE TABLE homebrew_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (length(name) >= 1 AND length(name) <= 100),
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Homebrew Subclasses Table (linked to classes)
CREATE TABLE homebrew_subclasses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (length(name) >= 1 AND length(name) <= 100),
  class_id UUID NOT NULL REFERENCES homebrew_classes(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Character-Homebrew Items Relationship Table
CREATE TABLE character_homebrew_items (
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  homebrew_item_id UUID NOT NULL REFERENCES homebrew_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (character_id, homebrew_item_id)
);

-- Performance Indexes
CREATE INDEX idx_characters_name ON characters(name);
CREATE INDEX idx_characters_created ON characters(created_at);
CREATE INDEX idx_characters_updated ON characters(updated_at);
CREATE INDEX idx_homebrew_items_name ON homebrew_items(name);
CREATE INDEX idx_homebrew_items_type ON homebrew_items(type);
CREATE INDEX idx_homebrew_items_updated ON homebrew_items(updated_at);
CREATE INDEX idx_homebrew_races_name ON homebrew_races(name);
CREATE INDEX idx_homebrew_races_updated ON homebrew_races(updated_at);
CREATE INDEX idx_homebrew_classes_name ON homebrew_classes(name);
CREATE INDEX idx_homebrew_classes_updated ON homebrew_classes(updated_at);
CREATE INDEX idx_homebrew_subclasses_name ON homebrew_subclasses(name);
CREATE INDEX idx_homebrew_subclasses_class_id ON homebrew_subclasses(class_id);
CREATE INDEX idx_character_homebrew_items_character ON character_homebrew_items(character_id);
CREATE INDEX idx_character_homebrew_items_item ON character_homebrew_items(homebrew_item_id);

-- JSONB Indexes for efficient querying
CREATE INDEX idx_characters_data_gin ON characters USING GIN(data);
CREATE INDEX idx_homebrew_items_data_gin ON homebrew_items USING GIN(data);
CREATE INDEX idx_homebrew_races_data_gin ON homebrew_races USING GIN(data);
CREATE INDEX idx_homebrew_classes_data_gin ON homebrew_classes USING GIN(data);
CREATE INDEX idx_homebrew_subclasses_data_gin ON homebrew_subclasses USING GIN(data);

-- Migration tracking
CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  description TEXT
);

INSERT INTO schema_migrations (version, description) VALUES (1, 'Initial schema with native UUID support');
```

-- SQLite Fallback Schema (for environments without WebAssembly)
```sql
-- SQLite fallback with TEXT-based UUID storage
CREATE TABLE characters (
  id TEXT PRIMARY KEY CHECK (length(id) = 36),
  name TEXT NOT NULL CHECK (length(name) >= 1 AND length(name) <= 100),
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  data TEXT NOT NULL CHECK (json_valid(data))
);
-- Additional tables similar to PGlite version but with TEXT UUIDs
```

### TypeScript Interfaces
```typescript
// src/lib/types/character.ts
export type UUID = string; // Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

export interface Character {
  id: UUID;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  data: CharacterData;
}

export interface BaseEntity {
  id: UUID;
  name: string;
  createdAt: Date;
  updatedAt: Date;
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

// UUID validation schema (native for PGlite, validation for SQLite)
export const uuidSchema = z.string().uuid('Must be a valid UUID');

// Enhanced UUID with database-agnostic validation
export const uuidWithFallbackSchema = z.string().refine(
  (val) => {
    // Check UUID format for both PGlite and SQLite
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(val);
  },
  { message: 'Must be a valid UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }
);

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
  id: uuidSchema,
  name: z.string().min(1).max(100),
  createdAt: z.date(),
  updatedAt: z.date(),
  data: characterDataSchema,
});

// Base entity schema for homebrew content
export const baseEntitySchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(100),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Database configuration schema
export const databaseConfigSchema = z.object({
  type: z.enum(['pglite', 'sqlite']),
  connectionString: z.string(),
  useFallback: z.boolean().default(false),
});

// Migration schema for database versioning
export const migrationSchema = z.object({
  version: z.number(),
  description: z.string(),
  appliedAt: z.date(),
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
│   │   ├── pglite.ts
│   │   ├── sqlite-fallback.ts
│   │   ├── database-manager.ts
│   │   ├── schema-pglite.sql
│   │   ├── schema-sqlite.sql
│   │   └── migrations/
│   │       ├── 001-initial-pglite.sql
│   │       ├── 001-initial-sqlite.sql
│   │       └── migration-runner.ts
│   ├── schemas/
│   │   ├── character.ts
│   │   ├── homebrew.ts
│   │   └── database-config.ts
│   ├── stores/
│   │   └── characters.ts
│   ├── types/
│   │   ├── character.ts
│   │   ├── database.ts
│   │   ├── uuid.ts
│   │   └── pglite.ts
│   └── utils/
│       ├── uuid.ts
│       ├── database-manager.ts
│       └── database-config.ts
├── routes/
│   ├── +layout.svelte
│   ├── +page.svelte
│   ├── characters/
│   │   ├── +page.svelte
│   │   └── [id]/
│   │       └── +page.svelte
│   └── new/
│       └── +page.svelte
├── static/
│   └── database/
│       ├── schema-pglite.sql
│       └── schema-sqlite.sql
└── tests/
    ├── components/
    ├── utils/
    ├── database/
    │   ├── test-utils.ts
    │   └── fixtures/
    │       ├── characters.json
    │       ├── items.json
    │       └── races.json
```

## Core Features

### Database Layer
- **Hybrid Database System**: PGlite primary with SQLite fallback
- **Connection Management**: Automatic database selection and error handling
- **Migration System**: Dual-schema versioning for PGlite and SQLite
- **Query Builder**: Type-safe database operations with UUID support
- **Native UUID Integration**: Automatic UUID generation in database layer
- **JSONB Support**: Efficient JSON querying with GIN indexes (PGlite)
- **Schema Validation**: Real-time constraint checking and validation
- **Performance Optimization**: Indexing strategies for both database types

#### Database Implementation Files:
```typescript
// src/lib/database/pglite.ts
export class PGliteDatabase {
  private db: PGlite;
  
  constructor(connectionString: string = 'idb://dnd-database') {
    this.db = new PGlite(connectionString);
  }
  
  async initialize(): Promise<void> {
    await this.runMigrations();
    await this.createIndexes();
  }
  
  // Native UUID generation via PostgreSQL
  async generateUUID(): Promise<UUID> {
    const result = await this.db.query('SELECT gen_random_uuid() as uuid');
    return result.rows[0].uuid;
  }
  
  // Full JSONB support for efficient querying
  async queryJSONB(path: string, value: any): Promise<any[]> {
    const sql = `SELECT * FROM characters WHERE data->>'${path}' = $1`;
    return await this.db.query(sql, [value]);
  }
}

// src/lib/database/sqlite-fallback.ts
export class SQLiteDatabase {
  private db: Database;
  
  constructor() {
    this.db = new Database('dnd-database.sqlite');
  }
  
  // UUID generation via utility functions
  generateUUID(): UUID {
    return generateUUID();
  }
  
  // JSON querying with JSON functions
  async queryJSON(path: string, value: any): Promise<any[]> {
    const sql = `SELECT * FROM characters WHERE json_extract(data, '$.${path}') = ?`;
    return this.db.prepare(sql).all(value);
  }
}

// src/lib/database/migrations/migration-runner.ts
export class MigrationRunner {
  async runMigrations(db: DatabaseManager): Promise<void> {
    const currentVersion = await db.getCurrentMigration();
    const pendingMigrations = this.getPendingMigrations(currentVersion);
    
    for (const migration of pendingMigrations) {
      await db.query(migration.sql);
      await db.query(
        'INSERT INTO schema_migrations (version, description) VALUES (?, ?)', 
        [migration.version, migration.description]
      );
    }
  }
}

// src/lib/database/performance-optimizer.ts
export class PerformanceOptimizer {
  // Analyze query performance and suggest optimizations
  async analyzeSlowQueries(queries: string[]): Promise<OptimizationReport> {
    // Query analysis logic
  }
  
  // Suggest indexes based on query patterns
  async suggestIndexes(operations: DBOperation[]): Promise<IndexSuggestion[]> {
    // Index recommendation logic
  }
}
```

### Character CRUD Operations
1. **Create Character**
   - Form validation with Zod
   - Auto-generate UUID for character ID
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

### Database Management & UUID Utilities
```typescript
// src/lib/utils/uuid.ts
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export function generateUUID(): UUID {
  return uuidv4() as UUID;
}

export function isValidUUID(id: string): boolean {
  return uuidValidate(id);
}

export function assertUUID(id: string): asserts id is UUID {
  if (!isValidUUID(id)) {
    throw new Error(`Invalid UUID: ${id}`);
  }
}

// Generate UUID with optional prefix for debugging (not stored in database)
export function generateDebugUUID(prefix: string = 'char'): string {
  return `${prefix}-${uuidv4()}`;
}

// src/lib/utils/database-manager.ts
export type DatabaseType = 'pglite' | 'sqlite';

export interface DatabaseConfig {
  type: DatabaseType;
  connectionString?: string;
  enableFallback?: boolean;
}

export class DatabaseManager {
  private db: PGlite | SQLiteDatabase;
  private config: DatabaseConfig;
  
  constructor(config: DatabaseConfig) {
    this.config = config;
    this.initializeDatabase();
  }
  
  private async initializeDatabase() {
    try {
      // Try PGlite first (native UUID support)
      if (this.config.type === 'pglite' || this.config.enableFallback) {
        this.db = new PGlite(this.config.connectionString || 'idb://dnd-database');
        await this.migratePGlite();
        return;
      }
    } catch (error) {
      console.warn('PGlite initialization failed, falling back to SQLite:', error);
      
      // Fallback to SQLite
      this.db = new SQLiteDatabase();
      await this.migrateSQLite();
    }
  }
  
  // Unified interface for UUID generation
  generateUUID(): UUID {
    if (this.db instanceof PGlite) {
      // Let PGlite handle UUID generation
      return generateUUID(); // Still use utility for consistency
    } else {
      // SQLite fallback - use utility
      return generateUUID();
    }
  }
  
  // Unified query interface
  async query(sql: string, params?: any[]): Promise<any> {
    return this.db.query(sql, params);
  }
  
  // Migration handling for both database types
  private async migratePGlite() {
    const migrations = await this.getPendingMigrations();
    for (const migration of migrations) {
      await this.db.query(migration.sql);
      await this.db.query('INSERT INTO schema_migrations (version, description) VALUES (?, ?)', 
        [migration.version, migration.description]);
    }
  }
  
  private async migrateSQLite() {
    // Similar migration logic for SQLite fallback
    const migrations = await this.getPendingMigrations();
    for (const migration of migrations) {
      await this.db.run(migration.sql, migration.params);
      await this.db.run('INSERT INTO schema_migrations (version, description) VALUES (?, ?)', 
        [migration.version, migration.description]);
    }
  }
}

// Database factory function
export async function createDatabase(config: DatabaseConfig = { type: 'pglite' }): Promise<DatabaseManager> {
  return new DatabaseManager(config);
}
```

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
- [ ] IndexedDB database layer connects and performs CRUD operations
- [ ] PGlite fallback works in environments without WebAssembly
- [ ] Character creation, reading, updating, and deletion works
- [ ] All forms validate with Zod schemas
- [ ] Basic UI components render correctly
- [ ] Responsive design works on mobile and desktop
- [ ] Tests cover core functionality (>80% coverage)
- [ ] Error handling is comprehensive
- [ ] TypeScript types are correct and strict
- [ ] Data persists across browser sessions without cloud dependency
- [ ] App works completely offline
- [ ] Browser storage quota handled gracefully

## Next Steps
After completing Phase 1, foundation will be ready for implementing D&D Beyond import functionality and more advanced character features in Phase 2. The hybrid database architecture will allow seamless migration to SQLite fallback in later phases when advanced querying becomes necessary.