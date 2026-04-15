import type React from 'react';
import { createContext, useContext } from 'react';
import type {
  Ability,
  CharacterBase,
  ExpertiseChoiceStore,
  InvocationChoiceStore,
  MetamagicChoiceStore,
  MysticArcanumChoiceStore,
  Skill,
} from '../types';
import { createDefaultCharacter } from '../types';

export interface AsiChoice {
  level: number;
  bonuses: { ability: Ability; amount: number }[];
}

export type FeatChoiceType = 'feat' | 'asi';

export interface FeatChoice {
  source: string;
  type: FeatChoiceType;
  featName?: string;
  asiBonuses?: { ability: Ability; amount: number }[];
  featSelections?: Record<string, string | string[]>;
}

export interface CharacterBuilderState {
  draft: CharacterBase;
  currentStep: number;
  mode: 'create' | 'levelup';
  baseCharacterId: number | null;
  asiChoices: AsiChoice[];
  featChoices: FeatChoice[];
  expertiseChoices: ExpertiseChoiceStore;
  metamagicChoices: MetamagicChoiceStore;
  invocationChoices: InvocationChoiceStore;
  mysticArcanumChoices: MysticArcanumChoiceStore;
  stepValidations: Record<string, boolean>;
  useTashasRules: boolean;
  raceChoices: Record<string, string | string[]>;
  backgroundChoices: Record<string, string | string[]>;
  backgroundEquipmentPackage: 'A' | 'B' | null;
}

export type BuilderAction =
  | { type: 'SET_MODE'; mode: 'create' | 'levelup'; baseCharacterId?: number | null }
  | { type: 'LOAD_BASE_CHARACTER'; character: Partial<CharacterBase> }
  | { type: 'UPDATE_DRAFT'; updates: Partial<CharacterBase> }
  | { type: 'SET_STEP'; step: number }
  | { type: 'ADD_ITEM_WITH_SOURCE'; listName: keyof CharacterBase; item: unknown }
  | { type: 'REMOVE_ITEMS_BY_SOURCE'; listName: keyof CharacterBase; source: string }
  | { type: 'ADD_ASI_CHOICE'; choice: AsiChoice }
  | { type: 'REMOVE_ASI_CHOICE'; level: number }
  | { type: 'SET_FEAT_CHOICE'; choice: FeatChoice }
  | { type: 'REMOVE_FEAT_CHOICE'; source: string }
  | { type: 'CLEAR_FEAT_CHOICES' }
  | { type: 'SET_EXPERTISE_CHOICE'; source: string; skills: Skill[] }
  | { type: 'REMOVE_EXPERTISE_CHOICE'; source: string }
  | { type: 'SET_METAMAGIC_CHOICE'; source: string; options: string[] }
  | { type: 'REMOVE_METAMAGIC_CHOICE'; source: string }
  | { type: 'SET_INVOCATION_CHOICE'; source: string; options: string[] }
  | { type: 'REMOVE_INVOCATION_CHOICE'; source: string }
  | { type: 'SET_MYSTIC_ARCANUM_CHOICE'; source: string; spellName: string }
  | { type: 'REMOVE_MYSTIC_ARCANUM_CHOICE'; source: string }
  | { type: 'SET_STEP_VALIDATION'; stepId: string; isValid: boolean }
  | { type: 'SET_TASHAS_RULES'; enabled: boolean }
  | { type: 'RESET_VALIDATIONS' }
  | { type: 'CLEAR_DRAFT' }
  | { type: 'SET_RACE_CHOICE'; choiceType: string; value: string | string[] }
  | { type: 'CLEAR_RACE_CHOICES' }
  | { type: 'SET_BACKGROUND_CHOICE'; choiceType: string; value: string | string[] }
  | { type: 'CLEAR_BACKGROUND_CHOICES' }
  | { type: 'SET_BACKGROUND_EQUIPMENT'; package: 'A' | 'B' };

