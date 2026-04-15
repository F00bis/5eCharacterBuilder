import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import FeatChoiceResolver from './FeatChoiceResolver';
import type { FeatChoiceDefinition } from '../../../types/featChoices';

vi.mock('../../../db/spells', () => ({
  getCantripsByClass: vi.fn().mockResolvedValue([
    { name: 'Fire Bolt', level: 0, requiresAttackRoll: true, classes: ['Wizard'] },
    { name: 'Light', level: 0, requiresAttackRoll: false, classes: ['Wizard'] },
    { name: 'Mage Hand', level: 0, requiresAttackRoll: false, classes: ['Wizard'] },
  ]),
  getSpellsByClass: vi.fn().mockResolvedValue([
    { name: 'Shield', level: 1, ritual: false, classes: ['Wizard'] },
    { name: 'Find Familiar', level: 1, ritual: true, classes: ['Wizard'] },
    { name: 'Detect Magic', level: 1, ritual: true, classes: ['Wizard'] },
  ]),
}));

vi.mock('../../../db/equipment', () => ({
  getWeapons: vi.fn().mockResolvedValue([
    { name: 'Longbow' }, { name: 'Longsword' }, { name: 'Rapier' },
    { name: 'Hand Crossbow' }, { name: 'Battleaxe' },
  ]),
}));

describe('FeatChoiceResolver', () => {
  describe('damage-type choice', () => {
    const damageTypeChoice: FeatChoiceDefinition = {
      id: 'damageType', kind: 'damage-type', label: 'Damage Type', count: 1,
      options: ['acid', 'cold', 'fire', 'lightning', 'thunder'],
    };

    it('renders a dropdown with damage type options', () => {
      render(
        <FeatChoiceResolver
          choices={[damageTypeChoice]}
          currentSelections={{}}
          asiChoice=""
          onAsiChange={vi.fn()}
          onSelectionChange={vi.fn()}
        />
      );
      expect(screen.getByText('Damage Type')).toBeInTheDocument();
    });
  });

  describe('saving-throw linked to asi', () => {
    const savingThrowChoice: FeatChoiceDefinition = {
      id: 'savingThrow', kind: 'saving-throw', label: 'Saving Throw Proficiency',
      count: 1, linkedTo: 'asi',
    };

    it('shows auto-linked text when asi is selected', () => {
      render(
        <FeatChoiceResolver
          choices={[savingThrowChoice]}
          currentSelections={{}}
          asiChoice="wisdom"
          onAsiChange={vi.fn()}
          onSelectionChange={vi.fn()}
        />
      );
      expect(screen.getByText(/wisdom/i)).toBeInTheDocument();
    });
  });

  describe('weapon-proficiency multi-select', () => {
    const weaponChoice: FeatChoiceDefinition = {
      id: 'weapons', kind: 'weapon-proficiency', label: 'Weapon Proficiencies', count: 4,
    };

    it('renders 4 weapon selectors', async () => {
      render(
        <FeatChoiceResolver
          choices={[weaponChoice]}
          currentSelections={{}}
          asiChoice=""
          onAsiChange={vi.fn()}
          onSelectionChange={vi.fn()}
        />
      );
      await waitFor(() => {
        expect(screen.getByText('Weapon Proficiencies')).toBeInTheDocument();
      });
    });
  });

  describe('spell choices with linkedTo', () => {
    const spellChoices: FeatChoiceDefinition[] = [
      { id: 'spellList', kind: 'spell-list', label: 'Spell List', count: 1, options: ['Wizard', 'Cleric'] },
      { id: 'cantrips', kind: 'cantrip', label: 'Cantrips', count: 2, linkedTo: 'spellList' },
    ];

    it('disables cantrip selectors until spell list is chosen', async () => {
      render(
        <FeatChoiceResolver
          choices={spellChoices}
          currentSelections={{}}
          asiChoice=""
          onAsiChange={vi.fn()}
          onSelectionChange={vi.fn()}
        />
      );
      expect(screen.getByText('Select a spell list first')).toBeInTheDocument();
    });

    it('loads cantrips for the selected spell list', async () => {
      render(
        <FeatChoiceResolver
          choices={spellChoices}
          currentSelections={{ spellList: 'Wizard' }}
          asiChoice=""
          onAsiChange={vi.fn()}
          onSelectionChange={vi.fn()}
        />
      );
      await waitFor(() => {
        expect(screen.getByText('Cantrips 1')).toBeInTheDocument();
      });
    });
  });
});
