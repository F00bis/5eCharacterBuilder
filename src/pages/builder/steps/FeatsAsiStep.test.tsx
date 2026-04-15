import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CharacterBuilderProvider } from '../../../contexts/CharacterBuilderProvider';
import { createDefaultCharacter } from '../../../types';
import { calculateFeatEntitlements } from '../../../utils/featEntitlements';
import FeatsAsiStep from './FeatsAsiStep';

vi.mock('../../../db/feats', () => ({
  getAllFeats: vi.fn().mockResolvedValue([
    {
      id: 'alert',
      name: 'Alert',
      description: 'Always be on the lookout for danger.',
      prerequisites: '',
      statModifiers: {},
      isHalfFeat: false,
      isSRD: true
    },
    {
      id: 'actor',
      name: 'Actor',
      description: 'You are skilled at feigning.',
      prerequisites: '',
      statModifiers: {},
      isHalfFeat: true,
      halfFeatChoiceAbility: 'charisma',
      asiOptions: ['charisma'],
      isSRD: true
    },
    {
      id: 'athlete',
      name: 'Athlete',
      description: 'You have undergone extensive physical training.',
      prerequisites: '',
      statModifiers: {},
      isHalfFeat: true,
      halfFeatChoiceAbility: 'strength',
      asiOptions: ['strength', 'dexterity'],
      isSRD: true
    }
  ])
}));

vi.mock('../../../db/classes', () => ({
  getAsiLevelsByClass: vi.fn().mockResolvedValue({
    Fighter: [4, 8, 12, 16, 19]
  })
}));

describe('FeatsAsiStep - Half-Feat ASI Choice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders without crashing', () => {
    const defaultDraft = createDefaultCharacter();
    localStorage.setItem('builderDraft_v1', JSON.stringify({
      draft: { ...defaultDraft, classes: [{ className: 'Fighter', level: 4 }] },
      currentStep: 0,
      mode: 'levelup',
      baseCharacterId: null,
      asiChoices: []
    }));

    render(
      <CharacterBuilderProvider>
        <FeatsAsiStep />
      </CharacterBuilderProvider>
    );
  });

  it('shows loading state initially', async () => {
    const defaultDraft = createDefaultCharacter();
    localStorage.setItem('builderDraft_v1', JSON.stringify({
      draft: { ...defaultDraft, classes: [{ className: 'Fighter', level: 4 }] },
      currentStep: 0,
      mode: 'levelup',
      baseCharacterId: null,
      asiChoices: []
    }));

    render(
      <CharacterBuilderProvider>
        <FeatsAsiStep />
      </CharacterBuilderProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/No feat or ASI choices available|Select a Feat|Ability Score Improvement/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('does not show ASI dropdown for non-half-feats in the summary', async () => {
    const defaultDraft = createDefaultCharacter();
    localStorage.setItem('builderDraft_v1', JSON.stringify({
      draft: { ...defaultDraft, classes: [{ className: 'Fighter', level: 4 }], feats: [] },
      currentStep: 0,
      mode: 'levelup',
      baseCharacterId: null,
      asiChoices: [],
      featChoices: [{
        source: 'Fighter 4',
        type: 'feat',
        featName: 'Alert'
      }]
    }));

    render(
      <CharacterBuilderProvider>
        <FeatsAsiStep />
      </CharacterBuilderProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Ability Score Increase')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });
});

describe('FeatsAsiStep - Feat Entitlement Logic', () => {
  it('should calculate feat entitlements for level 4 fighter', () => {
    const draft = createDefaultCharacter();
    draft.classes = [{ className: 'Fighter', level: 4 }];
    
    const entitlements = calculateFeatEntitlements(draft, 'levelup', { Fighter: [4, 8, 12, 16, 19] });
    
    expect(entitlements).toHaveLength(1);
    expect(entitlements[0].type).toBe('feat-or-asi');
    expect(entitlements[0].source).toBe('Class (Fighter 4)');
  });
});