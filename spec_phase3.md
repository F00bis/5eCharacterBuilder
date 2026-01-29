# Phase 3: Advanced Features - D&D 5e Character Sheet Manager

## Overview
This phase adds advanced functionality including comprehensive homebrew content creation, sophisticated import/export capabilities, full offline operation, and enhanced search features.

## Objectives
- Implement full homebrew content creation system
- Add advanced import/export functionality
- Implement offline-first architecture
- Create comprehensive search and filtering
- Add dice rolling integration
- Implement data validation and balance checking

## Technical Requirements

### Additional Dependencies
```json
{
  "dependencies": {
    "workbox-precaching": "^7.0.0",    // Service worker for offline
    "workbox-routing": "^7.0.0",      // Offline routing
    "dexie-export-import": "^1.0.0",  // Database backup/restore
    "html2canvas": "^1.4.0",          // Character sheet export
    "jszip": "^3.10.0",              // File packaging
    "uuid": "^9.0.0",                // Unique ID generation
    "semver": "^7.5.0",              // Version comparison
    "markdown-it": "^13.0.0"         // Homebrew content formatting
  },
  "devDependencies": {
    "@types/uuid": "^9.0.0",
    "@types/markdown-it": "^13.0.0",
    "@types/html2canvas": "^1.4.0"
  }
}
```

## Advanced Homebrew System

### Race Creator
```typescript
// src/lib/types/homebrew-race.ts
export interface HomebrewRace {
  id: string;
  name: string;
  description: string;
  source: string;
  version: string;
  abilityScoreIncreases: {
    strength?: number;
    dexterity?: number;
    constitution?: number;
    intelligence?: number;
    wisdom?: number;
    charisma?: number;
  };
  age: string;
  alignment: string;
  size: 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan';
  speed: number;
  languages: string[];
  traits: RacialTrait[];
  subraces: Subrace[];
}

export interface RacialTrait {
  name: string;
  description: string;
  requirements?: string;
  benefits: TraitBenefit[];
  drawbacks?: string[];
}

export interface TraitBenefit {
  type: 'ability_score' | 'skill' | 'saving_throw' | 'armor_class' | 'speed' | 'damage' | 'spellcasting' | 'custom';
  value: number | string;
  condition?: string;
  duration?: string;
}

export interface Subrace {
  name: string;
  description: string;
  abilityScoreIncreases: Partial<HomebrewRace['abilityScoreIncreases']>;
  additionalTraits: RacialTrait[];
  additionalLanguages: string[];
  additionalSize?: string;
  additionalSpeed?: number;
}
```

### Class Creator
```typescript
// src/lib/types/homebrew-class.ts
export interface HomebrewClass {
  id: string;
  name: string;
  description: string;
  hitDice: string;
  primaryAbility: string[];
  savingThrows: string[];
  armorProficiencies: string[];
  weaponProficiencies: string[];
  toolProficiencies: string[];
  skillChoices: SkillChoice;
  equipment: EquipmentChoice;
  features: ClassFeature[];
  spellcasting?: Spellcasting;
  subclasses: Subclass[];
}

export interface ClassFeature {
  name: string;
  level: number;
  description: string;
  benefits: FeatureBenefit[];
  prerequisites?: string[];
  choices?: FeatureChoice[];
}

export interface FeatureBenefit {
  type: 'ability_score' | 'skill' | 'proficiency' | 'attack_bonus' | 'damage_bonus' | 'resistance' | 'immunity' | 'spellcasting' | 'custom';
  value: number | string;
  condition?: string;
}

export interface FeatureChoice {
  name: string;
  type: 'choose_one' | 'choose_many' | 'choose_any';
  options: string[];
  count: number;
}

export interface Spellcasting {
  ability: string;
  ritual: boolean;
  cantrips: Record<number, number>;
  spellSlots: Record<number, number>;
  knownSpells: Record<number, number>;
}

export interface Subclass {
  name: string;
  description: string;
  level: number;
  features: ClassFeature[];
  prerequisites?: string[];
}
```

