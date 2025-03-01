import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn, supportedLanguages } from '@/lib/utils';

export interface LanguageSelectorProps {
  language: string;
  onLanguageChange: (value: string) => void;
}

export interface LangaugeSelectorRef {
  resetLanguage: () => void;
}

const LanguageSelector = forwardRef<LangaugeSelectorRef, LanguageSelectorProps>(
  ({ language, onLanguageChange }, ref) => {
    const [open, setOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(language);
    const handleSelectedLanguage = (value: string) => {
      setSelectedLanguage(value);
      onLanguageChange(value);
    };
    useImperativeHandle(ref, () => ({
      resetLanguage: () => handleSelectedLanguage('javascript'),
    })); // Expose the resetCode function to the parent

    return (
      <div id="tour-guide-select-language" className="flex gap-2 items-center">
        {/* <Label className=" capitalize">change language</Label> */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] h-[28px] p-2 border-stone justify-between capitalize">
              <span className="text-sm tablet:text-base">
                {selectedLanguage
                  ? supportedLanguages.find(
                      (language) => language === selectedLanguage,
                    )
                  : 'Select Language'}{' '}
              </span>

              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px]  h-[250px] p-0 bg-background">
            <Command>
              <CommandInput placeholder="Search Language..." />
              <CommandList>
                <CommandEmpty>No Language found.</CommandEmpty>
                <CommandGroup>
                  {supportedLanguages.map((language) => (
                    <CommandItem
                      key={language}
                      value={language}
                      onSelect={(currentValue) => {
                        handleSelectedLanguage(
                          currentValue === selectedLanguage ? '' : currentValue,
                        );
                        setOpen(false);
                      }}
                      className="capitalize">
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedLanguage === language
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {language}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);

LanguageSelector.displayName = 'LanguageSelector';
export default React.memo(LanguageSelector);
