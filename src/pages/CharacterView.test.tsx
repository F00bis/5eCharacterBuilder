import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CharacterView } from './CharacterView';
import type { Character } from '../types';

let mockQueryResult: Character | null | undefined = undefined;

vi.mock('dexie-react-hooks', () => ({
  useLiveQuery: () => mockQueryResult,
}));

function baseCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: 1,
    name: 'Test Hero',
    race: 'Human',
    background: 'Soldier',
    alignment: 'Neutral',
    classes: [{ className: 'Fighter', level: 5 }],
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    level: 5,
    hp: 40,
    maxHp: 40,
    currentHp: 40,
    tempHp: 0,
    ac: 16,
    speed: 30,
    proficiencyBonus: 3,
    skills: [],
    equipment: [],
    spellSlots: [],
    spells: [],
    feats: [],
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function renderCharacterView(characterId = '1') {
  return render(
    <MemoryRouter initialEntries={[`/characters/${characterId}`]}>
      <Routes>
        <Route path="/characters/:characterId" element={<CharacterView />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('CharacterView ability scores section', () => {
  afterEach(() => {
    mockQueryResult = undefined;
  });

  describe('base stats only', () => {
    it('displays all six ability scores with correct totals', () => {
      mockQueryResult = baseCharacter({
        abilityScores: {
          strength: 16,
          dexterity: 14,
          constitution: 12,
          intelligence: 8,
          wisdom: 13,
          charisma: 10,
        },
      });

      renderCharacterView();

      expect(screen.getByText('STR')).toBeInTheDocument();
      expect(screen.getByText('16')).toBeInTheDocument();
      expect(screen.getByText('DEX')).toBeInTheDocument();
      expect(screen.getByText('14')).toBeInTheDocument();
      expect(screen.getByText('CON')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('INT')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('WIS')).toBeInTheDocument();
      expect(screen.getByText('13')).toBeInTheDocument();
      expect(screen.getByText('CHA')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('displays correct modifiers for base stats', () => {
      mockQueryResult = baseCharacter({
        abilityScores: {
          strength: 16,
          dexterity: 14,
          constitution: 12,
          intelligence: 8,
          wisdom: 13,
          charisma: 10,
        },
      });

      renderCharacterView();

      // STR 16 -> +3, DEX 14 -> +2, CON 12 -> +1, INT 8 -> -1, WIS 13 -> +1, CHA 10 -> 0
      expect(screen.getByText('+3')).toBeInTheDocument();
      expect(screen.getByText('+2')).toBeInTheDocument();
      // +1 appears twice (CON and WIS)
      expect(screen.getAllByText('+1')).toHaveLength(2);
      expect(screen.getByText('-1')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('feats that increase stats', () => {
    it('adds feat bonuses to ability score totals', () => {
      mockQueryResult = baseCharacter({
        abilityScores: {
          strength: 14,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
        },
        feats: [
          {
            name: 'Resilient',
            description: '+1 to Strength',
            statModifiers: { strength: 2 },
          },
        ],
      });

      renderCharacterView();

      // base 14 + feat 2 = 16
      expect(screen.getByText('16')).toBeInTheDocument();
      // modifier for 16 is +3
      expect(screen.getByText('+3')).toBeInTheDocument();
    });

    it('applies multiple feats to different abilities', () => {
      mockQueryResult = baseCharacter({
        abilityScores: {
          strength: 10,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
        },
        feats: [
          {
            name: 'Resilient',
            description: '+1 to Constitution',
            statModifiers: { constitution: 1 },
          },
          {
            name: 'Observant',
            description: '+1 to Wisdom',
            statModifiers: { wisdom: 1 },
          },
        ],
      });

      renderCharacterView();

      // CON: base 10 + 1 = 11, WIS: base 10 + 1 = 11
      expect(screen.getAllByText('11')).toHaveLength(2);
    });
  });

  describe('equipment that increases stats', () => {
    it('adds magic item bonuses to ability score totals', () => {
      mockQueryResult = baseCharacter({
        abilityScores: {
          strength: 14,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
        },
        equipment: [
          {
            name: 'Gauntlets of Ogre Power',
            rarity: 'uncommon',
            weight: 1,
            description: 'Increases strength',
            statModifiers: { strength: 5 },
          },
        ],
      });

      renderCharacterView();

      // base 14 + equipment 5 = 19
      expect(screen.getByText('19')).toBeInTheDocument();
      // modifier for 19 is +4
      expect(screen.getByText('+4')).toBeInTheDocument();
    });

    it('applies equipment bonuses to multiple abilities', () => {
      mockQueryResult = baseCharacter({
        abilityScores: {
          strength: 10,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
        },
        equipment: [
          {
            name: 'Belt of Giant Strength',
            rarity: 'rare',
            weight: 2,
            description: 'Increases strength',
            statModifiers: { strength: 4 },
          },
          {
            name: 'Amulet of Health',
            rarity: 'rare',
            weight: 1,
            description: 'Increases constitution',
            statModifiers: { constitution: 4 },
          },
        ],
      });

      renderCharacterView();

      // STR: 10 + 4 = 14, CON: 10 + 4 = 14
      expect(screen.getAllByText('14')).toHaveLength(2);
      expect(screen.getAllByText('+2')).toHaveLength(2);
    });
  });

  describe('combination of base stats, feats, and equipment', () => {
    it('aggregates base score, feat, and equipment bonuses correctly', () => {
      mockQueryResult = baseCharacter({
        abilityScores: {
          strength: 14,
          dexterity: 12,
          constitution: 13,
          intelligence: 8,
          wisdom: 10,
          charisma: 15,
        },
        feats: [
          {
            name: 'Resilient',
            description: '+1 to Constitution',
            statModifiers: { constitution: 1 },
          },
          {
            name: 'Actor',
            description: '+1 to Charisma',
            statModifiers: { charisma: 1 },
          },
        ],
        equipment: [
          {
            name: 'Gauntlets of Ogre Power',
            rarity: 'uncommon',
            weight: 1,
            description: 'Increases strength',
            statModifiers: { strength: 5 },
          },
          {
            name: 'Headband of Intellect',
            rarity: 'uncommon',
            weight: 1,
            description: 'Increases intelligence',
            statModifiers: { intelligence: 11 },
          },
        ],
      });

      renderCharacterView();

      // STR: 14 + 5 (equipment) = 19, INT: 8 + 11 (equipment) = 19
      // Both score boxes show 19, plus tooltips repeat it -> use getAllByText
      expect(screen.getAllByText('19').length).toBeGreaterThanOrEqual(2);
      // +4 appears for both STR and INT
      expect(screen.getAllByText('+4').length).toBeGreaterThanOrEqual(2);
      // DEX: 12 (no bonuses) -> +1
      expect(screen.getByText('12')).toBeInTheDocument();
      // CON: 13 + 1 (feat) = 14 -> +2
      expect(screen.getByText('14')).toBeInTheDocument();
      // WIS: 10 (no bonuses) -> 0
      // CHA: 15 + 1 (feat) = 16 -> +3
      expect(screen.getByText('16')).toBeInTheDocument();
    });

    it('stacks multiple sources on the same ability', () => {
      mockQueryResult = baseCharacter({
        abilityScores: {
          strength: 12,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
        },
        feats: [
          {
            name: 'Resilient',
            description: '+1 to Strength',
            statModifiers: { strength: 1 },
          },
        ],
        equipment: [
          {
            name: 'Belt of Hill Giant Strength',
            rarity: 'rare',
            weight: 2,
            description: 'Increases strength',
            statModifiers: { strength: 7 },
          },
        ],
      });

      renderCharacterView();

      // STR: 12 + 1 (feat) + 7 (equipment) = 20 -> +5
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('+5')).toBeInTheDocument();
    });

    it('renders the character name', () => {
      mockQueryResult = baseCharacter({ name: 'Aragorn' });

      renderCharacterView();

      expect(screen.getByText('Aragorn')).toBeInTheDocument();
    });

    it('shows not found for missing character', () => {
      mockQueryResult = null;

      renderCharacterView('999');

      expect(screen.getByText('Character not found')).toBeInTheDocument();
    });
  });

  describe('tooltip breakdown content', () => {
    function getTooltip(abilityAbbr: string): HTMLElement {
      const box = screen.getByText(abilityAbbr).closest('.group')!;
      // The tooltip is the second child div (after the box face)
      return box.querySelector(':scope > div:last-child')!;
    }

    it('shows full ability name, total, and base score for base-only stats', () => {
      mockQueryResult = baseCharacter({
        abilityScores: {
          strength: 16,
          dexterity: 14,
          constitution: 12,
          intelligence: 8,
          wisdom: 13,
          charisma: 10,
        },
      });

      renderCharacterView();

      const strTooltip = getTooltip('STR');
      expect(within(strTooltip).getByText('Strength: 16')).toBeInTheDocument();
      expect(within(strTooltip).getByText('Base: 16')).toBeInTheDocument();

      const intTooltip = getTooltip('INT');
      expect(within(intTooltip).getByText('Intelligence: 8')).toBeInTheDocument();
      expect(within(intTooltip).getByText('Base: 8')).toBeInTheDocument();
    });

    it('shows no source lines when there are no bonuses', () => {
      mockQueryResult = baseCharacter({
        abilityScores: {
          strength: 10,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
        },
      });

      renderCharacterView();

      const tooltip = getTooltip('STR');
      // Header + divider + base line = 3 elements. No source lines.
      const lines = tooltip.querySelectorAll('.text-gray-700');
      expect(lines).toHaveLength(1); // only "Base: 10"
    });

    it('shows feat source lines in the tooltip', () => {
      mockQueryResult = baseCharacter({
        abilityScores: {
          strength: 14,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
        },
        feats: [
          {
            name: 'Resilient',
            description: '+2 to Strength',
            statModifiers: { strength: 2 },
          },
        ],
      });

      renderCharacterView();

      const tooltip = getTooltip('STR');
      expect(within(tooltip).getByText('Strength: 16')).toBeInTheDocument();
      expect(within(tooltip).getByText('Base: 14')).toBeInTheDocument();
      expect(within(tooltip).getByText('Resilient (feat): +2')).toBeInTheDocument();
    });

    it('shows equipment source lines in the tooltip', () => {
      mockQueryResult = baseCharacter({
        abilityScores: {
          strength: 14,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
        },
        equipment: [
          {
            name: 'Gauntlets of Ogre Power',
            rarity: 'uncommon',
            weight: 1,
            description: 'Increases strength',
            statModifiers: { strength: 5 },
          },
        ],
      });

      renderCharacterView();

      const tooltip = getTooltip('STR');
      expect(within(tooltip).getByText('Strength: 19')).toBeInTheDocument();
      expect(within(tooltip).getByText('Base: 14')).toBeInTheDocument();
      expect(within(tooltip).getByText('Gauntlets of Ogre Power (equipment): +5')).toBeInTheDocument();
    });

    it('shows both feat and equipment source lines in the tooltip', () => {
      mockQueryResult = baseCharacter({
        abilityScores: {
          strength: 12,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
        },
        feats: [
          {
            name: 'Resilient',
            description: '+1 to Strength',
            statModifiers: { strength: 1 },
          },
        ],
        equipment: [
          {
            name: 'Belt of Hill Giant Strength',
            rarity: 'rare',
            weight: 2,
            description: 'Increases strength',
            statModifiers: { strength: 7 },
          },
        ],
      });

      renderCharacterView();

      const tooltip = getTooltip('STR');
      expect(within(tooltip).getByText('Strength: 20')).toBeInTheDocument();
      expect(within(tooltip).getByText('Base: 12')).toBeInTheDocument();
      expect(within(tooltip).getByText('Resilient (feat): +1')).toBeInTheDocument();
      expect(within(tooltip).getByText('Belt of Hill Giant Strength (equipment): +7')).toBeInTheDocument();
    });

    it('shows correct tooltip content for each ability independently', () => {
      mockQueryResult = baseCharacter({
        abilityScores: {
          strength: 10,
          dexterity: 10,
          constitution: 13,
          intelligence: 10,
          wisdom: 10,
          charisma: 15,
        },
        feats: [
          {
            name: 'Resilient',
            description: '+1 to Constitution',
            statModifiers: { constitution: 1 },
          },
          {
            name: 'Actor',
            description: '+1 to Charisma',
            statModifiers: { charisma: 1 },
          },
        ],
      });

      renderCharacterView();

      const conTooltip = getTooltip('CON');
      expect(within(conTooltip).getByText('Constitution: 14')).toBeInTheDocument();
      expect(within(conTooltip).getByText('Base: 13')).toBeInTheDocument();
      expect(within(conTooltip).getByText('Resilient (feat): +1')).toBeInTheDocument();

      const chaTooltip = getTooltip('CHA');
      expect(within(chaTooltip).getByText('Charisma: 16')).toBeInTheDocument();
      expect(within(chaTooltip).getByText('Base: 15')).toBeInTheDocument();
      expect(within(chaTooltip).getByText('Actor (feat): +1')).toBeInTheDocument();

      // STR has no bonuses, tooltip should only show base
      const strTooltip = getTooltip('STR');
      expect(within(strTooltip).getByText('Strength: 10')).toBeInTheDocument();
      expect(within(strTooltip).getByText('Base: 10')).toBeInTheDocument();
      const strSourceLines = strTooltip.querySelectorAll('.text-gray-700');
      expect(strSourceLines).toHaveLength(1);
    });
  });
});