### Homebrew Content Creator Interface
```svelte
<!-- src/lib/components/homebrew/RaceCreator.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { HomebrewRaceSchema, type HomebrewRace } from '$lib/types/homebrew-race';
  import MarkdownEditor from './MarkdownEditor.svelte';
  import TraitBuilder from './TraitBuilder.svelte';
  
  let race: Partial<HomebrewRace> = {
    name: '',
    description: '',
    source: 'Custom',
    version: '1.0.0',
    abilityScoreIncreases: {},
    age: '',
    alignment: '',
    size: 'Medium',
    speed: 30,
    languages: [],
    traits: [],
    subraces: []
  };
  
  let activeTab: 'basic' | 'traits' | 'subraces' | 'preview' = 'basic';
  let validationErrors: string[] = [];
  let isPreviewMode = false;
  
  function validateRace() {
    const result = HomebrewRaceSchema.safeParse(race);
    if (!result.success) {
      validationErrors = result.error.issues.map(issue => issue.message);
      return false;
    }
    validationErrors = [];
    return true;
  }
  
  async function saveRace() {
    if (!validateRace()) return;
    
    try {
      // Save to database
      await db.saveHomebrewRace(race as HomebrewRace);
      // Show success message
      // Navigate to race list
    } catch (error) {
      // Show error message
    }
  }
  
  function exportRace() {
    if (!validateRace()) return;
    
    const blob = new Blob([JSON.stringify(race, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${race.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<div class="race-creator">
  <header class="creator-header">
    <h2>Create Custom Race</h2>
    <div class="header-actions">
      <button on:click={() => activeTab = 'preview'} class:active={activeTab === 'preview'}>Preview</button>
      <button on:click={exportRace} class="secondary-button">Export</button>
      <button on:click={saveRace} class="primary-button">Save Race</button>
    </div>
  </header>
  
  <nav class="tab-navigation">
    <button 
      on:click={() => activeTab = 'basic'} 
      class:active={activeTab === 'basic'}
    >
      Basic Info
    </button>
    <button 
      on:click={() => activeTab = 'traits'} 
      class:active={activeTab === 'traits'}
    >
      Traits & Features
    </button>
    <button 
      on:click={() => activeTab = 'subraces'} 
      class:active={activeTab === 'subraces'}
    >
      Subraces
    </button>
  </nav>
  
  {#if validationErrors.length > 0}
    <div class="validation-errors">
      <h4>Validation Errors:</h4>
      {#each validationErrors as error}
        <p class="error">• {error}</p>
      {/each}
    </div>
  {/if}
  
  <div class="tab-content">
    {#if activeTab === 'basic'}
      <section class="basic-info">
        <div class="form-group">
          <label for="name">Race Name</label>
          <input id="name" type="text" bind:value={race.name} required />
        </div>
        
        <div class="form-group">
          <label for="description">Description</label>
          <MarkdownEditor bind:content={race.description} />
        </div>
        
        <div class="form-group">
          <label for="source">Source</label>
          <input id="source" type="text" bind:value={race.source} />
        </div>
        
        <h3>Ability Score Increases</h3>
        <div class="ability-bonuses">
          {#each ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as ability}
            <div class="ability-bonus">
              <label for="{ability}">{ability.charAt(0).toUpperCase() + ability.slice(1)}</label>
              <input 
                id="{ability}" 
                type="number" 
                bind:value={race.abilityScoreIncreases[ability]} 
                min="0" 
                max="3" 
              />
            </div>
          {/each}
        </div>
        
        <div class="form-group">
          <label for="age">Age</label>
          <input id="age" type="text" bind:value={race.age} placeholder="e.g., reaches adulthood in 20 years" />
        </div>
        
        <div class="form-group">
          <label for="alignment">Alignment</label>
          <input id="alignment" type="text" bind:value={race.alignment} placeholder="e.g., Tends toward neutral" />
        </div>
        
        <div class="form-group">
          <label for="size">Size</label>
          <select id="size" bind:value={race.size}>
            <option value="Tiny">Tiny</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
            <option value="Huge">Huge</option>
            <option value="Gargantuan">Gargantuan</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="speed">Speed</label>
          <input id="speed" type="number" bind:value={race.speed} min="5" step="5" />
        </div>
        
        <div class="form-group">
          <label for="languages">Languages</label>
          <input id="languages" type="text" bind:value={race.languages.join(', ')} />
        </div>
      </section>
    {:else if activeTab === 'traits'}
      <section class="traits-section">
        <h3>Racial Traits</h3>
        <TraitBuilder bind:traits={race.traits} />
      </section>
    {:else if activeTab === 'subraces'}
      <section class="subraces-section">
        <h3>Subraces</h3>
        {#each race.subraces as subrace, index}
          <div class="subrace-card">
            <div class="subrace-header">
              <input 
                type="text" 
                bind:value={subrace.name} 
                placeholder="Subrace Name" 
              />
              <button 
                on:click={() => race.subraces.splice(index, 1)}
                class="danger-button"
              >
                Remove
              </button>
            </div>
            
            <div class="subrace-content">
              <textarea 
                bind:value={subrace.description} 
                placeholder="Subrace description" 
                rows="3"
              />
              
              <h4>Additional Ability Score Increases</h4>
              <div class="ability-bonuses">
                {#each ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as ability}
                  <div class="ability-bonus">
                    <label>{ability.charAt(0).toUpperCase() + ability.slice(1)}</label>
                    <input 
                      type="number" 
                      bind:value={subrace.abilityScoreIncreases[ability]} 
                      min="0" 
                      max="3" 
                    />
                  </div>
                {/each}
              </div>
              
              <TraitBuilder bind:traits={subrace.additionalTraits} />
            </div>
          </div>
        {/each}
        
        <button 
          on:click={() => race.subraces.push({
            name: '',
            description: '',
            abilityScoreIncreases: {},
            additionalTraits: [],
            additionalLanguages: []
          })}
          class="secondary-button"
        >
          Add Subrace
        </button>
      </section>
    {:else if activeTab === 'preview'}
      <section class="preview-section">
        <RacePreview {race} />
      </section>
    {/if}
  </div>
</div>
```

