import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Character, Ability, RaceStatSelection } from '../../../types';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { addCharacter } from '../../../db/characters';
import { updateCharacter } from '../../../db/characters';
import { getModifier } from '../../../utils/abilityScores';
import { getArmorClass } from '../../../utils/armorClass';
import type { ArmorClassBreakdown } from '../../../utils/armorClass';

const ABILITY_ORDER: Ability[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

interface PartialCharacterDraft {
  name?: string;
  race?: string;
  baseAbilityScores?: { [K in Ability]?: number };
  classes?: { className: string; level: number }[];
  level?: number;
  hpRolls?: number[];
  hpBonus?: number;
  equipment?: { equipped?: boolean; statModifiers?: Partial<Record<Ability, number>> }[];
  feats?: { statModifiers?: Partial<Record<Ability, number>> }[];
  raceStatSelections?: RaceStatSelection[];
}

function calculateRaceBonus(draft: PartialCharacterDraft): Record<Ability, number> {
  const bonus: Record<Ability, number> = { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 };
  const selections = draft.raceStatSelections;
  if (selections) {
    for (const selection of selections) {
      bonus[selection.ability] = selection.amount;
    }
  }
  return bonus;
}

export function calculateFinalAbilityScores(draft: PartialCharacterDraft): Record<Ability, number> {
  const base = draft.baseAbilityScores ?? {} as Record<Ability, number>;
  const raceBonus = calculateRaceBonus(draft);
  const result: Record<Ability, number> = { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 };

  for (const ability of ABILITY_ORDER) {
    const baseScore = base[ability] ?? 10;
    const featBonus = draft.feats?.reduce((sum, feat) => sum + (feat.statModifiers?.[ability] ?? 0), 0) ?? 0;
    const equipmentBonus = draft.equipment?.reduce((sum, item) => {
      if (!item.equipped) return sum;
      return sum + (item.statModifiers?.[ability] ?? 0);
    }, 0) ?? 0;
    result[ability] = baseScore + raceBonus[ability] + featBonus + equipmentBonus;
  }

  return result;
}

export function calculateMaxHp(draft: PartialCharacterDraft, totalLevel: number): number {
  const abilityScores = calculateFinalAbilityScores(draft);
  const conMod = getModifier(abilityScores.constitution);
  const hpRollsTotal = draft.hpRolls?.reduce((a, b) => a + b, 0) ?? 0;
  return hpRollsTotal + (conMod * totalLevel) + (draft.hpBonus ?? 0);
}

export function getArmorClassForDraft(draft: PartialCharacterDraft & { abilityScores?: Record<Ability, number> }): ArmorClassBreakdown {
  const fakeCharacter: Character = {
    name: '',
    race: '',
    background: '',
    alignment: '',
    classes: [],
    raceStatSelections: draft.raceStatSelections ?? [],
    baseAbilityScores: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
    abilityScores: draft.abilityScores ?? calculateFinalAbilityScores(draft),
    featureChoices: {},
    hpRolls: [],
    level: 0,
    xp: 0,
    portrait: null,
    hpBonus: 0,
    hp: 0,
    maxHp: 0,
    currentHp: 0,
    tempHp: 0,
    ac: 10,
    speed: 30,
    initiative: 0,
    vision: {},
    deathSaves: { successes: 0, failures: 0 },
    proficiencyBonus: 2,
    skills: [],
    equipment: (draft.equipment ?? []) as Character['equipment'],
    currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
    spellSlots: [],
    spells: [],
    feats: (draft.feats ?? []) as Character['feats'],
    statusEffects: [],
    notes: '',
    languages: [],
    toolProficiencies: [],
    raceChoices: {},
    backgroundChoices: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return getArmorClass(fakeCharacter);
}

export function useReviewStep() {
  const { state, dispatch } = useCharacterBuilder();
  const navigate = useNavigate();

  const totalLevel = (state.draft.classes ?? [])?.reduce((sum, c) => sum + c.level, 0) ?? 0;

  const finalCharacter = useMemo<Character>(() => {
    const draft = state.draft;

    const abilityScores = calculateFinalAbilityScores(draft);

    const conMod = getModifier(abilityScores.constitution);
    const hpRollsTotal = draft.hpRolls?.reduce((a, b) => a + b, 0) ?? 0;
    const calculatedMaxHp = hpRollsTotal + (conMod * totalLevel) + (draft.hpBonus ?? 0);

    const acBreakdown = getArmorClassForDraft({ ...draft, abilityScores });

    const proficiencyBonus = 1 + Math.floor((totalLevel - 1) / 4);

    const character: Character = {
      ...draft,
      abilityScores,
      maxHp: calculatedMaxHp,
      ac: acBreakdown.total,
      proficiencyBonus,
    } as Character;

    if (state.mode === 'create') {
      character.createdAt = new Date();
      character.hp = calculatedMaxHp;
      character.currentHp = calculatedMaxHp;
      character.tempHp = 0;
    }
    character.updatedAt = new Date();

    return character;
  }, [state.draft, state.mode, totalLevel]);

  const isValid = !!(state.draft.name?.trim());

  const handleFinish = async () => {
    if (!isValid) return;

    try {
      if (state.mode === 'create') {
        const id = await addCharacter(finalCharacter);
        dispatch({ type: 'CLEAR_DRAFT' });
        navigate(`/characters/${id}`);
      } else if (state.baseCharacterId) {
        await updateCharacter(state.baseCharacterId, finalCharacter);
        dispatch({ type: 'CLEAR_DRAFT' });
        navigate(`/characters/${state.baseCharacterId}`);
      }
    } catch (error) {
      console.error('Failed to save character:', error);
    }
  };

  return { finalCharacter, isValid, handleFinish };
}
