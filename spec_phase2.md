# Phase 2: Core Features - D&D 5e Character Sheet Manager

## Overview
This phase builds upon the foundation to implement core character management features, including D&D Beyond integration, comprehensive character sheet functionality, and basic homebrew support.

## Objectives
- Implement D&D Beyond JSON import parser
- Create comprehensive character sheet interface
- Add auto-calculation systems for D&D 5e mechanics
- Implement basic homebrew items management
- Add search and filtering capabilities

## Technical Requirements

### Additional Dependencies
```json
{
  "dependencies": {
    "papaparse": "^5.4.0",        // CSV parsing for imports
    "lodash-es": "^4.17.0",        // Utility functions
    "fuse.js": "^7.0.0",          // Fuzzy search
    "@dice-roller/rpg-dice-roller": "^5.0.0" // D&D dice rolling
  },
  "devDependencies": {
    "@types/lodash-es": "^4.17.0",
    "@types/papaparse": "^5.3.0"
  }
}
```

## D&D Beyond Integration

### Import Parser
```typescript
// src/lib/utils/dnd-beyond-parser.ts
import { z } from 'zod';

export const dndBeyondCharacterSchema = z.object({
  id: z.string(),
  name: z.string(),
  race: z.object({
    name: z.string(),
    bonuses: z.array(z.object({
      type: z.string(),
      bonus: z.number()
    })).optional()
  }),
  classes: z.array(z.object({
    name: z.string(),
    level: z.number(),
    subclass: z.string().optional()
  })),
  abilities: z.array(z.object({
    name: z.enum(['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma']),
    score: z.number(),
    modifier: z.number()
  })),
  hp: z.number(),
  maxHp: z.number(),
  tempHp: z.number().optional(),
  ac: z.number(),
  proficiency: z.number(),
  speed: z.number(),
  equipment: z.array(z.object({
    name: z.string(),
    type: z.string(),
    quantity: z.number(),
    weight: z.number()
  })).optional(),
  spells: z.array(z.object({
    name: z.string(),
    level: z.number(),
    school: z.string(),
    castingTime: z.string(),
    range: z.string(),
    components: z.string(),
    duration: z.string(),
    description: z.string()
  })).optional()
});

export type DndBeyondCharacter = z.infer<typeof dndBeyondCharacterSchema>;
```

### Import Service
```typescript
// src/lib/services/import-service.ts
export class ImportService {
  async parseDndBeyondJson(jsonString: string): Promise<Character> {
    try {
      const data = JSON.parse(jsonString);
      const validated = dndBeyondCharacterSchema.parse(data);
      return this.convertToCharacter(validated);
    } catch (error) {
      throw new ImportError(`Failed to parse D&D Beyond data: ${error.message}`);
    }
  }

  private convertToCharacter(beyond: DndBeyondCharacter): Character {
    const abilityScores: AbilityScores = {
      strength: beyond.abilities.find(a => a.name === 'Strength')?.score || 10,
      dexterity: beyond.abilities.find(a => a.name === 'Dexterity')?.score || 10,
      constitution: beyond.abilities.find(a => a.name === 'Constitution')?.score || 10,
      intelligence: beyond.abilities.find(a => a.name === 'Intelligence')?.score || 10,
      wisdom: beyond.abilities.find(a => a.name === 'Wisdom')?.score || 10,
      charisma: beyond.abilities.find(a => a.name === 'Charisma')?.score || 10,
    };

    return {
      id: `ddb_${beyond.id}`,
      name: beyond.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      data: {
        abilities: abilityScores,
        race: beyond.race.name,
        class: beyond.classes.map(c => `${c.name} ${c.level}`).join(' / '),
        level: beyond.classes.reduce((sum, c) => sum + c.level, 0),
        hp: beyond.hp,
        maxHp: beyond.maxHp,
        ac: beyond.ac,
        proficiency: beyond.proficiency,
        speed: beyond.speed,
        equipment: beyond.equipment || [],
        spells: beyond.spells || [],
        tempHp: beyond.tempHp || 0
      }
    };
  }
}
```

