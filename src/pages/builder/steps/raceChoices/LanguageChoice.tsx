import { SRD_LANGUAGES } from '../../../../data/languages';

interface LanguageChoiceProps {
  value: string;
  onChange: (value: string) => void;
  knownLanguages: string[];
}

export function LanguageChoice({ value, onChange, knownLanguages }: LanguageChoiceProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Choose a Language
      </label>
      <select
        className="w-full border-slate-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select a Language</option>
        {SRD_LANGUAGES.map(lang => (
          <option 
            key={lang} 
            value={lang}
            disabled={knownLanguages.includes(lang)}
          >
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
}
