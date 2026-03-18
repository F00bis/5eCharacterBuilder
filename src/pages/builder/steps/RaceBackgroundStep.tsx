import React, { useMemo } from 'react';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { srdRaces } from '../../../data/srdRaces';
import { srdBackgrounds } from '../../../data/srdBackgrounds';

export default function RaceBackgroundStep() {
  const { state, dispatch } = useCharacterBuilder();

  const handleRaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const raceId = e.target.value;
    const race = srdRaces.find(r => r.id === raceId);
    
    // Clear out any previously selected flexible stats when race changes
    dispatch({ type: 'UPDATE_DRAFT', updates: { race: race?.name || undefined } });
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bgId = e.target.value;
    const bg = srdBackgrounds.find(b => b.id === bgId);
    
    // 1. Remove old background skills
    dispatch({ type: 'REMOVE_ITEMS_BY_SOURCE', listName: 'skills', source: 'Background' });
    
    // 2. Add new background skills
    if (bg) {
      bg.skillProficiencies.forEach(skill => {
        dispatch({
          type: 'ADD_ITEM_WITH_SOURCE',
          listName: 'skills',
          item: { skill, ability: 'wisdom', level: 'proficient', source: 'Background' } // Note: ability mapping should ideally be dynamic based on the skill
        });
      });
    }

    dispatch({ type: 'UPDATE_DRAFT', updates: { background: bg?.name || undefined } });
  };

  const selectedRace = useMemo(() => srdRaces.find(r => r.name === state.draft.race), [state.draft.race]);
  const selectedBg = useMemo(() => srdBackgrounds.find(b => b.name === state.draft.background), [state.draft.background]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
      {/* Controls */}
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

        {selectedRace && (
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
            <h3 className="text-sm font-semibold mb-3">Ability Score Increases (Tasha's Rules)</h3>
            <p className="text-xs text-slate-500 mb-3">Allocate your +2 and +1 bonuses to different ability scores.</p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">+2 Bonus</label>
                <select className="w-full text-sm border-slate-300 rounded shadow-sm p-1 border">
                  <option value="" disabled>Select Ability</option>
                  {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map(stat => (
                    <option key={stat} value={stat}>{stat.charAt(0).toUpperCase() + stat.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">+1 Bonus</label>
                <select className="w-full text-sm border-slate-300 rounded shadow-sm p-1 border">
                  <option value="" disabled>Select Ability</option>
                  {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map(stat => (
                    <option key={stat} value={stat}>{stat.charAt(0).toUpperCase() + stat.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
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

      {/* Preview Card */}
      <div>
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 h-full">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">Summary</h2>
          
          {!selectedRace && !selectedBg && (
            <p className="text-slate-500 italic">Select a race and background to see details.</p>
          )}

          {selectedRace && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg text-purple-700">{selectedRace.name}</h3>
              <div className="flex gap-4 text-sm text-slate-600 mb-3 mt-1">
                <span>Speed: {selectedRace.speed}ft</span>
                <span>Size: {selectedRace.size}</span>
              </div>
              <ul className="text-sm space-y-2">
                {selectedRace.features.map(f => (
                  <li key={f.name}>
                    <span className="font-medium text-slate-800">{f.name}: </span>
                    <span className="text-slate-600">{f.description}</span>
                  </li>
                ))}
              </ul>
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
