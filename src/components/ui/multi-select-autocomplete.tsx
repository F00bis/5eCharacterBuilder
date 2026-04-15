import { useMemo } from 'react';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { TooltipProvider } from '@/components/ui/tooltip';

export interface MultiSelectAutocompleteProps<T> {
  selectedItems: T[];
  availableOptions: ComboboxOption[];
  maxSelections: number;
  onAdd: (value: string) => void;
  renderBadge: (item: T) => React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
}

export function MultiSelectAutocomplete<T>({
  selectedItems,
  availableOptions,
  maxSelections,
  onAdd,
  renderBadge,
  placeholder = 'Select an option...',
  disabled = false,
}: MultiSelectAutocompleteProps<T>) {
  const canAddMore = selectedItems.length < maxSelections;

  const filteredOptions = useMemo(() => {
    const selectedValues = new Set(selectedItems.map((item) => {
      if (typeof item === 'string') return item;
      return (item as { name: string }).name;
    }));
    return availableOptions.filter((opt) => !selectedValues.has(opt.value));
  }, [availableOptions, selectedItems]);

  const remainingCount = maxSelections - selectedItems.length;
  const showCounter = remainingCount > 0;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-3">
        {selectedItems.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedItems.map((item, idx) => (
              <div key={idx}>
                {renderBadge(item)}
              </div>
            ))}
          </div>
        )}

        {canAddMore && filteredOptions.length > 0 && (
          <>
            {showCounter && (
              <div className="text-sm text-slate-500">
                Select {remainingCount} more
              </div>
            )}
            <Combobox
              options={filteredOptions}
              value=""
              onChange={onAdd}
              placeholder={placeholder}
              disabled={disabled}
            />
          </>
        )}

        {!canAddMore && selectedItems.length > 0 && (
          <div className="text-sm text-slate-500">
            {selectedItems.length}/{maxSelections} selected
          </div>
        )}

        {canAddMore && filteredOptions.length === 0 && (
          <div className="text-sm text-slate-500">
            No more options available
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}