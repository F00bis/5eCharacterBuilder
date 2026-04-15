import { useEffect, useMemo } from 'react';
import { srdInvocationOptions } from '../../../data/srdInvocations';
import { srdMetamagicOptions } from '../../../data/srdMetamagic';
import { srdSpells } from '../../../data/srdSpells';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import type { Skill } from '../../../types';
import {
  calculateExpertiseEntitlements,
  calculateInvocationEntitlements,
  calculateMetamagicEntitlements,
  calculateMysticArcanumEntitlements,
} from '../../../utils/progressionEntitlements';
import { SKILL_DISPLAY_NAMES } from '../../../utils/skills';

function sourceLabel(className: string, level: number): string {
  return `${className} ${level}`;
}

function toggleInList<T>(list: T[], item: T, maxCount: number): T[] {
  if (list.includes(item)) {
    return list.filter(i => i !== item);
  }
  if (list.length >= maxCount) {
    return list;
  }
  return [...list, item];
}

export default function ProgressionChoicesStep() {
  const { state, dispatch } = useCharacterBuilder();

  const expertiseEntitlements = useMemo(
    () => calculateExpertiseEntitlements(state.draft.classes || []),
    [state.draft.classes]
  );
  const metamagicEntitlements = useMemo(
    () => calculateMetamagicEntitlements(state.draft.classes || []),
    [state.draft.classes]
  );
  const invocationEntitlements = useMemo(
    () => calculateInvocationEntitlements(state.draft.classes || []),
    [state.draft.classes]
  );
  const mysticArcanumEntitlements = useMemo(
    () => calculateMysticArcanumEntitlements(state.draft.classes || []),
    [state.draft.classes]
  );

  const proficientSkills = useMemo(() => {
    const skills = state.draft.skills || [];
    return [...new Set(skills.filter(s => s.level !== 'none').map(s => s.skill))] as Skill[];
  }, [state.draft.skills]);

  const alreadyExpertiseSkills = useMemo(() => {
    const skills = state.draft.skills || [];
    return [...new Set(skills.filter(s => s.level === 'expertise').map(s => s.skill))] as Skill[];
  }, [state.draft.skills]);

  const expertiseOptions = useMemo(
    () => proficientSkills.filter(skill => !alreadyExpertiseSkills.includes(skill)),
    [proficientSkills, alreadyExpertiseSkills]
  );

  const metamagicGlobalSelections = useMemo(() => {
    return Object.values(state.metamagicChoices).flat();
  }, [state.metamagicChoices]);

  const invocationGlobalSelections = useMemo(() => {
    return Object.values(state.invocationChoices).flat();
  }, [state.invocationChoices]);

  const isValid = useMemo(() => {
    for (const entitlement of expertiseEntitlements) {
      const selected = state.expertiseChoices[entitlement.sourceKey] || [];
      if (selected.length !== entitlement.count) return false;
      if (new Set(selected).size !== selected.length) return false;
      if (selected.some(skill => !expertiseOptions.includes(skill))) return false;
    }

    for (const entitlement of metamagicEntitlements) {
      const selected = state.metamagicChoices[entitlement.sourceKey] || [];
      if (selected.length !== entitlement.count) return false;
      if (new Set(selected).size !== selected.length) return false;
    }
    if (new Set(metamagicGlobalSelections).size !== metamagicGlobalSelections.length) return false;

    for (const entitlement of invocationEntitlements) {
      const selected = state.invocationChoices[entitlement.sourceKey] || [];
      if (selected.length !== entitlement.count) return false;
      if (new Set(selected).size !== selected.length) return false;
      const hasInvalidPrereq = selected.some(selectedName => {
        const option = srdInvocationOptions.find(invocation => invocation.name === selectedName);
        if (!option?.prerequisites?.minWarlockLevel) return false;
        return entitlement.level < option.prerequisites.minWarlockLevel;
      });
      if (hasInvalidPrereq) return false;
    }
    if (new Set(invocationGlobalSelections).size !== invocationGlobalSelections.length) return false;

    for (const entitlement of mysticArcanumEntitlements) {
      const selectedSpell = state.mysticArcanumChoices[entitlement.sourceKey];
      if (!selectedSpell) return false;
      const spell = srdSpells.find(s => s.name === selectedSpell);
      if (!spell) return false;
      if (spell.level !== entitlement.arcanumLevel) return false;
      if (!spell.classes.includes('Warlock')) return false;
    }

    return true;
  }, [
    expertiseEntitlements,
    expertiseOptions,
    invocationEntitlements,
    invocationGlobalSelections,
    metamagicEntitlements,
    metamagicGlobalSelections,
    mysticArcanumEntitlements,
    state.expertiseChoices,
    state.invocationChoices,
    state.metamagicChoices,
    state.mysticArcanumChoices,
  ]);

  useEffect(() => {
    dispatch({ type: 'SET_STEP_VALIDATION', stepId: 'progression-choices', isValid });
  }, [dispatch, isValid]);

  if (
    expertiseEntitlements.length === 0 &&
    metamagicEntitlements.length === 0 &&
    invocationEntitlements.length === 0 &&
    mysticArcanumEntitlements.length === 0
  ) {
    return (
      <div className="h-full overflow-y-auto space-y-4">
        <p className="text-slate-500">No progression choices are required at this level.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto space-y-6 pr-4">
      {expertiseEntitlements.map(entitlement => {
        const selected = state.expertiseChoices[entitlement.sourceKey] || [];
        return (
          <section key={entitlement.sourceKey} className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
            <h3 className="font-semibold">Expertise ({sourceLabel(entitlement.className, entitlement.level)})</h3>
            <p className="text-sm text-slate-600">Choose {entitlement.count} proficient skill(s) to gain Expertise.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {expertiseOptions.map(skill => (
                <button
                  key={`${entitlement.sourceKey}:${skill}`}
                  type="button"
                  onClick={() => {
                    const next = toggleInList(selected, skill, entitlement.count);
                    dispatch({ type: 'SET_EXPERTISE_CHOICE', source: entitlement.sourceKey, skills: next });
                  }}
                  className={`rounded px-3 py-2 text-sm border ${
                    selected.includes(skill)
                      ? 'bg-amber-100 border-amber-300 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {SKILL_DISPLAY_NAMES[skill]}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500">{selected.length}/{entitlement.count} selected</p>
          </section>
        );
      })}

      {metamagicEntitlements.map(entitlement => {
        const selected = state.metamagicChoices[entitlement.sourceKey] || [];
        return (
          <section key={entitlement.sourceKey} className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
            <h3 className="font-semibold">Metamagic ({sourceLabel(entitlement.className, entitlement.level)})</h3>
            <p className="text-sm text-slate-600">Choose {entitlement.count} new Metamagic option(s).</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {srdMetamagicOptions.map(option => {
                const usedElsewhere =
                  metamagicGlobalSelections.includes(option.name) && !selected.includes(option.name);
                return (
                  <button
                    key={`${entitlement.sourceKey}:${option.id}`}
                    type="button"
                    disabled={usedElsewhere}
                    onClick={() => {
                      const next = toggleInList(selected, option.name, entitlement.count);
                      dispatch({ type: 'SET_METAMAGIC_CHOICE', source: entitlement.sourceKey, options: next });
                    }}
                    className={`rounded px-3 py-2 text-sm border text-left ${
                      selected.includes(option.name)
                        ? 'bg-violet-100 border-violet-300 text-violet-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    } ${usedElsewhere ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <div className="font-medium">{option.name}</div>
                    <div className="text-xs mt-1">{option.description}</div>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-500">{selected.length}/{entitlement.count} selected</p>
          </section>
        );
      })}

      {invocationEntitlements.map(entitlement => {
        const selected = state.invocationChoices[entitlement.sourceKey] || [];
        return (
          <section key={entitlement.sourceKey} className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
            <h3 className="font-semibold">Eldritch Invocations ({sourceLabel(entitlement.className, entitlement.level)})</h3>
            <p className="text-sm text-slate-600">Choose {entitlement.count} new invocation(s).</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {srdInvocationOptions
                .filter(option => {
                  const minLevel = option.prerequisites?.minWarlockLevel;
                  return !minLevel || entitlement.level >= minLevel;
                })
                .map(option => {
                  const usedElsewhere =
                    invocationGlobalSelections.includes(option.name) && !selected.includes(option.name);
                  return (
                    <button
                      key={`${entitlement.sourceKey}:${option.id}`}
                      type="button"
                      disabled={usedElsewhere}
                      onClick={() => {
                        const next = toggleInList(selected, option.name, entitlement.count);
                        dispatch({ type: 'SET_INVOCATION_CHOICE', source: entitlement.sourceKey, options: next });
                      }}
                      className={`rounded px-3 py-2 text-sm border text-left ${
                        selected.includes(option.name)
                          ? 'bg-indigo-100 border-indigo-300 text-indigo-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      } ${usedElsewhere ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      <div className="font-medium">{option.name}</div>
                      <div className="text-xs mt-1">{option.description}</div>
                    </button>
                  );
                })}
            </div>
            <p className="text-xs text-slate-500">{selected.length}/{entitlement.count} selected</p>
          </section>
        );
      })}

      {mysticArcanumEntitlements.map(entitlement => {
        const selectedSpell = state.mysticArcanumChoices[entitlement.sourceKey] || '';
        const options = srdSpells.filter(
          spell => spell.level === entitlement.arcanumLevel && spell.classes.includes('Warlock')
        );

        return (
          <section key={entitlement.sourceKey} className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
            <h3 className="font-semibold">Mystic Arcanum ({sourceLabel(entitlement.className, entitlement.level)})</h3>
            <p className="text-sm text-slate-600">Choose one  level {entitlement.arcanumLevel} Warlock spell.</p>
            <select
              value={selectedSpell}
              onChange={(event) =>
                dispatch({
                  type: 'SET_MYSTIC_ARCANUM_CHOICE',
                  source: entitlement.sourceKey,
                  spellName: event.target.value,
                })
              }
              className="w-full rounded border border-slate-300 p-2"
            >
              <option value="">-- Select Spell --</option>
              {options.map(option => (
                <option key={`${entitlement.sourceKey}:${option.name}`} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </section>
        );
      })}
    </div>
  );
}
