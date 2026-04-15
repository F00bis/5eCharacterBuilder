import type { Skill } from './index';

export type ProgressionDomain = 'expertise' | 'metamagic' | 'invocation' | 'mystic-arcanum';

export interface ProgressionEntitlement {
  domain: ProgressionDomain;
  className: string;
  classIndex: number;
  level: number;
  count: number;
  sourceKey: string;
}

export interface ExpertiseEntitlement extends ProgressionEntitlement {
  domain: 'expertise';
}

export interface MetamagicEntitlement extends ProgressionEntitlement {
  domain: 'metamagic';
}

export interface InvocationEntitlement extends ProgressionEntitlement {
  domain: 'invocation';
}

export interface MysticArcanumEntitlement extends ProgressionEntitlement {
  domain: 'mystic-arcanum';
  arcanumLevel: 6 | 7 | 8 | 9;
}

export interface MetamagicOption {
  id: string;
  name: string;
  description: string;
}

export interface InvocationPrerequisite {
  minWarlockLevel?: number;
  pactBoon?: 'Pact of the Chain' | 'Pact of the Blade' | 'Pact of the Tome';
  spellKnown?: string;
  feature?: string;
}

export interface InvocationOption {
  id: string;
  name: string;
  description: string;
  prerequisites?: InvocationPrerequisite;
}

export interface MysticArcanumConstraint {
  arcanumLevel: 6 | 7 | 8 | 9;
  minWarlockLevel: number;
}

export interface ProgressionChoiceOptionGroup {
  sourceKey: string;
  count: number;
  options: string[];
}

export interface ExpertiseChoiceOptionGroup extends ProgressionChoiceOptionGroup {
  options: Skill[];
}
