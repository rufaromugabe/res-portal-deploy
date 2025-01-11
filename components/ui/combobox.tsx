'use client'; 
import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type ComboboxProps = {
  options: { value: string; label: string }[]; // List of options for the combobox
  placeholder: string; // Placeholder text when no value is selected
  onChange: (value: string) => void; // Callback to handle value change
  value: string; // Selected value
  disabled?: boolean; // Whether the combobox is disabled
};

export function Combobox({ options, placeholder, onChange, value, disabled = false }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled} // Disable the button if the combobox is disabled
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search program..." className="h-9" disabled={disabled} /> {/* Disable the input if the combobox is disabled */}
          <CommandList>
            <CommandEmpty>No program found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    if (!disabled) { // Prevent changes when disabled
                      onChange(currentValue === value ? '' : currentValue);
                      setOpen(false);
                    }
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
