import { createContext, useContext } from 'react';
import type React from 'react';
import type { Character, Ability } from '../types';

export interface AsiChoice {
  level: number;
  bonuses: { ability: Ability; amount: number }[];
}

export interface CharacterBuilderState {
  draft: Partial<Character>;
  currentStep: number;
  mode: 'create' | 'levelup';
  baseCharacterId: number | null;
  asiChoices: AsiChoice[];
}

export type BuilderAction =
  | { type: 'SET_MODE'; mode: 'create' | 'levelup'; baseCharacterId?: number | null }
  | { type: 'LOAD_BASE_CHARACTER'; character: Partial<Character> }
  | { type: 'UPDATE_DRAFT'; updates: Partial<Character> }
  | { type: 'SET_STEP'; step: number }
  | { type: 'ADD_ITEM_WITH_SOURCE'; listName: keyof Character; item: unknown }
  | { type: 'REMOVE_ITEMS_BY_SOURCE'; listName: keyof Character; source: string }
  | { type: 'ADD_ASI_CHOICE'; choice: AsiChoice }
  | { type: 'REMOVE_ASI_CHOICE'; level: number }
  | { type: 'CLEAR_DRAFT' };

export const defaultState: CharacterBuilderState = {
  draft: {},
  currentStep: 0,
  mode: 'create',
  baseCharacterId: null,
  asiChoices: [],
};

export function characterBuilderReducer(
  state: CharacterBuilderState,
  action: BuilderAction
): CharacterBuilderState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.mode, baseCharacterId: action.baseCharacterId ?? null };
    case 'LOAD_BASE_CHARACTER':
      return { 
        ...state, 
        draft: { ...action.character },
        asiChoices: (action.character as unknown as { asiChoices?: AsiChoice[] })?.asiChoices || []
      };
    case 'UPDATE_DRAFT':
      return { ...state, draft: { ...state.draft, ...action.updates } };
    case 'SET_STEP':
      return { ...state, currentStep: action.step };
    case 'ADD_ITEM_WITH_SOURCE': {
      const currentList = Array.isArray(state.draft[action.listName])
        ? (state.draft[action.listName] as unknown[])
        : [];
      return {
        ...state,
        draft: {
          ...state.draft,
          [action.listName]: [...currentList, action.item],
        },
      };
    }
    case 'REMOVE_ITEMS_BY_SOURCE': {
      const currentList = Array.isArray(state.draft[action.listName])
        ? (state.draft[action.listName] as unknown[])
        : [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filteredList = currentList.filter((item) => (item as any).source !== action.source);
      return {
        ...state,
        draft: {
          ...state.draft,
          [action.listName]: filteredList,
        },
      };
    }
    case 'ADD_ASI_CHOICE': {
      const existingIndex = state.asiChoices.findIndex(c => c.level === action.choice.level);
      if (existingIndex >= 0) {
        const updated = [...state.asiChoices];
        updated[existingIndex] = action.choice;
        return { ...state, asiChoices: updated };
      }
      return { ...state, asiChoices: [...state.asiChoices, action.choice] };
    }
    case 'REMOVE_ASI_CHOICE':
      return { ...state, asiChoices: state.asiChoices.filter(c => c.level !== action.level) };
    case 'CLEAR_DRAFT':
      return { ...defaultState };
    default:
      return state;
  }
}

export interface CharacterBuilderContextType {
  state: CharacterBuilderState;
  dispatch: React.Dispatch<BuilderAction>;
}

export const CharacterBuilderContext = createContext<CharacterBuilderContextType | undefined>(undefined);

export function useCharacterBuilder() {
  const context = useContext(CharacterBuilderContext);
  if (context === undefined) {
    throw new Error('useCharacterBuilder must be used within a CharacterBuilderProvider');
  }
  return context;
}
