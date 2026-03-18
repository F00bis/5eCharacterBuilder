import { describe, it, expect } from 'vitest';
import { characterBuilderReducer, CharacterBuilderState, BuilderAction } from './CharacterBuilderContextTypes';
import type { Character } from '../types';

describe('characterBuilderReducer', () => {
  const initialState: CharacterBuilderState = {
    draft: {},
    currentStep: 0,
    mode: 'create',
    baseCharacterId: null,
  };

  it('handles SET_MODE', () => {
    const action: BuilderAction = { type: 'SET_MODE', mode: 'levelup', baseCharacterId: 5 };
    const state = characterBuilderReducer(initialState, action);
    expect(state.mode).toBe('levelup');
    expect(state.baseCharacterId).toBe(5);
  });

  it('handles LOAD_BASE_CHARACTER', () => {
    const mockCharacter: Partial<Character> = { name: 'Gimli', race: 'Dwarf' };
    const action: BuilderAction = { type: 'LOAD_BASE_CHARACTER', character: mockCharacter };
    const state = characterBuilderReducer(initialState, action);
    expect(state.draft).toEqual(mockCharacter);
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
      draft: { skills: [] }
    };
    const action: BuilderAction = { 
      type: 'ADD_ITEM_WITH_SOURCE', 
      listName: 'skills', 
      item: { skill: 'athletics', ability: 'strength', level: 'proficient', source: 'Background: Soldier' } 
    };
    const state = characterBuilderReducer(startState, action);
    expect(state.draft.skills).toHaveLength(1);
    expect(state.draft.skills?.[0].skill).toBe('athletics');
    expect(state.draft.skills?.[0].source).toBe('Background: Soldier');
  });

  it('handles REMOVE_ITEMS_BY_SOURCE', () => {
    const startState: CharacterBuilderState = {
      ...initialState,
      draft: {
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
    expect(state.draft.skills?.[0].skill).toBe('perception');
  });

  it('handles CLEAR_DRAFT', () => {
    const startState: CharacterBuilderState = {
      draft: { name: 'Frodo' },
      currentStep: 5,
      mode: 'levelup',
      baseCharacterId: 1
    };
    const action: BuilderAction = { type: 'CLEAR_DRAFT' };
    const state = characterBuilderReducer(startState, action);
    expect(state.draft).toEqual({});
    expect(state.currentStep).toBe(0);
    expect(state.mode).toBe('create');
    expect(state.baseCharacterId).toBe(null);
  });
});
