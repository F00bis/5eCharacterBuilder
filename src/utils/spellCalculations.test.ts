import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  calculateSpellEntitlements,
  getSpellListForClass,
  getAvailableSpellsForCaster,
  buildUpdatedSpells,
} from './spellCalculations';
import type { ClassEntry, Character, CharacterSpell, AbilityScores } from '../types';
import type { DndSpell } from '../types/spells';

vi.mock('../db/spells', () => ({
  getSpellsByClass: vi.fn(),
}));

import { getSpellsByClass } from '../db/spells';

const mockGetSpellsByClass = vi.mocked(getSpellsByClass);

function defaultAbilityScores(): AbilityScores {
  return {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  };
}

function createMockDndSpell(overrides: Partial<DndSpell> = {}): DndSpell {
  return {
    name: 'Mock Spell',
    level: 1,
    school: 'Evocation',
    castingTime: '1 action',
    range: '60 feet',
    components: 'V, S',
    duration: 'Instantaneous',
    description: 'A mock spell for testing.',
    classes: ['Cleric'],
    isSRD: true,
    ...overrides,
  };
}

function createMockCharacterSpell(overrides: Partial<CharacterSpell> = {}): CharacterSpell {
  return {
    ...createMockDndSpell(),
    id: 1,
    prepared: false,
    ...overrides,
  };
}

function baseCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: 1,
    name: 'Test Hero',
    race: 'Human',
    background: 'Soldier',
    alignment: 'Neutral',
    classes: [{ className: 'Fighter', level: 1 }],
    raceStatSelections: [],
    baseAbilityScores: defaultAbilityScores(),
    abilityScores: defaultAbilityScores(),
    featureChoices: {},
    hpRolls: [],
    level: 1,
    xp: 0,
    portrait: null,
    hpBonus: 0,
    hp: 10,
    maxHp: 10,
    currentHp: 10,
    tempHp: 0,
    ac: 10,
    speed: 30,
    initiative: 0,
    vision: {},
    deathSaves: { successes: 0, failures: 0 },
    proficiencyBonus: 2,
    skills: [],
    equipment: [],
    currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
    spellSlots: [],
    spells: [],
    feats: [],
    statusEffects: [],
    notes: '',
    languages: [],
    toolProficiencies: [],
    raceChoices: {},
    backgroundChoices: {},
    featChoices: [],
    expertiseChoices: {},
    metamagicChoices: {},
    invocationChoices: {},
    mysticArcanumChoices: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('spellCalculations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateSpellEntitlements', () => {
    it('should return null for no classes', () => {
      const result = calculateSpellEntitlements([], defaultAbilityScores());
      expect(result).toBeNull();
    });

    it('should return null for non-spellcasting classes', () => {
      const classes: ClassEntry[] = [{ className: 'Barbarian', level: 1 }];
      const result = calculateSpellEntitlements(classes, defaultAbilityScores());
      expect(result).toBeNull();
    });

    it('should calculate Bard spell entitlements', () => {
      const classes: ClassEntry[] = [{ className: 'Bard', level: 1 }];
      const result = calculateSpellEntitlements(classes, defaultAbilityScores());

      expect(result).not.toBeNull();
      expect(result!.cantripsKnown).toBe(2);
      expect(result!.spellsKnown).toBe(2);
      expect(result!.canPrepare).toBe(false);
      expect(result!.spellcastingAbility).toBe('charisma');
    });

    it('should calculate Cleric spell entitlements', () => {
      const classes: ClassEntry[] = [{ className: 'Cleric', level: 1 }];
      const abilityScores: AbilityScores = { ...defaultAbilityScores(), wisdom: 16 };
      const result = calculateSpellEntitlements(classes, abilityScores);

      expect(result).not.toBeNull();
      expect(result!.cantripsKnown).toBe(3);
      expect(result!.spellsKnown).toBeGreaterThan(0);
      expect(result!.canPrepare).toBe(true);
      expect(result!.spellcastingAbility).toBe('wisdom');
      expect(result!.preparedSpellsMax).toBeDefined();
    });

    it('should calculate Druid spell entitlements', () => {
      const classes: ClassEntry[] = [{ className: 'Druid', level: 1 }];
      const result = calculateSpellEntitlements(classes, defaultAbilityScores());

      expect(result).not.toBeNull();
      expect(result!.cantripsKnown).toBe(2);
      expect(result!.canPrepare).toBe(true);
      expect(result!.spellcastingAbility).toBe('wisdom');
    });

    it('should calculate Paladin spell entitlements', () => {
      const classes: ClassEntry[] = [{ className: 'Paladin', level: 3 }];
      const result = calculateSpellEntitlements(classes, defaultAbilityScores());

      expect(result).not.toBeNull();
      expect(result!.cantripsKnown).toBe(0);
      expect(result!.spellsKnown).toBe(2);
      expect(result!.canPrepare).toBe(true);
      expect(result!.spellcastingAbility).toBe('charisma');
    });

    it('should calculate Sorcerer spell entitlements', () => {
      const classes: ClassEntry[] = [{ className: 'Sorcerer', level: 1 }];
      const result = calculateSpellEntitlements(classes, defaultAbilityScores());

      expect(result).not.toBeNull();
      expect(result!.cantripsKnown).toBe(4);
      expect(result!.spellsKnown).toBe(2);
      expect(result!.canPrepare).toBe(false);
      expect(result!.spellcastingAbility).toBe('charisma');
    });

    it('should calculate Warlock spell entitlements with pact magic', () => {
      const classes: ClassEntry[] = [{ className: 'Warlock', level: 3 }];
      const result = calculateSpellEntitlements(classes, defaultAbilityScores());

      expect(result).not.toBeNull();
      expect(result!.cantripsKnown).toBe(2);
      expect(result!.spellsKnown).toBe(4);
      expect(result!.canPrepare).toBe(false);
      expect(result!.spellcastingAbility).toBe('charisma');
      expect(result!.warlockPactSlots).toBeDefined();
      expect(result!.warlockPactSlots!.slots).toBe(2);
      expect(result!.warlockPactSlots!.slotLevel).toBe(1);
    });

    it('should calculate Warlock mystic arcanum at high levels', () => {
      const classes: ClassEntry[] = [{ className: 'Warlock', level: 17 }];
      const result = calculateSpellEntitlements(classes, defaultAbilityScores());

      expect(result).not.toBeNull();
      expect(result!.mysticArcanum).toBeDefined();
      expect(result!.mysticArcanum).toContain(6);
      expect(result!.mysticArcanum).toContain(7);
      expect(result!.mysticArcanum).toContain(8);
      expect(result!.mysticArcanum).toContain(9);
    });

    it('should calculate Wizard spell entitlements', () => {
      const classes: ClassEntry[] = [{ className: 'Wizard', level: 1 }];
      const result = calculateSpellEntitlements(classes, defaultAbilityScores());

      expect(result).not.toBeNull();
      expect(result!.cantripsKnown).toBe(3);
      expect(result!.spellsKnown).toBe(4);
      expect(result!.canPrepare).toBe(true);
      expect(result!.preparedSpellsMax).toBeDefined();
      expect(result!.spellcastingAbility).toBe('intelligence');
    });

    it('should handle Eldritch Knight subclass', () => {
      const classes: ClassEntry[] = [{ className: 'Fighter', level: 4 }];
      const result = calculateSpellEntitlements(classes, defaultAbilityScores(), 'Eldritch Knight');

      expect(result).not.toBeNull();
      expect(result!.cantripsKnown).toBe(0);
      expect(result!.spellsKnown).toBe(1);
      expect(result!.spellcastingAbility).toBe('intelligence');
      expect(result!.canPrepare).toBe(false);
    });

    it('should handle Arcane Trickster subclass', () => {
      const classes: ClassEntry[] = [{ className: 'Rogue', level: 4 }];
      const result = calculateSpellEntitlements(classes, defaultAbilityScores(), 'Arcane Trickster');

      expect(result).not.toBeNull();
      expect(result!.cantripsKnown).toBe(0);
      expect(result!.spellsKnown).toBe(1);
      expect(result!.spellcastingAbility).toBe('intelligence');
    });

    it('should scale cantrips at level 4', () => {
      const classes: ClassEntry[] = [{ className: 'Wizard', level: 4 }];
      const result = calculateSpellEntitlements(classes, defaultAbilityScores());

      expect(result).not.toBeNull();
      expect(result!.cantripsKnown).toBe(4);
    });

    it('should scale cantrips at level 10', () => {
      const classes: ClassEntry[] = [{ className: 'Wizard', level: 10 }];
      const result = calculateSpellEntitlements(classes, defaultAbilityScores());

      expect(result).not.toBeNull();
      expect(result!.cantripsKnown).toBe(5);
    });

    it('should handle multiclass with spellcasting', () => {
      const classes: ClassEntry[] = [
        { className: 'Wizard', level: 2 },
        { className: 'Fighter', level: 1 },
      ];
      const result = calculateSpellEntitlements(classes, defaultAbilityScores());

      expect(result).not.toBeNull();
      expect(result!.cantripsKnown).toBe(3);
      expect(result!.spellcastingAbility).toBe('intelligence');
    });

    describe('preparedSpellsMax', () => {
      it('should calculate L1 Cleric (WIS 16) max prepared = 4', () => {
        const classes: ClassEntry[] = [{ className: 'Cleric', level: 1 }];
        const abilityScores: AbilityScores = { ...defaultAbilityScores(), wisdom: 16 };
        const result = calculateSpellEntitlements(classes, abilityScores);

        expect(result).not.toBeNull();
        expect(result!.preparedSpellsMax).toBe(4);
      });

      it('should calculate L5 Paladin (CHA 14) max prepared = 7', () => {
        const classes: ClassEntry[] = [{ className: 'Paladin', level: 5 }];
        const abilityScores: AbilityScores = { ...defaultAbilityScores(), charisma: 14 };
        const result = calculateSpellEntitlements(classes, abilityScores);

        expect(result).not.toBeNull();
        expect(result!.preparedSpellsMax).toBe(7);
      });

      it('should calculate L10 Wizard (INT 20) max prepared = 15', () => {
        const classes: ClassEntry[] = [{ className: 'Wizard', level: 10 }];
        const abilityScores: AbilityScores = { ...defaultAbilityScores(), intelligence: 20 };
        const result = calculateSpellEntitlements(classes, abilityScores);

        expect(result).not.toBeNull();
        expect(result!.preparedSpellsMax).toBe(15);
      });
    });
  });

  describe('getSpellListForClass', () => {
    it('should return correct spell list for Bard', () => {
      expect(getSpellListForClass('Bard')).toEqual(['Bard']);
    });

    it('should return correct spell list for Cleric', () => {
      expect(getSpellListForClass('Cleric')).toEqual(['Cleric']);
    });

    it('should return correct spell list for Druid', () => {
      expect(getSpellListForClass('Druid')).toEqual(['Druid']);
    });

    it('should return correct spell list for Paladin', () => {
      expect(getSpellListForClass('Paladin')).toEqual(['Paladin']);
    });

    it('should return correct spell list for Sorcerer', () => {
      expect(getSpellListForClass('Sorcerer')).toEqual(['Sorcerer']);
    });

    it('should return correct spell list for Warlock', () => {
      expect(getSpellListForClass('Warlock')).toEqual(['Warlock']);
    });

    it('should return correct spell list for Wizard', () => {
      expect(getSpellListForClass('Wizard')).toEqual(['Wizard']);
    });

    it('should return Wizard list for Eldritch Knight', () => {
      expect(getSpellListForClass('Fighter', 'Eldritch Knight')).toEqual(['Wizard']);
    });

    it('should return Wizard list for Arcane Trickster', () => {
      expect(getSpellListForClass('Rogue', 'Arcane Trickster')).toEqual(['Wizard']);
    });

    it('should return empty array for non-spellcasting classes', () => {
      expect(getSpellListForClass('Barbarian')).toEqual([]);
    });
  });

  describe('getAvailableSpellsForCaster', () => {
    it('should return empty result for non-spellcasting character', async () => {
      const character = baseCharacter({ classes: [{ className: 'Barbarian', level: 1 }] });
      const result = await getAvailableSpellsForCaster(character);

      expect(result.availableSpells).toEqual([]);
      expect(result.spellbook).toEqual([]);
      expect(result.preparedSpellsMax).toBe(0);
      expect(result.canPrepare).toBe(false);
    });

    it('should return Wizard spellbook and available spells from character.spells', async () => {
      const spells: CharacterSpell[] = [
        createMockCharacterSpell({ id: 1, name: 'Magic Missile', prepared: true }),
        createMockCharacterSpell({ id: 2, name: 'Shield', prepared: false }),
        createMockCharacterSpell({ id: 3, name: 'Mage Armor', prepared: true }),
        createMockCharacterSpell({ id: 4, name: 'Burning Hands', prepared: false }),
        createMockCharacterSpell({ id: 5, name: 'Detect Magic', prepared: false }),
        createMockCharacterSpell({ id: 6, name: 'Feather Fall', prepared: true }),
      ];
      const character = baseCharacter({
        classes: [{ className: 'Wizard', level: 5 }],
        abilityScores: { ...defaultAbilityScores(), intelligence: 16 },
        spells,
      });

      const result = await getAvailableSpellsForCaster(character);

      expect(result.availableSpells).toHaveLength(6);
      expect(result.spellbook).toHaveLength(6);
      expect(result.availableSpells).toEqual(spells);
      expect(result.spellbook).toEqual(spells);
      expect(result.canPrepare).toBe(true);
      expect(result.preparedSpellsMax).toBe(8);
      expect(result.spellcastingAbility).toBe('intelligence');
    });

    it('should return full Cleric class list with prepared flags merged from character.spells', async () => {
      const dbClericSpells: DndSpell[] = [
        createMockDndSpell({ name: 'Cure Wounds', level: 1 }),
        createMockDndSpell({ name: 'Bless', level: 1 }),
        createMockDndSpell({ name: 'Shield of Faith', level: 1 }),
        createMockDndSpell({ name: 'Guiding Bolt', level: 1 }),
      ];
      mockGetSpellsByClass.mockResolvedValue(dbClericSpells);

      const characterSpells: CharacterSpell[] = [
        createMockCharacterSpell({ id: 1, name: 'Cure Wounds', prepared: true }),
        createMockCharacterSpell({ id: 2, name: 'Bless', prepared: true }),
        createMockCharacterSpell({ id: 3, name: 'Shield of Faith', prepared: false }),
        createMockCharacterSpell({ id: 4, name: 'Guiding Bolt', prepared: true }),
      ];
      const character = baseCharacter({
        classes: [{ className: 'Cleric', level: 1 }],
        abilityScores: { ...defaultAbilityScores(), wisdom: 16 },
        spells: characterSpells,
      });

      const result = await getAvailableSpellsForCaster(character);

      expect(mockGetSpellsByClass).toHaveBeenCalledWith('Cleric');
      expect(result.availableSpells).toHaveLength(4);
      expect(result.spellbook).toHaveLength(0);
      expect(result.canPrepare).toBe(true);
      expect(result.preparedSpellsMax).toBe(4);
      expect(result.spellcastingAbility).toBe('wisdom');

      const cureWounds = result.availableSpells.find((s) => s.name === 'Cure Wounds');
      expect(cureWounds?.prepared).toBe(true);

      const bless = result.availableSpells.find((s) => s.name === 'Bless');
      expect(bless?.prepared).toBe(true);

      const shieldOfFaith = result.availableSpells.find((s) => s.name === 'Shield of Faith');
      expect(shieldOfFaith?.prepared).toBe(false);

      const guidingBolt = result.availableSpells.find((s) => s.name === 'Guiding Bolt');
      expect(guidingBolt?.prepared).toBe(true);
    });

    it('should mark unprepared for class spells not in character.spells', async () => {
      const dbClericSpells: DndSpell[] = [
        createMockDndSpell({ name: 'Cure Wounds', level: 1 }),
        createMockDndSpell({ name: 'Bless', level: 1 }),
      ];
      mockGetSpellsByClass.mockResolvedValue(dbClericSpells);

      const characterSpells: CharacterSpell[] = [
        createMockCharacterSpell({ id: 1, name: 'Cure Wounds', prepared: true }),
      ];
      const character = baseCharacter({
        classes: [{ className: 'Cleric', level: 1 }],
        spells: characterSpells,
      });

      const result = await getAvailableSpellsForCaster(character);

      expect(result.availableSpells).toHaveLength(2);
      const cureWounds = result.availableSpells.find((s) => s.name === 'Cure Wounds');
      expect(cureWounds?.prepared).toBe(true);
      const bless = result.availableSpells.find((s) => s.name === 'Bless');
      expect(bless?.prepared).toBe(false);
      expect(bless?.source).toBe('Cleric');
    });
  });

  describe('buildUpdatedSpells', () => {
    it('should toggle a spell to prepared: true', () => {
      const spells: CharacterSpell[] = [
        createMockCharacterSpell({ id: 1, name: 'Magic Missile', prepared: false }),
        createMockCharacterSpell({ id: 2, name: 'Shield', prepared: false }),
      ];
      const entitlement = calculateSpellEntitlements(
        [{ className: 'Wizard', level: 1 }],
        defaultAbilityScores()
      )!;

      const result = buildUpdatedSpells(spells, { spellId: 1, prepared: true }, entitlement);

      expect(result).toHaveLength(2);
      expect(result[0].prepared).toBe(true);
      expect(result[1].prepared).toBe(false);
    });

    it('should toggle a spell to prepared: false', () => {
      const spells: CharacterSpell[] = [
        createMockCharacterSpell({ id: 1, name: 'Magic Missile', prepared: true }),
        createMockCharacterSpell({ id: 2, name: 'Shield', prepared: true }),
      ];
      const entitlement = calculateSpellEntitlements(
        [{ className: 'Wizard', level: 1 }],
        defaultAbilityScores()
      )!;

      const result = buildUpdatedSpells(spells, { spellId: 2, prepared: false }, entitlement);

      expect(result).toHaveLength(2);
      expect(result[0].prepared).toBe(true);
      expect(result[1].prepared).toBe(false);
    });

    it('should return a new array and not mutate the input', () => {
      const spells: CharacterSpell[] = [
        createMockCharacterSpell({ id: 1, name: 'Magic Missile', prepared: false }),
      ];
      const entitlement = calculateSpellEntitlements(
        [{ className: 'Wizard', level: 1 }],
        defaultAbilityScores()
      )!;

      const result = buildUpdatedSpells(spells, { spellId: 1, prepared: true }, entitlement);

      expect(result).not.toBe(spells);
      expect(spells[0].prepared).toBe(false);
      expect(result[0].prepared).toBe(true);
    });

    it('should not change spells when spellId does not match', () => {
      const spells: CharacterSpell[] = [
        createMockCharacterSpell({ id: 1, name: 'Magic Missile', prepared: false }),
      ];
      const entitlement = calculateSpellEntitlements(
        [{ className: 'Wizard', level: 1 }],
        defaultAbilityScores()
      )!;

      const result = buildUpdatedSpells(spells, { spellId: 999, prepared: true }, entitlement);

      expect(result[0].prepared).toBe(false);
    });
  });
});