## Enhanced Character Sheet

### Expanded Data Model
```typescript
// src/lib/types/character-extended.ts
export interface ExtendedCharacterData extends CharacterData {
  // Combat Stats
  initiative: number;
  inspiration: number;
  deathSaves: {
    successes: number;
    failures: number;
  };
  exhaustion: number;
  
  // Skills & Saving Throws
  savingThrows: {
    strength: boolean;
    dexterity: boolean;
    constitution: boolean;
    intelligence: boolean;
    wisdom: boolean;
    charisma: boolean;
  };
  
  skills: {
    acrobatics: boolean;
    animalHandling: boolean;
    arcana: boolean;
    athletics: boolean;
    deception: boolean;
    history: boolean;
    insight: boolean;
    intimidation: boolean;
    investigation: boolean;
    medicine: boolean;
    nature: boolean;
    perception: boolean;
    performance: boolean;
    persuasion: boolean;
    religion: boolean;
    sleightOfHand: boolean;
    stealth: boolean;
    survival: boolean;
  };
  
  // Equipment & Inventory
  currency: {
    cp: number;
    sp: number;
    ep: number;
    gp: number;
    pp: number;
  };
  
  // Features & Traits
  features: string[];
  traits: string[];
  feats: string[];
  racialTraits: string[];
  classFeatures: string[];
  
  // Spellcasting
  spellcasting: {
    spellAttackBonus: number;
    spellSaveDC: number;
    spellSlots: Record<number, number>;
    spells: Spell[];
  };
}
```

### Auto-Calculation Engine
```typescript
// src/lib/utils/calculator.ts
export class CharacterCalculator {
  calculateModifier(score: number): number {
    return Math.floor((score - 10) / 2);
  }
  
  calculateSkillTotal(
    abilityScore: number,
    isProficient: boolean,
    isExpert: boolean,
    proficiencyBonus: number
  ): number {
    const modifier = this.calculateModifier(abilityScore);
    const proficiencyBonusMultiplier = isExpert ? 2 : isProficient ? 1 : 0;
    return modifier + (proficiencyBonus * proficiencyBonusMultiplier);
  }
  
  calculateAC(character: ExtendedCharacterData): number {
    let ac = 10 + this.calculateModifier(character.abilities.dexterity);
    
    // Armor bonuses from equipment
    character.equipment?.forEach(item => {
      if (item.type === 'armor' && item.ac) {
        ac = Math.max(ac, item.ac);
        // Add Dex bonus for light/medium armor
        if (item.armorType === 'light' || item.armorType === 'medium') {
          const dexBonus = Math.min(
            this.calculateModifier(character.abilities.dexterity),
            item.armorType === 'medium' ? 2 : Infinity
          );
          ac = item.ac + dexBonus;
        }
      }
    });
    
    return ac;
  }
  
  calculatePassivePerception(character: ExtendedCharacterData): number {
    const perceptionSkill = this.calculateSkillTotal(
      character.abilities.wisdom,
      character.skills.perception,
      false, // Expertise handled separately
      character.proficiency
    );
    return 10 + perceptionSkill;
  }
  
  calculateSpellSaveDC(
    abilityScore: number,
    proficiencyBonus: number
  ): number {
    return 8 + this.calculateModifier(abilityScore) + proficiencyBonus;
  }
  
  calculateSpellAttackBonus(
    abilityScore: number,
    proficiencyBonus: number
  ): number {
    return this.calculateModifier(abilityScore) + proficiencyBonus;
  }
}
```

## Character Sheet UI Components

