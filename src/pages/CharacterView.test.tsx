import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Character } from '../types';
import { CharacterView } from './CharacterView';

let mockQueryResult: Character | null | undefined = undefined;

vi.mock('dexie-react-hooks', () => ({
  useLiveQuery: () => mockQueryResult,
}));

vi.mock('../components/SpellsPanel', () => ({
  SpellsPanel: () => <div data-testid="spells-panel">Spells Panel</div>,
}));

function baseCharacter(overrides: Partial<Character> = {}): Character {
  const { abilityScores: overrideAbilityScores, baseAbilityScores: overrideBaseAbilityScores, ...rest } = overrides;
  const abilityScores = overrideAbilityScores ?? {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  };
  return {
    id: 1,
    name: 'Test Hero',
    race: 'Human',
    background: 'Soldier',
    alignment: 'Neutral',
    classes: [{ className: 'Fighter', level: 5 }],
    abilityScores,
    baseAbilityScores: overrideBaseAbilityScores ?? abilityScores,
    level: 5,
    xp: 3500,
    portrait: null,
    hp: 40,
    maxHp: 40,
    currentHp: 40,
    tempHp: 0,
    ac: 16,
    speed: 30,
    initiative: 0,
    vision: {},
    deathSaves: {successes: 0, failures: 0},
    proficiencyBonus: 3,
    skills: [],
    equipment: [],
    currency: {cp: 0, sp: 0, ep: 0, gp: 0, pp: 0},
    spellSlots: [],
    spells: [],
    statusEffects: [],
    feats: [],
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    raceStatSelections: [],
    featureChoices: {},
    hpRolls: [],
    hpBonus: 0,
    languages: [],
    toolProficiencies: [],
    raceChoices: {},
    backgroundChoices: {},
    ...rest,
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

      // STR appears in both ability scores panel and skills panel
      expect(screen.getAllByText('STR').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('16').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('DEX').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('14').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('CON').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('12').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('INT').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('8').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('WIS').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('13').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('CHA').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('10').length).toBeGreaterThanOrEqual(1);
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
      // Skills panel may also show these bonuses, so check they exist at least once
      expect(screen.getAllByText('+3').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('+2').length).toBeGreaterThanOrEqual(1);
      // +1 appears at least twice (CON and WIS)
      expect(screen.getAllByText('+1').length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText('-1').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1);
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
            statModifiers: { strength: 2 }, },
        ],
      });

      renderCharacterView();

      // base 14 + feat 2 = 16
      expect(screen.getAllByText('16').length).toBeGreaterThanOrEqual(1);
      // modifier for 16 is +3
      expect(screen.getAllByText('+3').length).toBeGreaterThanOrEqual(1);
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
            statModifiers: { constitution: 1 }, },
          {
            name: 'Observant',
            description: '+1 to Wisdom',
            statModifiers: { wisdom: 1 }, },
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
            statModifiers: { strength: 5 }, equippable: true, equipped: true,
          },
        ],
      });

      renderCharacterView();

      // base 14 + equipment 5 = 19
      expect(screen.getAllByText('19').length).toBeGreaterThanOrEqual(1);
      // modifier for 19 is +4
      expect(screen.getAllByText('+4').length).toBeGreaterThanOrEqual(1);
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
            statModifiers: { strength: 4 }, equippable: true, equipped: true,
          },
          {
            name: 'Amulet of Health',
            rarity: 'rare',
            weight: 1,
            description: 'Increases constitution',
            statModifiers: { constitution: 4 }, equippable: true, equipped: true,
          },
        ],
      });

      renderCharacterView();

      // STR: 10 + 4 = 14, CON: 10 + 4 = 14
      // Skills panel may also show these values, so check at least 2
      expect(screen.getAllByText('14').length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText('+2').length).toBeGreaterThanOrEqual(2);
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
            statModifiers: { constitution: 1 }, },
          {
            name: 'Actor',
            description: '+1 to Charisma',
            statModifiers: { charisma: 1 }, },
        ],
        equipment: [
          {
            name: 'Gauntlets of Ogre Power',
            rarity: 'uncommon',
            weight: 1,
            description: 'Increases strength',
            statModifiers: { strength: 5 }, equippable: true, equipped: true,
          },
          {
            name: 'Headband of Intellect',
            rarity: 'uncommon',
            weight: 1,
            description: 'Increases intelligence',
            statModifiers: { intelligence: 11 }, equippable: true, equipped: true,
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
      expect(screen.getAllByText('12').length).toBeGreaterThanOrEqual(1);
      // CON: 13 + 1 (feat) = 14 -> +2
      expect(screen.getAllByText('14').length).toBeGreaterThanOrEqual(1);
      // WIS: 10 (no bonuses) -> 0
      // CHA: 15 + 1 (feat) = 16 -> +3
      expect(screen.getAllByText('16').length).toBeGreaterThanOrEqual(1);
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
            statModifiers: { strength: 1 }, },
        ],
        equipment: [
          {
            name: 'Belt of Hill Giant Strength',
            rarity: 'rare',
            weight: 2,
            description: 'Increases strength',
            statModifiers: { strength: 7 }, equippable: true, equipped: true,
          },
        ],
      });

      renderCharacterView();

      // STR: 12 + 1 (feat) + 7 (equipment) = 20 -> +5
      expect(screen.getAllByText('20').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('+5').length).toBeGreaterThanOrEqual(1);
    });

    it('renders the character name', () => {
      mockQueryResult = baseCharacter({ name: 'Aragorn' });

      renderCharacterView();

      expect(screen.getAllByText('Aragorn').length).toBeGreaterThan(0);
    });

    it('shows not found for missing character', () => {
      mockQueryResult = null;

      renderCharacterView('999');

      expect(screen.getByText('Character not found')).toBeInTheDocument();
    });
  });

  describe('skills panel integration', () => {
    it('renders the skills panel alongside ability scores', () => {
      mockQueryResult = baseCharacter({
        skills: [
          { skill: 'athletics', ability: 'strength', level: 'proficient' },
          { skill: 'perception', ability: 'wisdom', level: 'proficient' },
        ],
      });

      renderCharacterView();

      // Check that both panels are rendered
      expect(screen.getAllByText('STR').length).toBeGreaterThanOrEqual(1); // Ability scores panel + skills panel
      expect(screen.getByText('Skills')).toBeInTheDocument(); // Skills panel header
      expect(screen.getByText('Athletics')).toBeInTheDocument(); // Skill in panel
    });

    it('displays skill bonuses correctly with proficiency', () => {
      mockQueryResult = baseCharacter({
        abilityScores: {
          strength: 16, // +3
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 14, // +2
          charisma: 10,
        },
        proficiencyBonus: 3,
        skills: [
          { skill: 'athletics', ability: 'strength', level: 'proficient' },
          { skill: 'perception', ability: 'wisdom', level: 'expertise' },
        ],
      });

      renderCharacterView();

      // Athletics: +3 (ability) + 3 (proficiency) = +6
      const athleticsElements = screen.getAllByText('Athletics');
      expect(athleticsElements[0].closest('div')?.textContent).toContain('+6');

      // Perception: +2 (ability) + 6 (expertise) = +8
      const perceptionElements = screen.getAllByText('Perception');
      expect(perceptionElements[0].closest('div')?.textContent).toContain('+8');
    });
  });

  describe('tooltip breakdown content', () => {
    it('displays ability scores correctly', () => {
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

      expect(screen.getAllByText('16').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('14').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('12').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('8').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('13').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('10').length).toBeGreaterThanOrEqual(1);
    });

    it('displays ability modifiers correctly', () => {
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

      expect(screen.getAllByText('+3').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('+2').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('+1').length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText('-1').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('ability score overrides', () => {
    it('overrides ability score when override exceeds computed total', () => {
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
            description: 'Your Strength score is 19 while you wear these gauntlets.',
            abilityOverride: { strength: 19 }, equippable: true, equipped: true,
          },
        ],
      });

      renderCharacterView();

      // STR base 14, override to 19
      expect(screen.getAllByText('19').length).toBeGreaterThanOrEqual(1);
      // modifier for 19 is +4
      expect(screen.getAllByText('+4').length).toBeGreaterThanOrEqual(1);
    });

    it('does not override when computed total already exceeds override value', () => {
      mockQueryResult = baseCharacter({
        abilityScores: {
          strength: 20,
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
            description: 'Your Strength score is 19 while you wear these gauntlets.',
            abilityOverride: { strength: 19 }, equippable: true, equipped: true,
          },
        ],
      });

      renderCharacterView();

      // STR stays at 20 since 20 > 19
      expect(screen.getAllByText('20').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('+5').length).toBeGreaterThanOrEqual(1);
    });

    it('picks the highest override when multiple items override the same ability', () => {
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
            name: 'Gauntlets of Ogre Power',
            rarity: 'uncommon',
            weight: 1,
            description: 'Your Strength score is 19.',
            abilityOverride: { strength: 19 }, equippable: true, equipped: true,
          },
          {
            name: 'Belt of Fire Giant Strength',
            rarity: 'veryRare',
            weight: 2,
            description: 'Your Strength score is 25.',
            abilityOverride: { strength: 25 }, equippable: true, equipped: true,
          },
        ],
      });

      renderCharacterView();

      // Highest override wins: 25
      expect(screen.getAllByText('25').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('+7').length).toBeGreaterThanOrEqual(1);
    });

    it('stacks feat bonuses on top of override', () => {
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
            name: 'Heavy Armor Master',
            description: '+1 to Strength',
            statModifiers: { strength: 1 }, },
        ],
        equipment: [
          {
            name: 'Gauntlets of Ogre Power',
            rarity: 'uncommon',
            weight: 1,
            description: 'Your Strength score is 19.',
            abilityOverride: { strength: 19 }, equippable: true, equipped: true,
          },
        ],
      });

      renderCharacterView();

      // Override 19 + feat +1 = 20 (beats base 14 + feat 1 = 15)
      expect(screen.getAllByText('20').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('+5').length).toBeGreaterThanOrEqual(1);
    });

    it('stacks multiple feat bonuses on top of override', () => {
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
            name: 'Heavy Armor Master',
            description: '+1 to Strength',
            statModifiers: { strength: 1 }, },
          {
            name: 'Tavern Brawler',
            description: '+1 to Strength',
            statModifiers: { strength: 1 }, },
        ],
        equipment: [
          {
            name: 'Gauntlets of Ogre Power',
            rarity: 'uncommon',
            weight: 1,
            description: 'Your Strength score is 19.',
            abilityOverride: { strength: 19 }, equippable: true, equipped: true,
          },
        ],
      });

      renderCharacterView();

      // Override 19 + feat 1 + feat 1 = 21 (beats base 10 + 1 + 1 = 12)
      expect(screen.getAllByText('21').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('+5').length).toBeGreaterThanOrEqual(1);
    });

    it('does not use override when base + feats already exceed override + feats', () => {
      mockQueryResult = baseCharacter({
        abilityScores: {
          strength: 18,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
        },
        feats: [
          {
            name: 'Heavy Armor Master',
            description: '+1 to Strength',
            statModifiers: { strength: 1 }, },
        ],
        equipment: [
          {
            name: 'Gauntlets of Ogre Power',
            rarity: 'uncommon',
            weight: 1,
            description: 'Your Strength score is 19.',
            abilityOverride: { strength: 19 }, equippable: true, equipped: true,
          },
        ],
      });

      renderCharacterView();

      // base 18 + feat 1 = 19, override 19 + feat 1 = 20
      // Override wins: 20
      expect(screen.getAllByText('20').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('+5').length).toBeGreaterThanOrEqual(1);
    });

    it('uses base when base + feats exceed override + feats', () => {
      mockQueryResult = baseCharacter({
        abilityScores: {
          strength: 20,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
        },
        feats: [
          {
            name: 'Heavy Armor Master',
            description: '+1 to Strength',
            statModifiers: { strength: 1 }, },
        ],
        equipment: [
          {
            name: 'Gauntlets of Ogre Power',
            rarity: 'uncommon',
            weight: 1,
            description: 'Your Strength score is 19.',
            abilityOverride: { strength: 19 }, equippable: true, equipped: true,
          },
        ],
      });

      renderCharacterView();

      // base 20 + feat 1 = 21, override 19 + feat 1 = 20
      // Base path wins: 21
      expect(screen.getAllByText('21').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('+5').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('ability score override calculations', () => {
    it('applies override and shows correct score when override exceeds computed total', () => {
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
            name: 'Heavy Armor Master',
            description: '+1 to Strength',
            statModifiers: { strength: 1 }, },
        ],
        equipment: [
          {
            name: 'Gauntlets of Ogre Power',
            rarity: 'uncommon',
            weight: 1,
            description: 'Your Strength score is 19.',
            abilityOverride: { strength: 19 }, equippable: true, equipped: true,
          },
        ],
      });

      renderCharacterView();

      expect(screen.getAllByText('20').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('+5').length).toBeGreaterThanOrEqual(1);
    });

    it('shows correct score when override does not apply', () => {
      mockQueryResult = baseCharacter({
        abilityScores: {
          strength: 20,
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
            description: 'Your Strength score is 19.',
            abilityOverride: { strength: 19 }, equippable: true, equipped: true,
          },
        ],
      });

      renderCharacterView();

      expect(screen.getAllByText('20').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('+5').length).toBeGreaterThanOrEqual(1);
    });

    it('applies override only to the affected ability', () => {
      mockQueryResult = baseCharacter({
        abilityScores: {
          strength: 14,
          dexterity: 10,
          constitution: 13,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
        },
        feats: [
          {
            name: 'Resilient',
            description: '+1 to Constitution',
            statModifiers: { constitution: 1 }, },
        ],
        equipment: [
          {
            name: 'Gauntlets of Ogre Power',
            rarity: 'uncommon',
            weight: 1,
            description: 'Your Strength score is 19.',
            abilityOverride: { strength: 19 }, equippable: true, equipped: true,
          },
        ],
      });

      renderCharacterView();

      expect(screen.getAllByText('19').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('14').length).toBeGreaterThanOrEqual(1);
    });
  });
});