### Trait Builder Component
```svelte
<!-- src/lib/components/homebrew/TraitBuilder.svelte -->
<script lang="ts">
  import type { RacialTrait } from '$lib/types/homebrew-race';
  import MarkdownEditor from './MarkdownEditor.svelte';
  
  export let traits: RacialTrait[] = [];
  
  function addTrait() {
    traits.push({
      name: '',
      description: '',
      benefits: [],
      drawbacks: []
    });
  }
  
  function removeTrait(index: number) {
    traits.splice(index, 1);
  }
  
  function addBenefit(traitIndex: number) {
    traits[traitIndex].benefits.push({
      type: 'custom',
      value: '',
      condition: '',
      duration: ''
    });
  }
  
  function removeBenefit(traitIndex: number, benefitIndex: number) {
    traits[traitIndex].benefits.splice(benefitIndex, 1);
  }
</script>

<div class="trait-builder">
  {#each traits as trait, index}
    <div class="trait-card">
      <div class="trait-header">
        <input 
          type="text" 
          bind:value={trait.name} 
          placeholder="Trait Name" 
          class="trait-name"
        />
        <button 
          on:click={() => removeTrait(index)}
          class="danger-button small"
        >
          Remove
        </button>
      </div>
      
      <div class="trait-content">
        <div class="form-group">
          <label>Description</label>
          <MarkdownEditor bind:content={trait.description} />
        </div>
        
        <div class="form-group">
          <label>Requirements (optional)</label>
          <input 
            type="text" 
            bind:value={trait.requirements} 
            placeholder="e.g., Must be outdoors in sunlight"
          />
        </div>
        
        <h5>Benefits</h5>
        {#each trait.benefits as benefit, benefitIndex}
          <div class="benefit-item">
            <select bind:value={benefit.type}>
              <option value="ability_score">Ability Score</option>
              <option value="skill">Skill</option>
              <option value="saving_throw">Saving Throw</option>
              <option value="armor_class">Armor Class</option>
              <option value="speed">Speed</option>
              <option value="damage">Damage</option>
              <option value="spellcasting">Spellcasting</option>
              <option value="custom">Custom</option>
            </select>
            
            <input 
              type="text" 
              bind:value={benefit.value} 
              placeholder="Value" 
            />
            
            <input 
              type="text" 
              bind:value={benefit.condition} 
              placeholder="Condition (optional)" 
            />
            
            <button 
              on:click={() => removeBenefit(index, benefitIndex)}
              class="danger-button small"
            >
              ×
            </button>
          </div>
        {/each}
        
        <button on:click={() => addBenefit(index)} class="secondary-button small">
          Add Benefit
        </button>
        
        <div class="form-group">
          <label>Drawbacks (optional, one per line)</label>
          <textarea 
            bind:value={trait.drawbacks?.join('\n')} 
            rows="3" 
            placeholder="e.g., Cannot wear heavy armor"
          />
        </div>
      </div>
    </div>
  {/each}
  
  <button on:click={addTrait} class="secondary-button">
    Add Trait
  </button>
</div>
```

