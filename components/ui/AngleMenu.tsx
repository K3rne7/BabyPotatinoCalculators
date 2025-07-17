import React, { useState, useRef } from 'react';
import { useCalculatorContext } from '../../hooks/useCalculatorContext';
import { AngleMode } from '../../types';
import { useOutsideClick } from '../../hooks/useOutsideClick';

export const AngleMenu: React.FC = () => {
    const { angleMode, setAngleMode } = useCalculatorContext();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const modes = [AngleMode.Rad, AngleMode.Deg, AngleMode.Grad];

    useOutsideClick(menuRef, () => setIsOpen(false));

    const handleSelect = (mode: AngleMode) => {
        setAngleMode(mode);
        setIsOpen(false);
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="w-full h-full flex items-center justify-center bg-base-300 rounded-lg text-sm font-semibold p-2"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <span>{angleMode}</span>
                <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isOpen && (
                <div
                    className="absolute top-full mt-2 w-full bg-base-100 border border-base-300 rounded-lg shadow-lg z-20 p-1"
                    role="menu"
                >
                    {modes.map(mode => (
                        <button
                            key={mode}
                            onClick={() => handleSelect(mode)}
                            className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-primary hover:text-white transition-colors duration-150 ${angleMode === mode ? 'font-bold bg-primary/20' : ''}`}
                            role="menuitem"
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
