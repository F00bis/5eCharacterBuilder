import type { AbilityBreakdown } from '../utils/abilityScores';
import { formatModifier } from '../utils/abilityScores';

const abilityAbbreviations: Record<string, string> = {
  strength: 'STR',
  dexterity: 'DEX',
  constitution: 'CON',
  intelligence: 'INT',
  wisdom: 'WIS',
  charisma: 'CHA',
};

const abilityFullNames: Record<string, string> = {
  strength: 'Strength',
  dexterity: 'Dexterity',
  constitution: 'Constitution',
  intelligence: 'Intelligence',
  wisdom: 'Wisdom',
  charisma: 'Charisma',
};

export function AbilityScoreBox({ breakdown }: { breakdown: AbilityBreakdown }) {
  const abbr = abilityAbbreviations[breakdown.ability];
  const fullName = abilityFullNames[breakdown.ability];
  const formattedMod = formatModifier(breakdown.modifier);

  let modifierColor = 'text-gray-500';
  if (breakdown.modifier > 0) modifierColor = 'text-green-600';
  else if (breakdown.modifier < 0) modifierColor = 'text-red-600';

  return (
    <div className="group relative w-28">
      {/* Box face */}
      <div className="flex flex-col items-center border border-gray-300 rounded-lg p-3 bg-white shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
          {abbr}
        </span>
        <span className="text-2xl font-bold text-gray-900">
          {breakdown.totalScore}
        </span>
        <span className={`text-sm font-medium ${modifierColor}`}>
          {formattedMod}
        </span>
      </div>

      {/* Tooltip */}
      <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-10 w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-lg text-sm">
        <div className="font-bold text-gray-900">
          {fullName}: {breakdown.totalScore}
        </div>
        <hr className="my-1 border-gray-300" />
        {breakdown.override ? (
          <>
            <div className="text-purple-700 font-medium">
              Set to {breakdown.override.value} by {breakdown.override.name}
            </div>
            <div className="text-gray-400 line-through">Base: {breakdown.baseScore}</div>
            {breakdown.featSources.map((source, i) => (
              <div key={`feat-${i}`} className="text-gray-700">
                {source.name} ({source.type}): {formatModifier(source.value)}
              </div>
            ))}
            {breakdown.equipmentSources.map((source, i) => (
              <div key={`equip-${i}`} className="text-gray-400 line-through">
                {source.name} ({source.type}): {formatModifier(source.value)}
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="text-gray-700">Base: {breakdown.baseScore}</div>
            {breakdown.featSources.map((source, i) => (
              <div key={`feat-${i}`} className="text-gray-700">
                {source.name} ({source.type}): {formatModifier(source.value)}
              </div>
            ))}
            {breakdown.equipmentSources.map((source, i) => (
              <div key={`equip-${i}`} className="text-gray-700">
                {source.name} ({source.type}): {formatModifier(source.value)}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
