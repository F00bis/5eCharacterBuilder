import type { Ability } from './index';

export type SpellSchool =
  | 'Abjuration'
  | 'Conjuration'
  | 'Divination'
  | 'Enchantment'
  | 'Evocation'
  | 'Illusion'
  | 'Necromancy'
  | 'Transmutation';

export interface SpellDamageComponent {
  dice?: string;
  type: string;
  flat?: number | 'mod';
  formula?: string;
}

export type SpellDamageScaling =
  | {
      kind: 'cantrip';
      tiers: { level: number; components: SpellDamageComponent[] }[];
    }
  | {
      kind: 'slot';
      perSlotLevel: SpellDamageComponent[];
    }
  | {
      kind: 'instance';
      instanceDamage: SpellDamageComponent[];
      baseCount: number;
      countPerSlotLevel: number;
    }
  | {
      kind: 'none';
    };

export interface SpellDamage {
  base: SpellDamageComponent[];
  scaling: SpellDamageScaling;
}

export interface DndSpell {
  name: string;
  level: number;
  school: SpellSchool;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  higherLevel?: string;
  classes: string[];
  ritual?: boolean;
  concentration?: boolean;
  requiresAttackRoll?: boolean;
  savingThrowAbility?: Ability;
  damage?: SpellDamage;
  healing?: SpellDamage;
  isSRD: boolean;
}
