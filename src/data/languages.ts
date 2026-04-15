export interface Language {
  id: string;
  name: string;
  description: string;
  type: 'Standard' | 'Exotic';
}

export const SRD_LANGUAGES: Language[] = [
  {
    id: 'common',
    name: 'Common',
    description: 'The common tongue spoken throughout most of the worlds of D&D.',
    type: 'Standard',
  },
  {
    id: 'dwarvish',
    name: 'Dwarvish',
    description: 'The language of the dwarves, known for its hard consonants and guttural sounds.',
    type: 'Standard',
  },
  {
    id: 'elvish',
    name: 'Elvish',
    description: 'The flowing language of the elves, known for its melodic sounds and subtle expressions.',
    type: 'Standard',
  },
  {
    id: 'giant',
    name: 'Giant',
    description: 'The language of giants, ogres, and titans, known for its thunderous booming quality.',
    type: 'Standard',
  },
  {
    id: 'gnomish',
    name: 'Gnomish',
    description: 'The language of gnomes, known for its intricate wordplay and rapid speech.',
    type: 'Standard',
  },
  {
    id: 'goblin',
    name: 'Goblin',
    description: 'The crude language of goblins, hobgoblins, and bugbears.',
    type: 'Standard',
  },
  {
    id: 'halfling',
    name: 'Halfling',
    description: 'The language of halflings, known for its soft consonants and pleasant cadence.',
    type: 'Standard',
  },
  {
    id: 'orc',
    name: 'Orc',
    description: 'The harsh language of orcs and half-orcs, known for its guttural sounds.',
    type: 'Standard',
  },
  {
    id: 'abyssal',
    name: 'Abyssal',
    description: 'The chaotic language of the Abyss, spoken by demons and other fiends.',
    type: 'Exotic',
  },
  {
    id: 'celestial',
    name: 'Celestial',
    description: 'The harmonious language of the Upper Planes, spoken by celestials and angels.',
    type: 'Exotic',
  },
  {
    id: 'draconic',
    name: 'Draconic',
    description: 'The ancient language of dragons and dragonborn, known for its harsh syllables.',
    type: 'Exotic',
  },
  {
    id: 'deep-speech',
    name: 'Deep Speech',
    description: 'The alien language of the Far Realm, spoken by aberrations and mind flayers.',
    type: 'Exotic',
  },
  {
    id: 'infernal',
    name: 'Infernal',
    description: 'The lawful language of the Lower Planes, spoken by devils and tieflings.',
    type: 'Exotic',
  },
  {
    id: 'primordial',
    name: 'Primordial',
    description: 'The elemental language of air, earth, fire, and water, spoken by genies and elementals.',
    type: 'Exotic',
  },
  {
    id: 'sylvan',
    name: 'Sylvan',
    description: 'The forest language of fey and fey creatures, known for its whisper-like quality.',
    type: 'Exotic',
  },
  {
    id: 'undercommon',
    name: 'Undercommon',
    description: 'The trading language of the Underdark, spoken by drow and duergar.',
    type: 'Exotic',
  },
];

export function getLanguageById(id: string): Language | undefined {
  return SRD_LANGUAGES.find(lang => lang.id === id);
}

export function getLanguageByName(name: string): Language | undefined {
  return SRD_LANGUAGES.find(lang => lang.name.toLowerCase() === name.toLowerCase());
}
