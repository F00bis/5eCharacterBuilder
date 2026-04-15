export type FeatChoiceKind =
  | 'ability'
  | 'skill-proficiency'
  | 'skill-expertise'
  | 'saving-throw'
  | 'damage-type'
  | 'spell-list'
  | 'cantrip'
  | 'spell'
  | 'weapon-proficiency'
  | 'tool-proficiency'
  | 'spellcasting-ability'
  | 'maneuver';

export interface FeatChoiceDefinition {
  id: string;
  kind: FeatChoiceKind;
  label: string;
  count: number;
  options?: string[];
  linkedTo?: string;
  filter?: {
    requiresAttackRoll?: boolean;
    ritual?: boolean;
    spellLevel?: number;
  };
}