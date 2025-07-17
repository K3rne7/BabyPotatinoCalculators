
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import ConverterCategoryList from '../converter/ConverterCategoryMenu';
import UnitConverter from '../converter/UnitConverter';
import { conversionCategories } from '../../lib/conversions';
import { ConversionType } from '../../types';
import Placeholder from './Placeholder';
import { useOutsideClick } from '../../hooks/useOutsideClick';

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// Dropdown component for selecting a category
const CategoryDropdownMenu: React.FC<{
  activeCategoryKey: string;
  onSelectCategory: (key: string) => void;
}> = ({ activeCategoryKey, onSelectCategory }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [position, setPosition] = useState<{ top: number, left: number, width: number } | null>(null);

    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const openDropdown = useCallback(() => {
        const button = buttonRef.current;
        const calculatorBoundary = document.getElementById('calculator-boundary');
        if (button && calculatorBoundary) {
            const buttonRect = button.getBoundingClientRect();
            const boundaryRect = calculatorBoundary.getBoundingClientRect();
            
            const dropdownWidth = 280;
            const dropdownHeight = 400; // Max height

            let top = buttonRect.bottom + 8;
            let left = buttonRect.left;

            if (top + dropdownHeight > boundaryRect.bottom) {
                top = boundaryRect.bottom - dropdownHeight - 8;
            }
            if (left + dropdownWidth > boundaryRect.right) {
                left = boundaryRect.right - dropdownWidth - 8;
            }
            top = Math.max(top, boundaryRect.top + 8);
            left = Math.max(left, boundaryRect.left + 8);
            
            setPosition({ top, left, width: dropdownWidth });
            setIsOpen(true);
            setIsClosing(false);
        }
    }, []);

    const closeDropdown = useCallback(() => {
        if (!isOpen) return;
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 200);
    }, [isOpen]);

    useOutsideClick(dropdownRef, (event) => {
        if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
            closeDropdown();
        }
    });

    const handleSelect = (key: string) => {
        onSelectCategory(key);
        closeDropdown();
    };

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        isOpen ? closeDropdown() : openDropdown();
    };

    const DropdownComponent = isOpen && position && createPortal(
        <div
            ref={dropdownRef}
            style={{
                position: 'fixed',
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: `${position.width}px`,
                zIndex: 1000,
            }}
            className={`transform-gpu ${isClosing ? 'animate-fade-out' : 'animate-fade-in-up'}`}
        >
            <div className="popup-panel max-h-[400px] flex flex-col">
               <ConverterCategoryList
                   activeCategoryKey={activeCategoryKey}
                   onSelectCategory={handleSelect}
               />
            </div>
        </div>,
        document.body
    );

    return (
        <>
            <button
                ref={buttonRef}
                onClick={handleToggle}
                className="p-2 rounded-full hover:bg-base-300/50 text-base-content"
                aria-label="Toggle category menu"
                aria-expanded={isOpen}
            >
               {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            {DropdownComponent}
        </>
    );
};


const ConverterCalculator: React.FC = () => {
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>('length');
  
  const activeCategory = conversionCategories[activeCategoryKey];

  const handleSelectCategory = (key: string) => {
    setActiveCategoryKey(key);
  };

  const renderActiveConverter = () => {
    if (!activeCategory) {
      return <Placeholder title="Select a category" />;
    }

    switch (activeCategory.type) {
      case ConversionType.STANDARD:
      case ConversionType.FUNCTIONAL:
        if (!activeCategory.units || Object.keys(activeCategory.units).length === 0) {
           return <Placeholder title={`${activeCategory.name} - Coming Soon`} />;
        }
        return <UnitConverter key={activeCategoryKey} categoryKey={activeCategoryKey} />;
      case ConversionType.CUSTOM:
        const CustomComponent = activeCategory.component;
        if (CustomComponent) {
            return <CustomComponent key={activeCategoryKey} category={activeCategory} />;
        }
        return <Placeholder title={`${activeCategory.name} - Coming Soon`} />;
      default:
        return <Placeholder title="Invalid Category" />;
    }
  };

  return (
    <div className="flex h-full w-full bg-base-100/50 rounded-lg shadow-inner overflow-hidden">
      <div className="flex-1 flex flex-col w-full">
        <header className="flex items-center justify-between p-2 md:p-3 border-b border-base-300/50 flex-shrink-0">
          <CategoryDropdownMenu
            activeCategoryKey={activeCategoryKey}
            onSelectCategory={handleSelectCategory}
          />
          <h2 className="text-lg font-bold text-base-content text-center flex-grow truncate px-2">{activeCategory?.name || 'Converter'}</h2>
          <div className="w-10 h-10 flex-shrink-0" aria-hidden="true"></div>
        </header>
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-2 md:p-4">
          {renderActiveConverter()}
        </main>
      </div>
    </div>
  );
};

export default ConverterCalculator;