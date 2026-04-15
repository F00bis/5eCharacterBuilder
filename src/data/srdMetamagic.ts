import type { MetamagicOption } from '../types/progression';

export const srdMetamagicOptions: MetamagicOption[] = [
  {
    id: 'careful-spell',
    name: 'Careful Spell',
    description:
      'When you cast a spell that forces others to make a saving throw, you can spend 1 sorcery point to protect a number of creatures up to your Charisma modifier from that spell.',
  },
  {
    id: 'distant-spell',
    name: 'Distant Spell',
    description:
      'Spend 1 sorcery point to double the range of a spell with range 5 feet or greater, or to make a touch spell have range 30 feet.',
  },
  {
    id: 'empowered-spell',
    name: 'Empowered Spell',
    description:
      'Spend 1 sorcery point to reroll a number of damage dice up to your Charisma modifier for a spell.',
  },
  {
    id: 'extended-spell',
    name: 'Extended Spell',
    description:
      'Spend 1 sorcery point to double a spell duration, to a maximum duration of 24 hours.',
  },
  {
    id: 'heightened-spell',
    name: 'Heightened Spell',
    description:
      'Spend 3 sorcery points to give one target of your spell disadvantage on its first saving throw against the spell.',
  },
  {
    id: 'quickened-spell',
    name: 'Quickened Spell',
    description:
      'Spend 2 sorcery points to cast a spell with a casting time of 1 action as a bonus action.',
  },
  {
    id: 'subtle-spell',
    name: 'Subtle Spell',
    description:
      'Spend 1 sorcery point to cast a spell without somatic or verbal components.',
  },
  {
    id: 'twinned-spell',
    name: 'Twinned Spell',
    description:
      'When a spell targets only one creature and cannot target self, spend sorcery points equal to the spell level to target a second creature.',
  },
];
