import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onCreateCustom?: () => void;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  onCreateCustom,
  className,
  onOpenChange,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [triggerWidth, setTriggerWidth] = React.useState<string | undefined>()

  const filteredOptions = React.useMemo(() => {
    if (!search) return options
    const lowerSearch = search.toLowerCase()
    return options.filter((option) =>
      option.label.toLowerCase().includes(lowerSearch)
    )
  }, [options, search])

  const selectedOption = options.find((opt) => opt.value === value)

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setOpen(false)
    setSearch("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={(open) => { 
      setOpen(open); 
      onOpenChange?.(open);
      if (open && triggerRef.current) {
        setTriggerWidth(`${triggerRef.current.offsetWidth}px`)
      }
    }}>
      <PopoverPrimitive.Trigger asChild>
        <button
          ref={triggerRef}
          type="button"
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <span className={selectedOption ? "text-slate-900" : "text-slate-400"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {open ? (
            <ChevronUp className="h-4 w-4 opacity-50" />
          ) : (
            <ChevronDown className="h-4 w-4 opacity-50" />
          )}
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          style={{ width: triggerWidth }}
          className="z-50 overflow-hidden rounded-md border bg-white p-1 shadow-md animate-in fade-in-0 zoom-in-95"
          sideOffset={4}
          onKeyDown={handleKeyDown}
        >
          <div className="flex items-center border-b px-3 pb-2">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex h-8 w-full rounded-sm bg-transparent py-1 text-sm outline-none placeholder:text-slate-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-75 overflow-y-auto p-1">
            {filteredOptions.length === 0 && !onCreateCustom ? (
              <div className="py-6 text-center text-sm text-slate-500">
                No options found
              </div>
            ) : (
              <>
                {filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-100 hover:text-slate-900 data-disabled:pointer-events-none data-disabled:opacity-50",
                      option.value === value && "bg-slate-100 text-slate-900"
                    )}
                  >
                    {option.value === value && (
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                    <span className={option.value === value ? "ml-4" : ""}>
                      {option.label}
                    </span>
                  </div>
                ))}
                {onCreateCustom && (
                  <>
                    <div className="my-1 h-px bg-slate-200" />
                    <div
                      onClick={() => {
                        setOpen(false)
                        setSearch("")
                        onCreateCustom()
                      }}
                      className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm text-purple-700 hover:bg-purple-100 hover:text-purple-900"
                    >
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        +
                      </span>
                      <span className="ml-4">Create custom...</span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export { Combobox };

