import { useEffect, useState } from 'react';
import { getCantripsByClass } from '../../../../db/spells';
import type { DndSpell } from '../../../../types';

interface CantripChoiceProps {
  value: string;
  onChange: (value: string) => void;
  spellClass: string;
}

export function CantripChoice({ value, onChange, spellClass }: CantripChoiceProps) {
  const [cantrips, setCantrips] = useState<DndSpell[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCantrips() {
      const classCantrips = await getCantripsByClass(spellClass);
      setCantrips(classCantrips);
      setLoading(false);
    }
    loadCantrips();
  }, [spellClass]);

  if (loading) {
    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Choose a Cantrip
        </label>
        <div className="text-sm text-slate-500">Loading cantrips...</div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Choose a Cantrip
      </label>
      <select
        className="w-full border-slate-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select a Cantrip</option>
        {cantrips.map(cantrip => (
          <option key={cantrip.name} value={cantrip.name}>
            {cantrip.name.charAt(0).toUpperCase() + cantrip.name.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
