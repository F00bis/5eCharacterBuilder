import { useState, useEffect, useMemo } from 'react';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { rollDice } from '../../../utils/diceRoller';
import type { Ability, AbilityScores } from '../../../types';

const ABILITIES: Ability[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
const MAX_POINT_BUY = 27;

const POINT_COSTS: Record<number, number> = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
};

export default function AbilityScoresStep() {
  const { dispatch } = useCharacterBuilder();
  const [activeTab, setActiveTab] = useState<'standard' | 'pointBuy' | 'manual'>('standard');
  
  // States for each method
  const [standardScores, setStandardScores] = useState<Partial<Record<Ability, number>>>({});
  const [pointBuyScores, setPointBuyScores] = useState<AbilityScores>({
    strength: 8, dexterity: 8, constitution: 8, intelligence: 8, wisdom: 8, charisma: 8
  });
  
  const [manualRolls, setManualRolls] = useState<number[]>([]);
  const [manualFormula, setManualFormula] = useState('4d6dl1');
  const [manualAssignments, setManualAssignments] = useState<Partial<Record<Ability, number>>>({});

  const manualScores = useMemo(() => {
    const scores: Partial<Record<Ability, number>> = {};
    for (const ability of ABILITIES) {
      const idx = manualAssignments[ability];
      if (idx !== undefined && manualRolls[idx] !== undefined) {
        scores[ability] = manualRolls[idx];
      }
    }
    return scores;
  }, [manualAssignments, manualRolls]);

  // Sync to global state whenever the active method changes
  useEffect(() => {
    const hasUserSelections = 
      Object.keys(standardScores).length > 0 ||
      Object.keys(pointBuyScores).filter(k => pointBuyScores[k as Ability] !== 8).length > 0 ||
      Object.keys(manualAssignments).length > 0;
    
    if (!hasUserSelections) return;

    let newScores: Partial<Record<Ability, number>> = {};
    if (activeTab === 'standard') {
      newScores = standardScores;
    } else if (activeTab === 'pointBuy') {
      newScores = pointBuyScores;
    } else if (activeTab === 'manual') {
      newScores = manualScores;
    }

    dispatch({
      type: 'UPDATE_DRAFT',
      updates: { baseAbilityScores: newScores as AbilityScores }
    });
  }, [activeTab, standardScores, pointBuyScores, manualScores, dispatch]);

  const handleStandardChange = (ability: Ability, value: string) => {
    const numValue = parseInt(value, 10);
    setStandardScores(prev => {
      const next = { ...prev };
      if (isNaN(numValue)) {
        delete next[ability];
      } else {
        next[ability] = numValue;
      }
      return next;
    });
  };

  const handlePointBuyChange = (ability: Ability, delta: number) => {
    setPointBuyScores(prev => {
      const current = prev[ability];
      const next = current + delta;
      
      if (next >= 8 && next <= 15) {
        // Check if we have enough points for an increase
        if (delta > 0) {
          const costDiff = POINT_COSTS[next] - POINT_COSTS[current];
          if (calculatePointsRemaining() < costDiff) return prev;
        }
        return { ...prev, [ability]: next };
      }
      return prev;
    });
  };

  const calculatePointsRemaining = () => {
    const spent = Object.values(pointBuyScores).reduce((total, score) => total + (POINT_COSTS[score as number] || 0), 0);
    return MAX_POINT_BUY - spent;
  };

  const handleRollDice = () => {
    try {
      const rolls = [];
      for (let i = 0; i < 6; i++) {
        rolls.push(rollDice(manualFormula));
      }
      setManualRolls(rolls);
      setManualAssignments({});
    } catch {
      alert("Invalid dice formula");
    }
  };

  const handleManualAssign = (ability: Ability, indexStr: string) => {
    const index = parseInt(indexStr, 10);
    setManualAssignments(prev => {
      const next = { ...prev };
      if (isNaN(index)) {
        delete next[ability];
      } else {
        next[ability] = index;
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg self-start">
        {(['standard', 'pointBuy', 'manual'] as const).map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab 
                ? 'bg-white text-purple-700 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'standard' && 'Standard Array'}
            {tab === 'pointBuy' && 'Point Buy'}
            {tab === 'manual' && 'Manual Roll'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-lg border border-slate-200">
        {activeTab === 'standard' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-500 mb-4">Assign the standard array values (15, 14, 13, 12, 10, 8) to your ability scores.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ABILITIES.map(ability => {
                const usedScores = Object.entries(standardScores)
                  .filter(([a]) => a !== ability)
                  .map(([, v]) => v);
                const availableScores = STANDARD_ARRAY.filter(score => !usedScores.includes(score));
                
                return (
                  <div key={ability} className="flex items-center justify-between bg-slate-50 p-3 rounded border border-slate-100">
                    <span className="font-medium capitalize">{ability}</span>
                    <select
                      className="border-slate-300 rounded text-sm p-1"
                      value={standardScores[ability] || ''}
                      onChange={(e) => handleStandardChange(ability, e.target.value)}
                    >
                      <option value="">--</option>
                      {standardScores[ability] && <option value={standardScores[ability]}>{standardScores[ability]}</option>}
                      {availableScores.map(score => (
                        <option key={score} value={score}>{score}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'pointBuy' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-slate-500">All scores start at 8. You have 27 points to spend.</p>
              <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-bold">
                Points: {calculatePointsRemaining()} / {MAX_POINT_BUY}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ABILITIES.map(ability => {
                const score = pointBuyScores[ability];
                return (
                  <div key={ability} className="flex items-center justify-between bg-slate-50 p-3 rounded border border-slate-100">
                    <span className="font-medium capitalize">{ability}</span>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => handlePointBuyChange(ability, -1)}
                        disabled={score <= 8}
                        className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300 disabled:opacity-50"
                      >-</button>
                      <span className="w-6 text-center font-bold">{score}</span>
                      <button 
                        onClick={() => handlePointBuyChange(ability, 1)}
                        disabled={score >= 15 || calculatePointsRemaining() < (POINT_COSTS[score + 1] - POINT_COSTS[score])}
                        className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300 disabled:opacity-50"
                      >+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'manual' && (
          <div className="space-y-6">
            <div className="flex items-end space-x-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Roll Formula</label>
                <input 
                  type="text" 
                  value={manualFormula}
                  onChange={(e) => setManualFormula(e.target.value)}
                  className="border-slate-300 rounded p-2 text-sm"
                />
              </div>
              <button 
                onClick={handleRollDice}
                className="bg-purple-600 text-white px-4 py-2 rounded shadow-sm hover:bg-purple-700"
              >
                Roll Stats
              </button>
            </div>

            {manualRolls.length > 0 && (
              <div className="flex gap-2">
                {manualRolls.map((roll, idx) => (
                  <div key={idx} className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded border border-slate-200 font-bold text-lg">
                    {roll}
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ABILITIES.map(ability => {
                const usedIndices = Object.entries(manualAssignments)
                  .filter(([a]) => a !== ability)
                  .map(([, v]) => v);
                  
                return (
                  <div key={ability} className="flex items-center justify-between bg-slate-50 p-3 rounded border border-slate-100">
                    <span className="font-medium capitalize">{ability}</span>
                    <select
                      className="border-slate-300 rounded text-sm p-1"
                      value={manualAssignments[ability] ?? ''}
                      onChange={(e) => handleManualAssign(ability, e.target.value)}
                    >
                      <option value="">--</option>
                      {manualRolls.map((roll, idx) => {
                        if (usedIndices.includes(idx) && manualAssignments[ability] !== idx) return null;
                        return <option key={idx} value={idx}>{roll}</option>;
                      })}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
