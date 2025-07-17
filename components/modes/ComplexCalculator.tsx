import React, { useCallback, useEffect, useRef } from 'react';
import Display from '../ui/Display';
import Button from '../ui/Button';
import { useCalculatorContext } from '../../hooks/useCalculatorContext';

const ariaLabels: { [key: string]: string } = {
  'i': 'Imaginary Unit',
  're': 'Real Part',
  'im': 'Imaginary Part',
  'arg': 'Argument',
  'abs': 'Absolute Value (Magnitude)',
  'conj': 'Complex Conjugate',
  'Rect↔Polar': 'Toggle Rectangular/Polar Form',
  'DEL': 'Delete',
  'AC': 'All Clear',
  '(': 'Open Parenthesis',
  ')': 'Close Parenthesis',
  '÷': 'Divide',
  '×': 'Multiply',
  '−': 'Subtract',
  '+': 'Add',
  '=': 'Equals',
  '.': 'Decimal Point',
};

const ComplexCalculator: React.FC = () => {
    const { handleButtonClick } = useCalculatorContext();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        containerRef.current?.focus();
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        e.preventDefault();
        const key = e.key;
        if (/[0-9]/.test(key)) {
            handleButtonClick(key);
        } else if (key === '+') {
            handleButtonClick('+');
        } else if (key === '-') {
            handleButtonClick('−');
        } else if (key === '*') {
            handleButtonClick('×');
        } else if (key === '/') {
            handleButtonClick('÷');
        } else if (key === '.') {
            handleButtonClick('.');
        } else if (key === '(') {
            handleButtonClick('(');
        } else if (key === ')') {
            handleButtonClick(')');
        } else if (key === 'Enter' || key === '=') {
            handleButtonClick('=');
        } else if (key === 'Backspace') {
            handleButtonClick('DEL');
        } else if (key === 'Escape') {
            handleButtonClick('AC');
        } else if (key.toLowerCase() === 'i') {
            handleButtonClick('i');
        }
    }, [handleButtonClick]);
    
    const functionButtons = ['i', 're', 'im', 'arg', 'abs', 'conj'];
    const mainButtons = [
        ['AC', '(', ')', '÷'],
        ['7', '8', '9', '×'],
        ['4', '5', '6', '−'],
        ['1', '2', '3', '+'],
        ['0', '.', 'Rect↔Polar', '='],
    ];

    const getButtonClass = (btn: string) => {
        if (['÷', '×', '−', '+', '='].includes(btn)) return 'bg-primary/80 hover:bg-primary-focus text-white';
        if (['AC'].includes(btn)) return 'bg-secondary/80 hover:brightness-115 text-white';
        if (functionButtons.includes(btn) || ['Rect↔Polar', '(', ')'].includes(btn)) {
            return 'bg-base-300/70 hover:bg-base-300';
        }
        return 'bg-base-200/60 hover:bg-base-200/90';
    };

    return (
        <div
            ref={containerRef}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className="flex flex-col gap-4 h-full outline-none"
            aria-label="Complex Number Calculator. Use 'i' key for the imaginary unit."
        >
            <Display />
            <div className="grid grid-cols-6 gap-2" role="grid">
                {functionButtons.map(btn => (
                    <Button 
                        key={btn} 
                        onClick={() => handleButtonClick(btn === 'i' ? 'i' : `${btn}(`)} 
                        className={`${getButtonClass(btn)} text-lg md:text-xl`}
                        aria-label={ariaLabels[btn] || btn}
                        role="gridcell"
                    >
                        {btn}
                    </Button>
                ))}
            </div>
            <div className="grid grid-cols-4 gap-2" role="grid">
                {mainButtons.flat().map((btn) => (
                    <Button
                        key={btn}
                        onClick={() => handleButtonClick(btn)}
                        className={`${getButtonClass(btn)} ${btn === 'Rect↔Polar' ? 'text-sm' : 'text-xl md:text-2xl'}`}
                        aria-label={ariaLabels[btn] || btn}
                        role="gridcell"
                    >
                        {btn}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default ComplexCalculator;