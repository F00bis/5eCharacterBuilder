import { LanguageSelector } from '@/components/LanguageSelector';
import { useEffect, useMemo } from 'react';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { srdBackgrounds } from '../../../data/srdBackgrounds';

function getEquipmentChoiceKey(packageIndex: number, itemIndex: number): string {
  return `equipment:${packageIndex}:${itemIndex}`;
}

export default function BackgroundStep() {
  const { state, dispatch } = useCharacterBuilder();

  const selectedBg = useMemo(
    () => srdBackgrounds.find(b => b.name === state.draft.background),
    [state.draft.background]
  );

  const currentPackageIdx = state.backgroundEquipmentPackage === 'B' ? 1 : 0;
  const currentPackage = selectedBg?.equipment?.[currentPackageIdx];

  const equipmentChoices = useMemo(() => {
    if (!currentPackage) return [];
    return currentPackage.items
      .map((item, idx) => ({ item, idx }))
      .filter(({ item }) => item.options && item.options.length > 0);
  }, [currentPackage]);

  const allChoicesMade = equipmentChoices.length === 0 || 
    equipmentChoices.every(({ idx }) => {
      const selectionKey = getEquipmentChoiceKey(currentPackageIdx, idx);
      const selectedValue = state.backgroundChoices[selectionKey];
      return typeof selectedValue === 'string' && selectedValue.length > 0;
    });

  useEffect(() => {
    const isValid = !!state.draft.background && allChoicesMade;
    dispatch({ type: 'SET_STEP_VALIDATION', stepId: 'background', isValid });
  }, [state.draft.background, allChoicesMade, dispatch]);

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bgId = e.target.value;
    const bg = srdBackgrounds.find(b => b.id === bgId);

    dispatch({ type: 'REMOVE_ITEMS_BY_SOURCE', listName: 'skills', source: 'Background' });
    dispatch({ type: 'REMOVE_ITEMS_BY_SOURCE', listName: 'equipment', source: 'Background' });
    dispatch({ type: 'REMOVE_ITEMS_BY_SOURCE', listName: 'toolProficiencies', source: 'Background' });
    dispatch({ type: 'CLEAR_BACKGROUND_CHOICES' });

    if (bg) {
      bg.skillProficiencies.forEach(skill => {
        dispatch({
          type: 'ADD_ITEM_WITH_SOURCE',
          listName: 'skills',
          item: { skill, ability: 'wisdom', level: 'proficient', source: 'Background' }
        });
      });

      if (bg.toolProficiencies) {
        bg.toolProficiencies.forEach(tool => {
          dispatch({
            type: 'ADD_ITEM_WITH_SOURCE',
            listName: 'toolProficiencies',
            item: { tool, source: 'Background' }
          });
        });
      }

      if (bg.equipment && bg.equipment.length > 0) {
        const firstPackage = bg.equipment[0];
        firstPackage.items.forEach((item, itemIdx) => {
          addEquipmentItem(item, itemIdx, 0);
        });
        if (firstPackage.gold) {
          dispatch({
            type: 'UPDATE_DRAFT',
            updates: {
              currency: {
                ...state.draft.currency,
                gp: state.draft.currency.gp + firstPackage.gold
              }
            }
          });
        }
      }
    }

    dispatch({ type: 'UPDATE_DRAFT', updates: { background: bg?.name || undefined } });
  };

  const handleLanguageChange = (languages: string[]) => {
    dispatch({ type: 'SET_BACKGROUND_CHOICE', choiceType: 'language', value: languages });
    const currentLanguages = [...(state.draft.languages || [])];
    const newLanguages = languages.filter(l => !currentLanguages.includes(l));
    if (newLanguages.length > 0) {
      dispatch({
        type: 'UPDATE_DRAFT',
        updates: { languages: [...currentLanguages, ...newLanguages] }
      });
    }
  };

  const handleEquipmentPackageChange = (packageId: 'A' | 'B') => {
    dispatch({ type: 'SET_BACKGROUND_EQUIPMENT', package: packageId });
    dispatch({ type: 'REMOVE_ITEMS_BY_SOURCE', listName: 'equipment', source: 'Background' });

    if (selectedBg?.equipment) {
        const selectedPackage = selectedBg.equipment[packageId === 'A' ? 0 : 1];
        const selectedPackageIdx = packageId === 'A' ? 0 : 1;
        if (selectedPackage) {
          selectedPackage.items.forEach((item, itemIdx) => {
            addEquipmentItem(item, itemIdx, selectedPackageIdx);
          });
        if (selectedPackage.gold) {
          dispatch({
            type: 'UPDATE_DRAFT',
            updates: {
              currency: {
                ...state.draft.currency,
                gp: state.draft.currency.gp + selectedPackage.gold
              }
            }
          });
        }
      } else if (packageId === 'B') {
        dispatch({
          type: 'UPDATE_DRAFT',
          updates: {
            currency: {
              ...state.draft.currency,
              gp: state.draft.currency.gp + 50
            }
          }
        });
      }
    }
  };

  const knownLanguages = state.draft.languages || [];
  const languageCount = selectedBg?.languages || 0;

  const addEquipmentItem = (
    item: { name: string; quantity?: number; options?: string[] },
    itemIdx: number,
    packageIdx = currentPackageIdx
  ) => {
    const selectionKey = getEquipmentChoiceKey(packageIdx, itemIdx);
    const selectedOption = state.backgroundChoices[selectionKey];
    const optionName = typeof selectedOption === 'string' ? selectedOption : undefined;
    const itemName = item.options && item.options.length > 0
      ? optionName
      : item.name;

    if (!itemName) return;

    dispatch({
      type: 'ADD_ITEM_WITH_SOURCE',
      listName: 'equipment',
      item: {
        name: itemName,
        rarity: 'common',
        weight: 0,
        description: '',
        quantity: item.quantity || 1,
        source: 'Background'
      }
    });
  };

  const handleEquipmentChoiceChange = (itemIdx: number, selection: string) => {
    const selectionKey = getEquipmentChoiceKey(currentPackageIdx, itemIdx);
    dispatch({ type: 'SET_BACKGROUND_CHOICE', choiceType: selectionKey, value: selection });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left h-full overflow-hidden">
      <div className="space-y-6 h-full overflow-y-auto pr-4">
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

        {selectedBg && (
          <>
            {languageCount > 0 && (
              <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                <LanguageSelector
                  selectedLanguages={(state.backgroundChoices['language'] as string[]) || []}
                  onChange={handleLanguageChange}
                  maxSelections={languageCount}
                  knownLanguages={knownLanguages}
                  label="Additional Languages"
                />
              </div>
            )}

            {selectedBg.equipment && selectedBg.equipment.length > 0 && (
              <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                <h3 className="text-sm font-semibold mb-3">Equipment</h3>
                <div className="space-y-2">
                  {selectedBg.equipment.map((pkg, idx) => (
                    <label key={idx} className="flex items-start gap-2">
                      <input
                        type="radio"
                        name="equipmentPackage"
                        checked={state.backgroundEquipmentPackage === (idx === 0 ? 'A' : 'B')}
                        onChange={() => handleEquipmentPackageChange(idx === 0 ? 'A' : 'B')}
                        className="mt-1"
                      />
                      <div>
                        <span className="text-xs font-medium text-slate-700">
                          Package {idx === 0 ? 'A' : 'B'}:
                        </span>
                        <ul className="text-xs text-slate-600 mt-1">
                          {pkg.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              {item.options && item.options.length > 0 ? (
                                <div className="flex items-center gap-2">
                                  <span>Choose one of:</span>
                                  <select
                                    value={(state.backgroundChoices[getEquipmentChoiceKey(currentPackageIdx, itemIdx)] as string) || ''}
                                    onChange={(e) => handleEquipmentChoiceChange(itemIdx, e.target.value)}
                                    className="text-xs border-slate-300 rounded px-1 py-0.5"
                                  >
                                    <option value="" disabled>Select...</option>
                                    {item.options.map(opt => (
                                      <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                                </div>
                              ) : (
                                <span>{item.quantity ? `${item.quantity}x ` : ''}{item.name}</span>
                              )}
                            </li>
                          ))}
                          {pkg.gold && <li>{pkg.gold} GP</li>}
                        </ul>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="h-full">
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 h-full overflow-y-auto">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">Summary</h2>

          {!selectedBg && (
            <p className="text-slate-500 italic">Select a background to see details.</p>
          )}

          {selectedBg && (
            <div>
              <h3 className="font-semibold text-lg text-purple-700">{selectedBg.name}</h3>

              <div className="mt-4 space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-700">Your Selections</h4>
                  {selectedBg.equipment && selectedBg.equipment.length > 0 && (
                    <p className="text-xs text-slate-600 mt-1">
                      Equipment Package: <span className="font-medium">{state.backgroundEquipmentPackage || 'A'}</span>
                    </p>
                  )}
                  {languageCount > 0 && knownLanguages.length > 0 && (
                    <p className="text-xs text-slate-600 mt-1">
                      Languages: {knownLanguages.join(', ')}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-700">Character Benefits</h4>
                  <div className="mt-2 space-y-2">
                    <div>
                      <span className="text-xs font-medium text-slate-600">Skills: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedBg.skillProficiencies.map(skill => (
                          <span key={skill} className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                            {skill.charAt(0).toUpperCase() + skill.slice(1)}
                          </span>
                        ))}
                      </div>
                    </div>
                    {selectedBg.toolProficiencies && selectedBg.toolProficiencies.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-slate-600">Tools: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedBg.toolProficiencies.map(tool => (
                            <span key={tool} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedBg.equipment && selectedBg.equipment.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-slate-600">Equipment: </span>
                        <ul className="text-xs text-slate-600 mt-1 ml-2 list-disc">
                          {selectedBg.equipment[0]?.items.map((item, idx) => (
                            <li key={idx}>
                              {item.options && item.options.length > 0
                                ? (state.backgroundChoices[getEquipmentChoiceKey(currentPackageIdx, idx)] as string) || '(not selected)'
                                : `${item.quantity ? `${item.quantity}x ` : ''}${item.name}`}
                            </li>
                          ))}
                          {selectedBg.equipment[0]?.gold && <li>{selectedBg.equipment[0].gold} GP</li>}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
