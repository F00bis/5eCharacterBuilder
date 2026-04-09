import { useEffect, useMemo, useState } from 'react';
import type { ComboboxOption } from '../../../components/ui/combobox';
import { Combobox } from '../../../components/ui/combobox';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { getAllFeats } from '../../../db/feats';
import type { Ability } from '../../../types';
import type { Feat } from '../../../types/feats';
import type { FeatEntitlement } from '../../../utils/featEntitlements';
import { calculateFeatEntitlements } from '../../../utils/featEntitlements';
import { characterMeetsFeatPrerequisites } from '../../../utils/featPrerequisites';
import { useAsiLevelsByClass } from '../../../utils/useAsiLevelsByClass';

type ChoiceMode = 'asi' | 'feat';

interface EntitlementChoice {
  entitlement: FeatEntitlement;
  mode: ChoiceMode;
  featName: string;
  asiAbility1: Ability;
  asiAmount1: number;
  asiAbility2: Ability;
  asiAmount2: number;
}

const ABILITY_OPTIONS: ComboboxOption[] = [
  { value: 'strength', label: 'Strength' },
  { value: 'dexterity', label: 'Dexterity' },
  { value: 'constitution', label: 'Constitution' },
  { value: 'intelligence', label: 'Intelligence' },
  { value: 'wisdom', label: 'Wisdom' },
  { value: 'charisma', label: 'Charisma' },
];

const ASI_AMOUNT_OPTIONS: ComboboxOption[] = [
  { value: '1', label: '+1' },
  { value: '2', label: '+2' },
];

