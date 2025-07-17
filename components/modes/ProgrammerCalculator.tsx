
import React, { useEffect, useCallback, useRef } from 'react';
import { useProgrammerContext } from '../../hooks/useProgrammerContext';
import ProgrammerDisplay from '../programmer/ProgrammerDisplay';
import WordSizeSelector from '../programmer/WordSizeSelector';
import ProgrammerKeypad from '../programmer/ProgrammerKeypad';

const ProgrammerCalculator: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { programmerDisplayValue, handleProgrammerKeyClick, programmerBase } = useProgrammerContext();

    useEffect(() => {
        containerRef.current?.focus();
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        e.preventDefault();
        const key = e.key.toUpperCase();
        
        // Check if the key is a valid digit for the current base
        const digitValue = parseInt(key, 16);
        if (!isNaN(digitValue) && digitValue < programmerBase && /^[0-9A-F]$/.test(key)) {
            handleProgrammerKeyClick(key);
            return;
        }
        
        switch (key) {
            case 'ENTER':
            case '=': handleProgrammerKeyClick('='); break;
            case 'BACKSPACE': handleProgrammerKeyClick('DEL'); break;
            case 'ESCAPE': handleProgrammerKeyClick('AC'); break;
            case '&': handleProgrammerKeyClick('AND'); break;
            case '|': handleProgrammerKeyClick('OR'); break;
            case '^': handleProgrammerKeyClick('XOR'); break;
            case '~': handleProgrammerKeyClick('NOT'); break;
        }

    }, [handleProgrammerKeyClick, programmerBase]);
    
    const getFontSize = (text: string) => {
        const len = text.length;
        if (len > 48) return 'text-lg';
        if (len > 32) return 'text-xl';
        if (len > 22) return 'text-2xl';
        if (len > 15) return 'text-3xl';
        return 'text-4xl';
    };

    return (
        <div 
            ref={containerRef}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className="flex flex-col gap-3 h-full outline-none"
            aria-label="Programmer Calculator. Use keyboard for input."
        >
            {/* Main display for programmer mode */}
            <div
                role="textbox"
                aria-readonly="true"
                aria-live="polite"
                aria-label="Current value in selected base"
                className={`rounded-lg p-4 w-full h-24 flex items-end justify-end overflow-hidden font-mono text-right break-all ${getFontSize(programmerDisplayValue)} text-base-content transition-all duration-200 glass-display`}
                title={programmerDisplayValue}
            >
                {programmerDisplayValue || '0'}
            </div>
            <ProgrammerDisplay />
            <WordSizeSelector />
            <ProgrammerKeypad />
        </div>
    );
};

export default ProgrammerCalculator;