import { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import PropTypes from 'prop-types';
import { universities } from '../data/universities';
import ReactCountryFlag from 'react-country-flag';

const UniversitySearch = ({ value, onChange, className }) => {
  const [open, setOpen] = useState(false);
  
  // Find the selected university object
  const selectedUniversity = universities.find(uni => uni.name === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${className || ''}`}
        >
          <div className="flex items-center gap-2">
            {selectedUniversity ? (
              <>
                {selectedUniversity.name}
                <ReactCountryFlag
                  countryCode={selectedUniversity.country}
                  svg
                  style={{
                    width: '1.5em',
                    height: '1.5em',
                  }}
                />
              </>
            ) : (
              "Select university..."
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search university..." className="h-9" />
          <CommandEmpty>No university found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto">
            {universities.map((university) => (
              <CommandItem
                key={university.name}
                onSelect={() => {
                  onChange(university.name);
                  setOpen(false);
                }}
                className="cursor-pointer hover:bg-slate-100"
              >
                <div className="flex items-center gap-2">
                  {university.name}
                  <ReactCountryFlag
                    countryCode={university.country}
                    svg
                    style={{
                      width: '1.5em',
                      height: '1.5em',
                    }}
                  />
                </div>
                {value === university.name && (
                  <Check className="ml-auto h-4 w-4 opacity-100" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

UniversitySearch.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default UniversitySearch;