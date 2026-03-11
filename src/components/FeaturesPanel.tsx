import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useCharacter } from '../contexts/CharacterContext';
import type { GroupedFeatures } from '../utils/characterFeatures';
import { getCharacterFeatures } from '../utils/characterFeatures';

const SOURCE_COLORS: Record<string, string> = {
  race: 'bg-orange-100 text-orange-800',
  class: 'bg-green-100 text-green-800',
  feat: 'bg-purple-100 text-purple-800',
};

interface FeatureRowProps {
  name: string;
  description: string;
  source: 'race' | 'class' | 'feat';
  sourceDetail: string;
}

function FeatureRow({ name, description, source, sourceDetail }: FeatureRowProps) {
  return (
    <div className="px-2 py-1.5 bg-slate-50 rounded text-xs hover:bg-slate-100 transition-colors">
      <div className="flex items-center gap-2 mb-0.5">
        <span className="font-medium text-slate-700">{name}</span>
        <span className={`px-1.5 py-0.5 rounded text-[10px] ${SOURCE_COLORS[source]}`}>
          {sourceDetail}
        </span>
      </div>
      {description && (
        <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
      )}
    </div>
  );
}

function FeatureSection({
  title,
  features,
}: {
  title: string;
  features: { name: string; description: string; source: 'race' | 'class' | 'feat'; sourceDetail: string }[];
}) {
  if (features.length === 0) return null;

  return (
    <div className="mb-3">
      <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2 px-1">
        {title}
      </h3>
      <div className="space-y-1">
        {features.map((feature, index) => (
          <FeatureRow key={`${feature.source}-${index}`} {...feature} />
        ))}
      </div>
    </div>
  );
}

interface FeaturesPanelProps {
  character?: import('../types').Character;
}

export function FeaturesPanel(_props: FeaturesPanelProps) {
  const context = useCharacter();
  const character = _props.character ?? context.character!;

  const [features, setFeatures] = useState<GroupedFeatures | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadFeatures() {
      const data = await getCharacterFeatures(character);
      if (!cancelled) {
        setFeatures(data);
        setLoading(false);
      }
    }

    loadFeatures();
    return () => {
      cancelled = true;
    };
  }, [character]);

  return (
    <Card className="w-full h-full p-2 flex flex-col">
      <div className="text-xs font-bold text-slate-700 mb-2 px-1">
        Features
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="text-xs text-slate-400 text-center py-4">Loading...</div>
        ) : (
          <>
            {features && features.raceFeatures.features.length > 0 && (
              <FeatureSection
                title={`${features.raceFeatures.raceName} Features`}
                features={features.raceFeatures.features.map((f) => ({
                  ...f,
                }))}
              />
            )}

            {features &&
              features.classFeatures.map((classGroup) => (
                <FeatureSection
                  key={classGroup.className}
                  title={`${classGroup.className} Features`}
                  features={classGroup.features}
                />
              ))}

            {features && features.featFeatures.length > 0 && (
              <FeatureSection title="Feats" features={features.featFeatures} />
            )}

            {features &&
              features.raceFeatures.features.length === 0 &&
              features.classFeatures.length === 0 &&
              features.featFeatures.length === 0 && (
                <div className="text-xs text-slate-400 text-center py-4">
                  No features
                </div>
              )}
          </>
        )}
      </div>
    </Card>
  );
}
