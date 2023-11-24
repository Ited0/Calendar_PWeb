import { useState } from "react";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface ComboboxOption<T> {
  value: T;
  label: string;
}

interface ComboboxProps<T extends NonNullable<unknown>> {
  placeholder: string;
  empty: string;
  data: ComboboxOption<T>[];
  value?: T | undefined;
  setValue: (value?: T | undefined) => void;
}

export const Combobox = <T extends NonNullable<unknown>>({
  placeholder,
  data,
  empty,
  value,
  setValue,
}: ComboboxProps<T>) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? data.find((data) => data.value === value)?.label
            : placeholder}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full h-96">
        <Command>
          <CommandInput placeholder={placeholder}  />
          <CommandEmpty>{empty}</CommandEmpty>
          <CommandGroup className="overflow-y-auto">
            {data.map((option) => (
              <CommandItem
                key={option.value.toString()}
                value={option.label.toString()}
                onSelect={() => {
                  const newValue = option.value
                  setValue(
                    newValue === value?.toString() ? undefined : newValue
                  );
                  setOpen(false);
                }}
              >
                <CheckIcon
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
