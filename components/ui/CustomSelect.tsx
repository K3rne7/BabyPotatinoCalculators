import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useOutsideClick } from '../../hooks/useOutsideClick';

interface Option {
  value: string;
  label: string;
  isHeader?: boolean;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  variant?: 'transparent' | 'solid';
}

const ChevronDownIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
);

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, className = '', variant = 'transparent' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [position, setPosition] = useState<{ top: number, left: number, width: number } | null>(null);
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(opt => opt.value === value && !opt.isHeader);

  const openDropdown = useCallback(() => {
    const button = buttonRef.current;
    if (button) {
        const buttonRect = button.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        const dropdownHeight = Math.min(options.length * 40 + 8, 240); // Estimate height
        const dropdownWidth = buttonRect.width;

        let top = buttonRect.bottom + 4;

        if ((top + dropdownHeight > viewportHeight) && (buttonRect.top - dropdownHeight - 4 > 0)) {
            top = buttonRect.top - dropdownHeight - 4;
        }
        
        top = Math.max(4, Math.min(top, viewportHeight - dropdownHeight - 4));
        let left = buttonRect.left;
        left = Math.max(4, Math.min(left, viewportWidth - dropdownWidth - 4));

        setPosition({ top, left, width: dropdownWidth });
        setIsOpen(true);
    }
  }, [options.length]);
  
  const closeDropdown = useCallback(() => {
    if (!isOpen) return;
    setIsClosing(true);
    setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
    }, 200); // Match animation duration from index.html
  }, [isOpen]);

  useOutsideClick(dropdownRef, (event) => {
    if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
        return;
    }
    closeDropdown();
  });

  const handleOptionClick = (newValue: string) => {
    onChange(newValue);
    closeDropdown();
  };
  
  const handleToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      if(isOpen) {
          closeDropdown();
      } else {
          openDropdown();
      }
  };
  
  const transparentClasses = "bg-transparent text-base-content/80 font-semibold text-lg p-1 -m-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50";
  const solidClasses = "bg-base-200/50 hover:bg-base-200/80 text-base-content rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary";
  const variantClasses = variant === 'solid' ? solidClasses : transparentClasses;

  const DropdownComponent = isOpen && position && (
      <div
        ref={dropdownRef}
        style={{
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: `${position.width}px`,
          zIndex: 1000,
        }}
        className={isClosing ? 'animate-fade-out' : 'animate-fade-in-up'}
        role="listbox"
      >
        <div className="p-1 popup-panel max-h-60 overflow-y-auto result-scroll">
          {options.map((option) => (
            option.isHeader ? (
                <div key={option.value} className="px-3 py-2 text-xs font-bold text-base-content/50 uppercase tracking-wider cursor-default">
                    {option.label}
                </div>
            ) : (
                <button
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-150 text-base-content hover:bg-primary/80 hover:text-white ${option.value === value ? 'font-bold bg-primary/50 text-white' : ''}`}
                    role="option"
                    aria-selected={option.value === value}
                >
                    {option.label}
                </button>
            )
          ))}
        </div>
      </div>
  );

  return (
    <div className="relative w-full">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        type="button"
        className={`w-full flex justify-between items-center text-left ${variantClasses} ${className}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">{selectedOption?.label || 'Select...'}</span>
        <ChevronDownIcon />
      </button>

      {isOpen && createPortal(DropdownComponent, document.body)}
    </div>
  );
};

export default CustomSelect;