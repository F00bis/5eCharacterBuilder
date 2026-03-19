import { useMemo, useState } from 'react';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { srdClasses } from '../../../data/srdClasses';
import type { DndClass } from '../../../types/classes';

export default function ClassSelectionStep() {
  const { state, dispatch } = useCharacterBuilder();
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [hpRoll, setHpRoll] = useState<number | ''>('');
  const [hpMethod, setHpMethod] = useState<'average' | 'roll'>('average');
  const [featureChoices, setFeatureChoices] = useState<Record<string, string>>({});
  const [pendingClass, setPendingClass] = useState<string | null>(null);

  const classData = useMemo<DndClass | undefined>(() => {
    if (pendingClass) return srdClasses.find(c => c.name === pendingClass);
    return srdClasses.find(c => c.name === selectedClass);
  }, [pendingClass, selectedClass]);

  const currentTotalLevel = (state.draft.classes || []).reduce((acc, c) => acc + c.level, 0);
  const isLevel1 = currentTotalLevel === 0;
  const targetLevel = isLevel1 ? 1 : 2;

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClass = e.target.value;
    setSelectedClass(newClass);
    setFeatureChoices({});

    const cls = srdClasses.find(c => c.name === newClass);
    if (!cls) return;

    if (isLevel1) {
      setHpRoll(cls.hitDie);
      setPendingClass(cls.name);
    } else {
      setHpRoll(Math.ceil(cls.hitDie / 2) + 1);
    }
  };

  const handleConfirm = () => {
    if (!classData) return;

    const newClassEntry = { className: classData.name, level: 1 };
    const existingClasses = state.draft.classes || [];
    const updatedClasses = isLevel1 ? [newClassEntry] : [...existingClasses, newClassEntry];

    dispatch({
      type: 'UPDATE_DRAFT',
      updates: {
        classes: updatedClasses,
        level: currentTotalLevel + 1,
        hpRolls: [typeof hpRoll === 'number' ? hpRoll : classData.hitDie],
        featureChoices: { ...state.draft.featureChoices, ...featureChoices }
      }
    });

    setPendingClass(null);
  };

  const handleHpMethodChange = (method: 'average' | 'roll') => {
    setHpMethod(method);
    if (classData && !isLevel1) {
      if (method === 'average') {
        setHpRoll(Math.ceil(classData.hitDie / 2) + 1);
      } else {
        setHpRoll('');
      }
    }
  };

  const featuresWithChoices = classData?.features.filter(f => f.levelAcquired === targetLevel && f.choices);

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
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
            <h3 className="text-sm font-semibold mb-3">Hit Points (Level {targetLevel})</h3>
            {isLevel1 ? (
              <p className="text-sm text-slate-600">
                At Level 1, you automatically get maximum hit points for your class: <strong className="text-purple-700">{classData.hitDie} + CON Mod</strong>.
              </p>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" checked={hpMethod === 'average'} onChange={() => handleHpMethodChange('average')} />
                    Take Average ({Math.ceil(classData.hitDie / 2) + 1})
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" checked={hpMethod === 'roll'} onChange={() => handleHpMethodChange('roll')} />
                    Roll (1d{classData.hitDie})
                  </label>
                </div>
                {hpMethod === 'roll' && (
                  <input 
                    type="number" 
                    min={1} 
                    max={classData.hitDie} 
                    value={hpRoll} 
                    onChange={e => setHpRoll(parseInt(e.target.value, 10) || '')}
                    className="border-slate-300 rounded p-1 w-24"
                    placeholder="Roll"
                  />
                )}
              </div>
            )}
          </div>
        )}

        {featuresWithChoices && featuresWithChoices.length > 0 && (
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-4">
            <h3 className="text-sm font-semibold mb-2">Class Feature Choices</h3>
            {featuresWithChoices.map(feature => {
              const featureKey = `${classData!.name.toLowerCase()}-${feature.levelAcquired}-${feature.name.toLowerCase().replace(/\s+/g, '-')}`;
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

        {pendingClass && (
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Confirm Selection
          </button>
        )}
      </div>

      <div>
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 h-full">
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

              <h4 className="font-medium mb-1">Level {targetLevel} Features</h4>
              <ul className="text-sm space-y-2">
                {classData?.features.filter(f => f.levelAcquired === targetLevel).map(f => (
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