## Advanced Import/Export System

### Universal Import Manager
```typescript
// src/lib/services/universal-importer.ts
export class UniversalImporter {
  private parsers: Map<string, ImportParser> = new Map();
  
  constructor() {
    this.registerParsers();
  }
  
  private registerParsers() {
    this.parsers.set('application/json', new DndBeyondParser());
    this.parsers.set('text/csv', new CsvCharacterParser());
    this.parsers.set('text/plain', new CustomFormatParser());
  }
  
  async importFile(file: File): Promise<ImportResult[]> {
    const contentType = this.detectFileType(file);
    const parser = this.parsers.get(contentType);
    
    if (!parser) {
      throw new Error(`Unsupported file type: ${contentType}`);
    }
    
    try {
      const content = await file.text();
      const parsed = await parser.parse(content, file.name);
      
      // Validate all parsed content
      const validated = await Promise.all(
        parsed.map(item => this.validateImportItem(item))
      );
      
      return validated.filter(item => item.valid) as ImportResult[];
    } catch (error) {
      throw new ImportError(`Failed to import ${file.name}: ${error.message}`);
    }
  }
  
  private detectFileType(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'json': return 'application/json';
      case 'csv': return 'text/csv';
      case 'txt': return 'text/plain';
      default: return file.type;
    }
  }
  
  private async validateImportItem(item: any): Promise<ImportResult | null> {
    // Detect item type and validate with appropriate schema
    const validators = [
      { schema: characterSchema, type: 'character' },
      { schema: itemSchema, type: 'item' },
      { schema: raceSchema, type: 'race' },
      { schema: classSchema, type: 'class' }
    ];
    
    for (const { schema, type } of validators) {
      const result = schema.safeParse(item);
      if (result.success) {
        return {
          type,
          valid: true,
          data: result.data,
          warnings: this.generateWarnings(result.data, type)
        };
      }
    }
    
    return {
      type: 'unknown',
      valid: false,
      errors: ['Could not validate imported data'],
      warnings: []
    };
  }
  
  private generateWarnings(data: any, type: string): string[] {
    const warnings: string[] = [];
    
    // Check for potential balance issues
    if (type === 'character' && data.level > 20) {
      warnings.push('Character level exceeds normal maximum (20)');
    }
    
    if (type === 'item' && data.type === 'magic' && !data.rarity) {
      warnings.push('Magic item missing rarity rating');
    }
    
    return warnings;
  }
}

interface ImportResult {
  type: 'character' | 'item' | 'race' | 'class' | 'unknown';
  valid: boolean;
  data?: any;
  errors?: string[];
  warnings?: string[];
}

interface ImportParser {
  parse(content: string, filename: string): Promise<any[]>;
}
```

