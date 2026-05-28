import { useCallback, useState } from 'react';
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

type RightPanelTab = 'features' | 'inventory' | 'spellbook';

const TABS: { key: RightPanelTab; label: string }[] = [
  { key: 'features', label: 'Features' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'spellbook', label: 'Spellbook' },
];

const VALID_TABS: readonly RightPanelTab[] = ['features', 'inventory', 'spellbook'];

function TAB_STORAGE_KEY(characterId: number | string): string {
  return `char-tabs-${characterId}`;
}

function readStoredTab(characterId: number | string): RightPanelTab | null {
  try {
    const stored = localStorage.getItem(TAB_STORAGE_KEY(characterId));
    if (stored && (VALID_TABS as readonly string[]).includes(stored)) {
      return stored as RightPanelTab;
    }
  } catch {
    // localStorage unavailable or restricted
  }
  return null;
}

function writeStoredTab(characterId: number | string, tab: RightPanelTab): void {
  try {
    localStorage.setItem(TAB_STORAGE_KEY(characterId), tab);
  } catch {
    // localStorage unavailable or restricted
  }
}

function RightColumnSkeleton() {
  return (
    <div className="flex-1 min-h-0 animate-pulse bg-slate-100 rounded" aria-label="Loading character panel" />
  );
}

function CharacterViewContent() {
  const { character, isLoading, isNotFound } = useCharacter();

  const [activeTab, setActiveTabState] = useState<RightPanelTab>(() => {
    if (character && character.id !== undefined) {
      return readStoredTab(character.id) ?? 'features';
    }
    return 'features';
  });

  const setActiveTab = useCallback(
    (tab: RightPanelTab) => {
      setActiveTabState(tab);
      if (character && character.id !== undefined) {
        writeStoredTab(character.id, tab);
      }
    },
    [character]
  );

  if (isNotFound) {
    return <div className="p-4 text-red-500">Character not found</div>;
  }

  if (isLoading || !character) {
    return (
      <div className='p-1 h-screen overflow-hidden'>
        <div className="flex flex-row gap-1 h-full">
          <div className="flex flex-col gap-2 w-2/3 animate-pulse">
            <div className="h-12 bg-slate-100 rounded shrink-0" />
            <div className="flex flex-row gap-1 flex-1 min-h-0">
              <div className="w-[7%] h-full bg-slate-100 rounded" />
              <div className="w-[14%] h-full flex flex-col gap-1">
                <div className="h-[25%] bg-slate-100 rounded" />
                <div className="h-[62%] bg-slate-100 rounded" />
                <div className="h-[13%] bg-slate-100 rounded" />
              </div>
              <div className="flex-1 flex flex-col gap-1 min-h-0">
                <div className="w-full h-fit shrink-0 bg-slate-100 rounded" />
                <div className="w-full flex-1 min-h-0 bg-slate-100 rounded" />
              </div>
            </div>
          </div>
          <RightColumnSkeleton />
        </div>
      </div>
    );
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
          <div className="grid grid-cols-3 gap-1 shrink-0" role="tablist" aria-label="Character panels">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
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
          <div className="flex-1 min-h-0" role="tabpanel">
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
