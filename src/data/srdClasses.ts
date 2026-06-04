import type { DndClass } from '../types/classes';

export const srdClasses: DndClass[] = [
  {
    name: 'Barbarian',
    hitDie: 12,
    primaryAbility: 'strength',
    savingThrows: ['strength', 'constitution'],
    skillProficienciesChoices: 2,
    skillOptions: ['animalHandling', 'athletics', 'intimidation', 'nature', 'perception', 'survival'],
    asiLevels: [4, 8, 12, 16, 19],
    multiclassing: {
      prerequisites: [{ ability: 'strength', min: 13 }],
      proficienciesGained: {
        armor: ['Light', 'Medium', 'Shield'],
        weapons: ['Simple', 'Martial']
      }
    },
    features: [
      {
        name: 'Rage',
        description: 'In battle, you fight with a primal ferocity. On your turn, you can enter a rage as a bonus action. While raging, you gain the following benefits: You have advantage on Strength checks and Strength saving throws. When you make a melee weapon attack using Strength, you gain a +2 bonus to the damage roll. You have resistance to bludgeoning, piercing, and slashing damage. If you are able to cast spells, you can\'t cast them or concentrate on them while raging. Your rage lasts for 1 minute. It ends early if you are knocked unconscious or if your turn ends and you haven\'t attacked a hostile creature since your last turn or taken damage since then. You can also end your rage as a bonus action.',
        levelAcquired: 2,
        effects: {
          hpPerLevel: 12
        }
      },
      {
        name: 'Unarmored Defense',
        description: 'While you are not wearing any armor, your AC equals 10 + your Dexterity modifier + your Constitution modifier. Your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier. You gain a shield if you use one.',
        levelAcquired: 1,
        effects: {
          acCalculation: {
            base: 10,
            abilityModifiers: ['dexterity', 'constitution'],
            requiresNoArmor: true,
            requiresNoShield: false,
            allowShield: true,
          }
        }
      },
      {
        name: 'Reckless Attack',
        description: 'When you make your first attack on your turn, you can decide to attack recklessly. When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on Strength melee weapon attack rolls during this turn, but attack rolls against you have advantage until your next turn.',
        levelAcquired: 2
      },
      {
        name: 'Danger Sense',
        description: 'You gain an uncanny sense of when things nearby aren\'t as they should be. You gain an uncanny sense of when things nearby aren\'t as they should be, giving you advantage on Dexterity saving throws against effects that you can see such as traps and spells. You can\'t benefit from this trait if you are blinded, deafened, or incapacitated.',
        levelAcquired: 2
      },
      {
        name: 'Primal Path',
        description: 'Choose a path that shapes the nature of your rage. At 3rd level, you choose a path that shapes the nature of your rage. Choose either the Berserker or the Totem Warrior, both detailed at the end of the class description. Your choice grants you features at 3rd level and again at 6th, 10th, and 14th levels.',
        levelAcquired: 3,
        choices: {
          count: 1,
          options: ['Path of the Berserker', 'Path of the Totem Warrior'],
          optionDetails: {
            'Path of the Berserker': 'Embrace relentless fury with aggressive rage features like Frenzy and intimidating presence.',
            'Path of the Totem Warrior': 'Channel spiritual totem power to gain versatile, nature-themed benefits tied to animal spirits.'
          }
        }
      },
      {
        name: 'Ability Score Improvement',
        description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.',
        levelAcquired: 4
      },
      {
        name: 'Extra Attack',
        description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn. Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.',
        levelAcquired: 5
      },
      {
        name: 'Fast Movement',
        description: 'Your speed increases by 10 feet while you aren\'t wearing heavy armor. Starting at 5th level, your speed increases by 10 feet while you aren\'t wearing heavy armor.',
        levelAcquired: 5
      },
      {
        name: 'Feral Instinct',
        description: 'Your instincts are so honed that you have advantage on initiative rolls. By 7th level, your instincts are so honed that you have advantage on initiative rolls. Additionally, if you are surprised at the start of combat and aren\'t incapacitated, you can act normally on your first turn, but only if you enter your rage before doing anything else on that turn.',
        levelAcquired: 7
      },
      {
        name: 'Brutal Critical',
        description: 'You can roll one additional weapon damage die when determining the extra damage for a critical hit with a melee attack. Beginning at 9th level, you can roll one additional weapon damage die when determining the extra damage for a critical hit with a melee weapon attack. This increases to two additional dice at 13th level and three additional dice at 17th level.',
        levelAcquired: 9
      },
      {
        name: 'Relentless Rage',
        description: 'Your rage can keep you fighting despite grievous wounds. Starting at 11th level, your rage can keep you fighting despite grievous wounds. If you drop to 0 hit points while you\'re raging and don\'t die outright, you can make a DC 10 Constitution saving throw. If you succeed, you drop to 1 hit point instead. Each time you use this feature after the first, the DC increases by 5. When you finish a long rest, the DC resets to 10.',
        levelAcquired: 11
      },
      {
        name: 'Persistent Rage',
        description: 'Your rage ends early only if you fall unconscious or if you choose to end it. Beginning at 15th level, your rage is so fierce that it ends early only if you fall unconscious or if you choose to end it.',
        levelAcquired: 15
      },
      {
        name: 'Primal Champion',
        description: 'You embody the power of the wilds. Your Strength and Constitution scores increase by 4. At 20th level, you embody the power of the wilds. Your Strength and Constitution scores increase by 4. Each score can\'t exceed 24.',
        levelAcquired: 20,
        effects: {
          abilityScores: { strength: 4, constitution: 4 }
        }
      },
      // Path of the Berserker
      {
        name: 'Frenzy',
        description: 'Starting when you choose this path at 3rd level, you can go into a frenzy when you rage. If you do so, for the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns after this one. When your rage ends, you suffer one level of exhaustion.',
        levelAcquired: 3,
        requiredFeatureChoice: {
          featureKey: 'barbarian-3-primal-path',
          expectedValue: 'Path of the Berserker',
        },
      },
      {
        name: 'Mindless Rage',
        description: 'Beginning at 6th level, you can\'t be charmed or frightened while raging. If you are charmed or frightened when you enter your rage, the effect is suspended for the duration of the rage.',
        levelAcquired: 6,
        requiredFeatureChoice: {
          featureKey: 'barbarian-3-primal-path',
          expectedValue: 'Path of the Berserker',
        },
      },
      {
        name: 'Intimidating Presence',
        description: 'Beginning at 10th level, you can use your action to frighten someone with your menacing presence. When you do so, choose one creature that you can see within 30 feet of you. If the creature can see or hear you, it must succeed on a Wisdom saving throw (DC equal to 8 + your proficiency bonus + your Charisma modifier) or be frightened of you until the end of your next turn. On subsequent turns, you can use your action to extend the duration of this effect on the frightened creature until the end of your next turn. This effect ends if the creature ends its turn out of line of sight or more than 60 feet away from you.',
        levelAcquired: 10,
        requiredFeatureChoice: {
          featureKey: 'barbarian-3-primal-path',
          expectedValue: 'Path of the Berserker',
        },
      },
      {
        name: 'Retaliation',
        description: 'Starting at 14th level, when you take damage from a creature that is within 5 feet of you, you can use your reaction to make a melee weapon attack against that creature.',
        levelAcquired: 14,
        requiredFeatureChoice: {
          featureKey: 'barbarian-3-primal-path',
          expectedValue: 'Path of the Berserker',
        },
      },
      // Path of the Totem Warrior
      {
        name: 'Spirit Seeker',
        description: 'At 3rd level when you adopt this path, you gain the ability to cast the Beast Sense and Speak with Animals spells, but only as rituals.',
        levelAcquired: 3,
        requiredFeatureChoice: {
          featureKey: 'barbarian-3-primal-path',
          expectedValue: 'Path of the Totem Warrior',
        },
      },
      {
        name: 'Totem Spirit',
        description: 'At 3rd level, when you adopt this path, you choose a totem spirit and gain its feature. Bear: While raging, you have resistance to all damage except psychic damage. Eagle: While you\'re raging and aren\'t wearing heavy armor, other creatures have disadvantage on opportunity attack rolls against you, and you can use the Dash action as a bonus action on your turn. Wolf: While you\'re raging, your friends have advantage on melee attack rolls against any hostile creature within 5 feet of you.',
        levelAcquired: 3,
        requiredFeatureChoice: {
          featureKey: 'barbarian-3-primal-path',
          expectedValue: 'Path of the Totem Warrior',
        },
      },
      {
        name: 'Aspect of the Beast',
        description: 'At 6th level, you gain a magical benefit based on the totem animal of your choice. You can choose the same animal you selected at 3rd level or a different one. Bear: Your carrying capacity is doubled and you have advantage on Strength checks made to push, pull, lift, or break objects. Eagle: You can see up to 1 mile away with no difficulty, and dim light doesn\'t impose disadvantage on your Wisdom (Perception) checks. Wolf: You can track other creatures while traveling at a fast pace, and you can move stealthily while traveling at a normal pace.',
        levelAcquired: 6,
        requiredFeatureChoice: {
          featureKey: 'barbarian-3-primal-path',
          expectedValue: 'Path of the Totem Warrior',
        },
      },
      {
        name: 'Spirit Walker',
        description: 'At 10th level, you can cast the Commune with Nature spell, but only as a ritual. When you do so, a spiritual version of one of the animals you chose for Totem Spirit or Aspect of the Beast appears to you to convey the information you seek.',
        levelAcquired: 10,
        requiredFeatureChoice: {
          featureKey: 'barbarian-3-primal-path',
          expectedValue: 'Path of the Totem Warrior',
        },
      },
      {
        name: 'Totemic Attunement',
        description: 'At 14th level, you gain a magical benefit based on a totem animal of your choice. Bear: While you\'re raging, any creature within 5 feet of you that\'s hostile to you has disadvantage on attack rolls against targets other than you or another character with this feature. Eagle: While raging, you have a flying speed equal to your current walking speed. Wolf: While you\'re raging, you can use a bonus action on your turn to knock a Large or smaller creature prone when you hit it with a melee weapon attack.',
        levelAcquired: 14,
        requiredFeatureChoice: {
          featureKey: 'barbarian-3-primal-path',
          expectedValue: 'Path of the Totem Warrior',
        },
      },
    ],
    startingEquipment: {
      startingGoldFormula: '2d4 * 10',
      startingGoldAverage: 50,
      choices: [
        {
          label: 'Choose your weapons:',
          options: [
            { label: '(a) Greataxe', items: ['Greataxe'], type: 'bundle' },
            { label: '(b) Martial Melee Weapon', type: 'choice', weaponClasses: ['Martial'], weaponForms: ['Melee'] }
          ]
        },
        {
          label: 'Choose your secondary weapons:',
          options: [
            { label: '(a) Two Handaxes', items: ['Handaxe', 'Handaxe'], type: 'bundle' },
            { label: '(b) Simple Weapon', type: 'choice', weaponClasses: ['Simple'] }
          ]
        }
      ],
      fixedEquipment: ['Explorer\'s Pack', 'Javelin']
    }
  },
  {
    name: 'Bard',
    hitDie: 8,
    primaryAbility: 'charisma',
    savingThrows: ['dexterity', 'charisma'],
    skillProficienciesChoices: 3,
    skillOptions: ['acrobatics', 'animalHandling', 'arcana', 'athletics', 'deception', 'history', 'insight', 'intimidation', 'investigation', 'medicine', 'nature', 'perception', 'performance', 'persuasion', 'religion', 'sleightOfHand', 'stealth', 'survival'],
    asiLevels: [4, 8, 12, 16, 19],
    multiclassing: {
      prerequisites: [{ ability: 'charisma', min: 13 }],
      proficienciesGained: {
        armor: ['Light'],
        skills: 1,
        weapons: ['Simple', 'hand crossbow', 'longsword', 'rapier', 'shortsword']
      }
    },
    spellcastingAbility: 'charisma',
    spellPrepType: 'known',
    features: [
      {
        name: 'Bardic Inspiration',
        description: 'You can inspire others through stirring words or music. To do so, you use a bonus action on your turn to choose one creature other than yourself within 60 feet of you who can hear you. That creature gains one Bardic Inspiration die, a d6. Once within the next 10 minutes, the creature can roll the die and add the number rolled to one ability check, attack roll, or saving throw it makes. The creature can wait until after it rolls the d20 before deciding to use the Bardic Inspiration die, but must decide before the DM says whether the roll succeeds or fails. Once the Bardic Inspiration die is rolled, it is lost. A creature can have only one Bardic Inspiration die at a time. You can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain any expended uses when you finish a long rest. Your Bardic Inspiration die changes when you reach certain levels in this class. The die becomes a d8 at 5th level, a d10 at 10th level, and a d12 at 15th level.',
        levelAcquired: 1
      },
      {
        name: 'Jack of All Trades',
        description: 'You can add half your proficiency bonus to any ability check you make that doesn\'t already include your proficiency bonus. Starting at 2nd level, you can add half your proficiency bonus, rounded down, to any ability check that doesn\'t already include your proficiency bonus.',
        levelAcquired: 2
      },
      {
        name: 'Song of Rest',
        description: 'You can use soothing music or oration to help revitalize your wounded allies. Beginning at 2nd level, you can use soothing music or oration to help revitalize your wounded allies during a short rest. If you or any friendly creatures who can hear your performance regain hit points at the end of the short rest by spending one or more Hit Dice, each of those creatures regains an extra 1d6 hit points. The extra hit points increase when you reach certain bard levels: 1d8 at 9th level, 1d10 at 13th level, and 1d12 at 17th level.',
        levelAcquired: 2
      },
      {
        name: 'Bard College',
        description: 'Choose a college that represents your musical training. At 3rd level, you choose a college that inspires and informs your casting. Choose the College of Lore or the College of Valor, both detailed at the end of the class description. Your choice grants you features at 3rd level and again at 6th and 14th levels.',
        levelAcquired: 3,
        choices: {
          count: 1,
          options: ['College of Lore', 'College of Valor'],
          optionDetails: {
            'College of Lore': 'Master broad knowledge and magical versatility, with extra skills and flexible spell options.',
            'College of Valor': 'Inspire allies from the front line with martial training and combat-focused bard features.'
          }
        }
      },
      {
        name: 'Expertise',
        description: 'Choose two of your skill proficiencies. Your proficiency bonus is doubled for any ability check that uses either of these skills. At 3rd level, choose two of your skill proficiencies. Your proficiency bonus is doubled for any ability check that uses either of these skills. At 10th level, you can choose another two skills to gain this benefit.',
        levelAcquired: 2
      },
      {
        name: 'Ability Score Improvement',
        description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.',
        levelAcquired: 4
      },
      {
        name: 'Font of Inspiration',
        description: 'You regain all expended uses of Bardic Inspiration when you finish a short or long rest. Beginning at 5th level, you regain all of your expended uses of Bardic Inspiration when you finish a short or long rest.',
        levelAcquired: 5
      },
      {
        name: 'Countercharm',
        description: 'You can use musical notes or words of power to disrupt mind-influencing effects. At 6th level, you gain the ability to use musical notes or words of power to disrupt mind-influencing effects. As an action, you can start a performance that lasts until the end of your next turn. During that time, you and any friendly creatures within 30 feet of you have advantage on saving throws against being frightened or charmed. A creature must be able to hear you to gain this benefit. The performance ends early if you are incapacitated or silenced.',
        levelAcquired: 6
      },
      {
        name: 'Magical Secrets',
        description: 'You have learned a number of spells that reflect your own study of magic. At 10th level, you have learned magical secrets from across the multiverse. Choose two spells from any class, including this one. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip. The chosen spells count as bard spells for you and are included in the number in the Spells Known column of the Bard table. You learn two additional spells from any classes at 14th level and again at 18th level.',
        levelAcquired: 10
      },
      {
        name: 'Superior Inspiration',
        description: 'When you roll initiative and have no uses of Bardic Inspiration left, you regain one use. At 20th level, when you roll initiative and have no uses of Bardic Inspiration left, you regain one use.',
        levelAcquired: 20
      },
      // College of Lore
      {
        name: 'Bonus Proficiencies',
        description: 'When you join the College of Lore at 3rd level, you gain proficiency with three skills of your choice.',
        levelAcquired: 3,
        requiredFeatureChoice: {
          featureKey: 'bard-3-bard-college',
          expectedValue: 'College of Lore',
        },
      },
      {
        name: 'Cutting Words',
        description: 'Also at 3rd level, you learn how to use your wit to distract, confuse, and otherwise sap the confidence and competence of others. When a creature that you can see within 60 feet of you makes an attack roll, an ability check, or a damage roll, you can use your reaction to expend one of your uses of Bardic Inspiration, rolling a Bardic Inspiration die and subtracting the number rolled from the creature\'s roll. You can choose to use this feature after the creature makes its roll, but before the GM determines whether the attack roll or ability check succeeds or fails, or before the creature deals its damage. The creature is immune if it can\'t hear you or if it\'s immune to being charmed.',
        levelAcquired: 3,
        requiredFeatureChoice: {
          featureKey: 'bard-3-bard-college',
          expectedValue: 'College of Lore',
        },
      },
      {
        name: 'Additional Magical Secrets',
        description: 'At 6th level, you learn two spells of your choice from any class. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip. The chosen spells count as bard spells for you but don\'t count against the number of bard spells you know.',
        levelAcquired: 6,
        requiredFeatureChoice: {
          featureKey: 'bard-3-bard-college',
          expectedValue: 'College of Lore',
        },
      },
      {
        name: 'Peerless Skill',
        description: 'Starting at 14th level, when you make an ability check, you can expend one use of Bardic Inspiration. Roll a Bardic Inspiration die and add the number rolled to your ability check. You can choose to do so after you roll the die for the ability check, but before the GM tells you whether you succeed or fail.',
        levelAcquired: 14,
        requiredFeatureChoice: {
          featureKey: 'bard-3-bard-college',
          expectedValue: 'College of Lore',
        },
      },
      // College of Valor
      {
        name: 'Bonus Proficiencies (Valor)',
        description: 'When you join the College of Valor at 3rd level, you gain proficiency with medium armor, shields, and martial weapons.',
        levelAcquired: 3,
        requiredFeatureChoice: {
          featureKey: 'bard-3-bard-college',
          expectedValue: 'College of Valor',
        },
      },
      {
        name: 'Combat Inspiration',
        description: 'Also at 3rd level, you learn to inspire others in battle. A creature that has a Bardic Inspiration die from you can roll that die and add the number rolled to a weapon damage roll it just made. Alternatively, when an attack roll is made against the creature, it can use its reaction to roll the Bardic Inspiration die and add the number rolled to its AC against that attack, after seeing the roll but before knowing whether it hits or misses.',
        levelAcquired: 3,
        requiredFeatureChoice: {
          featureKey: 'bard-3-bard-college',
          expectedValue: 'College of Valor',
        },
      },
      {
        name: 'Extra Attack (Valor)',
        description: 'Starting at 6th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.',
        levelAcquired: 6,
        requiredFeatureChoice: {
          featureKey: 'bard-3-bard-college',
          expectedValue: 'College of Valor',
        },
      },
      {
        name: 'Battle Magic',
        description: 'At 14th level, you have mastered the art of weaving spellcasting and weapon use into a single harmonious act. When you use your action to cast a bard spell, you can make one weapon attack as a bonus action.',
        levelAcquired: 14,
        requiredFeatureChoice: {
          featureKey: 'bard-3-bard-college',
          expectedValue: 'College of Valor',
        },
      },
    ],
    startingEquipment: {
      startingGoldFormula: '5d4 * 10',
      startingGoldAverage: 125,
      choices: [
        {
          label: 'Choose your weapon:',
          options: [
            { label: '(a) Rapier', items: ['Rapier'], type: 'bundle' },
            { label: '(b) Longsword', items: ['Longsword'], type: 'bundle' },
            { label: '(c) Simple Weapon', type: 'choice', weaponClasses: ['Simple'] }
          ]
        },
        {
          label: 'Choose your instrument:',
          options: [
            { label: '(a) Lute', items: ['Lute'], type: 'bundle' },
            { label: '(b) Other Musical Instrument', type: 'choice', equipmentCategories: ['Musical Instrument'] }
          ]
        }
      ],
      fixedEquipment: ['Leather Armor', 'Dagger']
    }
  },
  {
    name: 'Cleric',
    hitDie: 8,
    primaryAbility: 'wisdom',
    savingThrows: ['wisdom', 'charisma'],
    skillProficienciesChoices: 2,
    skillOptions: ['history', 'insight', 'medicine', 'persuasion', 'religion'],
    asiLevels: [4, 8, 12, 16, 19],
    multiclassing: {
      prerequisites: [{ ability: 'wisdom', min: 13 }],
      proficienciesGained: {
        armor: ['Light', 'Medium', 'Shield']
      }
    },
    spellcastingAbility: 'wisdom',
    spellPrepType: 'prepared',
    features: [
      {
        name: 'Divine Domain',
        description: 'Choose one domain related to your deity. At 1st level, you choose one domain related to your deity. Each domain is detailed at the end of this class description. Your choice grants you domain spells and other features when you choose it at 1st level. It also grants you additional benefits at 2nd, 5th, 8th, and 11th levels.',
        levelAcquired: 1,
        choices: {
          count: 1,
          options: ['Knowledge Domain', 'Life Domain', 'Light Domain', 'Nature Domain', 'Tempest Domain', 'Trickery Domain', 'War Domain'],
          optionDetails: {
            'Knowledge Domain': 'Gain deeper command of lore, skills, and languages while channeling divine insight.',
            'Life Domain': 'Focus on restorative miracles with stronger healing magic and heavy armor training.',
            'Light Domain': 'Wield radiant power that burns darkness and protects allies with blinding light.',
            'Nature Domain': 'Blend divine power with the natural world, including druidic magic and resilient defenses.',
            'Tempest Domain': 'Command storm and thunder magic while fighting with martial and heavy armor proficiencies.',
            'Trickery Domain': 'Use stealth, illusions, and deception-focused blessings to outmaneuver enemies.',
            'War Domain': 'Fight as a battle priest with martial training and combat-focused divine features.'
          }
        }
      },
      {
        name: 'Channel Divinity',
        description: 'You can channel divine energy to fuel magical effects. At 2nd level, you gain the ability to channel divine energy directly from your deity, using that energy to fuel magical effects. You start with two such effects: Turn Undead and an effect determined by your domain. Some domains give you additional effects as you advance in levels, as noted in each domain description. When you use your Channel Divinity, you choose which effect to create. Some Channel Divinity effects require saving throws; the DC equals your cleric spell save DC. Starting at 6th level, you can use your Channel Divinity twice between rests, and at 18th level you can use it three times between rests. When you finish a long rest, you regain your expended uses.',
        levelAcquired: 2
      },
      {
        name: 'Ability Score Improvement',
        description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.',
        levelAcquired: 4
      },
      {
        name: 'Destroy Undead',
        description: 'Starting at 5th level, when an undead of CR equal to or less than your cleric level makes a saving throw against your Channel Divinity, it is destroyed on a failed save. Starting at 5th level, when an undead of CR equal to or less than your cleric level fails its saving throw against your Turn Undead feature, the undead is destroyed instantly.',
        levelAcquired: 5
      },
      {
        name: 'Divine Intervention',
        description: 'You can call on your deity to intervene on your behalf. Beginning at 10th level, you can call on your deity to intervene on your behalf when your need is great. Imploring your deity\'s aid requires you to use your action. Describe the assistance you seek, and roll percentile dice. If you roll a number equal or lower than your cleric level, your deity intervenes. A 91-00 always fails. If your deity intervenes, you can\'t use this feature again for 7 days. Otherwise, you can use it again after you finish a long rest. At 20th level, your roll is always successful (no roll required).',
        levelAcquired: 10
      },
      {
        name: 'Turn Undead',
        description: 'As an action, you present your holy symbol and speak a prayer censuring undead. As an action, you present your holy symbol and speak a prayer censuring undead. Each undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its save, it is turned for 1 minute or until it takes any damage. A turned creature must spend its turns trying to move as far away from you as it can, and it can\'t willingly move to a space within 30 feet of you. It also can\'t take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there\'s nowhere to move, the creature can use the Dodge action.',
        levelAcquired: 1
      },
      // Life Domain
      {
        name: 'Bonus Proficiency',
        description: 'When you choose this domain at 1st level, you gain proficiency with heavy armor.',
        levelAcquired: 1,
        requiredFeatureChoice: {
          featureKey: 'cleric-1-divine-domain',
          expectedValue: 'Life Domain',
        },
      },
      {
        name: 'Disciple of Life',
        description: 'Also starting at 1st level, your healing spells are more effective. Whenever you use a spell of 1st level or higher to restore hit points to a creature, the creature regains additional hit points equal to 2 + the spell\'s level.',
        levelAcquired: 1,
        requiredFeatureChoice: {
          featureKey: 'cleric-1-divine-domain',
          expectedValue: 'Life Domain',
        },
      },
      {
        name: 'Channel Divinity: Preserve Life',
        description: 'Starting at 2nd level, you can use your Channel Divinity to heal the badly injured. As an action, you present your holy symbol and evoke healing energy that can restore a number of hit points equal to five times your cleric level. Choose any creatures within 30 feet of you, and divide those hit points among them. This feature can restore a creature to no more than half of its hit point maximum. You can\'t use this feature on an undead or a construct.',
        levelAcquired: 2,
        requiredFeatureChoice: {
          featureKey: 'cleric-1-divine-domain',
          expectedValue: 'Life Domain',
        },
      },
      {
        name: 'Blessed Healer',
        description: 'Beginning at 6th level, the healing spells you cast on others heal you as well. When you cast a spell of 1st level or higher that restores hit points to a creature other than you, you regain hit points equal to 2 + the spell\'s level.',
        levelAcquired: 6,
        requiredFeatureChoice: {
          featureKey: 'cleric-1-divine-domain',
          expectedValue: 'Life Domain',
        },
      },
      {
        name: 'Divine Strike',
        description: 'At 8th level, you gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 radiant damage to the target. When you reach 14th level, the extra damage increases to 2d8.',
        levelAcquired: 8,
        requiredFeatureChoice: {
          featureKey: 'cleric-1-divine-domain',
          expectedValue: 'Life Domain',
        },
      },
      {
        name: 'Supreme Healing',
        description: 'Starting at 17th level, when you would normally roll one or more dice to restore hit points with a spell, you instead use the highest number possible for each die.',
        levelAcquired: 17,
        requiredFeatureChoice: {
          featureKey: 'cleric-1-divine-domain',
          expectedValue: 'Life Domain',
        },
      },
    ],
    startingEquipment: {
      startingGoldFormula: '5d4 * 10',
      startingGoldAverage: 125,
      choices: [
        {
          label: 'Choose your weapon:',
          options: [
            { label: '(a) Light Crossbow and Bolts', items: ['Light Crossbow', 'Bolts'], type: 'bundle' },
            { label: '(b) Simple Weapon', type: 'choice', weaponCategories: ['Simple Melee', 'Simple Ranged'] }
          ]
        }
      ],
      fixedEquipment: ['Scale Mail', 'Shield', 'Priest\'s Pack', 'Holy Symbol: Amulet']
    }
  },
  {
    name: 'Druid',
    hitDie: 8,
    primaryAbility: 'wisdom',
    savingThrows: ['intelligence', 'wisdom'],
    skillProficienciesChoices: 2,
    skillOptions: ['arcana', 'animalHandling', 'insight', 'medicine', 'nature', 'perception', 'religion', 'survival'],
    asiLevels: [4, 8, 12, 16, 19],
    multiclassing: {
      prerequisites: [{ ability: 'wisdom', min: 13 }],
      proficienciesGained: {
        armor: ['Light', 'Medium', 'Shield']
      }
    },
    spellcastingAbility: 'wisdom',
    spellPrepType: 'prepared',
    features: [
      {
        name: 'Druidic',
        description: 'You know Druidic, the secret language of your circle. You know Druidic, the secret language of your circle. You can speak it and use it to leave hidden messages. You and others who know this language automatically spot such a message. Otherwise, anyone who spots it succeeds on a DC 15 Wisdom (Perception) check to realize it\'s a message.',
        levelAcquired: 1
      },
      {
        name: 'Spellcasting',
        description: 'You draw on the divine magic of nature to cast spells. Drawing on the divine essence of nature itself, you can cast spells to transform that essence into magical effects. See Spells Lists and see chapter 10 for the general rules of spellcasting and chapter 11 for the druid spell list.',
        levelAcquired: 1
      },
      {
        name: 'Wild Shape',
        description: 'You can use your action to magically assume the shape of a beast. Starting at 2nd level, you can use your action to magically assume the shape of a beast that you have seen before. You can use this feature twice. You have a number of uses equal to your druid level, and you regain all expended uses when you finish a long rest. You can stay in a beast shape for a number of hours equal to half your druid level (rounded down). You then revert to your normal form unless you expend another use of this feature. You can revert to your normal form early by using a bonus action on your turn. You automatically revert if you fall unconscious, drop to 0 hit points, or die.',
        levelAcquired: 2
      },
      {
        name: 'Druid Circle',
        description: 'Your circle grants you special features. At 2nd level, you choose to identify with a circle of druids. Your choice grants you features at 2nd level and again at 6th, 10th, and 14th levels.',
        levelAcquired: 2,
        choices: {
          count: 1,
          options: ['Circle of the Land', 'Circle of the Moon'],
          optionDetails: {
            'Circle of the Land': 'Deepen your spellcasting through regional nature magic and improved resource recovery.',
            'Circle of the Moon': 'Specialize in stronger Wild Shape combat forms and more aggressive shapeshifting tactics.'
          }
        }
      },
      {
        name: 'Ability Score Improvement',
        description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.',
        levelAcquired: 4
      },
      {
        name: 'Timeless Body',
        description: 'The primal magic that you wield causes you to age more slowly. Starting at 18th level, the primal magic that you wield causes you to age more slowly. For every 10 years that pass, your body ages only 1 year.',
        levelAcquired: 18
      },
      {
        name: 'Beast Spells',
        description: 'You can cast many of your druid spells in any shape you assume using Wild Shape. Beginning at 18th level, you can cast many of your druid spells in any shape you assume using Wild Shape. You can perform the somatic and verbal components of a druid spell while in a beast shape, but you aren\'t able to provide material components.',
        levelAcquired: 18
      },
      {
        name: 'Archdruid',
        description: 'You can now use your Wild Shape an unlimited number of times. At 20th level, you can now use your Wild Shape an unlimited number of times. Additionally, you can ignore the verbal and somatic components of your druid spells, as well as any material components that lack a cost and aren\'t consumed by a spell. You gain this benefit in both your normal shape and your beast shape from Wild Shape.',
        levelAcquired: 20
      },
      // Circle of the Land
      {
        name: 'Bonus Cantrip',
        description: 'When you choose this circle at 2nd level, you learn one additional druid cantrip of your choice.',
        levelAcquired: 2,
        requiredFeatureChoice: {
          featureKey: 'druid-2-druid-circle',
          expectedValue: 'Circle of the Land',
        },
      },
      {
        name: 'Natural Recovery',
        description: 'Starting at 2nd level, you can regain some of your magical energy by sitting in meditation and communing with nature. During a short rest, you choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your druid level (rounded up), and none of the slots can be 6th level or higher. You can\'t use this feature again until you finish a long rest.',
        levelAcquired: 2,
        requiredFeatureChoice: {
          featureKey: 'druid-2-druid-circle',
          expectedValue: 'Circle of the Land',
        },
      },
      {
        name: 'Circle Spells',
        description: 'Your mystical connection to the land infuses you with the ability to cast certain spells. At 3rd, 5th, 7th, and 9th level you gain access to circle spells connected to the land where you became a druid. Choose that land—arctic, coast, desert, forest, grassland, mountain, or swamp. Once you gain access to a circle spell, you always have it prepared, and it doesn\'t count against the number of spells you can prepare each day.',
        levelAcquired: 3,
        requiredFeatureChoice: {
          featureKey: 'druid-2-druid-circle',
          expectedValue: 'Circle of the Land',
        },
      },
      {
        name: 'Land\'s Stride',
        description: 'Starting at 6th level, moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard. In addition, you have advantage on saving throws against plants that are magically created or manipulated to impede movement.',
        levelAcquired: 6,
        requiredFeatureChoice: {
          featureKey: 'druid-2-druid-circle',
          expectedValue: 'Circle of the Land',
        },
      },
      {
        name: 'Nature\'s Ward',
        description: 'When you reach 10th level, you can\'t be charmed or frightened by elementals or fey, and you are immune to poison and disease.',
        levelAcquired: 10,
        requiredFeatureChoice: {
          featureKey: 'druid-2-druid-circle',
          expectedValue: 'Circle of the Land',
        },
      },
      {
        name: 'Nature\'s Sanctuary',
        description: 'When you reach 14th level, creatures of the natural world sense your connection to nature and become hesitant to attack you. When a beast or plant creature attacks you, that creature must make a Wisdom saving throw against your druid spell save DC. On a failed save, the creature must choose a different target, or the attack automatically misses. On a successful save, the creature is immune to this effect for 24 hours.',
        levelAcquired: 14,
        requiredFeatureChoice: {
          featureKey: 'druid-2-druid-circle',
          expectedValue: 'Circle of the Land',
        },
      },
    ],
    startingEquipment: {
      startingGoldFormula: '2d4 * 10',
      startingGoldAverage: 50,
      choices: [
        {
          label: 'Choose your weapon:',
          options: [
            { label: '(a) Scimitar', items: ['Scimitar'], type: 'bundle' },
            { label: '(b) Simple Melee Weapon (non-metal)', items: ['Club', 'Dagger', 'Greatclub', 'Light Hammer', 'Quarterstaff', 'Sickle', 'Spear'], type: 'choice' }
          ]
        }
      ],
      fixedEquipment: ['Leather Armor', 'Explorer\'s Pack', 'Druidic Focus: Sprig of Mistletoe']
    }
  },
  {
    name: 'Fighter',
    hitDie: 10,
    primaryAbility: 'strength',
    savingThrows: ['strength', 'constitution'],
    skillProficienciesChoices: 2,
    skillOptions: ['acrobatics', 'animalHandling', 'athletics', 'history', 'insight', 'intimidation', 'perception', 'survival'],
    asiLevels: [4, 6, 8, 12, 14, 16, 19],
    multiclassing: {
      prerequisites: [{ ability: 'strength', min: 13 }],
      proficienciesGained: {
        armor: ['Light', 'Medium', 'Shield'],
        weapons: ['Simple', 'Martial']
      }
    },
    features: [
      {
        name: 'Fighting Style',
        description: 'You adopt a particular style of fighting as your specialty. You adopt a particular style of fighting as your specialty. You can\'t take a Fighting Style option more than once, even if you later get to choose again.',
        levelAcquired: 1,
        choices: {
          count: 1,
          options: ['Archery', 'Defense', 'Dueling', 'Great Weapon Fighting', 'Protection', 'Two-Weapon Fighting'],
          optionDetails: {
            'Archery': 'You gain a +2 bonus to attack rolls you make with ranged weapons.',
            'Defense': 'While you are wearing armor, you gain a +1 bonus to AC.',
            'Dueling': 'When wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls.',
            'Great Weapon Fighting': 'When you roll a 1 or 2 on weapon damage with a two-handed or versatile weapon used in two hands, you can reroll the die.',
            'Protection': 'While wielding a shield, you can use your reaction to impose disadvantage on an attack against an ally within 5 feet.',
            'Two-Weapon Fighting': 'When fighting with two weapons, you can add your ability modifier to the damage of the off-hand attack.'
          }
        }
      },
      {
        name: 'Second Wind',
        description: 'You have a limited well of stamina that you can draw on to protect yourself. You have a limited well of stamina that you can draw on to protect yourself. On your turn, you can use a bonus action to regain a number of hit points equal to 1d10 + your fighter level. Once you use this feature, you must finish a short or long rest before you can use it again.',
        levelAcquired: 1
      },
      {
        name: 'Action Surge',
        description: 'You can push yourself beyond your normal limits for a moment. Starting at 2nd level, you can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action on top of your regular action and a possible bonus action. Once you use this feature, you must finish a short or long rest before you can use it again. Starting at 17th level, you can use it twice before a rest, but only once on the same turn.',
        levelAcquired: 2
      },
      {
        name: 'Martial Archetype',
        description: 'Choose an archetype that you strive to emulate. At 3rd level, you choose an archetype that you strive to emulate in your combat styles and techniques. Choose Champion, Battle Master, or Eldritch Knight, all detailed at the end of the class description. The archetype you choose grants you features at 3rd level and again at 7th, 10th, 15th, and 18th level.',
        levelAcquired: 3,
        choices: {
          count: 1,
          options: ['Champion', 'Battle Master', 'Eldritch Knight'],
          optionDetails: {
            'Champion': 'Focus on straightforward martial excellence with improved critical hits and strong physical prowess.',
            'Battle Master': 'Use tactical maneuvers and superiority dice to control the battlefield and support allies.',
            'Eldritch Knight': 'Blend weapon combat with wizardly spells for a durable arcane warrior style.'
          }
        }
      },
      {
        name: 'Ability Score Improvement',
        description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. When you reach 4th level, and again at 6th, 8th, 12th, 14th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.',
        levelAcquired: 4
      },
      {
        name: 'Extra Attack',
        description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn. Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn. The number of attacks increases to three when you reach 11th level in this class and to four when you reach 20th level in this class.',
        levelAcquired: 5
      },
      {
        name: 'Indomitable',
        description: 'You can reroll a saving throw that you fail. Beginning at 9th level, you can reroll a saving throw that you fail. If you do so, you must use the new roll, and you can\'t use this feature again until you finish a long rest. You can use this feature twice before a long rest when you reach 13th level in this class and three times before a long rest when you reach 17th level in this class.',
        levelAcquired: 9
      },
      // Champion
      {
        name: 'Improved Critical',
        description: 'Beginning when you choose this archetype at 3rd level, your weapon attacks score a critical hit on a roll of 19 or 20.',
        levelAcquired: 3,
        requiredFeatureChoice: {
          featureKey: 'fighter-3-martial-archetype',
          expectedValue: 'Champion',
        },
      },
      {
        name: 'Remarkable Athlete',
        description: 'Starting at 7th level, you can add half your proficiency bonus (round up) to any Strength, Dexterity, or Constitution check you make that doesn\'t already use your proficiency bonus. In addition, when you make a running long jump, the distance you can cover increases by a number of feet equal to your Strength modifier.',
        levelAcquired: 7,
        requiredFeatureChoice: {
          featureKey: 'fighter-3-martial-archetype',
          expectedValue: 'Champion',
        },
      },
      {
        name: 'Additional Fighting Style',
        description: 'At 10th level, you can choose a second option from the Fighting Style class feature.',
        levelAcquired: 10,
        requiredFeatureChoice: {
          featureKey: 'fighter-3-martial-archetype',
          expectedValue: 'Champion',
        },
      },
      {
        name: 'Superior Critical',
        description: 'Starting at 15th level, your weapon attacks score a critical hit on a roll of 18–20.',
        levelAcquired: 15,
        requiredFeatureChoice: {
          featureKey: 'fighter-3-martial-archetype',
          expectedValue: 'Champion',
        },
      },
      {
        name: 'Survivor',
        description: 'At 18th level, you attain the pinnacle of resilience in battle. At the start of each of your turns, you regain hit points equal to 5 + your Constitution modifier if you have no more than half of your hit points left. You don\'t gain this benefit if you have 0 hit points.',
        levelAcquired: 18,
        requiredFeatureChoice: {
          featureKey: 'fighter-3-martial-archetype',
          expectedValue: 'Champion',
        },
      },
      // Battle Master
      {
        name: 'Combat Superiority',
        description: 'When you choose this archetype at 3rd level, you learn maneuvers that are fueled by special dice called superiority dice. You learn three maneuvers of your choice. You have four superiority dice, which are d8s. A superiority die is expended when you use it. You regain all of your expended superiority dice when you finish a short or long rest. You gain another superiority die at 7th level and one more at 15th level.',
        levelAcquired: 3,
        requiredFeatureChoice: {
          featureKey: 'fighter-3-martial-archetype',
          expectedValue: 'Battle Master',
        },
      },
      {
        name: 'Know Your Enemy',
        description: 'Starting at 7th level, if you spend at least 1 minute observing or interacting with another creature outside combat, you can learn certain information about its capabilities compared to your own. The DM tells you if the creature is your equal, superior, or inferior in regard to two of the following characteristics of your choice: Strength score, Dexterity score, Constitution score, Armor Class, Current hit points, Total class levels, Fighter class levels.',
        levelAcquired: 7,
        requiredFeatureChoice: {
          featureKey: 'fighter-3-martial-archetype',
          expectedValue: 'Battle Master',
        },
      },
      {
        name: 'Improved Combat Superiority',
        description: 'At 10th level, your superiority dice turn into d10s. At 18th level, they turn into d12s.',
        levelAcquired: 10,
        requiredFeatureChoice: {
          featureKey: 'fighter-3-martial-archetype',
          expectedValue: 'Battle Master',
        },
      },
      {
        name: 'Relentless',
        description: 'Starting at 15th level, when you roll initiative and have no superiority dice remaining, you regain 1 superiority die.',
        levelAcquired: 15,
        requiredFeatureChoice: {
          featureKey: 'fighter-3-martial-archetype',
          expectedValue: 'Battle Master',
        },
      },
      // Eldritch Knight
      {
        name: 'Spellcasting',
        description: 'When you reach 3rd level, you augment your martial prowess with the ability to cast spells. You learn two cantrips of your choice from the wizard spell list. You learn and prepare spells from the wizard spell list. The Eldritch Knight Spellcasting table shows how many spell slots you have to cast your spells of 1st level and higher.',
        levelAcquired: 3,
        requiredFeatureChoice: {
          featureKey: 'fighter-3-martial-archetype',
          expectedValue: 'Eldritch Knight',
        },
      },
      {
        name: 'Weapon Bond',
        description: 'At 3rd level, you learn a ritual that creates a magical bond between yourself and one weapon. You perform the ritual over the course of 1 hour, which can be done during a short rest. Once you have bonded a weapon to yourself, you can\'t be disarmed of that weapon unless you are incapacitated. If it is on the same plane of existence, you can summon that weapon to your hand as a bonus action.',
        levelAcquired: 3,
        requiredFeatureChoice: {
          featureKey: 'fighter-3-martial-archetype',
          expectedValue: 'Eldritch Knight',
        },
      },
      {
        name: 'War Magic',
        description: 'Beginning at 7th level, when you use your action to cast a cantrip, you can make one weapon attack as a bonus action.',
        levelAcquired: 7,
        requiredFeatureChoice: {
          featureKey: 'fighter-3-martial-archetype',
          expectedValue: 'Eldritch Knight',
        },
      },
      {
        name: 'Eldritch Strike',
        description: 'At 10th level, you learn how to make your weapon strikes undercut a creature\'s resistance to your spells. When you hit a creature with a weapon attack, that creature has disadvantage on the next saving throw it makes against a spell you cast before the end of your next turn.',
        levelAcquired: 10,
        requiredFeatureChoice: {
          featureKey: 'fighter-3-martial-archetype',
          expectedValue: 'Eldritch Knight',
        },
      },
      {
        name: 'Arcane Charge',
        description: 'At 15th level, you gain the ability to teleport up to 30 feet to an unoccupied space you can see when you use your Action Surge. You can teleport before or after the additional action.',
        levelAcquired: 15,
        requiredFeatureChoice: {
          featureKey: 'fighter-3-martial-archetype',
          expectedValue: 'Eldritch Knight',
        },
      },
      {
        name: 'Improved War Magic',
        description: 'Starting at 18th level, when you use your action to cast a spell, you can make one weapon attack as a bonus action.',
        levelAcquired: 18,
        requiredFeatureChoice: {
          featureKey: 'fighter-3-martial-archetype',
          expectedValue: 'Eldritch Knight',
        },
      },
    ],
    startingEquipment: {
      startingGoldFormula: '5d4 * 10',
      startingGoldAverage: 125,
      choices: [
        {
          label: 'Choose your armor:',
          options: [
            { label: '(a) Chain Mail', items: ['Chain Mail'], type: 'bundle' },
            { label: '(b) Leather Armor, Longbow, and Arrows', items: ['Leather Armor', 'Longbow', 'Arrows'], type: 'bundle' }
          ]
        },
        {
          label: 'Choose your weapon:',
          options: [
            { label: '(a) Martial Weapon and Shield', type: 'choice', weaponClasses: ['Martial'] },
            { label: '(b) Two Martial Weapons', type: 'choice', weaponClasses: ['Martial'], count: 2 }
          ]
        }
      ],
      fixedEquipment: ['Dungeoneer\'s Pack']
    }
  },
  {
    name: 'Monk',
    hitDie: 8,
    primaryAbility: 'dexterity',
    savingThrows: ['strength', 'dexterity'],
    skillProficienciesChoices: 1,
    skillOptions: ['acrobatics', 'athletics', 'history', 'insight', 'religion', 'stealth'],
    asiLevels: [4, 8, 12, 16, 19],
    multiclassing: {
      prerequisites: [{ ability: 'dexterity', min: 13 }, { ability: 'wisdom', min: 13 }],
      proficienciesGained: {
        weapons: ['Simple', 'shortsword']
      }
    },
    features: [
      {
        name: 'Unarmored Defense',
        description: 'While you are wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier. Beginning at 1st level, while you are wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier.',
        levelAcquired: 1,
        effects: {
          acCalculation: {
            base: 10,
            abilityModifiers: ['dexterity', 'wisdom'],
            requiresNoArmor: true,
            requiresNoShield: true,
            allowShield: false,
          }
        }
      },
      {
        name: 'Martial Arts',
        description: 'Your practice of martial arts gives you mastery of combat styles. At 1st level, your practice of martial arts gives you mastery of combat styles that use unarmed strikes and monk weapons, which are shortswords and any simple melee weapons that don\'t have the two-handed or heavy property. You gain the following benefits while you are unarmed or wielding only monk weapons and you aren\'t wearing armor or wielding a shield: You can use Dexterity instead of Strength for the attack and damage rolls of your unarmed strikes and monk weapons. You can roll a d4 in place of the normal damage of your unarmed strike. This die changes as you gain monk levels, as shown in the Martial Arts column of the Monk table. When you use the Attack action with an unarmed strike or a monk weapon on your turn, you can make one unarmed strike as a bonus action.',
        levelAcquired: 1
      },
      {
        name: 'Ki',
        description: 'You can tap into a reserve of mystical energy. Starting at 2nd level, you can tap into a reserve of mystical energy. This energy is represented by your Ki points. Your Ki pool has a number of points equal to your monk level + your Wisdom modifier. You can spend these points to fuel various Ki features. You start knowing three such features: Flurry of Blows, Patient Defense, and Step of the Wind.',
        levelAcquired: 2
      },
      {
        name: 'Unarmored Movement',
        description: 'Your speed increases by 10 feet while you are not wearing armor or wielding a shield. At 2nd level, your speed increases by 10 feet while you aren\'t wearing armor or wielding a shield. This bonus increases when you reach certain monk levels, as shown in the Monk table. At 9th level, you gain the ability to move along vertical surfaces and across liquids without falling during your turn.',
        levelAcquired: 2
      },
      {
        name: 'Monastic Tradition',
        description: 'Choose a tradition that represents your training. At 3rd level, you commit yourself to a monastic tradition: the Way of the Open Hand, the Way of Shadow, or the Way of the Four Elements, all detailed at the end of the class description. Your tradition grants you features at 3rd level and again at 6th, 11th, and 17th level.',
        levelAcquired: 3,
        choices: {
          count: 1,
          options: ['Way of the Open Hand', 'Way of Shadow', 'Way of the Four Elements'],
          optionDetails: {
            'Way of the Open Hand': 'Refine pure martial technique with control effects that shove, topple, and disrupt foes.',
            'Way of Shadow': 'Adopt stealth and deception tools, using ki to create darkness and move unseen.',
            'Way of the Four Elements': 'Channel elemental disciplines, spending ki to produce spell-like elemental effects.'
          }
        }
      },
      {
        name: 'Deflect Missiles',
        description: 'You can use your reaction to deflect or catch a missile. At 3rd level, you can use your reaction to deflect or catch a missile when you are hit by a ranged weapon attack. When you do so, the damage you take from the attack is reduced by 1d10 + your Dexterity modifier + your monk level. If you reduce the damage to 0, you can catch the missile if it is small enough for you to hold in one hand and you have at least one hand free.',
        levelAcquired: 3
      },
      {
        name: 'Ability Score Improvement',
        description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.',
        levelAcquired: 4
      },
      {
        name: 'Slow Fall',
        description: 'You can use your reaction to reduce any falling damage you take. Starting at 4th level, you can use your reaction when you fall to reduce any falling damage you take by an amount equal to five times your monk level.',
        levelAcquired: 4
      },
      {
        name: 'Extra Attack',
        description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn. Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.',
        levelAcquired: 5
      },
      {
        name: 'Stunning Strike',
        description: 'You can interfere with the flow of ki in an opponent\'s body. Starting at 5th level, you can interfere with the flow of ki in an opponent\'s body. When you hit another creature with a melee weapon attack, you can spend 1 Ki point to attempt a stunning strike. The target must succeed on a Constitution saving throw or be stunned until the end of your next turn.',
        levelAcquired: 5
      },
      {
        name: 'Ki-Empowered Strikes',
        description: 'Your unarmed strikes count as magical for the purpose of overcoming resistance and immunity. Starting at 6th level, your unarmed strikes count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.',
        levelAcquired: 6
      },
      {
        name: 'Evasion',
        description: 'Your instinctive agility lets you dodge out of the way of certain area effects. At 7th level, your instinctive agility lets you dodge out of the way of certain area effects, such as a blue dragon\'s lightning breath or a fireball spell. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.',
        levelAcquired: 7
      },
      {
        name: 'Stillness of Mind',
        description: 'You can use your action to end one effect on yourself that is causing you to be charmed or frightened. Starting at 7th level, you can use your action to end one effect on yourself that is causing you to be charmed or frightened.',
        levelAcquired: 7
      },
      {
        name: 'Purity of Body',
        description: 'Your training has made you immune to disease and poison. At 10th level, your training has made you immune to disease and poison.',
        levelAcquired: 10
      },
      {
        name: 'Tongue of the Sun and Moon',
        description: 'You learn to touch the mind of other creatures. Starting at 13th level, you learn to touch the mind of other creatures. You can now speak and understand every language.',
        levelAcquired: 13
      },
      {
        name: 'Diamond Soul',
        description: 'Your mastery of ki grants you proficiency in all saving throws. At 14th level, your mastery of ki grants you proficiency in all saving throws. Additionally, when you fail a saving throw, you can spend 1 Ki point to reroll it and take the second result.',
        levelAcquired: 14
      },
      {
        name: 'Timeless Body',
        description: 'Your ki sustains you so that you suffer none of the frailty of old age. At 15th level, your ki sustains you so that you suffer none of the frailty of old age. You can\'t be aged magically, and you ignore all extraneous penalties and benefits of old age.',
        levelAcquired: 15
      },
      {
        name: 'Empty Body',
        description: 'You can use your action to become invisible for 1 minute. At 18th level, you can use your action to become invisible for 1 minute. You immediately regain 10 Ki points when you do so. Additionally, you can spend 8 Ki points to cast the astral projection spell without material components.',
        levelAcquired: 18
      },
      {
        name: 'Perfect Self',
        description: 'When you roll for initiative and have no ki remaining, you regain 4 ki points. At 20th level, when you roll for initiative and have no Ki points remaining, you regain 4 Ki points.',
        levelAcquired: 20
      },
      // Way of the Open Hand
      {
        name: 'Open Hand Technique',
        description: 'Starting when you choose this tradition at 3rd level, you can manipulate your enemy\'s ki when you harness your own. Whenever you hit a creature with one of the attacks granted by your Flurry of Blows, you can impose one of the following effects on that target: It must succeed on a Dexterity saving throw or be knocked prone. It must make a Strength saving throw. If it fails, you can push it up to 15 feet away from you. It can\'t take reactions until the end of your next turn.',
        levelAcquired: 3,
        requiredFeatureChoice: {
          featureKey: 'monk-3-monastic-tradition',
          expectedValue: 'Way of the Open Hand',
        },
      },
      {
        name: 'Wholeness of Body',
        description: 'At 6th level, you gain the ability to heal yourself. As an action, you can regain hit points equal to three times your monk level. You must finish a long rest before you can use this feature again.',
        levelAcquired: 6,
        requiredFeatureChoice: {
          featureKey: 'monk-3-monastic-tradition',
          expectedValue: 'Way of the Open Hand',
        },
      },
      {
        name: 'Tranquility',
        description: 'Beginning at 11th level, you can enter a special meditation that surrounds you with an aura of peace. At the end of a long rest, you gain the effect of a sanctuary spell that lasts until the start of your next long rest (the spell can end early as normal). The saving throw DC for the spell equals 8 + your Wisdom modifier + your proficiency bonus.',
        levelAcquired: 11,
        requiredFeatureChoice: {
          featureKey: 'monk-3-monastic-tradition',
          expectedValue: 'Way of the Open Hand',
        },
      },
      {
        name: 'Quivering Palm',
        description: 'At 17th level, you gain the ability to set up lethal vibrations in someone\'s body. When you hit a creature with an unarmed strike, you can spend 3 ki points to start these imperceptible vibrations, which last for a number of days equal to your monk level. The vibrations are harmless unless you use your action to end them. To do so, you and the target must be on the same plane of existence. When you use this action, the creature must make a Constitution saving throw. If it fails, it is reduced to 0 hit points. If it succeeds, it takes 10d10 necrotic damage. You can have only one creature under the effect of this feature at a time. You can choose to end the vibrations harmlessly without using an action.',
        levelAcquired: 17,
        requiredFeatureChoice: {
          featureKey: 'monk-3-monastic-tradition',
          expectedValue: 'Way of the Open Hand',
        },
      },
      // Way of Shadow
      {
        name: 'Shadow Arts',
        description: 'Starting when you choose this tradition at 3rd level, you can use your ki to duplicate the effects of certain spells. As an action, you can spend 2 ki points to cast Darkness, Darkvision, Pass Without Trace, or Silence, without providing material components. Additionally, you gain the Minor Illusion cantrip if you don\'t already know it.',
        levelAcquired: 3,
        requiredFeatureChoice: {
          featureKey: 'monk-3-monastic-tradition',
          expectedValue: 'Way of Shadow',
        },
      },
      {
        name: 'Shadow Step',
        description: 'At 6th level, you gain the ability to step from one shadow into another. When you are in dim light or darkness, as a bonus action you can teleport up to 60 feet to an unoccupied space you can see that is also in dim light or darkness. You then have advantage on the first melee attack you make before the end of the turn.',
        levelAcquired: 6,
        requiredFeatureChoice: {
          featureKey: 'monk-3-monastic-tradition',
          expectedValue: 'Way of Shadow',
        },
      },
      {
        name: 'Cloak of Shadows',
        description: 'By 11th level, you have learned to become one with the shadows. When you are in an area of dim light or darkness, you can use your action to become invisible. You remain invisible until you make an attack, cast a spell, or are in an area of bright light.',
        levelAcquired: 11,
        requiredFeatureChoice: {
          featureKey: 'monk-3-monastic-tradition',
          expectedValue: 'Way of Shadow',
        },
      },
      {
        name: 'Opportunist',
        description: 'At 17th level, you can exploit a creature\'s momentary distraction when it is hit by an attack. Whenever a creature within 5 feet of you is hit by an attack made by a creature other than you, you can use your reaction to make a melee attack against that creature.',
        levelAcquired: 17,
        requiredFeatureChoice: {
          featureKey: 'monk-3-monastic-tradition',
          expectedValue: 'Way of Shadow',
        },
      },
      // Way of the Four Elements
      {
        name: 'Disciple of the Elements',
        description: 'When you choose this tradition at 3rd level, you learn magical disciplines that harness the power of the four elements. You know the Elemental Attunement discipline and one other elemental discipline of your choice. You learn one additional elemental discipline of your choice at 6th, 11th, and 17th level. Whenever you learn a new elemental discipline, you can also replace one elemental discipline that you already know with a different discipline.',
        levelAcquired: 3,
        requiredFeatureChoice: {
          featureKey: 'monk-3-monastic-tradition',
          expectedValue: 'Way of the Four Elements',
        },
      },
    ],
    startingEquipment: {
      startingGoldFormula: '5d4',
      startingGoldAverage: 12,
      choices: [
        {
          label: 'Choose your weapon:',
          options: [
            { label: '(a) Shortsword', items: ['Shortsword'], type: 'bundle' },
            { label: '(b) Simple Weapon', type: 'choice', weaponClasses: ['Simple'] }
          ]
        }
      ],
      fixedEquipment: ['Dungeoneer\'s Pack']
    }
  },
  {
    name: 'Paladin',
    hitDie: 10,
    primaryAbility: 'strength',
    savingThrows: ['wisdom', 'charisma'],
    skillProficienciesChoices: 2,
    skillOptions: ['athletics', 'insight', 'intimidation', 'medicine', 'persuasion', 'religion'],
    asiLevels: [4, 8, 12, 16, 19],
    spellcastingAbility: 'charisma',
    spellPrepType: 'prepared',
    multiclassing: {
      prerequisites: [{ ability: 'strength', min: 13 }, { ability: 'charisma', min: 13 }],
      proficienciesGained: {
        armor: ['Light', 'Medium', 'Shield'],
        weapons: ['Simple', 'Martial']
      }
    },
    features: [
      {
        name: 'Divine Sense',
        description: 'Your senses allow you to detect the presence of celestial, fiendish, or undead creatures. The presence of strong evil registers on your senses like a noxious odor, and powerful good rings like heavenly music in your ears. As an action, you can open your awareness to detect such forces. Until the end of your next turn, you know the location of any celestial, fiend, or undead within 60 feet of you that isn\'t behind total cover. You know the type (celestial, fiend, or undead) of any being whose presence you sense, but not its identity.',
        levelAcquired: 1
      },
      {
        name: 'Lay on Hands',
        description: 'Your blessed touch can heal wounds. Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you take a long rest. With that pool, you can restore a total number of hit points equal to your paladin level × 5. As an action, you can touch a creature and draw power from the pool to restore a number of hit points to that creature, up to the maximum amount remaining in your pool.',
        levelAcquired: 1
      },
      {
        name: 'Divine Smite',
        description: 'When you hit a creature with a melee weapon attack, you can invoke divine power. Starting at 2nd level, when you hit a creature with a melee weapon attack, you can invoke divine power to deal radiant damage to the target, in addition to the weapon\'s damage. The extra damage is 1d6 + half your paladin level, rounded up. The extra damage increases by 1d6 when you reach 11th level in this class (2d6) and 17th level in this class (3d6).',
        levelAcquired: 2
      },
      {
        name: 'Fighting Style',
        description: 'You adopt a particular style of fighting as your specialty. At 2nd level, you adopt a particular style of fighting as your specialty. You can\'t take a Fighting Style option more than once, even if you later get to choose again.',
        levelAcquired: 2,
        choices: {
          count: 1,
          options: ['Defense', 'Dueling', 'Great Weapon Fighting', 'Protection'],
          optionDetails: {
            'Defense': 'While you are wearing armor, you gain a +1 bonus to AC.',
            'Dueling': 'When wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls.',
            'Great Weapon Fighting': 'When you roll a 1 or 2 on weapon damage with a two-handed or versatile weapon used in two hands, you can reroll the die.',
            'Protection': 'While wielding a shield, you can use your reaction to impose disadvantage on an attack against an ally within 5 feet.'
          }
        }
      },
      {
        name: 'Divine Health',
        description: 'Your divine healing causes you to be immune to disease. Starting at 3rd level, your divine healing causes you to be immune to disease.',
        levelAcquired: 3
      },
      {
        name: 'Sacred Oath',
        description: 'Choose an oath that you will swear to uphold. When you reach 3rd level, you swear the oath that binds you as a paladin forever. Up to this time you have been in a preparatory stage, committed to the path but not yet sworn to it. Now you choose the Oath of Devotion, the Oath of the Ancients, or the Oath of Vengeance, all detailed at the end of the class description. Your choice grants you features at 3rd level and again at 7th, 15th, and 20th level.',
        levelAcquired: 3,
        choices: {
          count: 1,
          options: ['Oath of Devotion', 'Oath of the Ancients', 'Oath of Vengeance'],
          optionDetails: {
            'Oath of Devotion': 'Uphold ideals of honesty, courage, compassion, and justice as a classic holy champion.',
            'Oath of the Ancients': 'Defend life, beauty, and light through nature-aligned paladin magic and resilience.',
            'Oath of Vengeance': 'Pursue and punish great evil with relentless focus and hard-hitting pursuit tools.'
          }
        }
      },
      {
        name: 'Ability Score Improvement',
        description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.',
        levelAcquired: 4
      },
      {
        name: 'Extra Attack',
        description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn. Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.',
        levelAcquired: 5
      },
      {
        name: 'Aura of Protection',
        description: 'Whenever you or a friendly creature within 10 feet of you must make a saving throw, the creature gains a bonus equal to your Charisma modifier. Starting at 6th level, whenever you or a friendly creature within 10 feet of you must make a saving throw, the creature gains a bonus equal to your Charisma modifier (with a minimum bonus of +1). You must be conscious to grant this bonus. At 18th level, the range of this aura increases to 30 feet.',
        levelAcquired: 6
      },
      {
        name: 'Aura of Courage',
        description: 'You and friendly creatures within 10 feet of you can\'t be frightened while you are conscious. Starting at 10th level, you and friendly creatures within 10 feet of you can\'t be frightened while you are conscious. At 18th level, the range of this aura increases to 30 feet.',
        levelAcquired: 10
      },
      {
        name: 'Improved Divine Smite',
        description: 'Whenever you hit a creature with a melee weapon attack, you deal an extra 1d8 radiant damage. By 11th level, you are so suffused with divine righteousness that your melee strikes naturally deal radiant damage. Whenever you hit a creature with a melee weapon attack, you deal an extra 1d8 radiant damage.',
        levelAcquired: 11
      },
      {
        name: 'Cleansing Touch',
        description: 'You can use your action to end one spell on yourself or on one willing creature. Beginning at 14th level, you can use your action to end one spell on yourself or on one willing creature that you touch. You can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain all expended uses when you finish a long rest.',
        levelAcquired: 14
      },
      // Oath of Devotion
      {
        name: 'Channel Divinity (Devotion)',
        description: 'When you take this oath at 3rd level, you gain the following two Channel Divinity options. Sacred Weapon: As an action, you can imbue one weapon that you are holding with positive energy. For 1 minute, you add your Charisma modifier to attack rolls made with that weapon (with a minimum bonus of +1). The weapon also emits bright light in a 20-foot radius and dim light 20 feet beyond that. If the weapon is not already magical, it becomes magical for the duration. Turn the Unholy: As an action, you present your holy symbol and speak a prayer censuring fiends and undead. Each fiend or undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes damage.',
        levelAcquired: 3,
        requiredFeatureChoice: {
          featureKey: 'paladin-3-sacred-oath',
          expectedValue: 'Oath of Devotion',
        },
      },
      {
        name: 'Aura of Devotion',
        description: 'Starting at 7th level, you and friendly creatures within 10 feet of you can\'t be charmed while you are conscious. At 18th level, the range of this aura increases to 30 feet.',
        levelAcquired: 7,
        requiredFeatureChoice: {
          featureKey: 'paladin-3-sacred-oath',
          expectedValue: 'Oath of Devotion',
        },
      },
      {
        name: 'Purity of Spirit',
        description: 'Beginning at 15th level, you are always under the effects of a protection from evil and good spell.',
        levelAcquired: 15,
        requiredFeatureChoice: {
          featureKey: 'paladin-3-sacred-oath',
          expectedValue: 'Oath of Devotion',
        },
      },
      {
        name: 'Holy Nimbus',
        description: 'At 20th level, as an action, you can emanate an aura of sunlight. For 1 minute, bright light shines from you in a 30-foot radius, and dim light shines 30 feet beyond that. Whenever an enemy creature starts its turn in the bright light, the creature takes 10 radiant damage. In addition, for the duration, you have advantage on saving throws against spells cast by fiends or undead. Once you use this feature, you can\'t use it again until you finish a long rest.',
        levelAcquired: 20,
        requiredFeatureChoice: {
          featureKey: 'paladin-3-sacred-oath',
          expectedValue: 'Oath of Devotion',
        },
      },
    ],
    startingEquipment: {
      startingGoldFormula: '5d4 * 10',
      startingGoldAverage: 125,
      choices: [
        {
          label: 'Choose your weapon:',
          options: [
            { label: '(a) Martial Weapon and Shield', type: 'choice', weaponClasses: ['Martial'] },
            { label: '(b) Two Martial Weapons', type: 'choice', weaponClasses: ['Martial'], count: 2 }
          ]
        }
      ],
      fixedEquipment: ['Chain Mail', 'Holy Symbol: Amulet', 'Priest\'s Pack', 'Shield']
    }
  },
  {
    name: 'Ranger',
    hitDie: 10,
    primaryAbility: 'dexterity',
    savingThrows: ['strength', 'dexterity'],
    skillProficienciesChoices: 3,
    skillOptions: ['animalHandling', 'athletics', 'insight', 'investigation', 'nature', 'perception', 'stealth', 'survival'],
    asiLevels: [4, 8, 12, 16, 19],
    multiclassing: {
      prerequisites: [{ ability: 'dexterity', min: 13 }, { ability: 'wisdom', min: 13 }],
      proficienciesGained: {
        armor: ['Light', 'Medium', 'Shield'],
        weapons: ['Simple', 'Martial'],
        skills: 1
      }
    },
    features: [
      {
        name: 'Favored Enemy',
        description: 'You have significant experience studying, tracking, and combating a particular type of enemy. Beginning at 1st level, you have significant experience studying, tracking, and combating a particular type of enemy. Choose a type of favored enemy: aberrations, beasts, celestials, constructs, dragons, elementals, fey, fiends, giants, monstrosities, oozes, plants, or undead. You have advantage on Wisdom (Survival) checks to track your favored enemies, as well as on Intelligence checks to recall information about them.',
        levelAcquired: 1,
        choices: {
          count: 1,
          options: ['Aberrations', 'Beasts', 'Celestials', 'Constructs', 'Dragons', 'Elementals', 'Fey', 'Fiends', 'Giants', 'Monstrosities', 'Oozes', 'Plants', 'Undead'],
          optionDetails: {
            'Aberrations': 'You are trained to track aberrations and recall useful lore about them.',
            'Beasts': 'You are trained to track beasts and recall useful lore about them.',
            'Celestials': 'You are trained to track celestials and recall useful lore about them.',
            'Constructs': 'You are trained to track constructs and recall useful lore about them.',
            'Dragons': 'You are trained to track dragons and recall useful lore about them.',
            'Elementals': 'You are trained to track elementals and recall useful lore about them.',
            'Fey': 'You are trained to track fey and recall useful lore about them.',
            'Fiends': 'You are trained to track fiends and recall useful lore about them.',
            'Giants': 'You are trained to track giants and recall useful lore about them.',
            'Monstrosities': 'You are trained to track monstrosities and recall useful lore about them.',
            'Oozes': 'You are trained to track oozes and recall useful lore about them.',
            'Plants': 'You are trained to track dangerous plants and recall useful lore about them.',
            'Undead': 'You are trained to track undead and recall useful lore about them.'
          }
        }
      },
      {
        name: 'Natural Explorer',
        description: 'You are particularly familiar with one type of natural environment. You are particularly familiar with one type of natural environment and are adept at traveling and surviving in such regions. Choose one type of terrain: arctic, coast, desert, forest, grassland, hill, mountain, or swamp. When you make an Intelligence or Wisdom check related to your favored terrain, your proficiency bonus is doubled if you are using any of your trained skills.',
        levelAcquired: 1,
        choices: {
          count: 1,
          options: ['Arctic', 'Coast', 'Desert', 'Forest', 'Grassland', 'Hill', 'Mountain', 'Swamp'],
          optionDetails: {
            'Arctic': 'You are especially effective navigating and surviving arctic terrain, with stronger exploration checks there.',
            'Coast': 'You are especially effective navigating and surviving coastal terrain, with stronger exploration checks there.',
            'Desert': 'You are especially effective navigating and surviving desert terrain, with stronger exploration checks there.',
            'Forest': 'You are especially effective navigating and surviving forest terrain, with stronger exploration checks there.',
            'Grassland': 'You are especially effective navigating and surviving grassland terrain, with stronger exploration checks there.',
            'Hill': 'You are especially effective navigating and surviving hill terrain, with stronger exploration checks there.',
            'Mountain': 'You are especially effective navigating and surviving mountain terrain, with stronger exploration checks there.',
            'Swamp': 'You are especially effective navigating and surviving swamp terrain, with stronger exploration checks there.'
          }
        }
      },
      {
        name: 'Fighting Style',
        description: 'You adopt a particular style of fighting as your specialty. At 2nd level, you adopt a particular style of fighting as your specialty. Choose one of the following options. Once you choose a style, you can\'t take a Fighting Style option more than again, even if you later get to choose again.',
        levelAcquired: 2,
        choices: {
          count: 1,
          options: ['Archery', 'Defense', 'Dueling', 'Two-Weapon Fighting'],
          optionDetails: {
            'Archery': 'You gain a +2 bonus to attack rolls you make with ranged weapons.',
            'Defense': 'While you are wearing armor, you gain a +1 bonus to AC.',
            'Dueling': 'When wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls.',
            'Two-Weapon Fighting': 'When fighting with two weapons, you can add your ability modifier to the damage of the off-hand attack.'
          }
        }
      },
      {
        name: 'Ranger Archetype',
        description: 'Choose an archetype that you emulate in the exercise of your ranger abilities. At 3rd level, you choose an archetype that you emulate in the exercise of your ranger abilities. Choose Hunter or Beast Master, both detailed at the end of the class description. Your archetype choice grants you features at 3rd, 7th, 11th, and 15th level.',
        levelAcquired: 3,
        choices: {
          count: 1,
          options: ['Hunter', 'Beast Master'],
          optionDetails: {
            'Hunter': 'Specialize in personal combat techniques designed to counter a wide range of foes.',
            'Beast Master': 'Fight alongside a loyal animal companion that grows with your ranger training.'
          }
        }
      },
      {
        name: 'Primeval Awareness',
        description: 'You can use your action to focus your awareness on the world around you. Beginning at 3rd level, you can use your action to focus your awareness on the world around you. For 1 minute per ranger level, you can sense whether the following types of creatures are present within 1 mile of you (or within up to 6 miles if you are in your favored terrain): aberrations, celestials, dragons, elementals, fey, fiends, and undead.',
        levelAcquired: 3
      },
      {
        name: 'Ability Score Improvement',
        description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.',
        levelAcquired: 4
      },
      {
        name: 'Extra Attack',
        description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn. Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.',
        levelAcquired: 5
      },
      {
        name: 'Land\'s Stride',
        description: 'Moving through nonmagical difficult terrain costs you no extra movement. Starting at 8th level, moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard.',
        levelAcquired: 8
      },
      {
        name: 'Hide in Plain Sight',
        description: 'You can hide yourself from view in the wilderness. Starting at 10th level, you can hide yourself from view in the wilderness. Whenever you attempt to hide in your favored terrain, you can remain stationary without being observed by other creatures as long as you remain in your favored terrain.',
        levelAcquired: 10
      },
      {
        name: 'Vanish',
        description: 'You can use the Hide action as a bonus action. Starting at 14th level, you can use the Hide action as a bonus action on your turn. Also, you can\'t be tracked by nonmagical means, unless you choose to leave a trail.',
        levelAcquired: 14
      },
      {
        name: 'Feral Senses',
        description: 'Your connection to nature gives you preternatural awareness. At 18th level, you gain preternatural senses that help you fight creatures you can\'t see. When you attack a creature you can\'t see, your inability to see it doesn\'t impose disadvantage on your attack rolls against it. You are also aware of the location of any invisible creature within 30 feet of you.',
        levelAcquired: 18
      },
      {
        name: 'Foe Slayer',
        description: 'You become a master hunter. At 20th level, you become a master hunter. Once on each of your turns, you can add your Wisdom modifier to the attack roll or the damage roll of an attack you make against one of your favored enemies. You can choose to use this feature before or after the roll, but before any effects of the roll are applied.',
        levelAcquired: 20
      },
      // Hunter
      {
        name: 'Hunter\'s Prey',
        description: 'At 3rd level, you gain one of the following features of your choice. Colossus Slayer: Your tenacity can wear down the most potent foes. When you hit a creature with a weapon attack, the creature takes an extra 1d8 damage if it\'s below its hit point maximum. You can deal this extra damage only once per turn. Giant Killer: When a Large or larger creature within 5 feet of you hits or misses you with an attack, you can use your reaction to attack that creature immediately after its attack, provided that you can see the creature. Horde Breaker: Once on each of your turns when you make a weapon attack, you can make another attack with the same weapon against a different creature that is within 5 feet of the original target and within range of your weapon.',
        levelAcquired: 3,
        requiredFeatureChoice: {
          featureKey: 'ranger-3-ranger-archetype',
          expectedValue: 'Hunter',
        },
      },
      {
        name: 'Defensive Tactics',
        description: 'At 7th level, you gain one of the following features of your choice. Escape the Horde: Opportunity attacks against you are made with disadvantage. Multiattack Defense: When a creature hits you with an attack, you gain a +4 bonus to AC against all subsequent attacks made by that creature for the rest of the turn. Steel Will: You have advantage on saving throws against being frightened.',
        levelAcquired: 7,
        requiredFeatureChoice: {
          featureKey: 'ranger-3-ranger-archetype',
          expectedValue: 'Hunter',
        },
      },
      {
        name: 'Multiattack',
        description: 'At 11th level, you gain one of the following features of your choice. Volley: You can use your action to make a ranged attack against any number of creatures within 10 feet of a point you can see within your weapon\'s range. You must have ammunition for each target, as normal, and you make a separate attack roll for each target. Whirlwind Attack: You can use your action to make a melee attack against any number of creatures within 5 feet of you, with a separate attack roll for each target.',
        levelAcquired: 11,
        requiredFeatureChoice: {
          featureKey: 'ranger-3-ranger-archetype',
          expectedValue: 'Hunter',
        },
      },
      {
        name: 'Superior Hunter\'s Defense',
        description: 'At 15th level, you gain one of the following features of your choice. Evasion: When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail. Stand Against the Tide: When a hostile creature misses you with a melee attack, you can use your reaction to force that creature to repeat the same attack against another creature (other than itself) of your choice. Uncanny Dodge: When an attacker that you can see hits you with an attack, you can use your reaction to halve the attack\'s damage against you.',
        levelAcquired: 15,
        requiredFeatureChoice: {
          featureKey: 'ranger-3-ranger-archetype',
          expectedValue: 'Hunter',
        },
      },
      // Beast Master
      {
        name: 'Ranger\'s Companion',
        description: 'At 3rd level, you gain a beast companion that accompanies you on your adventures and is trained to fight alongside you. Choose a beast that is no larger than Medium and that has a challenge rating of 1/4 or lower. Add your proficiency bonus to the beast\'s AC, attack rolls, and damage rolls, as well as to any saving throws and skills it is proficient in. Its hit point maximum equals its normal maximum or four times your ranger level, whichever is higher.',
        levelAcquired: 3,
        requiredFeatureChoice: {
          featureKey: 'ranger-3-ranger-archetype',
          expectedValue: 'Beast Master',
        },
      },
      {
        name: 'Exceptional Training',
        description: 'Beginning at 7th level, on any of your turns when your beast companion doesn\'t attack, you can use a bonus action to command the beast to take the Dash, Disengage, or Help action on its turn. In addition, the beast\'s attacks now count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.',
        levelAcquired: 7,
        requiredFeatureChoice: {
          featureKey: 'ranger-3-ranger-archetype',
          expectedValue: 'Beast Master',
        },
      },
      {
        name: 'Bestial Fury',
        description: 'Starting at 11th level, when you command your beast companion to take the Attack action, the beast can make two attacks, or it can take the Multiattack action if it has that action.',
        levelAcquired: 11,
        requiredFeatureChoice: {
          featureKey: 'ranger-3-ranger-archetype',
          expectedValue: 'Beast Master',
        },
      },
      {
        name: 'Share Spells',
        description: 'Beginning at 15th level, when you cast a spell targeting yourself, you can also affect your beast companion with the spell if the beast is within 30 feet of you.',
        levelAcquired: 15,
        requiredFeatureChoice: {
          featureKey: 'ranger-3-ranger-archetype',
          expectedValue: 'Beast Master',
        },
      },
    ],
    startingEquipment: {
      startingGoldFormula: '5d4 * 10',
      startingGoldAverage: 125,
      choices: [
        {
          label: 'Choose your armor:',
          options: [
            { label: '(a) Scale Mail', items: ['Scale Mail'], type: 'bundle' },
            { label: '(b) Leather Armor', items: ['Leather Armor'], type: 'bundle' }
          ]
        },
        {
          label: 'Choose your weapons:',
          options: [
            { label: '(a) Two Shortswords', items: ['Shortsword', 'Shortsword'], type: 'bundle' },
            { label: '(b) Two Simple Melee Weapons', type: 'choice', weaponClasses: ['Simple'], weaponForms: ['Melee'], count: 2 }
          ]
        }
      ],
      fixedEquipment: ['Explorer\'s Pack', 'Longbow', 'Arrows']
    },
    spellcastingAbility: 'wisdom',
    spellPrepType: 'prepared',
  },
  {
    name: 'Rogue',
    hitDie: 8,
    primaryAbility: 'dexterity',
    savingThrows: ['dexterity', 'intelligence'],
    skillProficienciesChoices: 4,
    skillOptions: ['acrobatics', 'athletics', 'deception', 'insight', 'intimidation', 'investigation', 'perception', 'performance', 'persuasion', 'sleightOfHand', 'stealth'],
    asiLevels: [4, 8, 10, 12, 16, 19],
    multiclassing: {
      prerequisites: [{ ability: 'dexterity', min: 13 }],
      proficienciesGained: {
        armor: ['Light'],
        skills: 1,
        weapons: ['thieves tools']
      }
    },
    features: [
      {
        name: 'Expertise',
        description: 'Choose two of your skill proficiencies, or one of your skill proficiencies and your proficiency with thieves\' tools. At 1st level, choose two of your skill proficiencies, or one of your skill proficiencies and your proficiency with thieves\' tools. Your proficiency bonus is doubled for any ability check that uses either of these skills. At 6th level, you can choose another two skills (or thieves\' tools) to gain this benefit.',
        levelAcquired: 1,
        choices: {
          count: 2,
          options: ['acrobatics', 'athletics', 'deception', 'insight', 'intimidation', 'investigation', 'perception', 'performance', 'persuasion', 'sleightOfHand', 'stealth', 'thieves tools'],
          optionDetails: {
            acrobatics: 'Your proficiency bonus is doubled for ability checks you make using Acrobatics.',
            athletics: 'Your proficiency bonus is doubled for ability checks you make using Athletics.',
            deception: 'Your proficiency bonus is doubled for ability checks you make using Deception.',
            insight: 'Your proficiency bonus is doubled for ability checks you make using Insight.',
            intimidation: 'Your proficiency bonus is doubled for ability checks you make using Intimidation.',
            investigation: 'Your proficiency bonus is doubled for ability checks you make using Investigation.',
            perception: 'Your proficiency bonus is doubled for ability checks you make using Perception.',
            performance: 'Your proficiency bonus is doubled for ability checks you make using Performance.',
            persuasion: 'Your proficiency bonus is doubled for ability checks you make using Persuasion.',
            sleightOfHand: 'Your proficiency bonus is doubled for ability checks you make using Sleight of Hand.',
            stealth: 'Your proficiency bonus is doubled for ability checks you make using Stealth.',
            'thieves tools': 'Your proficiency bonus is doubled for ability checks you make using thieves\' tools.'
          }
        }
      },
      {
        name: 'Sneak Attack',
        description: 'You know how to strike subtly and exploit a foe\'s distraction. Beginning at 1st level, you know how to strike subtly and exploit a foe\'s distraction. Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack roll if you have advantage on the attack roll. The attack must use a finesse or a ranged weapon.',
        levelAcquired: 1
      },
      {
        name: 'Thieves\' Cant',
        description: 'During your rogue training you learned thieves\' cant. During your rogue training you learned thieves\' cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation. Only another creature that knows thieves\' cant understands such messages.',
        levelAcquired: 1
      },
      {
        name: 'Cunning Action',
        description: 'Your quick thinking and agility allow you to move and act quickly. Starting at 2nd level, your quick thinking and agility allow you to move and act quickly. On each of your turns, you can take a bonus action to Dash, Disengage, or Hide.',
        levelAcquired: 2
      },
      {
        name: 'Roguish Archetype',
        description: 'Choose an archetype that represents your area of expertise. At 3rd level, you choose an archetype that represents your area of expertise: Assassin, Arcane Trickster, or Thief. Your archetype choice grants you features at 3rd level and again at 9th, 13th, and 17th level.',
        levelAcquired: 3,
        choices: {
          count: 1,
          options: ['Assassin', 'Arcane Trickster', 'Thief'],
          optionDetails: {
            'Assassin': 'Excel at infiltration and burst damage with deadly ambush and disguise-focused tools.',
            'Arcane Trickster': 'Mix rogue cunning with enchantment and illusion magic for tricky battlefield control.',
            'Thief': 'Master mobility and object interaction with fast hands and superior climbing and stealth utility.'
          }
        }
      },
      {
        name: 'Ability Score Improvement',
        description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. When you reach 4th level, and again at 8th, 10th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.',
        levelAcquired: 4
      },
      {
        name: 'Uncanny Dodge',
        description: 'When an attacker that you can see hits you with an attack, you can use your reaction to halve the damage. Starting at 5th level, when an attacker that you can see hits you with an attack, you can use your reaction to halve the attack\'s damage against you.',
        levelAcquired: 5
      },
      {
        name: 'Evasion',
        description: 'Your instinctive agility lets you dodge out of the way of certain area effects. At 7th level, your instinctive agility lets you dodge out of the way of certain area effects, such as a blue dragon\'s lightning breath or a fireball spell. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.',
        levelAcquired: 7
      },
      {
        name: 'Reliable Talent',
        description: 'You have refined your skills until they approach perfection. By 11th level, you have refined your chosen skills until they approach perfection. Whenever you make an ability check that lets you add your proficiency bonus, you can treat a d20 roll of 9 or lower as a 10.',
        levelAcquired: 11
      },
      {
        name: 'Blindsense',
        description: 'If you are able to hear, you are aware of the location of any hidden or invisible creature within 10 feet of you. Starting at 14th level, if you are able to hear, you are aware of the location of any hidden or invisible creature within 10 feet of you.',
        levelAcquired: 14
      },
      {
        name: 'Slippery Mind',
        description: 'You have acquired greater mental resilience. By 15th level, you have acquired greater mental resilience. You gain proficiency in Wisdom saving throws.',
        levelAcquired: 15
      },
      {
        name: 'Elusive',
        description: 'No attack roll has advantage against you while you aren\'t incapacitated. Beginning at 18th level, no attack roll has advantage against you while you aren\'t incapacitated.',
        levelAcquired: 18
      },
      {
        name: 'Stroke of Luck',
        description: 'You have an uncanny ability to succeed when you need it. At 20th level, you have an uncanny ability to succeed when you need it. If your attack misses a target within range, you can turn the miss into a hit. Alternatively, if you fail an ability check, you can treat the d20 roll as a 20.',
        levelAcquired: 20
      },
      // Thief
      {
        name: 'Fast Hands',
        description: 'Starting at 3rd level, you can use the bonus action granted by your Cunning Action to make a Dexterity (Sleight of Hand) check, use your thieves\' tools to disarm a trap or open a lock, or take the Use an Object action.',
        levelAcquired: 3,
        requiredFeatureChoice: {
          featureKey: 'rogue-3-roguish-archetype',
          expectedValue: 'Thief',
        },
      },
      {
        name: 'Second-Story Work',
        description: 'When you choose this archetype at 3rd level, you gain the ability to climb faster than normal; climbing no longer costs you extra movement. In addition, when you make a running jump, the distance you cover increases by a number of feet equal to your Dexterity modifier.',
        levelAcquired: 3,
        requiredFeatureChoice: {
          featureKey: 'rogue-3-roguish-archetype',
          expectedValue: 'Thief',
        },
      },
      {
        name: 'Supreme Sneak',
        description: 'Starting at 9th level, you have advantage on a Dexterity (Stealth) check if you move no more than half your speed on the same turn.',
        levelAcquired: 9,
        requiredFeatureChoice: {
          featureKey: 'rogue-3-roguish-archetype',
          expectedValue: 'Thief',
        },
      },
      {
        name: 'Use Magic Device',
        description: 'By 13th level, you have learned enough about the workings of magic that you can improvise the use of items even when they are not intended for you. You ignore all class, race, and level requirements on the use of magic items.',
        levelAcquired: 13,
        requiredFeatureChoice: {
          featureKey: 'rogue-3-roguish-archetype',
          expectedValue: 'Thief',
        },
      },
      {
        name: 'Thief\'s Reflexes',
        description: 'When you reach 17th level, you have become adept at laying ambushes and quickly escaping danger. You can take two turns during the first round of any combat. You take your first turn at your normal initiative and your second turn at your initiative minus 10. You can\'t use this feature when you are surprised.',
        levelAcquired: 17,
        requiredFeatureChoice: {
          featureKey: 'rogue-3-roguish-archetype',
          expectedValue: 'Thief',
        },
      },
    ],
    startingEquipment: {
      startingGoldFormula: '4d4 * 10',
      startingGoldAverage: 100,
      choices: [
        {
          label: 'Choose your weapon:',
          options: [
            { label: '(a) Rapier', items: ['Rapier'], type: 'bundle' },
            { label: '(b) Shortsword', items: ['Shortsword'], type: 'bundle' }
          ]
        }
      ],
      fixedEquipment: ['Leather Armor', 'Burglar\'s Pack', 'Thieves\' Tools', 'Dagger', 'Dagger']
    }
  },
  {
    name: 'Sorcerer',
    hitDie: 6,
    primaryAbility: 'charisma',
    savingThrows: ['constitution', 'charisma'],
    skillProficienciesChoices: 2,
    skillOptions: ['arcana', 'deception', 'insight', 'intimidation', 'persuasion', 'religion'],
    asiLevels: [4, 8, 12, 16, 19],
    spellcastingAbility: 'charisma',
    spellPrepType: 'known',
    multiclassing: {
      prerequisites: [{ ability: 'charisma', min: 13 }],
      proficienciesGained: {}
    },
    features: [
      {
        name: 'Spellcasting',
        description: 'An event in your past, or in the life of a family member, infused your being with arcane magic. An event in your past, or in the life of a family member, infused your being with arcane magic. This font of magic, whatever its origin, fuels your spells. See chapter 10 for the general rules of spellcasting and chapter 11 for the sorcerer spell list.',
        levelAcquired: 1
      },
      {
        name: 'Sorcerous Origin',
        description: 'Choose a sorcerous origin that describes the source of your magical power. Choose a sorcerous origin, which describes the source of your innate magical power: Draconic Bloodline or Wild Magic, both detailed at the end of the class description. Your choice grants you features when you choose it at 1st level and again at 6th, 14th, and 18th level.',
        levelAcquired: 1,
        choices: {
          count: 1,
          options: ['Draconic Bloodline', 'Wild Magic'],
          optionDetails: {
            'Draconic Bloodline': 'Your magic is tied to draconic ancestry, improving durability and empowering dragon-themed spells.',
            'Wild Magic': 'Your magic is unpredictable, producing surges of chaotic arcane effects as you cast spells.'
          }
        }
      },
      {
        name: 'Draconic Resilience',
        description: 'The magic in your body manifests physical traits of your draconic gift. Your Hit Point maximum increases by 1, and it increases by 1 again whenever you gain a level in this class. Additionally, parts of your skin are covered by a thin sheen of dragon-like scales. When you aren\'t wearing armor, your AC equals 13 + your Dexterity modifier.',
        levelAcquired: 1,
        requiredFeatureChoice: {
          featureKey: 'sorcerer-1-sorcerous-origin',
          expectedValue: 'Draconic Bloodline',
        },
        effects: {
          acCalculation: {
            base: 13,
            abilityModifiers: ['dexterity'],
            requiresNoArmor: true,
            requiresNoShield: false,
            allowShield: true,
          }
        }
      },
      {
        name: 'Font of Magic',
        description: 'You have a well of magical power that you can draw upon. At 2nd level, you have a well of magical power that you can draw on to fuel your spells. This well is represented by sorcery points, which allow you to create a variety of magical effects. Your Charisma score determines the number of points you have.',
        levelAcquired: 2
      },
      {
        name: 'Metamagic',
        description: 'You can twist your spells to suit your needs. At 3rd level, you can twist your spells to suit your needs. You gain two of the following Metamagic options of your choice. You gain another one at 10th and 17th level. You can use only one Metamagic option on a spell when you cast it, unless otherwise noted.',
        levelAcquired: 2
      },
      {
        name: 'Ability Score Improvement',
        description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.',
        levelAcquired: 4
      },
      {
        name: 'Sorcerous Restoration',
        description: 'You regain 4 expended sorcery points whenever you finish a long rest. At 20th level, you regain 4 expended sorcery points whenever you finish a long rest.',
        levelAcquired: 20
      },
      // Draconic Bloodline
      {
        name: 'Dragon Ancestor',
        description: 'At 1st level, you choose one type of dragon as your ancestor. The damage type associated with each dragon is used by features you gain later. You can speak, read, and write Draconic. Additionally, whenever you make a Charisma check when interacting with dragons, your proficiency bonus is doubled if it applies to the check.',
        levelAcquired: 1,
        requiredFeatureChoice: {
          featureKey: 'sorcerer-1-sorcerous-origin',
          expectedValue: 'Draconic Bloodline',
        },
      },
      {
        name: 'Elemental Affinity',
        description: 'Starting at 6th level, when you cast a spell that deals damage of the type associated with your draconic ancestry, you can add your Charisma modifier to one damage roll of that spell. At the same time, you can spend 1 sorcery point to gain resistance to that damage type for 1 hour.',
        levelAcquired: 6,
        requiredFeatureChoice: {
          featureKey: 'sorcerer-1-sorcerous-origin',
          expectedValue: 'Draconic Bloodline',
        },
      },
      {
        name: 'Dragon Wings',
        description: 'At 14th level, you gain the ability to sprout a pair of dragon wings from your back, gaining a flying speed equal to your current speed. You can create these wings as a bonus action on your turn. They last until you dismiss them as a bonus action on your turn. You can\'t manifest your wings while wearing armor unless the armor is made to accommodate them.',
        levelAcquired: 14,
        requiredFeatureChoice: {
          featureKey: 'sorcerer-1-sorcerous-origin',
          expectedValue: 'Draconic Bloodline',
        },
      },
      {
        name: 'Draconic Presence',
        description: 'Beginning at 18th level, you can channel the dread presence of your dragon ancestor, causing those around you to become awestruck or frightened. As an action, you can spend 5 sorcery points to draw on this power and exude an aura of awe or fear (your choice) to a distance of 60 feet. For 1 minute or until you lose your concentration, each hostile creature that starts its turn in this aura must succeed on a Wisdom saving throw or be charmed (if you chose awe) or frightened (if you chose fear) until the aura ends. A creature that succeeds on this saving throw is immune to your aura for 24 hours.',
        levelAcquired: 18,
        requiredFeatureChoice: {
          featureKey: 'sorcerer-1-sorcerous-origin',
          expectedValue: 'Draconic Bloodline',
        },
      },
    ],
    startingEquipment: {
      startingGoldFormula: '3d4 * 10',
      startingGoldAverage: 75,
      choices: [
        {
          label: 'Choose your weapon:',
          options: [
            { label: '(a) Light Crossbow and Bolts', items: ['Light Crossbow', 'Bolts'], type: 'bundle' },
            { label: '(b) Simple Weapon', type: 'choice', weaponClasses: ['Simple'] }
          ]
        }
      ],
      fixedEquipment: ['Leather Armor', 'Component Pouch', 'Dungeoneer\'s Pack', 'Dagger', 'Dagger']
    }
  },
  {
    name: 'Warlock',
    hitDie: 8,
    primaryAbility: 'charisma',
    savingThrows: ['wisdom', 'charisma'],
    skillProficienciesChoices: 2,
    skillOptions: ['arcana', 'deception', 'history', 'intimidation', 'investigation', 'nature', 'religion'],
    asiLevels: [4, 8, 12, 16, 19],
    spellcastingAbility: 'charisma',
    spellPrepType: 'known',
    multiclassing: {
      prerequisites: [{ ability: 'charisma', min: 13 }],
      proficienciesGained: {
        armor: ['Light'],
        weapons: ['Simple']
      }
    },
    features: [
      {
        name: 'Otherworldly Patron',
        description: 'You have struck a bargain with an otherworldly being. You have struck a bargain with an otherworldly being of your choice: the Archfey, the Fiend, or the Great Old One, each detailed at the end of the class description. Your choice grants you features at 1st level and again at 6th, 10th, and 14th level.',
        levelAcquired: 1,
        choices: {
          count: 1,
          options: ['The Archfey', 'The Fiend', 'The Great Old One'],
          optionDetails: {
            'The Archfey': 'Your patron grants fey trickery and control effects that charm, beguile, or reposition foes.',
            'The Fiend': 'Your patron grants infernal resilience and aggressive magic centered on destructive power.',
            'The Great Old One': 'Your patron grants alien mental influence, including telepathic and mind-bending abilities.'
          }
        }
      },
      {
        name: 'Pact Magic',
        description: 'Your arcane research and the bargain you have struck with a patron give you facility with certain spells. Your arcane research and the bargain you have struck with a patron give you facility with certain spells. You can cast your spell slots as 1st-level spells, but you can only hold a 1st-level spell (from your list of spells known).',
        levelAcquired: 1
      },
      {
        name: 'Eldritch Invocations',
        description: 'In your study of occult lore, you have unlocked eldritch invocations. In your study of occult lore, you have unlocked eldritch invocations, granting you extraordinary magical abilities. At 2nd level, you gain two eldritch invocations of your choice. When you gain certain warlock levels, you gain additional invocations of your choice.',
        levelAcquired: 2
      },
      {
        name: 'Pact Boon',
        description: 'Your otherworldly patron grants you a magical gift. At 3rd level, your otherworldly patron grants you a magical gift based on the pact you made with your patron. Choose one of the following patron-specific bonus spells.',
        levelAcquired: 3,
        choices: {
          count: 1,
          options: ['Pact of the Chain', 'Pact of the Blade', 'Pact of the Tome'],
          optionDetails: {
            'Pact of the Chain': 'Gain a special familiar with expanded forms and stronger utility through invocation support.',
            'Pact of the Blade': 'Conjure and bond with a pact weapon to emphasize martial warlock combat.',
            'Pact of the Tome': 'Receive a Book of Shadows that grants extra cantrips and ritual-focused versatility.'
          }
        }
      },
      {
        name: 'Ability Score Improvement',
        description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.',
        levelAcquired: 4
      },
      {
        name: 'Mystic Arcanum',
        description: 'Your patron grants you a magical secret. At 11th level, your patron grants you a magical secret called an arcanum. Choose one 6th-level spell from the warlock spell list as this arcanum. You can cast your arcanum spell once without expending a spell slot. You must finish a long rest before you can do so again.',
        levelAcquired: 11
      },
      {
        name: 'Eldritch Master',
        description: 'You can draw from your patron\'s reservoir of power once per day. At 20th level, you can draw from your patron\'s reservoir of power once per day to regain all your expended spell slots from your Pact Magic feature.',
        levelAcquired: 20
      },
      // The Fiend
      {
        name: 'Expanded Spell List',
        description: 'The Fiend lets you choose from an expanded list of spells when you learn a warlock spell. The following spells are added to the warlock spell list for you: 1st level: burning hands, command; 2nd level: blindness/deafness, scorching ray; 3rd level: fireball, stinking cloud; 4th level: fire shield, wall of fire; 5th level: flame strike, hallow.',
        levelAcquired: 1,
        requiredFeatureChoice: {
          featureKey: 'warlock-1-otherworldly-patron',
          expectedValue: 'The Fiend',
        },
      },
      {
        name: 'Dark One\'s Blessing',
        description: 'Starting at 1st level, when you reduce a hostile creature to 0 hit points, you gain temporary hit points equal to your Charisma modifier + your warlock level (minimum of 1).',
        levelAcquired: 1,
        requiredFeatureChoice: {
          featureKey: 'warlock-1-otherworldly-patron',
          expectedValue: 'The Fiend',
        },
      },
      {
        name: 'Dark One\'s Own Luck',
        description: 'Starting at 6th level, you can call on your patron to alter fate in your favor. When you make an ability check or a saving throw, you can use this feature to add a d10 to your roll. You can do so after seeing the initial roll but before any of the roll\'s effects occur. Once you use this feature, you can\'t use it again until you finish a short or long rest.',
        levelAcquired: 6,
        requiredFeatureChoice: {
          featureKey: 'warlock-1-otherworldly-patron',
          expectedValue: 'The Fiend',
        },
      },
      {
        name: 'Fiendish Resilience',
        description: 'Starting at 10th level, you can choose one damage type when you finish a short or long rest. You gain resistance to that damage type until you choose a different one with this feature. Damage from magical weapons or silver weapons ignores this resistance.',
        levelAcquired: 10,
        requiredFeatureChoice: {
          featureKey: 'warlock-1-otherworldly-patron',
          expectedValue: 'The Fiend',
        },
      },
      {
        name: 'Hurl Through Hell',
        description: 'Starting at 14th level, when you hit a creature with an attack, you can use this feature to instantly transport the target through the lower planes. The creature disappears and hurtles through a nightmare landscape. At the end of your next turn, the target returns to the space it previously occupied, or the nearest unoccupied space. If the target is not a fiend, it takes 10d10 psychic damage as it reels from its horrific experience. Once you use this feature, you can\'t use it again until you finish a long rest.',
        levelAcquired: 14,
        requiredFeatureChoice: {
          featureKey: 'warlock-1-otherworldly-patron',
          expectedValue: 'The Fiend',
        },
      },
    ],
    startingEquipment: {
      startingGoldFormula: '4d4 * 10',
      startingGoldAverage: 100,
      choices: [
        {
          label: 'Choose your weapon:',
          options: [
            { label: '(a) Light Crossbow and Bolts', items: ['Light Crossbow', 'Bolts'], type: 'bundle' },
            { label: '(b) Simple Weapon', type: 'choice', weaponClasses: ['Simple'] }
          ]
        }
      ],
      fixedEquipment: ['Leather Armor', 'Component Pouch', 'Dungeoneer\'s Pack', 'Dagger', 'Dagger']
    }
  },
  {
    name: 'Wizard',
    hitDie: 6,
    primaryAbility: 'intelligence',
    savingThrows: ['intelligence', 'wisdom'],
    skillProficienciesChoices: 2,
    skillOptions: ['arcana', 'history', 'insight', 'investigation', 'medicine', 'religion'],
    asiLevels: [4, 8, 12, 16, 19],
    spellcastingAbility: 'intelligence',
    spellPrepType: 'known',
    multiclassing: {
      prerequisites: [{ ability: 'intelligence', min: 13 }],
      proficienciesGained: {}
    },
    features: [
      {
        name: 'Spellcasting',
        description: 'You have studied magical scripture and can cast spells. You have studied magical scripture and can cast spells. See chapter 10 for the general rules of spellcasting and chapter 11 for the wizard spell list.',
        levelAcquired: 1
      },
      {
        name: 'Arcane Recovery',
        description: 'You have learned to regain some of your magical energy during a short rest. You have learned to regain some of your magical energy during a short rest. During a short rest, you choose expended spell slots to recover. The spell slots can have a combined level equal to half your wizard level (rounded up), and none of the slots can be 6th level or higher.',
        levelAcquired: 1
      },
      {
        name: 'Arcane Tradition',
        description: 'Choose an arcane tradition that shapes your magical practice. At 2nd level, you choose an arcane tradition, shaping your magical practice. Your choice grants you features at 2nd level and again at 6th, 10th, and 14th level. Choose either Abjuration, Conjuration, Divination, Enchantment, Evocation, Illusion, Necromancy, or Transmutation, all detailed at the end of the class description.',
        levelAcquired: 2,
        choices: {
          count: 1,
          options: ['School of Abjuration', 'School of Conjuration', 'School of Divination', 'School of Enchantment', 'School of Evocation', 'School of Illusion', 'School of Necromancy', 'School of Transmutation'],
          optionDetails: {
            'School of Abjuration': 'Focus on protective wards and anti-magic techniques that shield you and your allies.',
            'School of Conjuration': 'Specialize in summoning creatures and objects while mastering teleportation tricks.',
            'School of Divination': 'Use foresight and magical insight to predict outcomes and influence key moments.',
            'School of Enchantment': 'Control minds and emotions with charm magic that manipulates enemy behavior.',
            'School of Evocation': 'Unleash powerful elemental blasts while shaping effects to spare your allies.',
            'School of Illusion': 'Create convincing false images and phantasms to deceive and outmaneuver opponents.',
            'School of Necromancy': 'Harness life-and-death magic to drain vitality and command undead servants.',
            'School of Transmutation': 'Alter creatures and matter with adaptable magic that changes forms and properties.'
          }
        }
      },
      {
        name: 'Ability Score Improvement',
        description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.',
        levelAcquired: 4
      },
      {
        name: 'Spell Mastery',
        description: 'You have mastered a number of spells and can cast them at will. At 18th level, you have mastered a number of spells that you can cast at will. Choose one 1st-level wizard spell and one 2nd-level wizard spell that are in your spellbook. You can cast those spells at their lowest level without expending a spell slot when you have them prepared.',
        levelAcquired: 18
      },
      {
        name: 'Signature Spells',
        description: 'You have learned two spells that you can cast at any time without increasing your spell slots. When you reach 20th level, you learn two spells of your choice that you can cast at any time. Each of these spells must be of a level that you have in your spellbook. You can\'t cast these spells at a higher level unless you have a spell slot of that level.',
        levelAcquired: 20
      },
      // School of Evocation
      {
        name: 'Evocation Savant',
        description: 'Beginning when you select this school at 2nd level, the gold and time you must spend to copy an evocation spell into your spellbook is halved.',
        levelAcquired: 2,
        requiredFeatureChoice: {
          featureKey: 'wizard-2-arcane-tradition',
          expectedValue: 'School of Evocation',
        },
      },
      {
        name: 'Sculpt Spells',
        description: 'Beginning at 2nd level, you can create pockets of relative safety within the effects of your evocation spells. When you cast an evocation spell that affects other creatures that you can see, you can choose a number of them equal to 1 + the spell\'s level. The chosen creatures automatically succeed on their saving throws against the spell, and they take no damage if they would normally take half damage on a successful save.',
        levelAcquired: 2,
        requiredFeatureChoice: {
          featureKey: 'wizard-2-arcane-tradition',
          expectedValue: 'School of Evocation',
        },
      },
      {
        name: 'Potent Cantrip',
        description: 'Starting at 6th level, your damaging cantrips affect even creatures that avoid the brunt of the effect. When a creature succeeds on a saving throw against your cantrip, the creature takes half the cantrip\'s damage (if any) but suffers no additional effect from the cantrip.',
        levelAcquired: 6,
        requiredFeatureChoice: {
          featureKey: 'wizard-2-arcane-tradition',
          expectedValue: 'School of Evocation',
        },
      },
      {
        name: 'Empowered Evocation',
        description: 'Beginning at 10th level, you can add your Intelligence modifier to one damage roll of any wizard evocation spell you cast.',
        levelAcquired: 10,
        requiredFeatureChoice: {
          featureKey: 'wizard-2-arcane-tradition',
          expectedValue: 'School of Evocation',
        },
      },
      {
        name: 'Overchannel',
        description: 'Starting at 14th level, you can increase the power of your simpler spells. When you cast a wizard spell of 1st through 5th level that deals damage, you can deal maximum damage with that spell. The first time you do so, you suffer no adverse effect. If you use this feature again before you finish a long rest, you take 2d12 necrotic damage for each level of the spell, immediately after you cast it. Each time you use this feature again before finishing a long rest, the necrotic damage per spell level increases by 1d12. This damage ignores resistance and immunity.',
        levelAcquired: 14,
        requiredFeatureChoice: {
          featureKey: 'wizard-2-arcane-tradition',
          expectedValue: 'School of Evocation',
        },
      },
    ],
    startingEquipment: {
      startingGoldFormula: '4d4 * 10',
      startingGoldAverage: 100,
      choices: [
        {
          label: 'Choose your weapon:',
          options: [
            { label: '(a) Quarterstaff', items: ['Quarterstaff'], type: 'bundle' },
            { label: '(b) Dagger', items: ['Dagger'], type: 'bundle' }
          ]
        }
      ],
      fixedEquipment: ['Spellbook', 'Scholar\'s Pack', 'Component Pouch']
    }
  }
];
