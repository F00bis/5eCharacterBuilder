import { describe, expect, it } from 'vitest';
import { createDefaultCharacter, type CharacterBase } from '../types';
import { characterBuilderReducer, defaultState } from './CharacterBuilderContextTypes';
import type { BuilderAction, CharacterBuilderState } from './CharacterBuilderContextTypes';

describe('characterBuilderReducer', () => {
  const initialState: CharacterBuilderState = {
    ...defaultState,
    draft: createDefaultCharacter(),
  };

  it('handles SET_MODE', () => {
    const action: BuilderAction = { type: 'SET_MODE', mode: 'levelup', baseCharacterId: 5 };
    const state = characterBuilderReducer(initialState, action);
    expect(state.mode).toBe('levelup');
    expect(state.baseCharacterId).toBe(5);
  });

  it('handles LOAD_BASE_CHARACTER', () => {
    const mockCharacter: Partial<CharacterBase> = { name: 'Gimli', race: 'Dwarf' };
    const action: BuilderAction = { type: 'LOAD_BASE_CHARACTER', character: mockCharacter };
    const state = characterBuilderReducer(initialState, action);
    expect(state.draft.name).toBe('Gimli');
    expect(state.draft.race).toBe('Dwarf');
  });

  it('handles UPDATE_DRAFT', () => {
    const action: BuilderAction = { type: 'UPDATE_DRAFT', updates: { name: 'Legolas' } };
    const state = characterBuilderReducer(initialState, action);
    expect(state.draft.name).toBe('Legolas');
  });

  it('handles SET_STEP', () => {
    const action: BuilderAction = { type: 'SET_STEP', step: 2 };
    const state = characterBuilderReducer(initialState, action);
    expect(state.currentStep).toBe(2);
  });

  it('handles ADD_ITEM_WITH_SOURCE', () => {
    const startState: CharacterBuilderState = {
      ...initialState,
      draft: { ...createDefaultCharacter(), skills: [] }
    };
    const action: BuilderAction = { 
      type: 'ADD_ITEM_WITH_SOURCE', 
      listName: 'skills', 
      item: { skill: 'athletics', ability: 'strength', level: 'proficient', source: 'Background: Soldier' } 
    };
    const state = characterBuilderReducer(startState, action);
    expect(state.draft.skills).toHaveLength(1);
    expect(state.draft.skills[0].skill).toBe('athletics');
    expect(state.draft.skills[0].source).toBe('Background: Soldier');
  });

  it('handles REMOVE_ITEMS_BY_SOURCE', () => {
    const startState: CharacterBuilderState = {
      ...initialState,
      draft: {
        ...createDefaultCharacter(),
        skills: [
          { skill: 'athletics', ability: 'strength', level: 'proficient', source: 'Background: Soldier' },
          { skill: 'perception', ability: 'wisdom', level: 'proficient', source: 'Class: Fighter' }
        ]
      }
    };
    const action: BuilderAction = { 
      type: 'REMOVE_ITEMS_BY_SOURCE', 
      listName: 'skills', 
      source: 'Background: Soldier' 
    };
    const state = characterBuilderReducer(startState, action);
    expect(state.draft.skills).toHaveLength(1);
    expect(state.draft.skills[0].skill).toBe('perception');
  });

  it('handles CLEAR_DRAFT', () => {
    const startState: CharacterBuilderState = {
      ...defaultState,
      draft: { ...createDefaultCharacter(), name: 'Frodo' },
      currentStep: 5,
      mode: 'levelup',
      baseCharacterId: 1,
    };
    const action: BuilderAction = { type: 'CLEAR_DRAFT' };
    const state = characterBuilderReducer(startState, action);
    expect(state.draft.name).toBe('');
    expect(state.currentStep).toBe(0);
    expect(state.mode).toBe('create');
    expect(state.baseCharacterId).toBe(null);
  });

  it('handles SET_STEP_VALIDATION', () => {
    const action: BuilderAction = { type: 'SET_STEP_VALIDATION', stepId: 'race', isValid: true };
    const state = characterBuilderReducer(initialState, action);
    expect(state.stepValidations['race']).toBe(true);
  });

  it('handles SET_STEP_VALIDATION aggregates multiple steps', () => {
    let state = characterBuilderReducer(initialState, { type: 'SET_STEP_VALIDATION', stepId: 'race', isValid: true });
    state = characterBuilderReducer(state, { type: 'SET_STEP_VALIDATION', stepId: 'abilities', isValid: true });
    expect(state.stepValidations['race']).toBe(true);
    expect(state.stepValidations['abilities']).toBe(true);
  });

  it('handles SET_TASHAS_RULES', () => {
    const action: BuilderAction = { type: 'SET_TASHAS_RULES', enabled: false };
    const state = characterBuilderReducer(initialState, action);
    expect(state.useTashasRules).toBe(false);
  });

  it('handles RESET_VALIDATIONS', () => {
    const startState: CharacterBuilderState = {
      ...initialState,
      stepValidations: { race: true, abilities: true }
    };
    const action: BuilderAction = { type: 'RESET_VALIDATIONS' };
    const state = characterBuilderReducer(startState, action);
    expect(state.stepValidations).toEqual({});
  });

  it('handles progression-domain choice actions', () => {
    let state = characterBuilderReducer(initialState, {
      type: 'SET_EXPERTISE_CHOICE',
      source: 'expertise:0:rogue:1',
      skills: ['stealth', 'perception'],
    });
    state = characterBuilderReducer(state, {
      type: 'SET_METAMAGIC_CHOICE',
      source: 'metamagic:0:sorcerer:3',
      options: ['Quickened Spell', 'Subtle Spell'],
    });
    state = characterBuilderReducer(state, {
      type: 'SET_INVOCATION_CHOICE',
      source: 'invocation:0:warlock:2',
      options: ['Agonizing Blast', "Devil's Sight"],
    });
    state = characterBuilderReducer(state, {
      type: 'SET_MYSTIC_ARCANUM_CHOICE',
      source: 'mystic-arcanum:0:warlock:11',
      spellName: 'Mass Suggestion',
    });

    expect(state.expertiseChoices['expertise:0:rogue:1']).toEqual(['stealth', 'perception']);
    expect(state.metamagicChoices['metamagic:0:sorcerer:3']).toEqual(['Quickened Spell', 'Subtle Spell']);
    expect(state.invocationChoices['invocation:0:warlock:2']).toEqual(['Agonizing Blast', "Devil's Sight"]);
    expect(state.mysticArcanumChoices['mystic-arcanum:0:warlock:11']).toBe('Mass Suggestion');
  });

  it('removes progression-domain choices by source', () => {
    let state = characterBuilderReducer(initialState, {
      type: 'SET_EXPERTISE_CHOICE',
      source: 'expertise:0:rogue:1',
      skills: ['stealth', 'perception'],
    });
    state = characterBuilderReducer(state, {
      type: 'REMOVE_EXPERTISE_CHOICE',
      source: 'expertise:0:rogue:1',
    });

    expect(state.expertiseChoices['expertise:0:rogue:1']).toBeUndefined();
  });
});
