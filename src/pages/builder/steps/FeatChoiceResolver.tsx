import { useEffect, useState, useMemo } from 'react';
import type { ComboboxOption } from '../../../components/ui/combobox';
import { Combobox } from '../../../components/ui/combobox';
import { SKILL_DISPLAY_NAMES } from '../../../utils/skills';
import type { Skill } from '../../../types';
import { getCantripsByClass, getSpellsByClass } from '../../../db/spells';
import { getWeapons } from '../../../db/equipment';
import type { Ability } from '../../../types';
import type { FeatChoiceDefinition } from '../../../types/featChoices';
import { srdManeuvers } from '../../../data/srdManeuvers';

interface FeatChoiceResolverProps {
  asiOptions?: Ability[];
  choices?: FeatChoiceDefinition[];
  currentSelections: Record<string, string | string[]>;
  asiChoice: Ability | '';
  onAsiChange: (ability: Ability) => void;
  onSelectionChange: (choiceId: string, value: string | string[]) => void;
  existingSkillProficiencies?: Skill[];
  existingWeaponProficiencies?: string[];
}

const ABILITY_OPTIONS: ComboboxOption[] = [
  { value: 'strength', label: 'Strength' },
  { value: 'dexterity', label: 'Dexterity' },
  { value: 'constitution', label: 'Constitution' },
  { value: 'intelligence', label: 'Intelligence' },
  { value: 'wisdom', label: 'Wisdom' },
  { value: 'charisma', label: 'Charisma' },
];

