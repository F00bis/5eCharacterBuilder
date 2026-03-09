import { Badge } from "@/components/ui/badge"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"
import { CustomEffectDialog } from "@/components/ui/custom-effect-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { srdStatusEffects } from "@/data/statusEffects"
import { getCustomStatusEffects, saveCustomStatusEffect } from "@/db/statusEffects"
import type { StatusEffect, StatusEffectCategory } from "@/types"
import { useCallback, useEffect, useState } from "react"
import { useCharacter } from "../contexts/CharacterContext"

interface StatusEffectsSectionProps {
  character?: import('../types').Character;
  onUpdate?: (updates: Partial<import('../types').Character>) => void;
}

function getBadgeVariant(category: StatusEffectCategory): "destructive" | "warning" | "success" {
  switch (category) {
    case "harmful":
      return "destructive"
    case "neutral":
      return "warning"
    case "beneficial":
      return "success"
  }
}

export function StatusEffectsSection(_props: StatusEffectsSectionProps) {
  const context = useCharacter();
  const character = _props.character ?? context.character!;
  const update = _props.onUpdate ?? context.update;
  
  const [customDialogOpen, setCustomDialogOpen] = useState(false)
  const [savedCustomEffects, setSavedCustomEffects] = useState<StatusEffect[]>([])
  const [availableEffects, setAvailableEffects] = useState<ComboboxOption[]>([])

  const updateAvailableEffects = useCallback((customEffects: StatusEffect[]) => {
    const currentEffectIds = character.statusEffects.map((e) => e.id)
    const options: ComboboxOption[] = [
      ...srdStatusEffects
        .filter((effect) => !currentEffectIds.includes(effect.id))
        .map((effect) => ({
          value: effect.id,
          label: effect.name,
        })),
      ...customEffects
        .filter((effect) => !currentEffectIds.includes(effect.id))
        .map((effect) => ({
          value: effect.id,
          label: `${effect.name} (Custom)`,
        })),
    ]
    setAvailableEffects(options)
  }, [character.statusEffects])

  useEffect(() => {
    getCustomStatusEffects()
      .then((effects) => {
        setSavedCustomEffects(effects)
        updateAvailableEffects(effects)
      })
      .catch((err) => {
        console.error('Failed to load custom status effects:', err)
      })
  }, [updateAvailableEffects])

  const handleAddEffect = (effectId: string) => {
    const srdEffect = srdStatusEffects.find((e) => e.id === effectId)
    if (srdEffect) {
      update({
        statusEffects: [...character.statusEffects, srdEffect],
      })
      return
    }

    const customEffect = savedCustomEffects.find((e) => e.id === effectId)
    if (customEffect) {
      update({
        statusEffects: [...character.statusEffects, customEffect],
      })
    }
  }

  const handleRemoveEffect = async (effectId: string) => {
    update({
      statusEffects: character.statusEffects.filter((e) => e.id !== effectId),
    })
  }

  const handleCreateCustomEffect = async (effect: StatusEffect) => {
    await saveCustomStatusEffect(effect)
    const updatedEffects = await getCustomStatusEffects()
    setSavedCustomEffects(updatedEffects)
    updateAvailableEffects(updatedEffects)
    update({
      statusEffects: [...character.statusEffects, effect],
    })
  }

  const handleComboboxOpenChange = async (open: boolean) => {
    if (open) {
      const effects = await getCustomStatusEffects()
      setSavedCustomEffects(effects)
      updateAvailableEffects(effects)
    }
  }

  return (
    <TooltipProvider delayDuration={200}>
      <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
        Status Effects
      </h3>

      {character.statusEffects.length === 0 ? (
        <div className="text-sm text-slate-400 italic mb-2">
          No active status effects
        </div>
      ) : (
        <div className="flex overflow-x-auto gap-1.5 mb-3 py-1">
          {character.statusEffects.map((effect) => (
            <Tooltip key={effect.id}>
              <TooltipTrigger asChild>
                <Badge
                  variant={getBadgeVariant(effect.category)}
                  onRemove={() => handleRemoveEffect(effect.id)}
                  className="shrink-0"
                >
                  {effect.name}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-62.5">
                <div className="font-semibold text-slate-900">{effect.name}</div>
                <div className="text-xs text-slate-600 mt-1">{effect.description}</div>
                {effect.isCustom && (
                  <div className="text-xs text-purple-600 mt-1">(Custom)</div>
                )}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      )}

      <Combobox
        options={availableEffects}
        value=""
        onChange={handleAddEffect}
        placeholder="Add status effect..."
        onCreateCustom={() => setCustomDialogOpen(true)}
        onOpenChange={handleComboboxOpenChange}
      />

      <CustomEffectDialog
        open={customDialogOpen}
        onOpenChange={setCustomDialogOpen}
        onCreate={handleCreateCustomEffect}
      />
    </TooltipProvider>
  )
}
