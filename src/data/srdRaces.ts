import type { DndRace } from '../types/races';

const DRACONIC_ANCESTRIES = [
  'Black', 'Blue', 'Brass', 'Bronze', 'Copper', 'Gold', 'Green', 'Red', 'Silver', 'White'
];

const ALL_SKILLS = [
  'athletics', 'acrobatics', 'sleightOfHand', 'stealth', 'arcana', 'history',
  'investigation', 'medicine', 'nature', 'religion', 'animalHandling', 'insight',
  'perception', 'survival', 'deception', 'intimidation', 'performance', 'persuasion'
];

const ALL_LANGUAGES = [
  'Common', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin',
  'Halfling', 'Orc', 'Abyssal', 'Celestial', 'Draconic', 'Deep Speech',
  'Infernal', 'Primordial', 'Sylvan', 'Undercommon'
];

const WIZARD_CANTRIPS = [
  'acid splash', 'blade ward', 'booming blade', 'chill touch', 'control flames',
  'dancing lights', 'drench', 'fire bolt', 'friends', 'gust', 'infestation',
  'light', 'mage hand', 'mending', 'message', 'minor illusion', 'mind sliver',
  'poison spray', 'prestidigitation', 'ray of frost', 'shape water', 'shocking grasp',
  'sword burst', 'thorn whip', 'toll the dead', 'true strike'
];