export default function FeatChoiceResolver({
  asiOptions,
  choices,
  currentSelections,
  asiChoice,
  onAsiChange,
  onSelectionChange,
  existingSkillProficiencies = [],
  existingWeaponProficiencies = [],
}: FeatChoiceResolverProps) {
  const [spellOptions, setSpellOptions] = useState<ComboboxOption[]>([]);
  const [cantripOptions, setCantripOptions] = useState<ComboboxOption[]>([]);
  const [weaponOptions, setWeaponOptions] = useState<ComboboxOption[]>([]);
  const [spellLoading, setSpellLoading] = useState(false);

  const skillOptions = useMemo((): ComboboxOption[] => {
    const skills = Object.entries(SKILL_DISPLAY_NAMES) as [Skill, string][];
    return skills.map(([value, label]) => ({ value, label }));
  }, []);

  const damageTypeOptions: ComboboxOption[] = [
    { value: 'acid', label: 'Acid' },
    { value: 'cold', label: 'Cold' },
    { value: 'fire', label: 'Fire' },
    { value: 'lightning', label: 'Lightning' },
    { value: 'thunder', label: 'Thunder' },
  ];

  const spellListOptions: ComboboxOption[] = [
    { value: 'Bard', label: 'Bard' },
    { value: 'Cleric', label: 'Cleric' },
    { value: 'Druid', label: 'Druid' },
    { value: 'Sorcerer', label: 'Sorcerer' },
    { value: 'Warlock', label: 'Warlock' },
    { value: 'Wizard', label: 'Wizard' },
  ];

  const spellcastingAbilityOptions: ComboboxOption[] = [
    { value: 'intelligence', label: 'Intelligence' },
    { value: 'wisdom', label: 'Wisdom' },
    { value: 'charisma', label: 'Charisma' },
  ];

  const maneuverOptions: ComboboxOption[] = srdManeuvers.map(m => ({
    value: m.name,
    label: m.name,
  }));

  useEffect(() => {
    async function loadWeapons() {
      const weapons = await getWeapons();
      setWeaponOptions(
        weapons.map(w => ({ value: w.name, label: w.name }))
      );
    }
    if (choices?.some(c => c.kind === 'weapon-proficiency')) {
      loadWeapons();
    }
  }, [choices]);

  useEffect(() => {
    const spellListChoice = choices?.find(c => c.kind === 'spell-list');
    const selectedList = currentSelections[spellListChoice?.id ?? ''] as string;
    
    if (!selectedList) {
      setSpellOptions([]);
      setCantripOptions([]);
      return;
    }

    async function loadSpells() {
      setSpellLoading(true);
      try {
        const cantrips = await getCantripsByClass(selectedList);
        const spells = await getSpellsByClass(selectedList);
        
        setCantripOptions(
          cantrips.map(c => ({ value: c.name, label: c.name }))
        );
        
        const filteredSpells = spells.filter(s => s.level === 1);
        setSpellOptions(
          filteredSpells.map(s => ({ value: s.name, label: s.name }))
        );
      } finally {
        setSpellLoading(false);
      }
    }

    loadSpells();
  }, [currentSelections, choices]);

  const linkedToASI = choices?.find(c => c.linkedTo === 'asi');
  const linkedToASIChoice = linkedToASI && asiChoice;

  if (!choices || choices.length === 0) {
    if (!asiOptions || asiOptions.length === 0) return null;
    
    if (asiOptions.length === 1) {
      return (
        <div className="mt-3">
          <p className="text-sm text-slate-600">
            +1 {asiOptions[0].charAt(0).toUpperCase() + asiOptions[0].slice(1)}
          </p>
        </div>
      );
    }

    return (
      <div className="mt-3">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Ability Score Increase (+1)
        </label>
        <Combobox
          options={asiOptions.map(a => ({
            value: a,
            label: a.charAt(0).toUpperCase() + a.slice(1),
          }))}
          value={asiChoice}
          onChange={(value) => onAsiChange(value as Ability)}
          placeholder="Choose ability..."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {linkedToASIChoice && (
        <div className="text-sm text-slate-600">
          <span className="font-medium">{linkedToASI.label}:</span>{' '}
          {asiChoice.charAt(0).toUpperCase() + asiChoice.slice(1)} (auto)
        </div>
      )}

      {choices.map(choice => {
        if (choice.linkedTo === 'asi') return null;

        switch (choice.kind) {
          case 'damage-type': {
            const currentValue = currentSelections[choice.id] as string || '';
            return (
              <div key={choice.id}>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {choice.label}
                </label>
                <Combobox
                  options={choice.options?.map(o => ({
                    value: o,
                    label: o.charAt(0).toUpperCase() + o.slice(1),
                  })) || damageTypeOptions}
                  value={currentValue}
                  onChange={(value) => onSelectionChange(choice.id, value)}
                  placeholder={`Choose ${choice.label}...`}
                />
              </div>
            );
          }

          case 'saving-throw': {
            if (choice.linkedTo === 'asi') return null;
            const currentValue = currentSelections[choice.id] as string || '';
            return (
              <div key={choice.id}>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {choice.label}
                </label>
                <Combobox
                  options={ABILITY_OPTIONS}
                  value={currentValue}
                  onChange={(value) => onSelectionChange(choice.id, value)}
                  placeholder={`Choose ${choice.label}...`}
                />
              </div>
            );
          }

          case 'skill-proficiency': {
            const currentValues = (currentSelections[choice.id] as string[]) || [];
            const availableSkills = skillOptions.filter(
              opt => !existingSkillProficiencies.includes(opt.value as Skill)
            );
            
            return (
              <div key={choice.id}>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {choice.label}
                </label>
                <Combobox
                  options={availableSkills}
                  value={currentValues[0] || ''}
                  onChange={(value) => onSelectionChange(choice.id, value)}
                  placeholder={`Choose ${choice.label}...`}
                />
              </div>
            );
          }

          case 'skill-expertise': {
            const currentValues = (currentSelections[choice.id] as string[]) || [];
            const expertiseSkills = skillOptions.filter(
              opt => existingSkillProficiencies.includes(opt.value as Skill)
            );
            
            return (
              <div key={choice.id}>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {choice.label}
                </label>
                <Combobox
                  options={expertiseSkills}
                  value={currentValues[0] || ''}
                  onChange={(value) => onSelectionChange(choice.id, value)}
                  placeholder={`Choose ${choice.label}...`}
                />
              </div>
            );
          }

          case 'spell-list': {
            const currentValue = currentSelections[choice.id] as string || '';
            return (
              <div key={choice.id}>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {choice.label}
                </label>
                <Combobox
                  options={choice.options ? choice.options.map(o => ({
                    value: o,
                    label: o,
                  })) : spellListOptions}
                  value={currentValue}
                  onChange={(value) => {
                    onSelectionChange(choice.id, value);
                    const linkedChoices = choices.filter(c => c.linkedTo === choice.id);
                    linkedChoices.forEach(c => {
                      onSelectionChange(c.id, c.count === 1 ? '' : []);
                    });
                  }}
                  placeholder={`Choose ${choice.label}...`}
                />
              </div>
            );
          }

          case 'spellcasting-ability': {
            const currentValue = currentSelections[choice.id] as string || '';
            return (
              <div key={choice.id}>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {choice.label}
                </label>
                <Combobox
                  options={choice.options?.map(o => ({
                    value: o,
                    label: o.charAt(0).toUpperCase() + o.slice(1),
                  })) || spellcastingAbilityOptions}
                  value={currentValue}
                  onChange={(value) => onSelectionChange(choice.id, value)}
                  placeholder={`Choose ${choice.label}...`}
                />
              </div>
            );
          }

          case 'cantrip': {
            const spellListChoice = choices.find(c => c.kind === 'spell-list');
            const selectedClass = currentSelections[spellListChoice?.id ?? ''] as string;
            const isSpellSniper = !spellListChoice;
            
            let options = cantripOptions;
            if (isSpellSniper) {
              options = cantripOptions;
            }

            if (!selectedClass && !isSpellSniper) {
              return (
                <div key={choice.id}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {choice.label}
                  </label>
                  <p className="text-sm text-slate-500">Select a spell list first</p>
                </div>
              );
            }

            return (
              <div key={choice.id} className="space-y-2">
                {Array.from({ length: choice.count }).map((_, index) => {
                  const currentValues = (currentSelections[choice.id] as string[]) || [];
                  const selectedByOthers = currentValues.filter((_, i) => i !== index);
                  const filteredOptions = options.filter(
                    opt => !selectedByOthers.includes(opt.value)
                  );

                  return (
                    <div key={index}>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        {choice.count > 1 ? `${choice.label} ${index + 1}` : choice.label}
                      </label>
                      <Combobox
                        options={filteredOptions}
                        value={currentValues[index] || ''}
                        onChange={(value) => {
                          const newValues = [...currentValues];
                          newValues[index] = value;
                          onSelectionChange(choice.id, newValues);
                        }}
                        placeholder={`Choose ${choice.label}...`}
                        disabled={spellLoading}
                      />
                    </div>
                  );
                })}
              </div>
            );
          }

          case 'spell': {
            const spellListChoice = choices.find(c => c.kind === 'spell-list');
            const selectedClass = currentSelections[spellListChoice?.id ?? ''] as string;
            
            if (!selectedClass) {
              return (
                <div key={choice.id}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {choice.label}
                  </label>
                  <p className="text-sm text-slate-500">Select a spell list first</p>
                </div>
              );
            }

            return (
              <div key={choice.id} className="space-y-2">
                {Array.from({ length: choice.count }).map((_, index) => {
                  const currentValues = (currentSelections[choice.id] as string[]) || [];
                  const selectedByOthers = currentValues.filter((_, i) => i !== index);
                  const filteredOptions = spellOptions.filter(
                    opt => !selectedByOthers.includes(opt.value)
                  );

                  return (
                    <div key={index}>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        {choice.count > 1 ? `${choice.label} ${index + 1}` : choice.label}
                      </label>
                      <Combobox
                        options={filteredOptions}
                        value={currentValues[index] || ''}
                        onChange={(value) => {
                          const newValues = [...currentValues];
                          newValues[index] = value;
                          onSelectionChange(choice.id, newValues);
                        }}
                        placeholder={`Choose ${choice.label}...`}
                        disabled={spellLoading}
                      />
                    </div>
                  );
                })}
              </div>
            );
          }

          case 'weapon-proficiency': {
            if (weaponOptions.length === 0) {
              return (
                <div key={choice.id}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {choice.label}
                  </label>
                  <p className="text-sm text-slate-500">Loading weapons...</p>
                </div>
              );
            }

            return (
              <div key={choice.id} className="space-y-2">
                {Array.from({ length: choice.count }).map((_, index) => {
                  const currentValues = (currentSelections[choice.id] as string[]) || [];
                  const selectedByOthers = currentValues.filter((_, i) => i !== index);
                  const filteredOptions = weaponOptions.filter(
                    opt => !selectedByOthers.includes(opt.value) && 
                           !existingWeaponProficiencies.includes(opt.value)
                  );

                  return (
                    <div key={index}>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        {choice.count > 1 ? `${choice.label} ${index + 1}` : choice.label}
                      </label>
                      <Combobox
                        options={filteredOptions}
                        value={currentValues[index] || ''}
                        onChange={(value) => {
                          const newValues = [...currentValues];
                          newValues[index] = value;
                          onSelectionChange(choice.id, newValues);
                        }}
                        placeholder={`Choose weapon...`}
                      />
                    </div>
                  );
                })}
              </div>
            );
          }

          case 'maneuver': {
            return (
              <div key={choice.id} className="space-y-2">
                {Array.from({ length: choice.count }).map((_, index) => {
                  const currentValues = (currentSelections[choice.id] as string[]) || [];
                  const selectedByOthers = currentValues.filter((_, i) => i !== index);
                  const filteredOptions = maneuverOptions.filter(
                    opt => !selectedByOthers.includes(opt.value)
                  );

                  return (
                    <div key={index}>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        {choice.count > 1 ? `${choice.label} ${index + 1}` : choice.label}
                      </label>
                      <Combobox
                        options={filteredOptions}
                        value={currentValues[index] || ''}
                        onChange={(value) => {
                          const newValues = [...currentValues];
                          newValues[index] = value;
                          onSelectionChange(choice.id, newValues);
                        }}
                        placeholder={`Choose maneuver...`}
                      />
                    </div>
                  );
                })}
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
