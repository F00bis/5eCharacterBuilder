import type { InvocationOption } from '../types/progression';

export const srdInvocationOptions: InvocationOption[] = [
  {
    id: 'agonizing-blast',
    name: 'Agonizing Blast',
    description: 'Add your Charisma modifier to the damage dealt by eldritch blast on a hit.',
    prerequisites: { spellKnown: 'eldritch blast' },
  },
  {
    id: 'armor-of-shadows',
    name: 'Armor of Shadows',
    description: 'You can cast mage armor on yourself at will, without expending a spell slot or material components.',
  },
  {
    id: 'beast-speech',
    name: 'Beast Speech',
    description: 'You can cast speak with animals at will, without expending a spell slot.',
  },
  {
    id: 'book-of-ancient-secrets',
    name: 'Book of Ancient Secrets',
    description: 'You can inscribe ritual spells into your Book of Shadows and cast them as rituals.',
    prerequisites: { pactBoon: 'Pact of the Tome' },
  },
  {
    id: 'devils-sight',
    name: "Devil's Sight",
    description: 'You can see normally in darkness, both magical and nonmagical, to 120 feet.',
  },
  {
    id: 'eldritch-sight',
    name: 'Eldritch Sight',
    description: 'You can cast detect magic at will, without expending a spell slot.',
  },
  {
    id: 'gift-of-the-ever-living-ones',
    name: 'Gift of the Ever-Living Ones',
    description: 'Whenever you regain hit points while your familiar is within 100 feet, treat healing dice as max values.',
    prerequisites: { pactBoon: 'Pact of the Chain' },
  },
  {
    id: 'lifedrinker',
    name: 'Lifedrinker',
    description: 'When you hit with your pact weapon, deal extra necrotic damage equal to your Charisma modifier.',
    prerequisites: { pactBoon: 'Pact of the Blade', minWarlockLevel: 12 },
  },
  {
    id: 'mask-of-many-faces',
    name: 'Mask of Many Faces',
    description: 'You can cast disguise self at will, without expending a spell slot.',
  },
  {
    id: 'repelling-blast',
    name: 'Repelling Blast',
    description: 'When you hit a creature with eldritch blast, you can push it up to 10 feet away from you.',
    prerequisites: { spellKnown: 'eldritch blast' },
  },
  {
    id: 'thirsting-blade',
    name: 'Thirsting Blade',
    description: 'You can attack with your pact weapon twice whenever you take the Attack action.',
    prerequisites: { pactBoon: 'Pact of the Blade', minWarlockLevel: 5 },
  },
  {
    id: 'visions-of-distant-realms',
    name: 'Visions of Distant Realms',
    description: 'You can cast arcane eye at will, without expending a spell slot.',
    prerequisites: { minWarlockLevel: 15 },
  },
];