### Export Manager
```typescript
// src/lib/services/export-manager.ts
export class ExportManager {
  async exportCharacter(character: Character, format: 'json' | 'pdf' | 'image'): Promise<void> {
    switch (format) {
      case 'json':
        return this.exportAsJson(character, 'character');
      case 'pdf':
        return this.exportAsPdf(character);
      case 'image':
        return this.exportAsImage(character);
    }
  }
  
  async exportHomebrewContent(content: HomebrewContent[], format: 'package' | 'individual'): Promise<void> {
    if (format === 'package') {
      await this.createHomebrewPackage(content);
    } else {
      for (const item of content) {
        await this.exportAsJson(item, item.type);
      }
    }
  }
  
  private async exportAsJson(data: any, type: string): Promise<void> {
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    this.downloadBlob(blob, `${type}-${data.name.toLowerCase().replace(/\s+/g, '-')}.json`);
  }
  
  private async exportAsPdf(character: Character): Promise<void> {
    // Generate HTML character sheet
    const html = await this.generateCharacterSheetHtml(character);
    
    // Convert to PDF using browser print functionality
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }
  }
  
  private async exportAsImage(character: Character): Promise<void> {
    const element = document.getElementById('character-sheet');
    if (!element) return;
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    canvas.toBlob(blob => {
      if (blob) {
        this.downloadBlob(blob, `character-${character.name.toLowerCase().replace(/\s+/g, '-')}.png`);
      }
    }, 'image/png');
  }
  
  private async createHomebrewPackage(content: HomebrewContent[]): Promise<void> {
    const jszip = new JSZip();
    
    // Add manifest
    const manifest = {
      name: 'Homebrew Package',
      version: '1.0.0',
      created: new Date().toISOString(),
      content: content.map(item => ({
        type: item.type,
        name: item.name,
        filename: `${item.type}-${item.name.toLowerCase().replace(/\s+/g, '-')}.json`
      }))
    };
    
    jszip.file('manifest.json', JSON.stringify(manifest, null, 2));
    
    // Add content files
    content.forEach(item => {
      const filename = `${item.type}-${item.name.toLowerCase().replace(/\s+/g, '-')}.json`;
      jszip.file(filename, JSON.stringify(item, null, 2));
    });
    
    // Generate and download ZIP
    const blob = await jszip.generateAsync({ type: 'blob' });
    this.downloadBlob(blob, 'homebrew-package.zip');
  }
  
  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  private async generateCharacterSheetHtml(character: Character): Promise<string> {
    // Generate styled HTML for character sheet
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${character.name} - Character Sheet</title>
          <style>
            /* Character sheet styles */
            body { font-family: 'Times New Roman', serif; margin: 20px; }
            .character-sheet { width: 8.5in; min-height: 11in; }
            /* Add comprehensive print styles */
          </style>
        </head>
        <body>
          <div class="character-sheet">
            <!-- Generate character sheet HTML -->
          </div>
        </body>
      </html>
    `;
  }
}
```

## Offline-First Architecture

### Service Worker Setup
```typescript
// src/service-worker.ts
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';

// Precache app shell
precacheAndRoute(self.__WB_MANIFEST);

// Cache API responses
registerRoute(
  ({ request }) => request.destination === 'script' || 
                   request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

// Cache images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
  })
);

// Handle database requests
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  async ({ request }) => {
    try {
      // Try network first
      const response = await fetch(request);
      const cache = await caches.open('api-cache');
      cache.put(request, response.clone());
      return response;
    } catch (error) {
      // Fallback to cache
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Return offline response for API calls
      return new Response(
        JSON.stringify({ error: 'Offline - Data not available' }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
);

// Database sync when online
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineChanges());
  }
});

async function syncOfflineChanges() {
  // Sync any offline changes to server (if server is available)
}
```

### Offline State Management
```typescript
// src/lib/stores/offline-store.ts
import { writable } from 'svelte/store';
import type { OfflineQueueItem } from '$lib/types/offline';

export const offlineStore = writable({
  isOnline: navigator.onLine,
  queue: [] as OfflineQueueItem[],
  lastSync: null as Date | null
});

// Listen for online/offline events
window.addEventListener('online', () => {
  offlineStore.update(store => ({ ...store, isOnline: true }));
  processSyncQueue();
});

window.addEventListener('offline', () => {
  offlineStore.update(store => ({ ...store, isOnline: false }));
});

async function processSyncQueue() {
  const store = offlineStore.get();
  
  for (const item of store.queue) {
    try {
      await item.execute();
    } catch (error) {
      console.error('Failed to sync offline action:', error);
      // Keep item in queue for retry
    }
  }
  
  offlineStore.update(store => ({
    ...store,
    queue: [],
    lastSync: new Date()
  }));
}
```

## Dice Rolling System

### Dice Roller
```typescript
// src/lib/services/dice-roller.ts
import { DiceRoller } from '@dice-roller/rpg-dice-roller';

export class DnDDiceRoller {
  private roller: DiceRoller;
  
  constructor() {
    this.roller = new DiceRoller();
  }
  
