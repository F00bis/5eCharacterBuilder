import { renderHook } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { CharacterBuilderContext, defaultState, type CharacterBuilderContextType } from '../../../contexts/CharacterBuilderContextTypes';
import { calculateFinalAbilityScores, useReviewStep } from './ReviewStepContext';

describe('calculateFinalAbilityScores', () => {
  it('applies ASI bonuses from featChoices in review calculations', () => {
    const result = calculateFinalAbilityScores({
      baseAbilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      featChoices: [
        {
          source: 'Class (Fighter 4)',
          type: 'asi',
          asiBonuses: [
            { ability: 'strength', amount: 2 },
          ],
        },
      ],
    });

    expect(result.strength).toBe(12);
    expect(result.dexterity).toBe(10);
  });

  it('stacks ASI featChoices with feat and equipment modifiers', () => {
    const result = calculateFinalAbilityScores({
      baseAbilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      featChoices: [
        {
          source: 'Class (Fighter 4)',
          type: 'asi',
          asiBonuses: [
            { ability: 'strength', amount: 1 },
            { ability: 'dexterity', amount: 1 },
          ],
        },
      ],
      feats: [
        {
          statModifiers: {
            strength: 1,
          },
        },
      ],
      equipment: [
        {
          equipped: true,
          statModifiers: {
            strength: 1,
          },
        },
      ],
    });

    expect(result.strength).toBe(13);
    expect(result.dexterity).toBe(11);
  });
});

describe('useReviewStep', () => {
  it('sets initiative from final dexterity modifier in create mode', () => {
    const state = {
      ...defaultState,
      mode: 'create' as const,
      draft: {
        ...defaultState.draft,
        name: 'Initiative Test',
        baseAbilityScores: {
          ...defaultState.draft.baseAbilityScores,
          dexterity: 14,
        },
      },
    };

    const contextValue: CharacterBuilderContextType = {
      state,
      dispatch: vi.fn(),
      isComplete: true,
    };

    const wrapper = ({ children }: { children: ReactNode }) => createElement(
      MemoryRouter,
      null,
      createElement(CharacterBuilderContext.Provider, { value: contextValue }, children)
    );

    const { result } = renderHook(() => useReviewStep(), { wrapper });

    expect(result.current.finalCharacter.initiative).toBe(2);
  });
});
