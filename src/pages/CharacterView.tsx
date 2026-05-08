import { AbilityScoresPanel } from '../components/AbilityScoresPanel';
import { ActionsPanel } from '../components/ActionsPanel';
import { CharacterHeader } from '../components/CharacterHeader';
import { CombatStatsPanel } from '../components/CombatStatsPanel';
import { FeaturesPanel } from '../components/FeaturesPanel';
import { InventoryPanel } from '../components/InventoryPanel';
import { PassivesPanel } from '../components/PassivesPanel';
import { SavingThrowsPanel } from '../components/SavingThrowsPanel';
import { SkillsPanel } from '../components/SkillsPanel';
import { SpellsPanel } from '../components/SpellsPanel';
import { useCharacter } from '../contexts/CharacterContext';
import { CharacterProvider } from '../contexts/CharacterContextProvider';
import { useState } from 'react';

type RightPanelTab = 'features' | 'inventory' | 'spellbook';

const TABS: { key: RightPanelTab; label: string }[] = [
  { key: 'features', label: 'Features' },
  { key: 'inventory', label: 'Inv' },
  { key: 'spellbook', label: 'Spellbook' },
];

function CharacterViewContent() {
  const { character, isLoading, isNotFound } = useCharacter();
  const [activeTab, setActiveTab] = useState<RightPanelTab>('features');

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading...</div>;
  }

  if (isNotFound || !character) {
    return <div className="p-4 text-red-500">Character not found</div>;
  }

  return (
    <div className='p-1 h-screen overflow-hidden'>
      <div className="flex flex-row gap-1 h-full">
        <div className="flex flex-col gap-2 w-2/3">
          <div className="h-fit shrink-0">
            <CharacterHeader />
          </div>
          <div className="flex flex-row gap-1 flex-1 min-h-0">
            <div className="w-[7%] h-full">
              <AbilityScoresPanel />
            </div>
            <div className="w-[14%] h-full flex flex-col gap-1">
              <div className="h-[25%]">
                <SavingThrowsPanel />
              </div>
              <div className="h-[62%]">
                <SkillsPanel />
              </div>
              <div className="h-[13%]">
                <PassivesPanel />
              </div>
            </div>
            <div className='flex-1 flex flex-col gap-1 min-h-0'>
              <div className="w-full h-fit shrink-0">
                <CombatStatsPanel />
              </div>
              <div className="w-full flex-1 min-h-0">
                <ActionsPanel />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 h-full flex flex-col gap-1">
          <div className="grid grid-cols-3 gap-1 shrink-0">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  activeTab === tab.key
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex-1 min-h-0">
            {activeTab === 'features' && <FeaturesPanel />}
            {activeTab === 'inventory' && <InventoryPanel />}
            {activeTab === 'spellbook' && <SpellsPanel />}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CharacterView() {
  return (
    <CharacterProvider>
      <CharacterViewContent />
    </CharacterProvider>
  );
}