  rollDice(notation: string, modifiers?: RollModifiers): DiceRollResult {
    const roll = this.roller.roll(notation);
    const result = {
      notation: roll.notation,
      total: roll.total,
      rolls: roll.rolls.map(r => ({
        rolls: r.rolls,
        modifiers: r.modifiers,
        results: r.results
      })),
      modifiers: modifiers || {}
    };
    
    // Apply D&D-specific modifiers
    if (modifiers) {
      if (modifiers.critical && this.isCriticalHit(result)) {
        result.total = this.applyCriticalDamage(result);
      }
      
      if (modifiers.bonus) {
        result.total += modifiers.bonus;
      }
    }
    
    return result;
  }
  
  rollAbilityCheck(abilityScore: number, proficient: boolean, expertise: boolean, proficiencyBonus: number): DiceRollResult {
    const modifier = Math.floor((abilityScore - 10) / 2);
    const profBonus = proficient ? (expertise ? proficiencyBonus * 2 : proficiencyBonus) : 0;
    
    return this.rollDice('1d20', { bonus: modifier + profBonus });
  }
  
  rollSavingThrow(abilityScore: number, proficient: boolean, proficiencyBonus: number): DiceRollResult {
    const modifier = Math.floor((abilityScore - 10) / 2);
    const profBonus = proficient ? proficiencyBonus : 0;
    
    return this.rollDice('1d20', { bonus: modifier + profBonus });
  }
  
  rollSkillCheck(abilityScore: number, proficient: boolean, expertise: boolean, proficiencyBonus: number): DiceRollResult {
    return this.rollAbilityCheck(abilityScore, proficient, expertise, proficiencyBonus);
  }
  
  rollDamage(damageDie: string, abilityScore?: number, bonus?: number): DiceRollResult {
    const modifiers: RollModifiers = {};
    
    if (abilityScore) {
      modifiers.bonus = Math.floor((abilityScore - 10) / 2);
    }
    
    if (bonus) {
      modifiers.bonus = (modifiers.bonus || 0) + bonus;
    }
    
    return this.rollDice(damageDie, modifiers);
  }
  
  private isCriticalHit(roll: DiceRollResult): boolean {
    return roll.rolls.some(r => r.results.some(result => result === 20));
  }
  
  private applyCriticalDamage(roll: DiceRollResult): number {
    // Double the dice rolls (not the bonuses)
    const diceTotal = roll.total - (roll.modifiers.bonus || 0);
    return diceTotal * 2 + (roll.modifiers.bonus || 0);
  }
}

export interface RollModifiers {
  bonus?: number;
  critical?: boolean;
  advantage?: boolean;
  disadvantage?: boolean;
}

export interface DiceRollResult {
  notation: string;
  total: number;
  rolls: Array<{
    rolls: any[];
    modifiers: any[];
    results: number[];
  }>;
  modifiers: RollModifiers;
}
```

### Dice Roller UI
```svelte
<!-- src/lib/components/dice/DiceRoller.svelte -->
<script lang="ts">
  import { DnDDiceRoller, type DiceRollResult } from '$lib/services/dice-roller';
  import type { Character } from '$lib/types/character';
  
  export let character: Character;
  
  const diceRoller = new DnDDiceRoller();
  
  let activeTab: 'combat' | 'ability' | 'skill' | 'damage' | 'custom' = 'combat';
  let customNotation = '';
  let rollHistory: DiceRollResult[] = [];
  
  function rollInitiative() {
    const result = diceRoller.rollAbilityCheck(
      character.data.abilities.dexterity,
      character.data.skills.initiative,
      false,
      character.data.proficiency
    );
    addToHistory(result);
  }
  
  function rollAbility(ability: string) {
    const abilityScore = character.data.abilities[ability.toLowerCase() as keyof typeof character.data.abilities];
    const isProficient = character.data.savingThrows[ability.toLowerCase() as keyof typeof character.data.savingThrows];
    
    const result = diceRoller.rollSavingThrow(abilityScore, isProficient, character.data.proficiency);
    addToHistory(result);
  }
  
  function rollSkill(skill: string, ability: string) {
    const abilityScore = character.data.abilities[ability.toLowerCase() as keyof typeof character.data.abilities];
    const isProficient = character.data.skills[skill.toLowerCase() as keyof typeof character.data.skills];
    const isExpertise = character.data.expertise?.[skill.toLowerCase() as keyof typeof character.data.expertise] || false;
    
    const result = diceRoller.rollSkillCheck(abilityScore, isProficient, isExpertise, character.data.proficiency);
    addToHistory(result);
  }
  
  function rollCustomDice() {
    if (!customNotation) return;
    
    const result = diceRoller.rollDice(customNotation);
    addToHistory(result);
  }
  
  function addToHistory(result: DiceRollResult) {
    rollHistory.unshift(result);
    if (rollHistory.length > 20) {
      rollHistory.pop();
    }
  }
