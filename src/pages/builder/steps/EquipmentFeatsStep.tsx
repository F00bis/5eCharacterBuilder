import { useState, useMemo, useEffect } from 'react';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { getClassByName } from '../../../db/classes';
import EquipmentPackages from './EquipmentPackages';
import EquipmentShop from './EquipmentShop';

export default function EquipmentFeatsStep() {
  const { state } = useCharacterBuilder();
  const currentTotalLevel = (state.draft.classes || []).reduce((acc, c) => acc + c.level, 0);
  const isLevel1 = currentTotalLevel === 0 || state.mode === 'create';
  const pendingClass = (state.draft.classes || []).find(c => !c.subclass);
  const currentClassName = pendingClass?.className || state.draft.classes?.[0]?.className || '';
  
  const [equipmentMode, setEquipmentMode] = useState<'packages' | 'gold'>('packages');
  
  const [classData, setClassData] = useState<Awaited<ReturnType<typeof getClassByName>>>(undefined);
  
  const classEquipment = useMemo(() => {
    return classData?.startingEquipment || null;
  }, [classData]);
  
  useEffect(() => {
    if (currentClassName) {
      getClassByName(currentClassName).then(setClassData);
    }
  }, [currentClassName]);

  return (
    <div className="h-full overflow-y-auto space-y-8">
      {isLevel1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Starting Equipment</h2>
          
          <div className="flex space-x-4 bg-slate-100 p-1 rounded-lg self-start">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                equipmentMode === 'packages' 
                  ? 'bg-white text-purple-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setEquipmentMode('packages')}
            >
              Class Packages
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                equipmentMode === 'gold' 
                  ? 'bg-white text-purple-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setEquipmentMode('gold')}
            >
              Starting Gold
            </button>
          </div>
          
          {equipmentMode === 'packages' && (
            <EquipmentPackages 
              currentClassName={currentClassName}
              isLevel1={isLevel1}
            />
          )}
          
          {equipmentMode === 'gold' && (
            <EquipmentShop 
              classEquipment={classEquipment}
              isLevel1={isLevel1}
            />
          )}
        </div>
      )}
    </div>
  );
}
