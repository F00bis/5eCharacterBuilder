import type { Ability, Skill, ProficiencyLevel } from '../types';
import type { FeatChoiceDefinition } from '../types/featChoices';

export interface SrdFeat {
  id: string;
  name: string;
  description: string;
  prerequisites: string;
  statModifiers: Partial<Record<Ability, number>>;
  skillModifiers?: Partial<Record<Skill, number>>;
  savingThrowProficiencies?: Partial<Record<Ability, ProficiencyLevel>>;
  isHalfFeat: boolean;
  halfFeatChoiceAbility?: Ability;
  asiOptions?: Ability[];
  choices?: FeatChoiceDefinition[];
  isSRD: boolean;
}

export const srdFeats: SrdFeat[] = [
  {
    id: 'alert',
    name: 'Alert',
    description: 'Always on the lookout for danger, you gain the following benefits: You gain a +5 bonus to initiative. You can\'t be surprised while you are conscious. Other creatures don\'t gain advantage on attack rolls against you as a result of being unseen by you.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'athlete',
    name: 'Athlete',
    description: 'You have undergone extensive physical training to gain the following benefits: Increase your Strength or Dexterity score by 1, to a maximum of 20. You gain proficiency in the Athletics skill. You gain a climbing speed equal to your walking speed. You can make a running long jump or a running long jump without moving more than 5 feet beforehand.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: true,
    halfFeatChoiceAbility: 'strength',
    asiOptions: ['strength', 'dexterity'],
    isSRD: true
  },
  {
    id: 'actor',
    name: 'Actor',
    description: 'You are skilled at feigning and have the following benefits: Increase your Charisma score by 1, to a maximum of 20. You have advantage on Charisma (Deception) and Charisma (Performance) checks when trying to pass yourself off as a different person. You can mimic the sound of another person, or the sounds made by other types of creatures, after hearing them for at least 1 minute.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: true,
    halfFeatChoiceAbility: 'charisma',
    asiOptions: ['charisma'],
    isSRD: true
  },
  {
    id: 'charger',
    name: 'Charger',
    description: 'When you use your action to Dash, you can use a bonus action to make one melee weapon attack or to shove a creature. If you move at least 10 feet in a straight line immediately before taking this bonus action, you gain a +5 bonus to the attack\'s damage roll (or to the creature\'s saving throw DC if it succeeds on the contested check).',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'crossbowExpert',
    name: 'Crossbow Expert',
    description: 'Thanks to extensive practice with crossbows, you gain the following benefits: You ignore the loading quality of crossbows with which you are proficient. Being within 5 feet of a hostile creature doesn\'t impose disadvantage on your ranged attack rolls. When you use the Attack action and attack with a one-handed weapon, you can use a bonus action to attack with a loaded hand crossbow you are holding.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'defensiveDuelist',
    name: 'Defensive Duelist',
    description: 'Prerequisite: Dexterity 13 or higher. When you are wielding a finesse weapon and another creature hits you with a melee attack, you can use your reaction to add your proficiency bonus to your AC for that attack, potentially causing it to miss.',
    prerequisites: 'Dexterity 13 or higher',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'dualWielder',
    name: 'Dual Wielder',
    description: 'You master fighting with two weapons, gaining the following benefits: You gain a +1 bonus to AC while you are wielding a separate melee weapon in each hand. You can use two-weapon fighting even when the one-handed melee weapons you are wielding aren\'t light. You can draw or stow two one-handed weapons when you would normally be able to draw or stow only one.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'dungeonDelver',
    name: 'Dungeon Delver',
    description: 'You are experienced at navigating dungeons, gaining the following benefits: You have advantage on Wisdom (Perception) and Intelligence (Investigation) checks made to detect hidden doors and passages. You have advantage on saving throws made to avoid or resist traps. You have resistance to damage from traps. You can search for traps while traveling at a normal pace without penalty.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'durable',
    name: 'Durable',
    description: 'Hardy and resilient, you gain the following benefits: Increase your Constitution score by 1, to a maximum of 20. When you roll a Hit Die to regain hit points, the minimum number of hit points you regain equals twice your Constitution modifier (minimum of 2). Your hit point maximum increases by an amount equal to your Constitution modifier.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: true,
    halfFeatChoiceAbility: 'constitution',
    asiOptions: ['constitution'],
    isSRD: true
  },
  {
    id: 'elementalAdept',
    name: 'Elemental Adept',
    description: 'Prerequisite: The ability to cast at least one spell. When you gain this feat, choose one of the major damage types (acid, cold, fire, lightning, thunder). Spells you cast ignore resistance to damage of the chosen type. In addition, when you roll damage for a spell you cast that deals damage of that type, you can treat any 1 on a damage die as a 2.',
    prerequisites: 'The ability to cast at least one spell',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true,
    choices: [{
      id: 'damageType',
      kind: 'damage-type',
      label: 'Damage Type',
      count: 1,
      options: ['acid', 'cold', 'fire', 'lightning', 'thunder'],
    }],
  },
  {
    id: 'featGrappler',
    name: 'Grappler',
    description: 'Prerequisite: Strength 13 or higher. You\'ve developed the skills necessary to hold your own in close-quarters grappling. You gain the following benefits: You have advantage on attack rolls against a creature you are grappling. You can use your action to try to pin a creature grappled by you. To do so, make another grapple check. If you succeed, the creature is prone and restrained until the grapple ends. A creature within 5 feet of you can use its action to knock you or a creature you are grappling prone.',
    prerequisites: 'Strength 13 or higher',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'greatWeaponMaster',
    name: 'Great Weapon Master',
    description: 'You\'ve learned to put the weight of a weapon to your advantage, gaining the following benefits: On your turn, when you score a critical hit or reduce a creature to 0 hit points with a melee weapon attack, you can make one melee weapon attack as a bonus action. Before you make a melee attack with a heavy weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If that attack hits, you gain a +10 bonus to the attack\'s damage roll.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'healer',
    name: 'Healer',
    description: 'You are an able physician, gaining the following benefits: When you use a healer\'s kit to stabilize a dying creature, that creature also regains 1 hit point. As an action, you can spend one use of a healer\'s kit to tend to a creature and restore a number of hit points equal to 1d6 + your Wisdom modifier. A creature can\'t benefit from your healer feat more than once per short rest.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'heavilyArmored',
    name: 'Heavily Armored',
    description: 'Prerequisite: Proficiency with medium armor. You have trained to use heavy armor, gaining the following benefits: Increase your Strength score by 1, to a maximum of 20. You gain proficiency with heavy armor.',
    prerequisites: 'Proficiency with medium armor',
    statModifiers: {},
    isHalfFeat: true,
    halfFeatChoiceAbility: 'strength',
    asiOptions: ['strength'],
    isSRD: true
  },
  {
    id: 'heavyArmorMaster',
    name: 'Heavy Armor Master',
    description: 'Prerequisite: Proficiency with heavy armor. You can use your armor to deflect strikes that would kill others. You gain the following benefits: Increase your Strength score by 1, to a maximum of 20. While you are wearing heavy armor, bludgeoning, piercing, and slashing damage that you take from nonmagical weapons is reduced by 3.',
    prerequisites: 'Proficiency with heavy armor',
    statModifiers: {},
    isHalfFeat: true,
    halfFeatChoiceAbility: 'strength',
    asiOptions: ['strength'],
    isSRD: true
  },
  {
    id: 'inspirational',
    name: 'Inspiring Leader',
    description: 'Prerequisite: Charisma 13 or higher. You can spend 10 minutes inspiring others, granting them temporary hit points equal to your level + your Charisma modifier. A creature can\'t gain temporary hit points from this feat again until they finish a short or long rest.',
    prerequisites: 'Charisma 13 or higher',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'keenMind',
    name: 'Keen Mind',
    description: 'You have a mind that can track time, direction, and detail with uncanny precision. You gain the following benefits: Increase your Intelligence score by 1, to a maximum of 20. You always know which way is north. You always know the number of hours left before the next sunrise or sunset. You can accurately recall anything you have seen or heard within the past month.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: true,
    halfFeatChoiceAbility: 'intelligence',
    asiOptions: ['intelligence'],
    isSRD: true
  },
  {
    id: 'lightlyArmored',
    name: 'Lightly Armored',
    description: 'You train to use light armor, gaining the following benefits: Increase your Strength or Dexterity score by 1, to a maximum of 20. You gain proficiency with light armor.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: true,
    halfFeatChoiceAbility: 'dexterity',
    asiOptions: ['strength', 'dexterity'],
    isSRD: true
  },
  {
    id: 'linguist',
    name: 'Linguist',
    description: 'You are studious and have learned a number of languages. You gain the following benefits: Increase your Intelligence score by 1, to a maximum of 20. You learn three languages of your choice. You can read, speak, and write one additional language of your choice.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: true,
    halfFeatChoiceAbility: 'intelligence',
    asiOptions: ['intelligence'],
    isSRD: true
  },
  {
    id: 'luck',
    name: 'Lucky',
    description: 'You have inexplicable luck that seems to kick in at just the right moment. You have 3 luck points. Whenever you make an attack roll, ability check, or saving throw, you can spend 1 luck point to roll an additional d20. You can choose to spend your luck after you roll the d20, but before the outcome is determined. You choose which of the d20s is used for the attack roll, ability check, or saving throw. You can also spend 1 luck point when an attack roll is made against you. Roll a d20, and choose which of the d20s is used for the attack roll. You regain your expended luck points when you finish a long rest.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'mageSlayer',
    name: 'Mage Slayer',
    description: 'You have practiced techniques useful in melee combat against spellcasters, gaining the following benefits: When a creature within 5 feet of you casts a spell, you can use your reaction to make a melee weapon attack against that creature. When you damage a creature that is concentrating on a spell, that creature has disadvantage on the saving throw it makes to maintain its concentration. You have advantage on saving throws against spells cast by creatures within 5 feet of you.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'magicInitiate',
    name: 'Magic Initiate',
    description: 'Choose a class for the spellcasting tradition your character is being initiated into. Your spellcasting ability for these spells is Charisma if you don\'t already have one, otherwise it is the ability you normally use for spellcasting. You learn two cantrips and one 1st-level spell from the spell list of your chosen class. If you can normally cast 1st-level spells, the 1st-level spell is cast at its lowest level. Once per long rest you can cast the 1st-level spell without expending a spell slot.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true,
    choices: [
      {
        id: 'spellList',
        kind: 'spell-list',
        label: 'Spell List',
        count: 1,
        options: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Warlock', 'Wizard'],
      },
      {
        id: 'spellcastingAbility',
        kind: 'spellcasting-ability',
        label: 'Spellcasting Ability',
        count: 1,
        options: ['intelligence', 'wisdom', 'charisma'],
      },
      {
        id: 'cantrips',
        kind: 'cantrip',
        label: 'Cantrips',
        count: 2,
        linkedTo: 'spellList',
      },
      {
        id: 'spell',
        kind: 'spell',
        label: 'Level 1 Spell',
        count: 1,
        linkedTo: 'spellList',
      },
    ],
  },
  {
    id: 'martialAdept',
    name: 'Martial Adept',
    description: 'You have martial training that grants you mastery of combat styles. You gain the following benefits: You learn two maneuvers of your choice from among those available to the Battle Master archetype. You gain one superiority die, which is a d6. This die is used to fuel your maneuvers. If amaneuver requires a saving throw, the DC equals 8 + your proficiency bonus + your Strength or Dexterity modifier. You regain your expended superiority dice when you finish a short or long rest.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true,
    choices: [{
      id: 'maneuvers',
      kind: 'maneuver',
      label: 'Maneuvers',
      count: 2,
    }],
  },
  {
    id: 'mediumArmorMaster',
    name: 'Medium Armor Master',
    description: 'Prerequisite: Proficiency with medium armor. You have practiced moving in medium armor, gaining the following benefits: Wearing medium armor doesn\'t impose disadvantage on your Dexterity (Stealth) checks. When you wear medium armor, you can add 3, rather than 2, to your AC if you have a Dexterity of 16 or higher.',
    prerequisites: 'Proficiency with medium armor',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'mobile',
    name: 'Mobile',
    description: 'You are exceptionally swift and agile. You gain the following benefits: Your speed increases by 10 feet. When you use the Dash action, difficult terrain doesn\'t cost you extra movement on that turn. When you make a melee attack against a creature, you don\'t provoke opportunity attacks from that creature for the rest of your turn, whether you hit or not.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'moderatelyArmored',
    name: 'Moderately Armored',
    description: 'Prerequisite: Proficiency with light armor. You have trained to use medium armor, gaining the following benefits: Increase your Strength or Dexterity score by 1, to a maximum of 20. You gain proficiency with medium armor and shields.',
    prerequisites: 'Proficiency with light armor',
    statModifiers: {},
    isHalfFeat: true,
    halfFeatChoiceAbility: 'dexterity',
    asiOptions: ['strength', 'dexterity'],
    isSRD: true
  },
  {
    id: 'mountedCombatant',
    name: 'Mounted Combatant',
    description: 'You are a formidable cavalry rider. You gain the following benefits: You have advantage on melee attack rolls against unmounted creatures that are smaller than your mount. You can force an attack targeted at your mount to target you instead. If your mount is subjected to an effect that allows a Dexterity saving throw to take only half damage, you can use your reaction to have the mount take only half the damage if it fails the saving throw, or no damage if it succeeds.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'observant',
    name: 'Observant',
    description: 'Quick to notice details, you gain the following benefits: Increase your Intelligence or Wisdom score by 1, to a maximum of 20. If you can see a creature\'s mouth while it is speaking a language you understand, you can interpret what it\'s saying by reading its lips. You have a +5 bonus to your passive Wisdom (Perception) and passive Intelligence (Investigation) scores.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: true,
    halfFeatChoiceAbility: 'wisdom',
    asiOptions: ['intelligence', 'wisdom'],
    isSRD: true
  },
  {
    id: 'piercer',
    name: 'Piercer',
    description: 'You have mastered the art of piercing strikes. You gain the following benefits: Increase your Strength or Dexterity by 1, to a maximum of 20. Once per turn, when you hit a creature with a weapon that deals piercing damage, you can deal an additional die of weapon damage. When a creature you can see within 60 feet of you makes an attack roll, you can use your reaction to impose disadvantage on it.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: true,
    halfFeatChoiceAbility: 'strength',
    asiOptions: ['strength', 'dexterity'],
    isSRD: true
  },
  {
    id: 'poisoner',
    name: 'Poisoner',
    description: 'You are practiced in the art of creating and using poison, gaining the following benefits: When you make a damage roll, you can deal additional poison damage equal to your proficiency bonus. You can apply poison to a weapon or piece of ammunition as an action. You have resistance to poison damage and are immune to the poisoned condition.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'polearmMaster',
    name: 'Polearm Master',
    description: 'You have learned to make deadly use of reach weapons, gaining the following benefits: When you take the Attack action and attack with a glaive, halberd, or quarterstaff, you can use a bonus action to make a melee attack with the opposite end of the weapon. The weapon\'s damage die for this attack is a d4. As a bonus action, you can ready a weapon with the reach property, then immediately attack with it if a creature enters its reach.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'quickenedSpell',
    name: 'Quicken Spell',
    description: 'Prerequisite: The ability to cast at least one spell. You have learned to cast some spells more quickly. When you cast a spell that has a casting time of 1 action, you can change the casting time to 1 bonus action. You can use this property to cast a spell in this way a number of times equal to your proficiency bonus, and you regain all uses when you finish a long rest.',
    prerequisites: 'The ability to cast at least one spell',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'resilient',
    name: 'Resilient',
    description: 'Choose one ability score. You gain the following benefits: Increase the chosen ability score by 1, to a maximum of 20. You gain proficiency in saving throws using the chosen ability.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: true,
    halfFeatChoiceAbility: 'constitution',
    asiOptions: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
    isSRD: true,
    choices: [{
      id: 'savingThrow',
      kind: 'saving-throw',
      label: 'Saving Throw Proficiency',
      count: 1,
      linkedTo: 'asi',
    }],
  },
  {
    id: 'ritualCaster',
    name: 'Ritual Caster',
    description: 'Prerequisite: Intelligence or Wisdom 13 or higher. You have learned a number of spells that can be cast as rituals. You gain the following benefits: Choose one class that has the spellcasting feature. You learn two 1st-level spells of your choice from that class\'s spell list. The chosen spells must have the ritual tag. You can cast these spells as rituals if they have the ritual tag. If you can already cast spells from this class, you learn two additional 1st-level spells from that class\'s spell list.',
    prerequisites: 'Intelligence or Wisdom 13 or higher',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true,
    choices: [
      {
        id: 'spellList',
        kind: 'spell-list',
        label: 'Class Spell List',
        count: 1,
        options: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Warlock', 'Wizard'],
      },
      {
        id: 'ritualSpells',
        kind: 'spell',
        label: 'Ritual Spells (Level 1)',
        count: 2,
        linkedTo: 'spellList',
      },
    ],
  },
  {
    id: 'savageAttacker',
    name: 'Savage Attacker',
    description: 'You have trained to deal particularly damaging strikes. When you roll damage for a melee weapon attack, you can reroll the weapon\'s damage dice and use either total. You can use this ability only once per turn.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'sentinel',
    name: 'Sentinel',
    description: 'You have mastered techniques to protect yourself in combat, gaining the following benefits: When a creature within 5 feet of you makes an attack against a target other than you, you can use your reaction to make a melee weapon attack against the attacking creature. When you hit a creature with an opportunity attack, the creature\'s speed becomes 0 for the rest of the turn. Creatures provoke opportunity attacks from you even if they take the Disengage action before leaving your reach.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    description: 'You have mastered ranged weapons and can make shots that others find impossible. You gain the following benefits: Attacking at long range doesn\'t impose disadvantage on your ranged weapon attack rolls. Your ranged weapon attacks ignore half cover and three-quarters cover. Before you make a ranged attack with a weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If that attack hits, you gain a +10 bonus to the attack\'s damage roll.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'shieldMaster',
    name: 'Shield Master',
    description: 'You use shields not just for protection but also as a weapon. You gain the following benefits: If you take the Attack action on your turn, you can use a bonus action to shove a creature within 5 feet of you with a shield. If you aren\'t incapacitated, you can add your shield\'s AC bonus to any Dexterity saving throw you make against a spell or other effect that affects you. As a bonus action, you can strike an adjacent creature with your shield.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'skillExpert',
    name: 'Skill Expert',
    description: 'You have honed your skills in a specific area. You gain the following benefits: Increase one ability score of your choice by 1, to a maximum of 20. You gain proficiency in one skill of your choice. Choose one skill in which you have proficiency. That skill becomes a expertise skill for you.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: true,
    halfFeatChoiceAbility: 'charisma',
    asiOptions: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
    isSRD: true,
    choices: [
      {
        id: 'skillProficiency',
        kind: 'skill-proficiency',
        label: 'Skill Proficiency',
        count: 1,
      },
      {
        id: 'skillExpertise',
        kind: 'skill-expertise',
        label: 'Skill Expertise',
        count: 1,
      },
    ],
  },
  {
    id: 'slayer',
    name: 'Slayer',
    description: 'Prerequisite: The user must have at least one Extra Attack feature to gain this feat. You have learned to study your foes and exploit their weaknesses. You gain the following benefits: You can use a bonus action to mark a creature as your quarry. While this mark persists, you gain advantage on attack rolls against the marked creature, and your damage rolls against it deal additional damage equal to your proficiency bonus.',
    prerequisites: 'Extra Attack feature',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'spellSniper',
    name: 'Spell Sniper',
    description: 'Prerequisite: The ability to cast at least one spell. You have learned to counteract those who would hide from your magic. You gain the following benefits: When you cast a spell that requires an attack roll, the spell\'s range is doubled. Your ranged spell attacks ignore half cover and three-quarters cover. You learn one cantrip that requires an attack roll.',
    prerequisites: 'The ability to cast at least one spell',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true,
    choices: [{
      id: 'cantrip',
      kind: 'cantrip',
      label: 'Cantrip (requires attack roll)',
      count: 1,
    }],
  },
  {
    id: 'sprinter',
    name: 'Sprinter',
    description: 'You have learned to channel energy into bursts of speed. When you use the Dash action, your speed increases by 30 feet for that action.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'swordsage',
    name: 'Swordsage',
    description: 'You have learned to make weapons sing with your strikes. You gain the following benefits: Increase your Dexterity or Strength by 1, to a maximum of 20. When you hit a creature with a sword on your turn, you can cause the attack to deal additional damage equal to your proficiency bonus.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: true,
    halfFeatChoiceAbility: 'strength',
    asiOptions: ['strength', 'dexterity'],
    isSRD: true
  },
  {
    id: 'tough',
    name: 'Tough',
    description: 'Your hit point maximum increases by an amount equal to twice your level when you gain this feat. Whenever you gain a level thereafter, your hit point maximum increases by an additional 2 hit points.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'warCaster',
    name: 'War Caster',
    description: 'Prerequisite: The ability to cast at least one spell. You have practiced casting spells in the midst of combat, gaining the following benefits: When a hostile creature\'s movement provokes an opportunity attack from you, you can use your reaction to cast a spell at the creature, rather than making an opportunity attack. The spell must have a casting time of 1 action and must target only that creature. You have advantage on Constitution saving throws that you make to maintain your concentration on a spell when you take damage.',
    prerequisites: 'The ability to cast at least one spell',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 'weaponMaster',
    name: 'Weapon Master',
    description: 'You have practiced extensively with a variety of weapons, gaining the following benefits: Increase your Strength or Dexterity by 1, to a maximum of 20. You gain proficiency with four weapons of your choice.',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: true,
    halfFeatChoiceAbility: 'strength',
    asiOptions: ['strength', 'dexterity'],
    isSRD: true,
    choices: [{
      id: 'weapons',
      kind: 'weapon-proficiency',
      label: 'Weapon Proficiencies',
      count: 4,
    }],
  }
];

export function getFeatById(id: string): SrdFeat | undefined {
  return srdFeats.find(feat => feat.id === id);
}

export function getFeatsByPrerequisite(prerequisite: string): SrdFeat[] {
  if (!prerequisite) return srdFeats;
  return srdFeats.filter(feat => feat.prerequisites === prerequisite);
}