export const defaultState: CharacterBuilderState = {
  draft: createDefaultCharacter(),
  currentStep: 0,
  mode: 'create',
  baseCharacterId: null,
  asiChoices: [],
  featChoices: [],
  expertiseChoices: {},
  metamagicChoices: {},
  invocationChoices: {},
  mysticArcanumChoices: {},
  stepValidations: {},
  useTashasRules: true,
  raceChoices: {},
  backgroundChoices: {},
  backgroundEquipmentPackage: null,
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
      const characterWithProgression = action.character as Partial<CharacterBase>;
      return { 
        ...state, 
        draft: { ...loadedDraft, ...action.character },
        asiChoices: (action.character as unknown as { asiChoices?: AsiChoice[] })?.asiChoices || [],
        featChoices: characterWithProgression.featChoices || [],
        expertiseChoices: characterWithProgression.expertiseChoices || {},
        metamagicChoices: characterWithProgression.metamagicChoices || {},
        invocationChoices: characterWithProgression.invocationChoices || {},
        mysticArcanumChoices: characterWithProgression.mysticArcanumChoices || {},
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
    case 'SET_FEAT_CHOICE': {
      const existingIndex = state.featChoices.findIndex(c => c.source === action.choice.source);
      if (existingIndex >= 0) {
        const updated = [...state.featChoices];
        updated[existingIndex] = action.choice;
        return { ...state, featChoices: updated };
      }
      return { ...state, featChoices: [...state.featChoices, action.choice] };
    }
    case 'REMOVE_FEAT_CHOICE':
      return { ...state, featChoices: state.featChoices.filter(c => c.source !== action.source) };
    case 'CLEAR_FEAT_CHOICES':
      return { ...state, featChoices: [] };
    case 'SET_EXPERTISE_CHOICE':
      return {
        ...state,
        expertiseChoices: {
          ...state.expertiseChoices,
          [action.source]: action.skills,
        },
      };
    case 'REMOVE_EXPERTISE_CHOICE': {
      const updated = { ...state.expertiseChoices };
      delete updated[action.source];
      return { ...state, expertiseChoices: updated };
    }
    case 'SET_METAMAGIC_CHOICE':
      return {
        ...state,
        metamagicChoices: {
          ...state.metamagicChoices,
          [action.source]: action.options,
        },
      };
    case 'REMOVE_METAMAGIC_CHOICE': {
      const updated = { ...state.metamagicChoices };
      delete updated[action.source];
      return { ...state, metamagicChoices: updated };
    }
    case 'SET_INVOCATION_CHOICE':
      return {
        ...state,
        invocationChoices: {
          ...state.invocationChoices,
          [action.source]: action.options,
        },
      };
    case 'REMOVE_INVOCATION_CHOICE': {
      const updated = { ...state.invocationChoices };
      delete updated[action.source];
      return { ...state, invocationChoices: updated };
    }
    case 'SET_MYSTIC_ARCANUM_CHOICE':
      return {
        ...state,
        mysticArcanumChoices: {
          ...state.mysticArcanumChoices,
          [action.source]: action.spellName,
        },
      };
    case 'REMOVE_MYSTIC_ARCANUM_CHOICE': {
      const updated = { ...state.mysticArcanumChoices };
      delete updated[action.source];
      return { ...state, mysticArcanumChoices: updated };
    }
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
    case 'SET_RACE_CHOICE':
      return {
        ...state,
        raceChoices: { ...state.raceChoices, [action.choiceType]: action.value }
      };
    case 'CLEAR_RACE_CHOICES':
      return { ...state, raceChoices: {} };
    case 'SET_BACKGROUND_CHOICE':
      return {
        ...state,
        backgroundChoices: { ...state.backgroundChoices, [action.choiceType]: action.value }
      };
    case 'CLEAR_BACKGROUND_CHOICES':
      return { ...state, backgroundChoices: {} };
    case 'SET_BACKGROUND_EQUIPMENT':
      return { ...state, backgroundEquipmentPackage: action.package };
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
