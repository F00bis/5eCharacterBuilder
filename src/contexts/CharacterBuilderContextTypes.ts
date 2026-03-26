import { createContext, useContext } from 'react';
import type React from 'react';
import type { CharacterBuilderDraft, Ability } from '../types';
import { createDefaultCharacter } from '../types';

export interface AsiChoice {
  level: number;
  bonuses: { ability: Ability; amount: number }[];
}

export interface CharacterBuilderState {
  draft: CharacterBuilderDraft;
  currentStep: number;
  mode: 'create' | 'levelup';
  baseCharacterId: number | null;
  asiChoices: AsiChoice[];
  stepValidations: Record<string, boolean>;
  useTashasRules: boolean;
}

export type BuilderAction =
  | { type: 'SET_MODE'; mode: 'create' | 'levelup'; baseCharacterId?: number | null }
  | { type: 'LOAD_BASE_CHARACTER'; character: Partial<CharacterBuilderDraft> }
  | { type: 'UPDATE_DRAFT'; updates: Partial<CharacterBuilderDraft> }
  | { type: 'SET_STEP'; step: number }
  | { type: 'ADD_ITEM_WITH_SOURCE'; listName: keyof CharacterBuilderDraft; item: unknown }
  | { type: 'REMOVE_ITEMS_BY_SOURCE'; listName: keyof CharacterBuilderDraft; source: string }
  | { type: 'ADD_ASI_CHOICE'; choice: AsiChoice }
  | { type: 'REMOVE_ASI_CHOICE'; level: number }
  | { type: 'SET_STEP_VALIDATION'; stepId: string; isValid: boolean }
  | { type: 'SET_TASHAS_RULES'; enabled: boolean }
  | { type: 'RESET_VALIDATIONS' }
  | { type: 'CLEAR_DRAFT' };

export const defaultState: CharacterBuilderState = {
  draft: createDefaultCharacter(),
  currentStep: 0,
  mode: 'create',
  baseCharacterId: null,
  asiChoices: [],
  stepValidations: {},
  useTashasRules: true,
};

export function characterBuilderReducer(
  state: CharacterBuilderState,
  action: BuilderAction
): CharacterBuilderState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.mode, baseCharacterId: action.baseCharacterId ?? null };
    case 'LOAD_BASE_CHARACTER': {
      const loadedDraft = createDefaultCharacter();
      return { 
        ...state, 
        draft: { ...loadedDraft, ...action.character },
        asiChoices: (action.character as unknown as { asiChoices?: AsiChoice[] })?.asiChoices || []
      };
    }
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
    case 'SET_STEP_VALIDATION':
      return {
        ...state,
        stepValidations: { ...state.stepValidations, [action.stepId]: action.isValid }
      };
    case 'SET_TASHAS_RULES':
      return { ...state, useTashasRules: action.enabled };
    case 'RESET_VALIDATIONS':
      return { ...state, stepValidations: {} };
    case 'CLEAR_DRAFT':
      return { ...defaultState };
    default:
      return state;
  }
}

export interface CharacterBuilderContextType {
  state: CharacterBuilderState;
  dispatch: React.Dispatch<BuilderAction>;
  isComplete: boolean;
}

export const CharacterBuilderContext = createContext<CharacterBuilderContextType | undefined>(undefined);

export function useCharacterBuilder() {
  const context = useContext(CharacterBuilderContext);
  if (context === undefined) {
    throw new Error('useCharacterBuilder must be used within a CharacterBuilderProvider');
  }
  return context;
}
