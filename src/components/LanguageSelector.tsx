import { Badge } from "@/components/ui/badge"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SRD_LANGUAGES, type Language } from "@/data/languages"
import { useMemo } from "react"

interface LanguageSelectorProps {
  selectedLanguages: string[]
  onChange: (languages: string[]) => void
  maxSelections: number
  knownLanguages?: string[]
  label?: string
  singleSelect?: boolean
  placeholder?: string
}

function getLanguageById(id: string): Language | undefined {
  return SRD_LANGUAGES.find(lang => lang.id === id)
}

function getLanguageByName(name: string): Language | undefined {
  return SRD_LANGUAGES.find(lang => lang.name.toLowerCase() === name.toLowerCase())
}

export function LanguageSelector({
  selectedLanguages,
  onChange,
  maxSelections,
  knownLanguages,
  label = "Languages",
  singleSelect = false,
  placeholder,
}: LanguageSelectorProps) {
  const showKnownLanguages = knownLanguages && knownLanguages.length > 0
  const effectiveMax = singleSelect ? 1 : maxSelections
  const remaining = effectiveMax - selectedLanguages.length
  const isAtLimit = remaining <= 0

  const allDisabledLanguageIds = useMemo(() => {
    const known = new Set(knownLanguages ?? [])
    const selected = new Set(selectedLanguages)
    const disabled = new Set<string>()
    
    known.forEach(name => {
      const lang = getLanguageByName(name)
      if (lang) disabled.add(lang.id)
    })
    
    selected.forEach(id => disabled.add(id))
    
    return disabled
  }, [knownLanguages, selectedLanguages])

  const availableOptions: ComboboxOption[] = useMemo(() => {
    return SRD_LANGUAGES
      .filter(lang => !allDisabledLanguageIds.has(lang.id))
      .map(lang => ({
        value: lang.id,
        label: lang.name,
      }))
  }, [allDisabledLanguageIds])

  const handleAddLanguage = (languageId: string) => {
    if (singleSelect) {
      onChange([languageId])
    } else {
      if (selectedLanguages.length < effectiveMax) {
        onChange([...selectedLanguages, languageId])
      }
    }
  }

  const handleRemoveLanguage = (languageId: string) => {
    onChange(selectedLanguages.filter(id => id !== languageId))
  }

  const defaultPlaceholder = singleSelect
    ? "Select a language..."
    : `Add language... (${remaining} of ${effectiveMax} remaining)`

  const displayPlaceholder = placeholder ?? defaultPlaceholder

  return (
    <TooltipProvider delayDuration={200}>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>

        {showKnownLanguages && (
          <div className="mb-3">
            <div className="text-xs text-slate-500 mb-1.5">Known Languages</div>
            <div className="flex flex-wrap gap-1.5">
              {knownLanguages!.map((name) => {
                const lang = getLanguageByName(name)
                if (!lang) return null
                return (
                  <Tooltip key={lang.id}>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="shrink-0">
                        {lang.name}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-62.5">
                      <div className="font-semibold text-slate-900">{lang.name}</div>
                      <div className="text-xs text-slate-600 mt-1">{lang.description}</div>
                      <div className="text-xs text-slate-400 mt-1">{lang.type}</div>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </div>
        )}

        {selectedLanguages.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {selectedLanguages.map((id) => {
              const lang = getLanguageById(id)
              if (!lang) return null
              return (
                <Tooltip key={lang.id}>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="default"
                      onRemove={() => handleRemoveLanguage(lang.id)}
                      className="shrink-0"
                    >
                      {lang.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-62.5">
                    <div className="font-semibold text-slate-900">{lang.name}</div>
                    <div className="text-xs text-slate-600 mt-1">{lang.description}</div>
                    <div className="text-xs text-slate-400 mt-1">{lang.type}</div>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        )}

        {!isAtLimit && (
          <Combobox
            options={availableOptions}
            value=""
            onChange={handleAddLanguage}
            placeholder={displayPlaceholder}
          />
        )}

        {isAtLimit && !singleSelect && (
          <div className="text-sm text-slate-500 italic">
            Maximum number of languages selected ({effectiveMax})
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