</script>

<div class="dice-roller">
  <header class="roller-header">
    <h3>Dice Roller - {character.name}</h3>
  </header>
  
  <nav class="tab-navigation">
    <button on:click={() => activeTab = 'combat'} class:active={activeTab === 'combat'}>Combat</button>
    <button on:click={() => activeTab = 'ability'} class:active={activeTab === 'ability'}>Abilities</button>
    <button on:click={() => activeTab = 'skill'} class:active={activeTab === 'skill'}>Skills</button>
    <button on:click={() => activeTab = 'damage'} class:active={activeTab === 'damage'}>Damage</button>
    <button on:click={() => activeTab = 'custom'} class:active={activeTab === 'custom'}>Custom</button>
  </nav>
  
  <div class="tab-content">
    {#if activeTab === 'combat'}
      <div class="combat-rolls">
        <button on:click={rollInitiative} class="dice-button">
          🎲 Initiative ({Math.floor((character.data.abilities.dexterity - 10) / 2)})
        </button>
        <button on:click={() => rollCustomDice('1d20 + ' + Math.floor((character.data.abilities.dexterity - 10) / 2))}>
          🎲 Initiative Roll
        </button>
      </div>
    {:else if activeTab === 'ability'}
      <div class="ability-rolls">
        {#each Object.entries(character.data.abilities) as [ability, score]}
          <button on:click={() => rollAbility(ability)} class="dice-button">
            🎲 {ability.charAt(0).toUpperCase() + ability.slice(1)} Save
            <span class="modifier">({Math.floor((score - 10) / 2)})</span>
          </button>
        {/each}
      </div>
    {:else if activeTab === 'custom'}
      <div class="custom-roll">
        <div class="custom-input">
          <input 
            type="text" 
            bind:value={customNotation} 
            placeholder="e.g., 3d6+4, 1d20+5" 
            class="dice-notation"
          />
          <button on:click={rollCustomDice} class="primary-button">
            Roll
          </button>
        </div>
        
        <div class="quick-buttons">
          <button on:click={() => customNotation = '1d4'}>d4</button>
          <button on:click={() => customNotation = '1d6'}>d6</button>
          <button on:click={() => customNotation = '1d8'}>d8</button>
          <button on:click={() => customNotation = '1d10'}>d10</button>
          <button on:click={() => customNotation = '1d12'}>d12</button>
          <button on:click={() => customNotation = '1d20'}>d20</button>
          <button on:click={() => customNotation = '2d6'}>2d6</button>
          <button on:click={() => customNotation = '3d6'}>3d6</button>
        </div>
      </div>
    {/if}
  </div>
  
  {#if rollHistory.length > 0}
    <section class="roll-history">
      <h4>Recent Rolls</h4>
      <div class="history-list">
        {#each rollHistory as roll, index}
          <div class="history-item" class:newest={index === 0}>
            <span class="notation">{roll.notation}</span>
            <span class="total">{roll.total}</span>
            <span class="details">
              {roll.rolls[0]?.rolls?.map((r: any) => r.roll || r).join(', ') || ''}
            </span>
          </div>
        {/each}
      </div>
    </section>
  {/if}
</div>
```

## Success Criteria
- [ ] Full homebrew race creator with validation
- [ ] Comprehensive class and subclass creation tools
- [ ] Advanced import system supporting multiple formats
- [ ] Export functionality for characters and homebrew packages
- [ ] Complete offline operation with sync capabilities
- [ ] Integrated dice rolling system
- [ ] Real-time search across all content types
- [ ] Data validation and balance checking
- [ ] Responsive design works flawlessly
- [ ] Performance scales to hundreds of characters/items
- [ ] Error handling provides clear user guidance
- [ ] All calculations follow official D&D 5e rules

## Next Steps
After completing Phase 3, the application will be a fully-featured D&D 5e character sheet manager with comprehensive homebrew support, offline capabilities, and advanced features. Phase 4 will focus on polish, performance optimization, and optional cloud synchronization features.