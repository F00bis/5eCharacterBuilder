import type { Ability, Character, Equipment } from '../types';

export interface AttackResult {
  toHit: number;
  damage: string;
  damageType: string;
  toHitBreakdown: { name: string; value: number }[];
  damageBreakdown: { name: string; value: number }[];
  damageBonusSources: { name: string; value: number }[];
}

export interface SpellAttackResult {
  attackBonus: number;
  saveDC: number;
  attackBreakdown: { name: string; value: number }[];
  saveDCBreakdown: { name: string; value: number }[];
}

function getAbilityModifier(character: Character, ability: Ability): number {
  const score = character.abilityScores[ability];
  return Math.floor((score - 10) / 2);
}

function getProficiencyBonus(character: Character): number {
  return character.proficiencyBonus;
}

const basicWeaponProficiencies = [
  'unarmed strike', 'club', 'dagger', 'greatclub', 'handaxe', 'javelin', 'light hammer',
  'mace', 'quarterstaff', 'sickle', 'spear', 'shortbow', 'sling', 'dart', 'crossbow',
  'hand crossbow', 'heavy crossbow', 'longbow', 'net', 'trident', 'war pick', 'warhammer',
  'whip', 'flail', 'glaive', 'greataxe', 'greatsword', 'halberd', 'lance', 'longsword',
  'maul', 'pike', 'rapier', 'scimitar', 'shortsword'
];

function isWeaponProficient(character: Character, weapon: Equipment): boolean {
  const weaponName = weapon.name.toLowerCase();
  
  if (basicWeaponProficiencies.some(prof => weaponName.includes(prof))) {
    return true;
  }
  
  const isMartial = weapon.weaponCategory?.includes('Martial');
  if (!isMartial) {
    return true;
  }
  
  return character.classes.some(classEntry => {
    if (classEntry.className === 'Fighter' || classEntry.className === 'Paladin' || 
        classEntry.className === 'Ranger' || classEntry.className === 'Barbarian') {
      return true;
    }
    if (classEntry.className === 'Rogue' && weaponName.includes('rapier')) {
      return true;
    }
    if (classEntry.className === 'Monk' && (weaponName.includes('quarterstaff') || weaponName.includes('shortsword'))) {
      return true;
    }
    return false;
  });
}

function parseDamage(damage: string): { dice: string; type: string } {
  const match = damage.match(/(\d+d\d+(?:\+\d+)?)\s*(\w+)?/);
  if (match) {
    return { dice: match[1], type: match[2] || 'bludgeoning' };
  }
  return { dice: damage, type: 'bludgeoning' };
}

function getEffectiveAbilityScore(character: Character, ability: Ability): number {
  let score = character.abilityScores[ability];
  
  for (const item of character.equipment) {
    if (!item.equipped) continue;
    if (item.abilityOverride?.[ability] && item.abilityOverride[ability]! > score) {
      score = item.abilityOverride[ability]!;
    }
  }
  
  return score;
}

function getWeaponBonus(weapon: Equipment): number {
  const name = weapon.name.toLowerCase();
  
  const plusMatch = name.match(/\+(\d+)/);
  if (plusMatch) {
    return parseInt(plusMatch[1], 10);
  }
  
  if (name.includes('masterwork')) {
    return 1;
  }
  
  return 0;
}

