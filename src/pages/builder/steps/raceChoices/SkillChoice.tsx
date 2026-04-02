import { useState } from 'react';
import type { Skill } from '../../../../types';

const ALL_SKILLS: Skill[] = [
  'athletics', 'acrobatics', 'sleightOfHand', 'stealth', 'arcana', 'history',
  'investigation', 'medicine', 'nature', 'religion', 'animalHandling', 'insight',
  'perception', 'survival', 'deception', 'intimidation', 'performance', 'persuasion'
];

const SKILL_LABELS: Record<Skill, string> = {
  athletics: 'Athletics',
  acrobatics: 'Acrobatics',
  sleightOfHand: 'Sleight of Hand',
  stealth: 'Stealth',
  arcana: 'Arcana',
  history: 'History',
  investigation: 'Investigation',
  medicine: 'Medicine',
  nature: 'Nature',
  religion: 'Religion',
  animalHandling: 'Animal Handling',
  insight: 'Insight',
  perception: 'Perception',
  survival: 'Survival',
  deception: 'Deception',
  intimidation: 'Intimidation',
  performance: 'Performance',
  persuasion: 'Persuasion',
};

interface SkillChoiceProps {
  value: string[];
  count: number;
  onChange: (value: string[]) => void;
  exclude?: string[];
}

export function SkillChoice({ value, count, onChange, exclude = [] }: SkillChoiceProps) {
  const [currentSelection, setCurrentSelection] = useState<string>('');

  const handleAddSkill = (skill: string) => {
    if (value.length < count && !value.includes(skill) && !exclude.includes(skill)) {
      const newValue = [...value, skill];
      onChange(newValue);
      setCurrentSelection('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const newValue = value.filter(s => s !== skill);
    onChange(newValue);
  };

  const availableSkills = ALL_SKILLS.filter(
    skill => !value.includes(skill) && !exclude.includes(skill)
  );

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Choose {count} Skill{count > 1 ? 's' : ''}
      </label>
      
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map(skill => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm"
            >
              {SKILL_LABELS[skill as Skill] || skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {value.length < count && (
        <select
          className="w-full border-slate-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
          value={currentSelection}
          onChange={(e) => {
            setCurrentSelection(e.target.value);
            if (e.target.value) {
              handleAddSkill(e.target.value);
            }
          }}
        >
          <option value="">Select a Skill</option>
          {availableSkills.map(skill => (
            <option key={skill} value={skill}>
              {SKILL_LABELS[skill]}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