export default function FeatsAsiStep() {
  const { state, dispatch } = useCharacterBuilder();
  const { draft, mode, featChoices } = state;
  const asiLevelsByClass = useAsiLevelsByClass();

  const [allFeats, setAllFeats] = useState<Feat[]>([]);
  const [featsLoading, setFeatsLoading] = useState(true);

  const entitlements = useMemo(
    () => calculateFeatEntitlements(draft, mode, asiLevelsByClass),
    [draft, mode, asiLevelsByClass]
  );

  const choices = useMemo(() => {
    const newChoices = new Map<string, EntitlementChoice>();
    for (const entitlement of entitlements) {
      const existing = featChoices.find(fc => fc.source === entitlement.source);
      if (existing) {
        newChoices.set(entitlement.source, {
          entitlement,
          mode: existing.type,
          featName: existing.featName || '',
          asiAbility1: existing.asiBonuses?.[0]?.ability || 'strength',
          asiAmount1: existing.asiBonuses?.[0]?.amount || 2,
          asiAbility2: existing.asiBonuses?.[1]?.ability || 'dexterity',
          asiAmount2: existing.asiBonuses?.[1]?.amount || 1,
        });
      } else {
        newChoices.set(entitlement.source, {
          entitlement,
          mode: entitlement.type === 'feat-only' ? 'feat' : 'asi',
          featName: '',
          asiAbility1: 'strength',
          asiAmount1: 2,
          asiAbility2: 'dexterity',
          asiAmount2: 1,
        });
      }
    }
    return newChoices;
  }, [entitlements, featChoices]);

  useEffect(() => {
    async function loadFeats() {
      const feats = await getAllFeats();
      setAllFeats(feats);
      setFeatsLoading(false);
    }
    loadFeats();
  }, []);

  const { feats: draftFeats } = draft;

  const filteredFeatOptions = useMemo((): ComboboxOption[] => {
    const existingFeatNames = new Set<string>();
    for (const choice of choices.values()) {
      if (choice.featName) {
        existingFeatNames.add(choice.featName);
      }
    }
    for (const existingFeat of draftFeats) {
      existingFeatNames.add(existingFeat.name);
    }

    return allFeats
      .filter(feat => !existingFeatNames.has(feat.name))
      .map(feat => {
        const prereqCheck = characterMeetsFeatPrerequisites(feat.prerequisites || '', draft.baseAbilityScores);
        return {
          value: feat.name,
          label: prereqCheck.met ? feat.name : `${feat.name} (${prereqCheck.reason})`,
        };
      });
  }, [allFeats, choices, draftFeats, draft]);

  const selectedFeatInPanel = useMemo(() => {
    for (const choice of choices.values()) {
      if (choice.featName && choice.mode === 'feat') {
        const feat = allFeats.find(f => f.name === choice.featName);
        if (feat) return feat;
      }
    }
    return null;
  }, [choices, allFeats]);

  const isValid = useMemo(() => {
    for (const entitlement of entitlements) {
      const choice = choices.get(entitlement.source);
      if (!choice) return false;
      if (entitlement.type === 'feat-only') {
        if (!choice.featName) return false;
      } else if (entitlement.type === 'feat-or-asi') {
        if (choice.mode === 'asi') {
          let hasValidAsi = false;
          if (choice.asiAmount1 === 2) {
            hasValidAsi = true;
          } else if (choice.asiAmount1 === 1 && choice.asiAmount2 === 1) {
            hasValidAsi = choice.asiAbility1 !== choice.asiAbility2;
          }
          if (!hasValidAsi) return false;
        } else {
          if (!choice.featName) return false;
        }
      }
    }
    return true;
  }, [entitlements, choices]);

  useEffect(() => {
    dispatch({ type: 'SET_STEP_VALIDATION', stepId: 'feats-asi', isValid });
  }, [isValid, dispatch]);

  useEffect(() => {
    const relevantChoices = state.featChoices;
    const selectedFeatsToAdd: Array<{ name: string; description: string; statModifiers: Record<Ability, number> }> = [];
    
    for (const choice of relevantChoices) {
      if (choice.type === 'feat' && choice.featName) {
        const feat = allFeats.find(f => f.name === choice.featName);
        if (feat) {
          const statModifiers: Record<Ability, number> = {
            strength: feat.statModifiers?.strength ?? 0,
            dexterity: feat.statModifiers?.dexterity ?? 0,
            constitution: feat.statModifiers?.constitution ?? 0,
            intelligence: feat.statModifiers?.intelligence ?? 0,
            wisdom: feat.statModifiers?.wisdom ?? 0,
            charisma: feat.statModifiers?.charisma ?? 0,
          };
          selectedFeatsToAdd.push({
            name: feat.name,
            description: feat.description,
            statModifiers,
          });
        }
      }
    }

    dispatch({
      type: 'UPDATE_DRAFT',
      updates: { feats: selectedFeatsToAdd },
    });
  }, [state.featChoices, allFeats, dispatch]);

  const handleChoiceChange = (source: string, updates: Partial<EntitlementChoice>) => {
    const currentChoice = choices.get(source);
    if (!currentChoice) return;
    
    const newChoice = { ...currentChoice, ...updates };
    const asiBonuses = newChoice.mode === 'asi' ? [
      { ability: newChoice.asiAbility1, amount: newChoice.asiAmount1 },
      ...(newChoice.asiAmount1 === 1 && newChoice.asiAmount2 === 1 ? [{ ability: newChoice.asiAbility2, amount: newChoice.asiAmount2 }] : [])
    ].filter(b => b.amount > 0) : undefined;
    
    dispatch({
      type: 'SET_FEAT_CHOICE',
      choice: {
        source: newChoice.entitlement.source,
        type: newChoice.mode,
        featName: newChoice.featName || undefined,
        asiBonuses,
      },
    });
  };

  const handleChoiceModeChange = (source: string, newMode: ChoiceMode) => {
    handleChoiceChange(source, { mode: newMode });
  };

  const handleFeatSelect = (source: string, featName: string) => {
    handleChoiceChange(source, { featName });
  };

  const handleAsiChange = (
    source: string,
    updates: { asiAbility1?: Ability; asiAmount1?: number; asiAbility2?: Ability; asiAmount2?: number }
  ) => {
    handleChoiceChange(source, updates);
  };

  const abilityOptions = ABILITY_OPTIONS;
  const asiAmountOptions = ASI_AMOUNT_OPTIONS;

  if (entitlements.length === 0) {
    return (
      <div className="h-full overflow-y-auto space-y-6">
        <p className="text-slate-500">No feat or ASI choices available at this time.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left h-full overflow-hidden">
      <div className="space-y-6 overflow-y-auto pr-4 h-full">
        {entitlements.map(entitlement => {
          const choice = choices.get(entitlement.source);
          if (!choice) return null;

          return (
            <div key={entitlement.source} className="space-y-4">
              <h2 className="text-lg font-semibold text-purple-700">{entitlement.source}</h2>
              
              {entitlement.type === 'feat-or-asi' && (
                <div className="flex space-x-2">
                  <button
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      choice.mode === 'asi'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    onClick={() => handleChoiceModeChange(entitlement.source, 'asi')}
                  >
                    Ability Score Improvement
                  </button>
                  <button
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      choice.mode === 'feat'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    onClick={() => handleChoiceModeChange(entitlement.source, 'feat')}
                  >
                    Choose a Feat
                  </button>
                </div>
              )}

              {choice.mode === 'feat' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Select a Feat
                  </label>
                  <Combobox
                    options={filteredFeatOptions}
                    value={choice.featName}
                    onChange={(value) => handleFeatSelect(entitlement.source, value)}
                    placeholder="Search feats..."
                    disabled={featsLoading}
                  />
                </div>
              )}

              {choice.mode === 'asi' && entitlement.type === 'feat-or-asi' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      First Increase
                    </label>
                    <Combobox
                      options={abilityOptions}
                      value={choice.asiAbility1}
                      onChange={(value) =>
                        handleAsiChange(entitlement.source, {
                          asiAbility1: value as Ability,
                        })
                      }
                      placeholder="Select ability"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Increase Type
                    </label>
                    <Combobox
                      options={asiAmountOptions}
                      value={String(choice.asiAmount1)}
                      onChange={(value) =>
                        handleAsiChange(entitlement.source, {
                          asiAmount1: parseInt(value, 10),
                        })
                      }
                      placeholder="Select increase"
                    />
                  </div>
                  {choice.asiAmount1 === 1 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Second Increase
                      </label>
                      <Combobox
                        options={abilityOptions}
                        value={choice.asiAbility2}
                        onChange={(value) =>
                          handleAsiChange(entitlement.source, {
                            asiAbility2: value as Ability,
                          })
                        }
                        placeholder="Select ability"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="h-full">
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 h-full overflow-y-auto">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">Summary</h2>
          {!selectedFeatInPanel ? (
            <p className="text-slate-500 italic">Select a feat to see details.</p>
          ) : (
            <div>
              <h3 className="font-semibold text-lg text-purple-700">
                {selectedFeatInPanel.name}
              </h3>
              {selectedFeatInPanel.prerequisites && (
                <p className="text-sm text-slate-600 mt-1">
                  <span className="font-medium">Prerequisites: </span>
                  {selectedFeatInPanel.prerequisites}
                </p>
              )}
              <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">
                {selectedFeatInPanel.description}
              </p>
              {selectedFeatInPanel.isHalfFeat && (
                <p className="text-sm text-blue-600 mt-2">
                  This is a half-feat. It grants +1 to{' '}
                  {selectedFeatInPanel.halfFeatChoiceAbility || 'an ability score'} plus another benefit.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}