### Main Character Sheet
```svelte
<!-- src/lib/components/character/CharacterSheet.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { CharacterCalculator } from '$lib/utils/calculator';
  import type { ExtendedCharacter } from '$lib/types/character-extended';
  
  export let character: ExtendedCharacter;
  
  const calculator = new CharacterCalculator();
  
  $: mod = (score: number) => calculator.calculateModifier(score);
  $: passivePerception = calculator.calculatePassivePerception(character.data);
  $: ac = calculator.calculateAC(character.data);
</script>

<div class="character-sheet">
  <!-- Header Section -->
  <header class="sheet-header">
    <div class="character-info">
      <input type="text" bind:value={character.name} class="character-name" />
      <div class="character-details">
        <span>{character.data.race}</span>
        <span>{character.data.class}</span>
        <span>Level {character.data.level}</span>
      </div>
    </div>
  </header>
  
  <!-- Ability Scores -->
  <section class="ability-scores">
    {#each Object.entries(character.data.abilities) as [ability, score]}
      <div class="ability-score">
        <div class="ability-name">{ability.substring(0, 3).toUpperCase()}</div>
        <div class="ability-score-value">{score}</div>
        <div class="ability-modifier">{mod(score) > 0 ? '+' : ''}{mod(score)}</div>
      </div>
    {/each}
  </section>
  
  <!-- Combat Stats -->
  <section class="combat-stats">
    <div class="stat">
      <label>Armor Class</label>
      <div class="stat-value">{ac}</div>
    </div>
    <div class="stat">
      <label>Hit Points</label>
      <div class="hp-display">
        <input type="number" bind:value={character.data.hp} />
        <span>/</span>
        <span>{character.data.maxHp}</span>
      </div>
    </div>
    <div class="stat">
      <label>Speed</label>
      <div class="stat-value">{character.data.speed} ft</div>
    </div>
    <div class="stat">
      <label>Initiative</label>
      <div class="stat-value">{mod(character.data.abilities.dexterity) > 0 ? '+' : ''}{mod(character.data.abilities.dexterity)}</div>
    </div>
    <div class="stat">
      <label>Proficiency</label>
      <div class="stat-value">{character.data.proficiency > 0 ? '+' : ''}{character.data.proficiency}</div>
    </div>
  </section>
  
  <!-- Skills Section -->
  <section class="skills">
    <h3>Skills</h3>
    {#each Object.entries(character.data.skills) as [skill, proficient]}
      <div class="skill">
        <input type="checkbox" bind:checked={character.data.skills[skill]} />
        <span class="skill-name">{skill}</span>
        <span class="skill-mod">
          {calculator.calculateSkillTotal(
            character.data.abilities[getAbilityForSkill(skill)],
            proficient,
            false,
            character.data.proficiency
          ) > 0 ? '+' : ''}{calculator.calculateSkillTotal(
            character.data.abilities[getAbilityForSkill(skill)],
            proficient,
            false,
            character.data.proficiency
          )}
        </span>
      </div>
    {/each}
  </section>
</div>
```

### Import Interface
```svelte
<!-- src/lib/components/import/DndBeyondImport.svelte -->
<script lang="ts">
  import { ImportService } from '$lib/services/import-service';
  
  let file: File | null = null;
  let importing = false;
  let importResult: { success: boolean; message: string; character?: Character } | null = null;
  
  const importService = new ImportService();
  
  async function handleImport() {
    if (!file) return;
    
    importing = true;
    try {
      const text = await file.text();
      const character = await importService.parseDndBeyondJson(text);
      importResult = {
        success: true,
        message: `Successfully imported ${character.name}`,
        character
      };
    } catch (error) {
      importResult = {
        success: false,
        message: `Import failed: ${error.message}`
      };
    } finally {
      importing = false;
    }
  }
  
  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    file = target.files?.[0] || null;
  }
</script>

<div class="import-container">
  <h2>Import D&D Beyond Character</h2>
  
  <div class="file-upload">
    <input
      type="file"
      accept=".json"
      on:change={handleFileChange}
      disabled={importing}
    />
    <button
      on:click={handleImport}
      disabled={!file || importing}
      class="primary-button"
    >
      {importing ? 'Importing...' : 'Import Character'}
    </button>
  </div>
  
  {#if importResult}
    <div class="import-result" class:success={importResult.success} class:error={!importResult.success}>
      {importResult.message}
    </div>
  {/if}
</div>
```

