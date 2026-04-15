const DRACONIC_ANCESTRY_DATA: Record<string, { damageType: string; breathWeapon: string; save: string }> = {
  'Black': { damageType: 'Acid', breathWeapon: '5 by 30 ft. line', save: 'DEX' },
  'Blue': { damageType: 'Lightning', breathWeapon: '5 by 30 ft. line', save: 'DEX' },
  'Brass': { damageType: 'Fire', breathWeapon: '5 by 30 ft. line', save: 'DEX' },
  'Bronze': { damageType: 'Lightning', breathWeapon: '5 by 30 ft. line', save: 'DEX' },
  'Copper': { damageType: 'Acid', breathWeapon: '5 by 30 ft. line', save: 'DEX' },
  'Gold': { damageType: 'Fire', breathWeapon: '15 ft. cone', save: 'DEX' },
  'Green': { damageType: 'Poison', breathWeapon: '15 ft. cone', save: 'CON' },
  'Red': { damageType: 'Fire', breathWeapon: '15 ft. cone', save: 'DEX' },
  'Silver': { damageType: 'Cold', breathWeapon: '15 ft. cone', save: 'CON' },
  'White': { damageType: 'Cold', breathWeapon: '15 ft. cone', save: 'CON' },
};

const DRACONIC_ANCESTRIES = Object.keys(DRACONIC_ANCESTRY_DATA);

interface DraconicAncestryChoiceProps {
  value: string;
  onChange: (value: string) => void;
}

export function DraconicAncestryChoice({ value, onChange }: DraconicAncestryChoiceProps) {
  const selectedData = value ? DRACONIC_ANCESTRY_DATA[value] : null;

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Draconic Ancestry
        </label>
        <select
          className="w-full border-slate-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select Dragon Type</option>
          {DRACONIC_ANCESTRIES.map((ancestry) => (
            <option key={ancestry} value={ancestry}>
              {ancestry}
            </option>
          ))}
        </select>
      </div>

      {selectedData && (
        <div className="bg-purple-50 border border-purple-100 rounded-md p-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-semibold text-purple-900 block">Damage Type</span>
              <span className="text-purple-800">{selectedData.damageType}</span>
            </div>
            <div>
              <span className="font-semibold text-purple-900 block">Saving Throw</span>
              <span className="text-purple-800">{selectedData.save} Save</span>
            </div>
            <div className="col-span-2">
              <span className="font-semibold text-purple-900 block">Breath Weapon</span>
              <span className="text-purple-800">{selectedData.breathWeapon}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
