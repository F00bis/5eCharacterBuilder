import { describe, it, expect } from 'vitest';
import { resolveFeat } from './featResolver';
import type { SrdFeat } from '../data/srdFeats';

function makeSrdFeat(overrides: Partial<SrdFeat>): SrdFeat {
  return {
    id: 'test',
    name: 'Test Feat',
    description: 'A test feat',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true,
    ...overrides,
  };
}

describe('resolveFeat', () => {
  describe('non-half-feats without choices', () => {
    it('returns a feat with empty statModifiers', () => {
      const srdFeat = makeSrdFeat({ name: 'Alert' });
      const result = resolveFeat(srdFeat, {});
      expect(result.name).toBe('Alert');
      expect(result.statModifiers).toEqual({});
      expect(result.resolvedChoices).toBeUndefined();
    });
  });

  describe('half-feats with fixed ASI (single asiOption)', () => {
    it('Actor: applies +1 CHA when charisma is selected', () => {
      const srdFeat = makeSrdFeat({
        name: 'Actor',
        isHalfFeat: true,
        asiOptions: ['charisma'],
      });
      const result = resolveFeat(srdFeat, { asiChoice: 'charisma' });
      expect(result.statModifiers).toEqual({ charisma: 1 });
      expect(result.resolvedChoices).toEqual({ asi: 'charisma' });
    });

    it('Durable: applies +1 CON', () => {
      const srdFeat = makeSrdFeat({
        name: 'Durable',
        isHalfFeat: true,
        asiOptions: ['constitution'],
      });
      const result = resolveFeat(srdFeat, { asiChoice: 'constitution' });
      expect(result.statModifiers).toEqual({ constitution: 1 });
    });
  });

  describe('half-feats with ASI choice (multiple asiOptions)', () => {
    it('Athlete: applies +1 STR when strength is chosen', () => {
      const srdFeat = makeSrdFeat({
        name: 'Athlete',
        isHalfFeat: true,
        asiOptions: ['strength', 'dexterity'],
      });
      const result = resolveFeat(srdFeat, { asiChoice: 'strength' });
      expect(result.statModifiers).toEqual({ strength: 1 });
      expect(result.resolvedChoices).toEqual({ asi: 'strength' });
    });

    it('Athlete: applies +1 DEX when dexterity is chosen', () => {
      const srdFeat = makeSrdFeat({
        name: 'Athlete',
        isHalfFeat: true,
        asiOptions: ['strength', 'dexterity'],
      });
      const result = resolveFeat(srdFeat, { asiChoice: 'dexterity' });
      expect(result.statModifiers).toEqual({ dexterity: 1 });
    });

    it('Resilient: applies +1 to any chosen ability', () => {
      const srdFeat = makeSrdFeat({
        name: 'Resilient',
        isHalfFeat: true,
        asiOptions: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
      });
      const result = resolveFeat(srdFeat, { asiChoice: 'wisdom' });
      expect(result.statModifiers).toEqual({ wisdom: 1 });
    });
  });

  describe('ASI validation', () => {
    it('does not apply ASI if choice is not in asiOptions', () => {
      const srdFeat = makeSrdFeat({
        name: 'Athlete',
        isHalfFeat: true,
        asiOptions: ['strength', 'dexterity'],
      });
      const result = resolveFeat(srdFeat, { asiChoice: 'charisma' });
      expect(result.statModifiers).toEqual({});
    });

    it('does not apply ASI if no asiChoice provided for half-feat', () => {
      const srdFeat = makeSrdFeat({
        name: 'Athlete',
        isHalfFeat: true,
        asiOptions: ['strength', 'dexterity'],
      });
      const result = resolveFeat(srdFeat, {});
      expect(result.statModifiers).toEqual({});
    });

    it('does not apply ASI for non-half-feat even if asiChoice is provided', () => {
      const srdFeat = makeSrdFeat({ name: 'Alert', isHalfFeat: false });
      const result = resolveFeat(srdFeat, { asiChoice: 'strength' });
      expect(result.statModifiers).toEqual({});
    });
  });

  describe('saving throw proficiency (Resilient)', () => {
    it('grants saving throw proficiency linked to ASI choice', () => {
      const srdFeat = makeSrdFeat({
        name: 'Resilient',
        isHalfFeat: true,
        asiOptions: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
        choices: [{
          id: 'savingThrow',
          kind: 'saving-throw' as const,
          label: 'Saving Throw Proficiency',
          count: 1,
          linkedTo: 'asi',
        }],
      });
      const result = resolveFeat(srdFeat, { asiChoice: 'wisdom' });
      expect(result.savingThrowProficiencies).toEqual({ wisdom: 'proficient' });
    });

    it('does not grant saving throw if no ASI chosen on linked choice', () => {
      const srdFeat = makeSrdFeat({
        name: 'Resilient',
        isHalfFeat: true,
        asiOptions: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
        choices: [{
          id: 'savingThrow',
          kind: 'saving-throw' as const,
          label: 'Saving Throw Proficiency',
          count: 1,
          linkedTo: 'asi',
        }],
      });
      const result = resolveFeat(srdFeat, {});
      expect(result.savingThrowProficiencies).toBeUndefined();
    });
  });

  describe('skill choices (Skill Expert)', () => {
    it('applies skill proficiency bonus', () => {
      const srdFeat = makeSrdFeat({
        name: 'Skill Expert',
        isHalfFeat: true,
        asiOptions: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
        choices: [
          { id: 'skillProficiency', kind: 'skill-proficiency' as const, label: 'Skill Proficiency', count: 1 },
          { id: 'skillExpertise', kind: 'skill-expertise' as const, label: 'Skill Expertise', count: 1 },
        ],
      });
      const result = resolveFeat(srdFeat, {
        asiChoice: 'intelligence',
        choices: { skillProficiency: 'arcana', skillExpertise: 'stealth' },
      });
      expect(result.statModifiers).toEqual({ intelligence: 1 });
      expect(result.skillModifiers).toEqual({ arcana: 2, stealth: 2 });
      expect(result.resolvedChoices).toEqual({
        asi: 'intelligence',
        skillProficiency: 'arcana',
        skillExpertise: 'stealth',
      });
    });
  });

  describe('non-mechanical choices (damage type, spell list)', () => {
    it('stores damage type selection in resolvedChoices', () => {
      const srdFeat = makeSrdFeat({
        name: 'Elemental Adept',
        choices: [{
          id: 'damageType',
          kind: 'damage-type' as const,
          label: 'Damage Type',
          count: 1,
          options: ['acid', 'cold', 'fire', 'lightning', 'thunder'],
        }],
      });
      const result = resolveFeat(srdFeat, { choices: { damageType: 'fire' } });
      expect(result.resolvedChoices).toEqual({ damageType: 'fire' });
      expect(result.statModifiers).toEqual({});
    });

    it('stores spell list and spell selections in resolvedChoices', () => {
      const srdFeat = makeSrdFeat({
        name: 'Magic Initiate',
        choices: [
          { id: 'spellList', kind: 'spell-list' as const, label: 'Spell List', count: 1 },
          { id: 'cantrips', kind: 'cantrip' as const, label: 'Cantrips', count: 2, linkedTo: 'spellList' },
          { id: 'spell', kind: 'spell' as const, label: 'Level 1 Spell', count: 1, linkedTo: 'spellList' },
        ],
      });
      const result = resolveFeat(srdFeat, {
        choices: {
          spellList: 'Wizard',
          cantrips: ['Fire Bolt', 'Light'],
          spell: 'Shield',
        },
      });
      expect(result.resolvedChoices).toEqual({
        spellList: 'Wizard',
        cantrips: ['Fire Bolt', 'Light'],
        spell: 'Shield',
      });
    });
  });

  describe('weapon proficiency choices', () => {
    it('stores weapon selections in resolvedChoices', () => {
      const srdFeat = makeSrdFeat({
        name: 'Weapon Master',
        isHalfFeat: true,
        asiOptions: ['strength', 'dexterity'],
        choices: [{
          id: 'weapons',
          kind: 'weapon-proficiency' as const,
          label: 'Weapon Proficiencies',
          count: 4,
        }],
      });
      const result = resolveFeat(srdFeat, {
        asiChoice: 'strength',
        choices: { weapons: ['longbow', 'longsword', 'rapier', 'hand crossbow'] },
      });
      expect(result.statModifiers).toEqual({ strength: 1 });
      expect(result.resolvedChoices).toEqual({
        asi: 'strength',
        weapons: ['longbow', 'longsword', 'rapier', 'hand crossbow'],
      });
    });
  });
});