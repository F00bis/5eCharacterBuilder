import { useMemo, useState, useEffect, useCallback } from 'react';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { srdClasses } from '../../../data/srdClasses';
import type { DndClass } from '../../../types/classes';

type FeatureChoiceValue = string | string[];

export default function ClassSelectionStep() {
  const { state, dispatch } = useCharacterBuilder();
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [level1HpRoll, setLevel1HpRoll] = useState<number>(0);
  const [subsequentHpMethod, setSubsequentHpMethod] = useState<'average' | 'roll'>('average');
  const [featureChoices, setFeatureChoices] = useState<Record<string, FeatureChoiceValue>>({});

  const classData = useMemo<DndClass | undefined>(() => {
    return srdClasses.find(c => c.name === selectedClass);
  }, [selectedClass]);

  const currentTotalLevel = (state.draft.classes || []).reduce((acc, c) => acc + c.level, 0);
  const isFirstLevel = currentTotalLevel === 0;

  const saveToDraft = useCallback(() => {
    if (!classData) return;

    const newClassEntry = { className: classData.name, level: 1 };
    const existingClasses = state.draft.classes || [];
    const updatedClasses = isFirstLevel ? [newClassEntry] : [...existingClasses, newClassEntry];

    dispatch({
      type: 'UPDATE_DRAFT',
      updates: {
        classes: updatedClasses,
        level: currentTotalLevel + 1,
        hpRolls: [level1HpRoll],
        featureChoices: { ...state.draft.featureChoices, ...featureChoices }
      }
    });
  }, [classData, isFirstLevel, currentTotalLevel, level1HpRoll, featureChoices, state.draft, dispatch]);

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClass = e.target.value;
    setSelectedClass(newClass);
    setFeatureChoices({});

    const cls = srdClasses.find(c => c.name === newClass);
    if (!cls) return;

    setLevel1HpRoll(cls.hitDie);
    setSubsequentHpMethod('average');
  };

  const handleSubsequentHpMethodChange = (method: 'average' | 'roll') => {
    setSubsequentHpMethod(method);
  };

  useEffect(() => {
    if (selectedClass && classData) {
      saveToDraft();
    }
  }, [selectedClass, level1HpRoll, featureChoices, saveToDraft, classData]);

  const featuresWithChoices = classData?.features.filter(f => f.levelAcquired === 1 && f.choices);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Select Class</label>
          <select 
            className="w-full border-slate-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
            value={selectedClass}
            onChange={handleClassChange}
          >
            <option value="" disabled>-- Choose a Class --</option>
            {srdClasses.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        {classData && (
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-2">Hit Points at Level 1</h3>
              <p className="text-sm text-slate-600">
                At 1st level, your character gets the <strong>maximum</strong> hit points for their hit die: <strong className="text-purple-700">{classData.hitDie} + CON Mod</strong>.
              </p>
              <p className="text-sm text-slate-500 mt-1">
                (Current max: {classData.hitDie})
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Hit Points for Subsequent Levels</h3>
              <p className="text-sm text-slate-600 mb-3">
                When your character gains a level, choose whether to take the average result or roll the hit die.
              </p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input 
                    type="radio" 
                    checked={subsequentHpMethod === 'average'} 
                    onChange={() => handleSubsequentHpMethodChange('average')}
                  />
                  Take Average ({Math.ceil(classData.hitDie / 2) + 1})
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input 
                    type="radio" 
                    checked={subsequentHpMethod === 'roll'} 
                    onChange={() => handleSubsequentHpMethodChange('roll')}
                  />
                  Roll (1d{classData.hitDie})
                </label>
              </div>
            </div>
          </div>
        )}

        {featuresWithChoices && featuresWithChoices.length > 0 && (
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-4">
            <h3 className="text-sm font-semibold mb-2">Class Feature Choices</h3>
            {featuresWithChoices.map(feature => {
              const featureKey = `${classData!.name.toLowerCase()}-1-${feature.name.toLowerCase().replace(/\s+/g, '-')}`;
              return (
                <div key={feature.name}>
                  <label className="block text-xs font-medium text-slate-600 mb-1">{feature.name}</label>
                  <select 
                    className="w-full text-sm border-slate-300 rounded shadow-sm p-1 border"
                    value={featureChoices[featureKey] || ''}
                    onChange={(e) => setFeatureChoices(prev => ({ ...prev, [featureKey]: e.target.value }))}
                  >
                    <option value="" disabled>Select Option</option>
                    {feature.choices?.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 max-h-[60vh] overflow-y-auto">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">Class Summary</h2>
          
          {!classData ? (
            <p className="text-slate-500 italic">Select a class to see details.</p>
          ) : (
            <div>
              <h3 className="font-semibold text-lg text-purple-700">{classData.name}</h3>
              <div className="text-sm text-slate-600 mt-2 mb-4">
                <p><strong>Hit Die:</strong> d{classData.hitDie}</p>
                <p><strong>Primary Ability:</strong> <span className="capitalize">{classData.primaryAbility}</span></p>
                <p><strong>Saves:</strong> {classData.savingThrows.join(', ')}</p>
              </div>

              <h4 className="font-medium mb-1">Level 1 Features</h4>
              <ul className="text-sm space-y-2">
                {classData.features.filter(f => f.levelAcquired === 1).map(f => (
                  <li key={f.name}>
                    <span className="font-medium text-slate-800">{f.name}: </span>
                    <span className="text-slate-600 line-clamp-2" title={f.description}>{f.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
