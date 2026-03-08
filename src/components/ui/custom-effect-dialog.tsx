import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import type { StatusEffect, StatusEffectCategory } from "@/types"
import { createCustomStatusEffect } from "@/data/statusEffects"

interface CustomEffectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (effect: StatusEffect) => void
}

export function CustomEffectDialog({
  open,
  onOpenChange,
  onCreate,
}: CustomEffectDialogProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState<StatusEffectCategory>("harmful")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const effect = createCustomStatusEffect(name.trim(), category, description.trim() || undefined)
    onCreate(effect)
    setName("")
    setCategory("harmful")
    setDescription("")
    onOpenChange(false)
  }

  const handleClose = () => {
    setName("")
    setCategory("harmful")
    setDescription("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Custom Status Effect</DialogTitle>
            <DialogDescription>
              Add a custom status effect to your character.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Blessed, Marked, Charged"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as StatusEffectCategory)}
                required
              >
                <option value="harmful">Harmful</option>
                <option value="neutral">Neutral</option>
                <option value="beneficial">Beneficial</option>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A custom status effect"
                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Create Effect
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
