import { useEffect, useState } from 'react';
import { getAllFeats } from '../../../../db/feats';
import type { Feat } from '../../../../types';

interface FeatChoiceProps {
  value: string;
  onChange: (value: string) => void;
}

export function FeatChoice({ value, onChange }: FeatChoiceProps) {
  const [feats, setFeats] = useState<Feat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeats() {
      const allFeats = await getAllFeats();
      setFeats(allFeats);
      setLoading(false);
    }
    loadFeats();
  }, []);

  if (loading) {
    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Choose a Feat
        </label>
        <div className="text-sm text-slate-500">Loading feats...</div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Choose a Feat
      </label>
      <select
        className="w-full border-slate-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select a Feat</option>
        {feats.map(feat => (
          <option key={feat.name} value={feat.name}>
            {feat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
