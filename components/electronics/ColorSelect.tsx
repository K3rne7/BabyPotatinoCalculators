import React, { useState, useRef, useCallback } from 'react';
import { useOutsideClick } from '../../hooks/useOutsideClick';

export interface ColorOption {
  value: string;
  label: string;
  color: string;
}

interface ColorSelectProps {
  options: ColorOption[];
  value: string;
  onChange: (value: string) => void;
}

const ColorSelect: React.FC<ColorSelectProps> = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  const closeDropdown = useCallback(() => setIsOpen(false), []);

  useOutsideClick(dropdownRef, (event) => {
    if (!buttonRef.current?.contains(event.target as Node)) {
      closeDropdown();
    }
  });

  const handleOptionClick = (newValue: string) => {
    onChange(newValue);
    closeDropdown();
  };

  return (
    <div className="relative w-full">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(prev => !prev)}
        type="button"
        className="w-full h-10 flex items-center justify-center p-2 bg-base-100 rounded-md border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span
          className="w-5 h-5 rounded-full border border-base-content/20"
          style={{ backgroundColor: selectedOption.color }}
        ></span>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          style={{ zIndex: 20 }}
          className="absolute top-full mt-1 w-40 bg-base-100 dark:bg-base-300 border border-base-300 dark:border-base-200 rounded-lg shadow-2xl p-1"
          role="listbox"
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={`w-full flex items-center gap-3 text-left px-3 py-1.5 text-sm rounded-md transition-colors duration-150 text-base-content hover:bg-primary hover:text-white ${
                option.value === value ? 'font-bold bg-primary/20' : ''
              }`}
              role="option"
              aria-selected={option.value === value}
            >
              <span
                className="w-4 h-4 rounded-full border border-base-content/20"
                style={{ backgroundColor: option.color }}
              ></span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorSelect;
