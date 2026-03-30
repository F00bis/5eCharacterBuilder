import { describe, it, expect } from 'vitest';
import { calculateSpellEntitlements, getSpellListForClass } from './spellCalculations';
import type { ClassEntry } from '../types';

describe('spellCalculations', () => {
  describe('calculateSpellEntitlements', () => {
    it('should return null for no classes', () => {
      const result = calculateSpellEntitlements([]);
      expect(result).toBeNull();
    });

    it('should return null for non-spellcasting classes', () => {
      const classes: ClassEntry[] = [{ className: 'Barbarian', level: 1 }];
      const result = calculateSpellEntitlements(classes);
      expect(result).toBeNull();
    });

    it('should calculate Bard spell entitlements', () => {
      const classes: ClassEntry[] = [{ className: 'Bard', level: 1 }];
      const result = calculateSpellEntitlements(classes);
      
      expect(result).not.toBeNull();
      expect(result!.cantripsKnown).toBe(2);
      expect(result!.spellsKnown).toBe(2);
      expect(result!.canPrepare).toBe(false);
      expect(result!.spellcastingAbility).toBe('charisma');
    });

    it('should calculate Cleric spell entitlements', () => {
      const classes: ClassEntry[] = [{ className: 'Cleric', level: 1 }];
      const result = calculateSpellEntitlements(classes);
      
      expect(result).not.toBeNull();
      expect(result!.cantripsKnown).toBe(3);
      expect(result!.spellsKnown).toBeGreaterThan(0);
      expect(result!.canPrepare).toBe(true);
      expect(result!.spellcastingAbility).toBe('wisdom');
      expect(result!.preparedSpellsMax).toBeDefined();
    });

    it('should calculate Druid spell entitlements', () => {
      const classes: ClassEntry[] = [{ className: 'Druid', level: 1 }];
      const result = calculateSpellEntitlements(classes);
      
      expect(result).not.toBeNull();
      expect(result!.cantripsKnown).toBe(2);
      expect(result!.canPrepare).toBe(true);
      expect(result!.spellcastingAbility).toBe('wisdom');
    });

    it('should calculate Paladin spell entitlements', () => {
      const classes: ClassEntry[] = [{ className: 'Paladin', level: 2 }];
      const result = calculateSpellEntitlements(classes);
      
      expect(result).not.toBeNull();
      expect(result!.cantripsKnown).toBe(0);
      expect(result!.spellsKnown).toBe(2);
      expect(result!.canPrepare).toBe(true);
      expect(result!.spellcastingAbility).toBe('charisma');
    });

    it('should calculate Sorcerer spell entitlements', () => {
      const classes: ClassEntry[] = [{ className: 'Sorcerer', level: 1 }];
      const result = calculateSpellEntitlements(classes);
      
      expect(result).not.toBeNull();
      expect(result!.cantripsKnown).toBe(4);
      expect(result!.spellsKnown).toBe(2);
      expect(result!.canPrepare).toBe(false);
      expect(result!.spellcastingAbility).toBe('charisma');
    });

    it('should calculate Warlock spell entitlements with pact magic', () => {
      const classes: ClassEntry[] = [{ className: 'Warlock', level: 3 }];
      const result = calculateSpellEntitlements(classes);
      
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
      const result = calculateSpellEntitlements(classes);
      
      expect(result).not.toBeNull();
      expect(result!.mysticArcanum).toBeDefined();
      expect(result!.mysticArcanum).toContain(6);
      expect(result!.mysticArcanum).toContain(7);
      expect(result!.mysticArcanum).toContain(8);
      expect(result!.mysticArcanum).toContain(9);
    });

    it('should calculate Wizard spell entitlements', () => {
      const classes: ClassEntry[] = [{ className: 'Wizard', level: 1 }];
      const result = calculateSpellEntitlements(classes);
      
      expect(result).not.toBeNull();
      expect(result!.cantripsKnown).toBe(3);
      expect(result!.spellsKnown).toBe(3);
      expect(result!.canPrepare).toBe(false);
      expect(result!.spellcastingAbility).toBe('intelligence');
    });

    it('should handle Eldritch Knight subclass', () => {
      const classes: ClassEntry[] = [{ className: 'Fighter', level: 4 }];
      const result = calculateSpellEntitlements(classes, 'Eldritch Knight');
      
      expect(result).not.toBeNull();
      expect(result!.cantripsKnown).toBe(0);
      expect(result!.spellsKnown).toBe(1);
      expect(result!.spellcastingAbility).toBe('intelligence');
      expect(result!.canPrepare).toBe(false);
    });

    it('should handle Arcane Trickster subclass', () => {
      const classes: ClassEntry[] = [{ className: 'Rogue', level: 4 }];
      const result = calculateSpellEntitlements(classes, 'Arcane Trickster');
      
      expect(result).not.toBeNull();
      expect(result!.cantripsKnown).toBe(0);
      expect(result!.spellsKnown).toBe(1);
      expect(result!.spellcastingAbility).toBe('intelligence');
    });

    it('should scale cantrips at level 4', () => {
      const classes: ClassEntry[] = [{ className: 'Wizard', level: 4 }];
      const result = calculateSpellEntitlements(classes);
      
      expect(result).not.toBeNull();
      expect(result!.cantripsKnown).toBe(4);
    });

    it('should scale cantrips at level 10', () => {
      const classes: ClassEntry[] = [{ className: 'Wizard', level: 10 }];
      const result = calculateSpellEntitlements(classes);
      
      expect(result).not.toBeNull();
      expect(result!.cantripsKnown).toBe(5);
    });

    it('should handle multiclass with spellcasting', () => {
      const classes: ClassEntry[] = [
        { className: 'Wizard', level: 2 },
        { className: 'Fighter', level: 1 },
      ];
      const result = calculateSpellEntitlements(classes);
      
      expect(result).not.toBeNull();
      expect(result!.cantripsKnown).toBe(3);
      expect(result!.spellcastingAbility).toBe('intelligence');
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
});