## Basic Homebrew Items

### Item Management
```typescript
// src/lib/types/homebrew.ts
export interface HomebrewItem {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'equipment' | 'consumable' | 'tool' | 'magic';
  rarity: 'common' | 'uncommon' | 'rare' | 'very rare' | 'legendary';
  description: string;
  weight?: number;
  cost?: {
    amount: number;
    type: 'cp' | 'sp' | 'ep' | 'gp' | 'pp';
  };
  weapon?: {
    damage: string;
    damageType: string;
    range?: string;
    properties: string[];
  };
  armor?: {
    ac: number;
    armorType: 'light' | 'medium' | 'heavy' | 'shield';
    stealthDisadvantage?: boolean;
    strengthRequirement?: number;
  };
  magic?: {
    requiresAttunement: boolean;
    attunementRequirement?: string;
    charges?: number;
    maxCharges?: number;
  };
}
```

### Homebrew Item Creator
```svelte
<!-- src/lib/components/homebrew/ItemCreator.svelte -->
<script lang="ts">
  import { HomebrewItemSchema, type HomebrewItem } from '$lib/types/homebrew';
  
  let item: Partial<HomebrewItem> = {
    name: '',
    type: 'equipment',
    rarity: 'common',
    description: '',
    weight: 0,
    magic: {
      requiresAttunement: false
    }
  };
  
  let validationErrors: string[] = [];
  
  function saveItem() {
    const result = HomebrewItemSchema.safeParse(item);
    if (!result.success) {
      validationErrors = result.error.issues.map(issue => issue.message);
      return;
    }
    
    validationErrors = [];
    // Save to database
    // Dispatch save event
  }
</script>

<form on:submit|preventDefault={saveItem} class="item-creator">
  <div class="form-group">
    <label for="name">Item Name</label>
    <input id="name" type="text" bind:value={item.name} required />
  </div>
  
  <div class="form-group">
    <label for="type">Item Type</label>
    <select id="type" bind:value={item.type}>
      <option value="weapon">Weapon</option>
      <option value="armor">Armor</option>
      <option value="equipment">Equipment</option>
      <option value="consumable">Consumable</option>
      <option value="tool">Tool</option>
      <option value="magic">Magic Item</option>
    </select>
  </div>
  
  <div class="form-group">
    <label for="rarity">Rarity</label>
    <select id="rarity" bind:value={item.rarity}>
      <option value="common">Common</option>
      <option value="uncommon">Uncommon</option>
      <option value="rare">Rare</option>
      <option value="very rare">Very Rare</option>
      <option value="legendary">Legendary</option>
    </select>
  </div>
  
  <div class="form-group">
    <label for="description">Description</label>
    <textarea id="description" bind:value={item.description} rows="4" required></textarea>
  </div>
  
  <div class="form-group">
    <label for="weight">Weight (lbs)</label>
    <input id="weight" type="number" bind:value={item.weight} min="0" step="0.1" />
  </div>
  
  <!-- Conditionally show weapon/armor fields based on type -->
  {#if item.type === 'weapon'}
    <div class="form-group">
      <label for="damage">Damage</label>
      <input id="damage" type="text" bind:value={item.weapon?.damage} placeholder="1d8" />
    </div>
    
    <div class="form-group">
      <label for="damageType">Damage Type</label>
      <select id="damageType" bind:value={item.weapon?.damageType}>
        <option value="slashing">Slashing</option>
        <option value="piercing">Piercing</option>
        <option value="bludgeoning">Bludgeoning</option>
        <option value="acid">Acid</option>
        <option value="cold">Cold</option>
        <option value="fire">Fire</option>
        <option value="force">Force</option>
        <option value="lightning">Lightning</option>
        <option value="necrotic">Necrotic</option>
        <option value="poison">Poison</option>
        <option value="psychic">Psychic</option>
        <option value="radiant">Radiant</option>
        <option value="thunder">Thunder</option>
      </select>
    </div>
  {/if}
  
  {#if item.type === 'armor'}
    <div class="form-group">
      <label for="ac">Armor Class</label>
      <input id="ac" type="number" bind:value={item.armor?.ac} min="10" />
    </div>
    
    <div class="form-group">
      <label for="armorType">Armor Type</label>
      <select id="armorType" bind:value={item.armor?.armorType}>
        <option value="light">Light</option>
        <option value="medium">Medium</option>
        <option value="heavy">Heavy</option>
        <option value="shield">Shield</option>
      </select>
    </div>
  {/if}
  
  {#if validationErrors.length > 0}
    <div class="validation-errors">
      {#each validationErrors as error}
        <p class="error">{error}</p>
      {/each}
    </div>
  {/if}
  
  <button type="submit" class="primary-button">Save Item</button>
</form>
```