export const srdRaces: DndRace[] = [
  {
    id: 'dwarf',
    name: 'Dwarf',
    abilityScoreIncreases: [
      { amount: 2 },
      { amount: 1 },
    ],
    speed: 25,
    size: 'Medium',
    languages: ['Dwarvish'],
    additionalLanguages: 0,
    features: [
      { name: 'Darkvision', description: 'Accustomed to life underground, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.' },
      { name: 'Dwarven Resilience', description: 'You have advantage on saving throws against poison, and you have resistance against poison damage.' },
    ],
    savingThrowFeatures: [
      { type: 'advantage', description: 'vs poison' },
    ],
    weaponProficiencies: ['battleaxe', 'handaxe', 'light hammer', 'warhammer'],
    subraces: [
      {
        id: 'hill-dwarf',
        name: 'Hill Dwarf',
        description: 'Hill Dwarves have heightened senses and increased resilience.',
        abilityScoreIncreases: [
          { ability: 'wisdom', amount: 1 }
        ],
        features: [
          { name: 'Dwarven Toughness', description: 'Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.' }
        ]
      },
      {
        id: 'mountain-dwarf',
        name: 'Mountain Dwarf',
        description: 'Mountain Dwarves are built for battle and armored combat.',
        abilityScoreIncreases: [
          { ability: 'strength', amount: 2 }
        ],
        features: [
          { name: 'Dwarven Armor Training', description: 'You have proficiency with medium armor and shields.' }
        ]
      }
    ],
  },
  {
    id: 'elf',
    name: 'Elf',
    abilityScoreIncreases: [
      { amount: 2 },
      { amount: 1 },
    ],
    speed: 30,
    size: 'Medium',
    languages: ['Elvish'],
    additionalLanguages: 0,
    features: [
      { name: 'Darkvision', description: 'Accustomed to life in the twilight of the forest, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.' },
      { name: 'Fey Ancestry', description: 'You have advantage on saving throws against being charmed, and magic can\'t put you to sleep.' },
    ],
    savingThrowFeatures: [
      { type: 'advantage', description: 'vs charmed' },
    ],
    subraces: [
      {
        id: 'high-elf',
        name: 'High Elf',
        description: 'High Elves are master of the arcane arts and ancient lore.',
        abilityScoreIncreases: [
          { ability: 'intelligence', amount: 1 }
        ],
        features: [
          { name: 'Elf Weapon Training', description: 'You have proficiency with the longsword, shortsword, shortbow, and longbow.' },
          { name: 'Cantrip', description: 'You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.' }
        ],
        choices: [
          { type: 'cantrip', count: 1, options: WIZARD_CANTRIPS, required: true }
        ]
      },
      {
        id: 'wood-elf',
        name: 'Wood Elf',
        description: 'Wood Elves are swift and stealthy, deeply connected to the forest.',
        abilityScoreIncreases: [
          { ability: 'wisdom', amount: 1 }
        ],
        speed: 35,
        features: [
          { name: 'Elf Weapon Training', description: 'You have proficiency with the longsword, shortsword, shortbow, and longbow.' },
          { name: 'Mask of the Wild', description: 'You can attempt to hide even when you are only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena.' }
        ]
      },
      {
        id: 'drow',
        name: 'Drow',
        description: 'Drow are exiled underground, masterfully adapted to darkness.',
        abilityScoreIncreases: [
          { ability: 'charisma', amount: 1 }
        ],
        darkvision: 120,
        features: [
          { name: 'Superior Darkvision', description: 'Your darkvision has a radius of 120 feet.' },
          { name: 'Sunlight Sensitivity', description: 'You have disadvantage on attack rolls and Wisdom (Perception) checks that rely on sight when you, the target of your attack, or whatever you are trying to perceive is in direct sunlight.' }
        ]
      }
    ],
  },
  {
    id: 'halfling',
    name: 'Halfling',
    abilityScoreIncreases: [
      { amount: 2 },
      { amount: 1 },
    ],
    speed: 25,
    size: 'Small',
    languages: ['Halfling'],
    additionalLanguages: 0,
    features: [
      { name: 'Lucky', description: 'When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.' },
      { name: 'Brave', description: 'You have advantage on saving throws against being frightened.' },
      { name: 'Halfling Nimbleness', description: 'You can move through the space of any creature that is of a size larger than yours.' },
    ],
    savingThrowFeatures: [
      { type: 'advantage', description: 'vs frightened' },
    ],
    subraces: [
      {
        id: 'lightfoot',
        name: 'Lightfoot',
        description: 'Lightfoot Halflings are masters of stealth and diplomacy.',
        abilityScoreIncreases: [
          { ability: 'charisma', amount: 1 }
        ],
        features: [
          { name: 'Naturally Stealthy', description: 'You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.' }
        ]
      },
      {
        id: 'stout',
        name: 'Stout',
        description: 'Stout Halflings are hardier than their cousins, with a resistance to poison.',
        abilityScoreIncreases: [
          { ability: 'constitution', amount: 1 }
        ],
        features: [
          { name: 'Stout Resilience', description: 'You have advantage on saving throws against poison, and you have resistance against poison damage.' }
        ]
      }
    ],
  },
  {
    id: 'human',
    name: 'Human',
    abilityScoreIncreases: [
      { ability: 'strength', amount: 1 },
      { ability: 'dexterity', amount: 1 },
      { ability: 'constitution', amount: 1 },
      { ability: 'intelligence', amount: 1 },
      { ability: 'wisdom', amount: 1 },
      { ability: 'charisma', amount: 1 },
    ],
    speed: 30,
    size: 'Medium',
    languages: ['Common'],
    additionalLanguages: 1,
    features: [],
    savingThrowFeatures: [],
    choices: [
      { type: 'language', count: 1, options: ALL_LANGUAGES, required: true }
    ],
    subraces: [
      {
        id: 'variant-human',
        name: 'Variant Human',
        description: 'Variant Humans are diverse, talented, and ambitious.',
        abilityScoreIncreases: [
          { amount: 1 },
          { amount: 1 },
        ],
        features: [
          { name: 'Skill Versatility', description: 'You gain proficiency in one skill of your choice.' }
        ],
        choices: [
          { type: 'skill', count: 1, options: ALL_SKILLS, required: true },
          { type: 'feat', count: 1, required: true }
        ]
      }
    ],
  },
  {
    id: 'dragonborn',
    name: 'Dragonborn',
    abilityScoreIncreases: [
      { ability: 'strength', amount: 2 },
      { ability: 'charisma', amount: 1 },
    ],
    speed: 30,
    size: 'Medium',
    languages: ['Draconic', 'Common'],
    additionalLanguages: 0,
    features: [
      { name: 'Draconic Ancestry', description: 'You have a particular lineage with one type of dragon. Choose a dragon type from the table. Your breath weapon and damage resistance are determined by the dragon type you choose.' },
      { name: 'Breath Weapon', description: 'You can use your action to exhale destructive energy. Your draconic ancestry determines the size, shape, and damage type of your exhalation.' },
      { name: 'Damage Resistance', description: 'You have resistance to the damage type associated with your draconic ancestry.' },
    ],
    savingThrowFeatures: [],
    choices: [
      { type: 'draconicAncestry', count: 1, options: DRACONIC_ANCESTRIES, required: true }
    ],
  },
  {
    id: 'gnome',
    name: 'Gnome',
    abilityScoreIncreases: [
      { amount: 2 },
      { amount: 1 },
    ],
    speed: 25,
    size: 'Small',
    languages: ['Gnomish', 'Common'],
    additionalLanguages: 0,
    features: [
      { name: 'Darkvision', description: 'Accustomed to life underground, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.' },
      { name: 'Gnome Cunning', description: 'You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.' },
    ],
    savingThrowFeatures: [
      { type: 'advantage', description: 'vs magic (INT/WIS/CHA)' },
    ],
    subraces: [
      {
        id: 'forest-gnome',
        name: 'Forest Gnome',
        description: 'Forest Gnomes are reclusive and skilled at illusion magic.',
        abilityScoreIncreases: [
          { ability: 'dexterity', amount: 1 }
        ],
        features: [
          { name: 'Natural Illusionist', description: 'You know the minor illusion cantrip. Intelligence is your spellcasting ability for it.' },
          { name: 'Speak with Small Beasts', description: 'Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts.' }
        ]
      },
      {
        id: 'rock-gnome',
        name: 'Rock Gnome',
        description: 'Rock Gnomes are inventive and deeply connected to their craft.',
        abilityScoreIncreases: [
          { ability: 'constitution', amount: 1 }
        ],
        features: [
          { name: 'Artificer\'s Lore', description: 'Whenever you make an Intelligence (History) check related to magic items, alchemical objects, or technological devices, you can add twice your proficiency bonus, instead of any proficiency bonus you normally apply.' },
          { name: 'Tinker', description: 'You have proficiency with artisan\'s tools (tinker\'s tools). Using those tools, you can spend 1 hour and 10 gp worth of materials to construct a Tiny device (AC 5, 1 hp). You can attend to one device at a time. You can use an action to cause it to activate, and you can use a bonus action to deactivate it.' }
        ]
      }
    ],
  },
  {
    id: 'half-elf',
    name: 'Half-Elf',
    abilityScoreIncreases: [
      { ability: 'charisma', amount: 2 },
      { amount: 1 },
      { amount: 1 },
    ],
    speed: 30,
    size: 'Medium',
    languages: ['Elvish', 'Common'],
    additionalLanguages: 0,
    features: [
      { name: 'Darkvision', description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.' },
      { name: 'Fey Ancestry', description: 'You have advantage on saving throws against being charmed, and magic can\'t put you to sleep.' },
    ],
    savingThrowFeatures: [
      { type: 'advantage', description: 'vs charmed' },
    ],
    choices: [
      { type: 'skill', count: 2, options: ALL_SKILLS, required: true },
      { type: 'language', count: 1, options: ALL_LANGUAGES, required: true }
    ],
  },
  {
    id: 'half-orc',
    name: 'Half-Orc',
    abilityScoreIncreases: [
      { ability: 'strength', amount: 2 },
      { ability: 'constitution', amount: 1 },
    ],
    speed: 30,
    size: 'Medium',
    languages: ['Orc', 'Common'],
    additionalLanguages: 0,
    features: [
      { name: 'Darkvision', description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.' },
      { name: 'Savage Attacks', description: 'When you score a critical hit with a melee weapon attack, you can roll one of the weapon\'s damage dice one additional time and add it to the extra damage of the critical hit.' },
    ],
    savingThrowFeatures: [],
  },
  {
    id: 'tiefling',
    name: 'Tiefling',
    abilityScoreIncreases: [
      { ability: 'charisma', amount: 2 },
      { ability: 'intelligence', amount: 1 },
    ],
    speed: 30,
    size: 'Medium',
    languages: ['Infernal', 'Common'],
    additionalLanguages: 0,
    features: [
      { name: 'Darkvision', description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.' },
      { name: 'Hellish Resistance', description: 'You have resistance to fire damage.' },
    ],
    savingThrowFeatures: [],
  },
];
