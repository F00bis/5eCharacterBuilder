import { useMemo, useState, useEffect, useCallback } from 'react';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { srdRaces } from '../../../data/srdRaces';
import type { Ability } from '../../../types';
import type { RaceChoice } from '../../../types/races';
import { isValidRaceStep } from '../../../utils/validation';
import {
  DraconicAncestryChoice,
  SkillChoice,
  CantripChoice,
} from './raceChoices';
import { LanguageSelector } from '@/components/LanguageSelector';

const ABILITIES: Ability[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

function getAllRequiredChoices(
  race: typeof srdRaces[0] | undefined,
  subraceId: string | undefined
): RaceChoice[] {
  if (!race) return [];

  const choices: RaceChoice[] = [];

  if (race.choices) {
    choices.push(...race.choices.filter(c => c.required && c.type !== 'feat' && c.type !== 'language'));
  }

  if (subraceId) {
    const subrace = race.subraces?.find(sr => sr.id === subraceId);
    if (subrace?.choices) {
      choices.push(...subrace.choices.filter(c => c.required && c.type !== 'feat' && c.type !== 'language'));
    }
  }

  return choices;
}

export default function RaceStep() {
  const { state, dispatch } = useCharacterBuilder();
  const [plus2, setPlus2] = useState<Ability | null>(null);
  const [plus1, setPlus1] = useState<Ability | null>(null);
  const [flexibleSelections, setFlexibleSelections] = useState<Record<number, Ability | null>>({});

  const useTashasRules = state.useTashasRules ?? true;

  const selectedRace = useMemo(() => srdRaces.find(r => r.name === state.draft.race), [state.draft.race]);
  const selectedSubrace = useMemo(() => {
    if (!selectedRace || !state.draft.subrace) return undefined;
    return selectedRace.subraces?.find(sr => sr.id === state.draft.subrace);
  }, [selectedRace, state.draft.subrace]);

  const baseBonuses = useMemo(() => 
    selectedSubrace?.abilityScoreIncreases ?? selectedRace?.abilityScoreIncreases ?? [],
  [selectedRace, selectedSubrace]);

  const additionalLanguageCount = selectedRace?.additionalLanguages ?? 0;

  const hasSubraces = selectedRace?.subraces && selectedRace.subraces.length > 0;

  const effectiveSpeed = selectedSubrace?.speed ?? selectedRace?.speed ?? 30;
  const effectiveDarkvision = selectedSubrace?.darkvision ?? selectedRace?.features.find(f => f.name === 'Darkvision') ? 60 : undefined;

  const requiredChoices = useMemo(
    () => getAllRequiredChoices(selectedRace, state.draft.subrace),
    [selectedRace, state.draft.subrace]
  );

  const updateRaceStatSelections = useCallback((
    p2: Ability | null, 
    p1: Ability | null, 
    flex: Record<number, Ability | null>,
    isTashas: boolean,
    bonuses: { ability?: Ability; amount: number }[]
  ) => {
    const selections: { ability: Ability; amount: number }[] = [];
    
    if (isTashas) {
      if (p2) selections.push({ ability: p2, amount: 2 });
      if (p1 && p1 !== p2) selections.push({ ability: p1, amount: 1 });
    } else {
      let flexIdx = 0;
      bonuses.forEach((inc) => {
        if (inc.ability) {
          selections.push({ ability: inc.ability, amount: inc.amount });
        } else {
          const selected = flex[flexIdx];
          if (selected) {
            selections.push({ ability: selected, amount: inc.amount });
          }
          flexIdx++;
        }
      });
    }
    
    dispatch({ type: 'UPDATE_DRAFT', updates: { raceStatSelections: selections } });
  }, [dispatch]);

  useEffect(() => {
    const isValid = isValidRaceStep(
      state.draft.race,
      state.draft.subrace,
      useTashasRules,
      plus2,
      plus1,
      flexibleSelections,
      baseBonuses,
      state.raceChoices,
      requiredChoices,
      additionalLanguageCount
    );
    dispatch({ type: 'SET_STEP_VALIDATION', stepId: 'race', isValid });
  }, [state.draft.race, state.draft.subrace, useTashasRules, plus2, plus1, flexibleSelections, baseBonuses, state.raceChoices, requiredChoices, additionalLanguageCount, dispatch]);

  // Update effect to sync selections when rules toggle or bonuses change
  useEffect(() => {
    updateRaceStatSelections(plus2, plus1, flexibleSelections, useTashasRules, baseBonuses);
  }, [plus2, plus1, flexibleSelections, useTashasRules, baseBonuses, updateRaceStatSelections]);

  const handleRaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const raceId = e.target.value;
    const race = srdRaces.find(r => r.id === raceId);

    dispatch({
      type: 'UPDATE_DRAFT',
      updates: {
        race: race?.name || undefined,
        subrace: undefined,
        raceStatSelections: [],
        languages: race?.languages || [],
      }
    });
    dispatch({ type: 'CLEAR_RACE_CHOICES' });

    setPlus2(null);
    setPlus1(null);
    setFlexibleSelections({});
  };

  const handleSubraceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subraceId = e.target.value;

    dispatch({
      type: 'UPDATE_DRAFT',
      updates: {
        subrace: subraceId || undefined,
        raceStatSelections: [],
      }
    });
    dispatch({ type: 'CLEAR_RACE_CHOICES' });

    setPlus2(null);
    setPlus1(null);
    setFlexibleSelections({});
  };

  const handlePlus2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ability = e.target.value as Ability;
    setPlus2(ability);
    if (ability === plus1) {
      setPlus1(null);
    }
  };

  const handlePlus1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ability = e.target.value as Ability;
    setPlus1(ability);
  };

  const handleFlexibleChange = (index: number, ability: Ability | '') => {
    setFlexibleSelections(prev => ({
      ...prev,
      [index]: ability || null
    }));
  };

  const handleRaceChoiceChange = (choiceType: string, value: string | string[]) => {
    dispatch({ type: 'SET_RACE_CHOICE', choiceType, value });
  };

  const handleLanguageChange = (languages: string[]) => {
    const raceLanguages = selectedRace?.languages || [];
    const additionalLanguages = languages.filter(l => !raceLanguages.includes(l));
    dispatch({ type: 'UPDATE_DRAFT', updates: { languages: [...raceLanguages, ...additionalLanguages] } });
  };

  const renderChoiceComponent = (choice: RaceChoice) => {
    const currentValue = state.raceChoices[choice.type];

    switch (choice.type) {
      case 'draconicAncestry':
        return (
          <DraconicAncestryChoice
            key={choice.type}
            value={(currentValue as string) || ''}
            onChange={(value) => handleRaceChoiceChange(choice.type, value)}
          />
        );

case 'skill':
        return (
          <SkillChoice
            key={choice.type}
            value={Array.isArray(currentValue) ? currentValue : []}
            count={choice.count}
            onChange={(value) => handleRaceChoiceChange(choice.type, value)}
          />
        );

      case 'cantrip':
        return (
          <CantripChoice
            key={choice.type}
            value={(currentValue as string) || ''}
            onChange={(value) => handleRaceChoiceChange(choice.type, value)}
            spellClass="wizard"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left h-full overflow-hidden">
      <div className="space-y-6 overflow-y-auto pr-4 h-full">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Select Race</label>
          <select
            className="w-full border-slate-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
            value={selectedRace?.id || ''}
            onChange={handleRaceChange}
          >
            <option value="" disabled>-- Choose a Race --</option>
            {srdRaces.map(race => (
              <option key={race.id} value={race.id}>{race.name}</option>
            ))}
          </select>
        </div>

        {hasSubraces && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Subrace</label>
            <select
              className="w-full border-slate-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
              value={state.draft.subrace || ''}
              onChange={handleSubraceChange}
            >
              <option value="">None (Base {selectedRace?.name})</option>
              {selectedRace?.subraces?.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
        )}

        {selectedRace && (
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={useTashasRules}
                onChange={(e) => dispatch({ type: 'SET_TASHAS_RULES', enabled: e.target.checked })}
                className="rounded border-slate-300"
              />
              <label className="text-sm font-medium text-slate-700">Use Flexible Ability Scores (Tasha's Rules)</label>
            </div>

            {useTashasRules ? (
              <>
                <h3 className="text-sm font-semibold mb-3">Ability Score Increases (Tasha's Rules)</h3>
                <p className="text-xs text-slate-500 mb-3">Allocate your +2 and +1 bonuses to different ability scores.</p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">+2 Bonus</label>
                    <select
                      className="w-full text-sm border-slate-300 rounded shadow-sm p-1 border"
                      value={plus2 ?? ''}
                      onChange={handlePlus2Change}
                    >
                      <option value="">Select Ability</option>
                      {ABILITIES.map(stat => (
                        <option key={stat} value={stat} disabled={stat === plus1}>{stat.charAt(0).toUpperCase() + stat.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">+1 Bonus</label>
                    <select
                      className="w-full text-sm border-slate-300 rounded shadow-sm p-1 border"
                      value={plus1 ?? ''}
                      onChange={handlePlus1Change}
                    >
                      <option value="">Select Ability</option>
                      {ABILITIES.map(stat => (
                        <option key={stat} value={stat} disabled={stat === plus2}>{stat.charAt(0).toUpperCase() + stat.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold mb-2">Traditional Ability Bonuses</h4>
                <p className="text-xs text-slate-500 mb-2">
                  Your {selectedSubrace?.name ?? selectedRace.name} heritage grants:
                </p>
                <div className="space-y-3">
                  {baseBonuses.map((inc, idx) => {
                    if (inc.ability) {
                      return (
                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-700 bg-white p-2 rounded border border-slate-200">
                          <span className="font-bold text-purple-600">+{inc.amount}</span>
                          <span className="capitalize">{inc.ability}</span>
                        </div>
                      );
                    }

                    const flexIdx = baseBonuses.slice(0, idx).filter(b => !b.ability).length;
                    
                    return (
                      <div key={idx} className="space-y-1">
                        <label className="block text-xs font-medium text-slate-600">+{inc.amount} Bonus (Flexible)</label>
                        <select
                          className="w-full text-sm border-slate-300 rounded shadow-sm p-1 border"
                          value={flexibleSelections[flexIdx] ?? ''}
                          onChange={(e) => handleFlexibleChange(flexIdx, e.target.value as Ability)}
                        >
                          <option value="">Select Ability</option>
                          {ABILITIES.map(stat => {
                            const isFixed = baseBonuses.some(b => b.ability === stat);
                            const isTakenByOtherFlex = Object.entries(flexibleSelections).some(([k, v]) => parseInt(k) !== flexIdx && v === stat);
                            
                            return (
                              <option key={stat} value={stat} disabled={isFixed || isTakenByOtherFlex}>
                                {stat.charAt(0).toUpperCase() + stat.slice(1)}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {requiredChoices.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700">Race Choices</h3>
            <div className="space-y-4">
              {requiredChoices.map(choice => renderChoiceComponent(choice))}
            </div>
          </div>
        )}

        {selectedRace && selectedRace.languages.length > 0 && (
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
            {additionalLanguageCount > 0 ? (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  Additional Languages <span className="text-red-500">*</span>
                </h3>
                <LanguageSelector
                  selectedLanguages={(state.raceChoices['language'] as string[]) || []}
                  onChange={(languages) => {
                    handleRaceChoiceChange('language', languages);
                    handleLanguageChange(languages);
                  }}
                  maxSelections={additionalLanguageCount}
                  knownLanguages={selectedRace.languages}
                  label="Additional Languages"
                />
              </div>
            ) : (
              <>
                <h3 className="text-sm font-semibold mb-2">Known Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRace.languages.map(lang => (
                    <span
                      key={lang}
                      className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded text-sm"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="h-full">
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 h-full overflow-y-auto">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">Summary</h2>

          {!selectedRace && (
            <p className="text-slate-500 italic">Select a race to see details.</p>
          )}

          {selectedRace && (
            <div>
              <h3 className="font-semibold text-lg text-purple-700">
                {selectedRace.name}
                {selectedSubrace && <span className="text-purple-500"> ({selectedSubrace.name})</span>}
              </h3>
              <div className="flex gap-4 text-sm text-slate-600 mb-3 mt-1">
                <span>Speed: {effectiveSpeed}ft</span>
                <span>Size: {selectedRace.size}</span>
                {effectiveDarkvision && <span>Darkvision: {effectiveDarkvision}ft</span>}
              </div>
              <ul className="text-sm space-y-2">
                {selectedRace.features.map(f => (
                  <li key={f.name}>
                    <span className="font-medium text-slate-800">{f.name}: </span>
                    <span className="text-slate-600">{f.description}</span>
                  </li>
                ))}
              </ul>

              {selectedSubrace && (
                <div className="mt-4 p-4 bg-purple-50 rounded">
                  <h4 className="font-semibold text-purple-700">{selectedSubrace.name}</h4>
                  {selectedSubrace.description && (
                    <p className="text-sm text-slate-600 mt-1">{selectedSubrace.description}</p>
                  )}
                  {selectedSubrace.features?.map(f => (
                    <div key={f.name} className="mt-2">
                      <span className="font-medium text-slate-800">{f.name}: </span>
                      <span className="text-sm text-slate-600">{f.description}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