## Search and Filtering

### Search Service
```typescript
// src/lib/services/search-service.ts
import Fuse from 'fuse.js';

export class SearchService {
  private characterFuse: Fuse<Character>;
  private itemFuse: Fuse<HomebrewItem>;
  
  constructor() {
    // Initialize with empty data, will be updated
    this.characterFuse = new Fuse([], {
      keys: ['name', 'data.race', 'data.class'],
      threshold: 0.3,
      includeScore: true
    });
    
    this.itemFuse = new Fuse([], {
      keys: ['name', 'type', 'description'],
      threshold: 0.3,
      includeScore: true
    });
  }
  
  updateCharacters(characters: Character[]) {
    this.characterFuse.setCollection(characters);
  }
  
  updateItems(items: HomebrewItem[]) {
    this.itemFuse.setCollection(items);
  }
  
  searchCharacters(query: string): Character[] {
    if (!query.trim()) return [];
    return this.characterFuse.search(query).map(result => result.item);
  }
  
  searchItems(query: string): HomebrewItem[] {
    if (!query.trim()) return [];
    return this.itemFuse.search(query).map(result => result.item);
  }
  
  filterCharacters(characters: Character[], filters: CharacterFilters): Character[] {
    return characters.filter(char => {
      if (filters.levelRange && char.data.level < filters.levelRange.min) return false;
      if (filters.levelRange && char.data.level > filters.levelRange.max) return false;
      if (filters.classes && !filters.classes.some(cls => char.data.class.includes(cls))) return false;
      if (filters.races && !filters.races.includes(char.data.race)) return false;
      return true;
    });
  }
}

interface CharacterFilters {
  levelRange?: { min: number; max: number };
  classes?: string[];
  races?: string[];
}
```

## Routes Enhancement

### Character Management Routes
- **`/characters`** - Enhanced list with search, filtering, and sorting
- **`/characters/import`** - D&D Beyond import interface
- **`/characters/[id]`** - Full character sheet view
- **`/characters/[id]/edit`** - Edit character with auto-calculations
- **`/homebrew/items`** - Homebrew items management
- **`/homebrew/items/new`** - Create new homebrew item

### Load Functions
```typescript
// src/routes/characters/+page.ts
export async function load({ url }) {
  const searchService = new SearchService();
  const characters = await db.getAllCharacters();
  searchService.updateCharacters(characters);
  
  const query = url.searchParams.get('search') || '';
  const filteredCharacters = query ? searchService.searchCharacters(query) : characters;
  
  return {
    characters: filteredCharacters,
    searchQuery: query
  };
}
```

## Success Criteria
- [ ] D&D Beyond JSON import works seamlessly
- [ ] Character sheet displays all core D&D 5e stats
- [ ] Auto-calculations update in real-time
- [ ] Basic homebrew item creation and management
- [ ] Search functionality works across characters and items
- [ ] Form validation prevents invalid data entry
- [ ] Responsive design works on all screen sizes
- [ ] Performance remains smooth with large character lists
- [ ] Error handling provides clear user feedback
- [ ] All calculations follow D&D 5e rules accurately

## Next Steps
After completing Phase 2, the application will have full character management capabilities with D&D Beyond integration and basic homebrew support, preparing for advanced homebrew features in Phase 3.