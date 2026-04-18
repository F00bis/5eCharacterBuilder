import { useMemo, useState, useEffect, useCallback } from 'react';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { srdClasses } from '../../../data/srdClasses';
import type { DndClass } from '../../../types/classes';

type FeatureChoiceValue = string | string[];

function buildFeatureKey(className: string, levelAcquired: number, featureName: string): string {
  return `${className.toLowerCase()}-${levelAcquired}-${featureName.toLowerCase().replace(/\s+/g, '-')}`;
}

function toSelectedValues(value: FeatureChoiceValue | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return value ? [value] : [];
}

function formatChoiceLabel(choice: string): string {
  if (choice === 'thieves tools') return "Thieves' Tools";

  const withSpaces = choice.replace(/([a-z])([A-Z])/g, '$1 $2');
  return withSpaces
    .split(' ')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function ClassSelectionStep() {
  const { state, dispatch } = useCharacterBuilder();
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [level1HpRoll, setLevel1HpRoll] = useState<number>(0);
  const [subsequentHpMethod, setSubsequentHpMethod] = useState<'average' | 'roll'>('average');
  const [featureChoices, setFeatureChoices] = useState<Record<string, FeatureChoiceValue>>({});

  const classData = useMemo<DndClass | undefined>(() => {
    return srdClasses.find(c => c.name === selectedClass);
  }, [selectedClass]);

  const saveClassToDraft = useCallback(() => {
    if (!classData) return;

    dispatch({
      type: 'SET_CLASS_FOR_CURRENT_PASS',
      className: classData.name,
    });
  }, [classData, dispatch]);

  const saveClassDetailsToDraft = useCallback(() => {
    if (!classData) return;

    const mergedFeatureChoices = { ...state.draft.featureChoices, ...featureChoices };
    const featureChoicesUnchanged =
      JSON.stringify(mergedFeatureChoices) === JSON.stringify(state.draft.featureChoices);
    const hpRollsUnchanged =
      state.draft.hpRolls.length === 1 && state.draft.hpRolls[0] === level1HpRoll;

    if (featureChoicesUnchanged && hpRollsUnchanged) {
      return;
    }

    dispatch({
      type: 'UPDATE_DRAFT',
      updates: {
        hpRolls: [level1HpRoll],
        featureChoices: mergedFeatureChoices,
      },
    });
  }, [classData, level1HpRoll, featureChoices, state.draft.featureChoices, state.draft.hpRolls, dispatch]);

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
      saveClassToDraft();
    }
  }, [selectedClass, saveClassToDraft, classData]);

  useEffect(() => {
    if (selectedClass && classData) {
      saveClassDetailsToDraft();
    }
  }, [selectedClass, level1HpRoll, featureChoices, saveClassDetailsToDraft, classData]);

  const featuresWithChoices = classData?.features.filter(f => f.levelAcquired === 1 && f.choices);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left h-full overflow-hidden">
      <div className="space-y-6 h-full overflow-y-auto pr-4">
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
              const featureKey = buildFeatureKey(classData!.name, feature.levelAcquired, feature.name);
              const choiceCount = feature.choices?.count ?? 1;
              const selectedValues = toSelectedValues(featureChoices[featureKey]);
              const availableOptions = feature.choices?.options.filter(opt => !selectedValues.includes(opt)) ?? [];

              const handleSingleChoiceChange = (value: string) => {
                setFeatureChoices(prev => ({ ...prev, [featureKey]: value }));
              };

              const handleMultiChoiceAdd = (value: string) => {
                setFeatureChoices(prev => {
                  const existing = toSelectedValues(prev[featureKey]);
                  if (existing.includes(value) || existing.length >= choiceCount) {
                    return prev;
                  }

                  return { ...prev, [featureKey]: [...existing, value] };
                });
              };

              const handleMultiChoiceRemove = (value: string) => {
                setFeatureChoices(prev => {
                  const existing = toSelectedValues(prev[featureKey]);
                  return { ...prev, [featureKey]: existing.filter(v => v !== value) };
                });
              };

              const selectedDetails = selectedValues
                .map(choice => ({
                  choice,
                  detail: feature.choices?.optionDetails?.[choice],
                }))
                .filter(item => Boolean(item.detail));



              return (
                <div key={feature.name} className="space-y-2 bg-white border border-slate-200 rounded-md p-3">
                  <label className="block text-xs font-medium text-slate-600 mb-1">{feature.name}</label>
                  {choiceCount === 1 ? (
                    <select
                      className="w-full text-sm border-slate-300 rounded shadow-sm p-1 border"
                      value={selectedValues[0] || ''}
                      onChange={(e) => handleSingleChoiceChange(e.target.value)}
                    >
                      <option value="" disabled>Select Option</option>
                      {feature.choices?.options.map(opt => (
                        <option key={opt} value={opt}>{formatChoiceLabel(opt)}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="space-y-2">
                      {selectedValues.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedValues.map(choice => (
                            <span
                              key={choice}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs"
                            >
                              {formatChoiceLabel(choice)}
                              <button
                                type="button"
                                onClick={() => handleMultiChoiceRemove(choice)}
                                className="text-purple-600 hover:text-purple-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      {selectedValues.length < choiceCount && (
                        <select
                          className="w-full text-sm border-slate-300 rounded shadow-sm p-1 border"
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleMultiChoiceAdd(e.target.value);
                            }
                          }}
                        >
                          <option value="">Select Option</option>
                          {availableOptions.map(opt => (
                            <option key={opt} value={opt}>{formatChoiceLabel(opt)}</option>
                          ))}
                        </select>
                      )}
                      <p className="text-xs text-slate-500">Selected {selectedValues.length} of {choiceCount}</p>
                    </div>
                  )}

                  {selectedDetails.length > 0 && (
                    <div className="bg-purple-50 border border-purple-100 rounded-md p-2 text-xs space-y-1">
                      {selectedDetails.map(item => (
                        <p key={item.choice} className="text-purple-900">
                          <span className="font-semibold">{formatChoiceLabel(item.choice)}:</span> {item.detail}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="h-full">
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 h-full overflow-y-auto">
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
                {classData.features.filter(f => f.levelAcquired === 1).map(f => {
                  const featureKey = buildFeatureKey(classData.name, f.levelAcquired, f.name);
                  const selectedValues = toSelectedValues(featureChoices[featureKey]);
                  const showChoiceSummary = Boolean(f.choices && selectedValues.length > 0);

                  return (
                    <li key={f.name}>
                      <span className="font-medium text-slate-800">{f.name}: </span>
                      {!showChoiceSummary && (
                        <span className="text-slate-600 line-clamp-2" title={f.description}>{f.description}</span>
                      )}
                      {f.choices && selectedValues.length > 0 && (
                        <div className="mt-1 space-y-1">
                          <p className="text-xs font-medium text-slate-700">Selected: {selectedValues.map(formatChoiceLabel).join(', ')}</p>
                          {selectedValues.map(choice => {
                            const detail = f.choices?.optionDetails?.[choice];

                            if (!detail) {
                              return null;
                            }

                            return (
                              <p key={choice} className="text-xs text-slate-600">
                                <span className="font-medium">{formatChoiceLabel(choice)}:</span> {detail}
                              </p>
                            );
                          })}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