describe('CharacterView tabbed right column layout', () => {
  afterEach(() => {
    mockQueryResult = undefined;
  });

  it('renders three tab buttons with correct labels', () => {
    mockQueryResult = baseCharacter();
    renderCharacterView();

    expect(screen.getByRole('tab', { name: 'Features' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Inventory' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Spellbook' })).toBeInTheDocument();
  });

  it('only mounts one panel at a time', () => {
    mockQueryResult = baseCharacter();
    renderCharacterView();

    // Default active tab is Features; FeaturesPanel heading + tab button = 2 matches
    expect(screen.queryAllByText('Features')).toHaveLength(2);
    // InventoryPanel root heading
    expect(screen.queryByRole('heading', { name: 'Inventory' })).not.toBeInTheDocument();
    // Mocked SpellsPanel
    expect(screen.queryByTestId('spells-panel')).not.toBeInTheDocument();
  });

  it('clicking Inventory tab renders InventoryPanel', () => {
    mockQueryResult = baseCharacter();
    renderCharacterView();

    fireEvent.click(screen.getByRole('tab', { name: 'Inventory' }));

    expect(screen.getByRole('heading', { name: 'Inventory' })).toBeInTheDocument();
    // Features tab button remains; panel heading is gone
    expect(screen.queryAllByText('Features')).toHaveLength(1);
    expect(screen.queryByTestId('spells-panel')).not.toBeInTheDocument();
  });

  it('clicking Spellbook tab renders SpellsPanel', () => {
    mockQueryResult = baseCharacter();
    renderCharacterView();

    fireEvent.click(screen.getByRole('tab', { name: 'Spellbook' }));

    expect(screen.getByTestId('spells-panel')).toBeInTheDocument();
    // Features tab button remains; panel heading is gone
    expect(screen.queryAllByText('Features')).toHaveLength(1);
    expect(screen.queryByRole('heading', { name: 'Inventory' })).not.toBeInTheDocument();
  });

  it('clicking Features tab renders FeaturesPanel', () => {
    mockQueryResult = baseCharacter();
    renderCharacterView();

    fireEvent.click(screen.getByRole('tab', { name: 'Inventory' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Features' }));

    // Features tab button + panel heading = 2 matches
    expect(screen.queryAllByText('Features')).toHaveLength(2);
    expect(screen.queryByRole('heading', { name: 'Inventory' })).not.toBeInTheDocument();
    expect(screen.queryByTestId('spells-panel')).not.toBeInTheDocument();
  });

  it('active tab has distinct styling and inactive tabs do not', () => {
    mockQueryResult = baseCharacter();
    renderCharacterView();

    const featuresTab = screen.getByRole('tab', { name: 'Features' });
    const invTab = screen.getByRole('tab', { name: 'Inventory' });
    const spellbookTab = screen.getByRole('tab', { name: 'Spellbook' });

    // Features is active by default
    expect(featuresTab).toHaveClass('bg-slate-700');
    expect(featuresTab).toHaveClass('text-white');
    expect(invTab).not.toHaveClass('bg-slate-700');
    expect(invTab).not.toHaveClass('text-white');
    expect(spellbookTab).not.toHaveClass('bg-slate-700');
    expect(spellbookTab).not.toHaveClass('text-white');

    fireEvent.click(invTab);

    expect(invTab).toHaveClass('bg-slate-700');
    expect(invTab).toHaveClass('text-white');
    expect(featuresTab).not.toHaveClass('bg-slate-700');
    expect(featuresTab).not.toHaveClass('text-white');
  });
});

describe('CharacterView tab persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    mockQueryResult = undefined;
  });

  afterEach(() => {
    localStorage.clear();
    mockQueryResult = undefined;
  });

  it('defaults to features when no stored value', () => {
    mockQueryResult = baseCharacter();
    renderCharacterView();

    // Features active: tab button + panel heading = 2 matches
    expect(screen.queryAllByText('Features')).toHaveLength(2);
    // Inventory inactive: only tab button = 1 match
    expect(screen.queryAllByText('Inventory')).toHaveLength(1);
  });

  it('reads stored tab on mount — stored "spellbook" activates Spellbook', () => {
    mockQueryResult = baseCharacter({ id: 1 });
    localStorage.setItem('char-tabs-1', 'spellbook');
    renderCharacterView();

    expect(screen.getByTestId('spells-panel')).toBeInTheDocument();
    // Features inactive: only tab button = 1 match
    expect(screen.queryAllByText('Features')).toHaveLength(1);
  });

  it('reads stored tab on mount — stored "inventory" activates Inventory', () => {
    mockQueryResult = baseCharacter({ id: 1 });
    localStorage.setItem('char-tabs-1', 'inventory');
    renderCharacterView();

    // Inventory active: tab button + panel heading = 2 matches
    expect(screen.queryAllByText('Inventory')).toHaveLength(2);
    // Features inactive: only tab button = 1 match
    expect(screen.queryAllByText('Features')).toHaveLength(1);
  });

  it('writes tab key to localStorage when tab is changed', () => {
    mockQueryResult = baseCharacter({ id: 1 });
    renderCharacterView();

    fireEvent.click(screen.getByRole('tab', { name: 'Inventory' }));

    expect(localStorage.getItem('char-tabs-1')).toBe('inventory');
  });

  it('keys storage by character.id to avoid cross-character pollution', () => {
    mockQueryResult = baseCharacter({ id: 2 });
    localStorage.setItem('char-tabs-1', 'spellbook');
    renderCharacterView();

    // Character 2 should default to features, not use character 1's stored tab
    expect(screen.queryAllByText('Features')).toHaveLength(2);
    expect(screen.queryByTestId('spells-panel')).not.toBeInTheDocument();
  });

  it('ignores invalid stored values and defaults to features', () => {
    mockQueryResult = baseCharacter({ id: 1 });
    localStorage.setItem('char-tabs-1', 'invalid-tab');
    renderCharacterView();

    // Features active: tab button + panel heading = 2 matches
    expect(screen.queryAllByText('Features')).toHaveLength(2);
  });
});

