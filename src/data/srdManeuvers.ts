export interface Maneuver {
  name: string;
  description: string;
}

export const srdManeuvers: Maneuver[] = [
  {
    name: "Commander's Strike",
    description: "When you take the Attack action on your turn, you can forgo one of your attacks and use a bonus action to direct one of your companions to strike. When you do so, choose a friendly creature who can see or hear you and expend one superiority die. That creature can immediately use its reaction to make one weapon attack, adding the superiority die to its attack roll.",
  },
  {
    name: "Disarming Attack",
    description: "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to disarm the target. Add the superiority die to the attack's damage roll, and the target must make a Strength saving throw. On a failed save, the target drops one item of your choice that it's holding. The item lands at the target's feet.",
  },
  {
    name: "Distracting Strike",
    description: "When you hit a creature with a weapon attack, you can expend one superiority die to distract the target. Add the superiority die to the attack's damage roll, and the next attack roll against the target by a creature other than you has advantage. This effect ends after the next attack roll or at the end of the target's next turn.",
  },
  {
    name: "Evasive Footwork",
    description: "When you move on your turn, you can expend one superiority die, rolling the die and adding the number rolled to your AC until you stop moving. You can use this maneuver even if you have already used your movement but not when you are mounted or aren't wearing armor.",
  },
  {
    name: "Feinting Attack",
    description: "As a bonus action, you can expend one superiority die and choose a creature within 5 feet of you as your target. You have advantage on your next attack roll against that creature. If that attack hits, add the superiority die to the attack's damage roll.",
  },
  {
    name: "Goading Attack",
    description: "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to goad the target. Add the superiority die to the attack's damage roll, and the target must make a Wisdom saving throw. On a failed save, the target has disadvantage on all attack rolls against targets other than you until the end of your next turn.",
  },
  {
    name: "Lunging Attack",
    description: "When you make a melee weapon attack on your turn, you can expend one superiority die to increase your reach for that attack by 5 feet. If you hit, add the superiority die to the attack's damage roll.",
  },
  {
    name: "Maneuvering Attack",
    description: "When you hit a creature with a weapon attack, you can expend one superiority die to maneuver one of your comrades into a more advantageous position. Add the superiority die to the attack's damage roll, and you choose a friendly creature who can see or hear you. That creature can use its reaction to move up to half its speed without provoking opportunity attacks.",
  },
  {
    name: "Menacing Attack",
    description: "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to frighten the target. Add the superiority die to the attack's damage roll, and the target must make a Wisdom saving throw. On a failed save, the target is frightened of you until the end of your next turn.",
  },
  {
    name: "Parry",
    description: "When another creature damages you with a melee attack, you can use your reaction and expend one superiority die to reduce the damage by the number you roll on your superiority die plus your Dexterity modifier.",
  },
  {
    name: "Precision Attack",
    description: "When you make a weapon attack roll against a creature, you can expend one superiority die to add it to the roll. You can use this maneuver before or after making the attack roll, but before any effects of the attack are applied.",
  },
  {
    name: "Pushing Attack",
    description: "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to drive the target back. Add the superiority die to the attack's damage roll, and if the target is Large or smaller, it must make a Strength saving throw. On a failed save, the target is pushed up to 15 feet away from you.",
  },
  {
    name: "Rally",
    description: "On your turn, you can use a bonus action and expend one superiority die to bolster the resolve of one of your companions. When you do so, choose a friendly creature who can see or hear you. That creature gains temporary hit points equal to the superiority die roll plus your Charisma modifier.",
  },
  {
    name: "Riposte",
    description: "When a creature misses you with a melee attack, you can use your reaction and expend one superiority die to make a melee weapon attack against the creature. Add the superiority die to the attack's damage roll.",
  },
  {
    name: "Sweeping Attack",
    description: "When you hit a creature with a melee weapon attack, you can expend one superiority die to attempt to damage another creature with the same attack. Choose another creature within 5 feet of the original target. If the original attack roll would hit the second creature, it takes damage equal to the number you roll on your superiority die. The damage type is the same as the weapon's damage type.",
  },
  {
    name: "Trip Attack",
    description: "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to knock the target down. Add the superiority die to the attack's damage roll, and if the target is Large or smaller, it must make a Strength saving throw. On a failed save, the target is knocked prone.",
  },
];
