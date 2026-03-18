export function rollDice(formula: string): number {
  const match = formula.trim().toLowerCase().match(/^(\d+)d(\d+)(?:dl(\d+))?$/);
  
  if (!match) {
    throw new Error(`Invalid dice formula: ${formula}`);
  }

  const [, numDiceStr, sidesStr, dropLowestStr] = match;
  const numDice = parseInt(numDiceStr, 10);
  const sides = parseInt(sidesStr, 10);
  const dropLowest = dropLowestStr ? parseInt(dropLowestStr, 10) : 0;

  if (numDice <= 0 || sides <= 0 || dropLowest >= numDice) {
    throw new Error(`Invalid dice formula parameters: ${formula}`);
  }

  const rolls: number[] = [];
  for (let i = 0; i < numDice; i++) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }

  // Sort ascending so the lowest rolls are at the beginning
  rolls.sort((a, b) => a - b);
  
  // Slice off the lowest 'dropLowest' rolls
  const keptRolls = rolls.slice(dropLowest);
  return keptRolls.reduce((sum, roll) => sum + roll, 0);
}
