import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { srdRaces } from '../../../data/srdRaces';
import { srdBackgrounds } from '../../../data/srdBackgrounds';
import type { Ability } from '../../../types';

const ABILITIES: Ability[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

export function isValidRaceStep(
  race: string | undefined,
  background: string | undefined,
  useTashasRules: boolean,
  plus2: Ability | null,
  plus1: Ability | null
): boolean {
  if (!race || !background) return false;
  if (useTashasRules) {
    return !!(plus2 && plus1 && plus2 !== plus1);
  }
  return true;
}

export default function RaceBackgroundStep() {
  const { state, dispatch } = useCharacterBuilder();
  const [plus2, setPlus2] = useState<Ability | null>(null);
  const [plus1, setPlus1] = useState<Ability | null>(null);

  const useTashasRules = state.useTashasRules ?? true;

  const selectedRace = useMemo(() => srdRaces.find(r => r.name === state.draft.race), [state.draft.race]);
  const selectedSubrace = useMemo(() => {
    if (!selectedRace || !state.draft.subrace) return undefined;
    return selectedRace.subraces?.find(sr => sr.id === state.draft.subrace);
  }, [selectedRace, state.draft.subrace]);
  const selectedBg = useMemo(() => srdBackgrounds.find(b => b.name === state.draft.background), [state.draft.background]);

  const hasSubraces = selectedRace?.subraces && selectedRace.subraces.length > 0;

  const effectiveSpeed = selectedSubrace?.speed ?? selectedRace?.speed ?? 30;
  const effectiveDarkvision = selectedSubrace?.darkvision ?? selectedRace?.features.find(f => f.name === 'Darkvision') ? 60 : undefined;

  const updateRaceStatSelections = useCallback((p2: Ability | null, p1: Ability | null) => {
    const selections: { ability: Ability; amount: number }[] = [];
    if (p2) {
      selections.push({ ability: p2, amount: 2 });
    }
    if (p1 && p1 !== p2) {
      selections.push({ ability: p1, amount: 1 });
    }
    dispatch({ type: 'UPDATE_DRAFT', updates: { raceStatSelections: selections } });
  }, [dispatch]);

  useEffect(() => {
    const isValid = isValidRaceStep(state.draft.race, state.draft.background, useTashasRules, plus2, plus1);
    dispatch({ type: 'SET_STEP_VALIDATION', stepId: 'race', isValid });
  }, [state.draft.race, state.draft.background, useTashasRules, plus2, plus1, dispatch]);

  const handleRaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const raceId = e.target.value;
    const race = srdRaces.find(r => r.id === raceId);
    
    dispatch({ 
      type: 'UPDATE_DRAFT', 
      updates: { 
        race: race?.name || undefined,
        subrace: undefined,
        raceStatSelections: []
      } 
    });
    
    setPlus2(null);
    setPlus1(null);
  };

  const handleSubraceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subraceId = e.target.value;
    
    dispatch({ 
      type: 'UPDATE_DRAFT', 
      updates: { 
        subrace: subraceId || undefined,
        raceStatSelections: []
      } 
    });
    
    setPlus2(null);
    setPlus1(null);
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bgId = e.target.value;
    const bg = srdBackgrounds.find(b => b.id === bgId);
    
    dispatch({ type: 'REMOVE_ITEMS_BY_SOURCE', listName: 'skills', source: 'Background' });
    
    if (bg) {
      bg.skillProficiencies.forEach(skill => {
        dispatch({
          type: 'ADD_ITEM_WITH_SOURCE',
          listName: 'skills',
          item: { skill, ability: 'wisdom', level: 'proficient', source: 'Background' }
        });
      });
    }

    dispatch({ type: 'UPDATE_DRAFT', updates: { background: bg?.name || undefined } });
  };

  const handlePlus2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ability = e.target.value as Ability;
    setPlus2(ability);
    if (ability === plus1) {
      setPlus1(null);
    }
    updateRaceStatSelections(ability, plus1);
  };

  const handlePlus1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ability = e.target.value as Ability;
    setPlus1(ability);
    updateRaceStatSelections(plus2, ability);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
      <div className="space-y-6">
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
              <option value="">None (Base {selectedRace.name})</option>
              {selectedRace.subraces?.map(sub => (
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
            ) : selectedSubrace && selectedSubrace.abilityScoreIncreases ? (
              <div>
                <h4 className="text-sm font-semibold mb-2">Traditional Ability Bonuses</h4>
                <p className="text-xs text-slate-500 mb-2">Your {selectedSubrace.name} heritage grants:</p>
                <ul className="text-sm space-y-1">
                  {selectedSubrace.abilityScoreIncreases.map((inc, idx) => (
                    <li key={idx}>
                      +{inc.amount} {inc.ability ? inc.ability.charAt(0).toUpperCase() + inc.ability.slice(1) : 'flexible'}
                    </li>
                  ))}
                </ul>
              </div>
            ) : selectedRace.abilityScoreIncreases ? (
              <div>
                <h4 className="text-sm font-semibold mb-2">Traditional Ability Bonuses</h4>
                <p className="text-xs text-slate-500 mb-2">Your {selectedRace.name} heritage grants:</p>
                <ul className="text-sm space-y-1">
                  {selectedRace.abilityScoreIncreases.map((inc, idx) => (
                    <li key={idx}>
                      +{inc.amount} {inc.ability ? inc.ability.charAt(0).toUpperCase() + inc.ability.slice(1) : 'flexible'}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Select Background</label>
          <select 
            className="w-full border-slate-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
            value={selectedBg?.id || ''}
            onChange={handleBackgroundChange}
          >
            <option value="" disabled>-- Choose a Background --</option>
            {srdBackgrounds.map(bg => (
              <option key={bg.id} value={bg.id}>{bg.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 max-h-[60vh] overflow-y-auto">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">Summary</h2>
          
          {!selectedRace && !selectedBg && (
            <p className="text-slate-500 italic">Select a race and background to see details.</p>
          )}

          {selectedRace && (
            <div className="mb-6">
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

          {selectedBg && (
            <div>
              <h3 className="font-semibold text-lg text-purple-700 border-t pt-4">{selectedBg.name}</h3>
              <p className="text-sm text-slate-600 mt-2 mb-3">{selectedBg.description}</p>
              <div className="text-sm">
                <span className="font-medium text-slate-800">Skill Proficiencies: </span>
                <span className="text-slate-600">
                  {selectedBg.skillProficiencies.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