export function getWeaponAttack(character: Character, weapon: Equipment): AttackResult {
  const isMelee = !weapon.weaponCategory?.includes('Ranged') || weapon.properties?.includes('Thrown');
  const ability: Ability = isMelee ? 'strength' : 'dexterity';
  
  const effectiveScore = getEffectiveAbilityScore(character, ability);
  const mod = Math.floor((effectiveScore - 10) / 2);
  
  const proficient = isWeaponProficient(character, weapon);
  const prof = proficient ? getProficiencyBonus(character) : 0;
  
  const toHit = mod + prof;
  
  const toHitBreakdown = [
    { name: ability.charAt(0).toUpperCase() + ability.slice(1) + ' modifier', value: mod },
  ];
  if (prof > 0) {
    toHitBreakdown.push({ name: 'Proficiency', value: prof });
  }
  
  const weaponBonus = getWeaponBonus(weapon);
  
  const damageInfo = parseDamage(weapon.damage || '1d4');
  const damageDice = damageInfo.dice;
  const damageType = damageInfo.type;
  
  const damageBonusSources: { name: string; value: number }[] = [];
  
  if (mod !== 0) {
    damageBonusSources.push({ name: ability.charAt(0).toUpperCase() + ability.slice(1) + ' modifier', value: mod });
  }
  if (weaponBonus !== 0) {
    damageBonusSources.push({ name: weapon.name, value: weaponBonus });
  }
  
  const totalDamageBonus = mod + weaponBonus;
  const damageBreakdown: { name: string; value: number }[] = [];
  
  const diceMatch = damageDice.match(/(\d+)d(\d+)/);
  if (diceMatch) {
    const numDice = parseInt(diceMatch[1], 10);
    const dieSize = parseInt(diceMatch[2], 10);
    damageBreakdown.push({ name: 'Damage dice', value: Math.floor(numDice * (dieSize + 1) / 2) });
  }
  
  const damage = totalDamageBonus !== 0 ? damageDice + '+' + totalDamageBonus : damageDice;
  
  return {
    toHit,
    damage,
    damageType,
    toHitBreakdown,
    damageBreakdown,
    damageBonusSources,
  };
}

export function getUnarmedStrike(character: Character): AttackResult {
  let baseDamage = '1';
  const strMod = getAbilityModifier(character, 'strength');
  
  const isMonk = character.classes.some(c => c.className === 'Monk');
  if (isMonk) {
    const monkLevel = character.classes.find(c => c.className === 'Monk')?.level || 1;
    if (monkLevel >= 17) {
      baseDamage = '10';
    } else if (monkLevel >= 11) {
      baseDamage = '8';
    } else if (monkLevel >= 5) {
      baseDamage = '6';
    } else {
      baseDamage = '4';
    }
  }
  
  const damage = strMod > 0 ? baseDamage + '+' + strMod : baseDamage;
  
  const damageBonusSources = strMod > 0 
    ? [{ name: 'Strength modifier', value: strMod }]
    : [];
  
  return {
    toHit: strMod + getProficiencyBonus(character),
    damage,
    damageType: 'bludgeoning',
    toHitBreakdown: [
      { name: 'Strength modifier', value: strMod },
      { name: 'Proficiency', value: getProficiencyBonus(character) },
    ],
    damageBreakdown: [
      { name: isMonk ? 'Martial Arts' : 'Base damage', value: parseInt(baseDamage, 10) },
      { name: 'Strength modifier', value: strMod },
    ],
    damageBonusSources,
  };
}

export function getSpellAttack(character: Character): SpellAttackResult {
  const spellcastingAbility = getSpellcastingAbility(character);
  const mod = getAbilityModifier(character, spellcastingAbility);
  const prof = getProficiencyBonus(character);
  
  return {
    attackBonus: mod + prof,
    saveDC: 8 + mod + prof,
    attackBreakdown: [
      { name: spellcastingAbility.charAt(0).toUpperCase() + spellcastingAbility.slice(1) + ' modifier', value: mod },
      { name: 'Proficiency', value: prof },
    ],
    saveDCBreakdown: [
      { name: 'Base', value: 8 },
      { name: spellcastingAbility.charAt(0).toUpperCase() + spellcastingAbility.slice(1) + ' modifier', value: mod },
      { name: 'Proficiency', value: prof },
    ],
  };
}

export function getSpellSaveDC(character: Character): number {
  const spellcastingAbility = getSpellcastingAbility(character);
  const mod = getAbilityModifier(character, spellcastingAbility);
  return 8 + mod + getProficiencyBonus(character);
}

function getSpellcastingAbility(character: Character): Ability {
  const className = character.classes[0]?.className;
  
  if (className === 'Wizard' || className === 'Druid') {
    return 'intelligence';
  }
  if (className === 'Cleric' || className === 'Ranger') {
    return 'wisdom';
  }
  if (className === 'Sorcerer' || className === 'Bard' || className === 'Paladin' || className === 'Warlock') {
    return 'charisma';
  }
  
  return 'intelligence';
}