describe('CharacterView right-column loading state', () => {
  afterEach(() => {
    mockQueryResult = undefined;
  });

  it('shows skeleton in right column when isLoading is true, not the tab bar', () => {
    mockQueryResult = undefined;
    renderCharacterView();

    expect(screen.getByLabelText('Loading character panel')).toBeInTheDocument();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('shows tab bar when isLoading is false', () => {
    mockQueryResult = baseCharacter();
    renderCharacterView();

    expect(screen.queryByLabelText('Loading character panel')).not.toBeInTheDocument();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });
});

describe('CharacterView tab ARIA roles', () => {
  afterEach(() => {
    mockQueryResult = undefined;
  });

  it('tab list has role="tablist"', () => {
    mockQueryResult = baseCharacter();
    renderCharacterView();

    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('each tab button has role="tab" and aria-selected', () => {
    mockQueryResult = baseCharacter();
    renderCharacterView();

    const featuresTab = screen.getByRole('tab', { name: 'Features' });
    expect(featuresTab).toHaveAttribute('aria-selected', 'true');

    const invTab = screen.getByRole('tab', { name: 'Inventory' });
    expect(invTab).toHaveAttribute('aria-selected', 'false');

    const spellbookTab = screen.getByRole('tab', { name: 'Spellbook' });
    expect(spellbookTab).toHaveAttribute('aria-selected', 'false');
  });
});
