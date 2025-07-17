

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Display from '../ui/Display';
import Button from '../ui/Button';
import { useCalculatorContext } from '../../hooks/useCalculatorContext';
import MemoryPopup from '../ui/MemoryPopup';

const ariaLabels: { [key: string]: string } = {
  'M+': 'Memory Add',
  'F↔D': 'Fraction-Decimal Toggle',
  '+/-': 'Toggle Sign',
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

const BasicCalculator: React.FC = () => {
  const { handleButtonClick } = useCalculatorContext();
  
  const [memoryPopupState, setMemoryPopupState] = useState<{ open: boolean, target: HTMLElement | null }>({ open: false, target: null });
  const memoryLongPressTimer = useRef<number | undefined>(undefined);
  const memoryButtonRef = useRef<HTMLButtonElement>(null);
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
    }
  }, [handleButtonClick]);

  const handleMemoryMouseDown = () => {
    memoryLongPressTimer.current = window.setTimeout(() => {
      setMemoryPopupState({ open: true, target: memoryButtonRef.current });
    }, 500);
  };

  const handleMemoryMouseUp = () => {
    if (memoryLongPressTimer.current) {
      window.clearTimeout(memoryLongPressTimer.current);
    }
  };

  const handleMemoryPopupSelect = (action: string) => {
    handleButtonClick(action);
    setMemoryPopupState({ open: false, target: null });
  };

  const controlButtons = ['M+', 'F↔D', '+/-', 'DEL'];
  const mainButtons = [
    ['AC', '(', ')', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '−'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];
  
  const getButtonClass = (btn: string) => {
    if (['÷', '×', '−', '+', '='].includes(btn)) {
      return 'bg-primary/80 hover:bg-primary-focus text-white';
    }
    if (['AC', 'DEL'].includes(btn)) {
      return 'bg-secondary/80 hover:brightness-115 text-white';
    }
    if (['(', ')', 'M+', 'F↔D', '+/-'].includes(btn)) {
      return 'bg-base-300/70 hover:bg-base-300';
    }
    // Default for numbers
    return 'bg-base-200/60 hover:bg-base-200/90';
  };

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="flex flex-col gap-4 h-full outline-none"
      aria-label="Basic Calculator. Use your keyboard for input."
    >
      {memoryPopupState.open && <MemoryPopup target={memoryPopupState.target} onSelect={handleMemoryPopupSelect} onClose={() => setMemoryPopupState({ open: false, target: null })} />}
      <Display />
      <div className="grid grid-cols-4 gap-2" role="grid">
        {controlButtons.map((btn) => {
          if (btn === 'M+') {
            return (
              <Button
                key={btn}
                ref={memoryButtonRef}
                onMouseDown={handleMemoryMouseDown}
                onMouseUp={handleMemoryMouseUp}
                onMouseLeave={handleMemoryMouseUp}
                onTouchStart={handleMemoryMouseDown}
                onTouchEnd={handleMemoryMouseUp}
                onClick={() => { if (!memoryPopupState.open) handleButtonClick('M+'); }}
                className={`${getButtonClass(btn)} text-lg md:text-xl`}
                aria-label={ariaLabels[btn] || btn}
                role="gridcell"
              >
                M+
              </Button>
            );
          }
          return (
            <Button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className={`${getButtonClass(btn)} text-lg md:text-xl`}
              aria-label={ariaLabels[btn] || btn}
              role="gridcell"
            >
              {btn}
            </Button>
          );
        })}
      </div>
      <div className="grid grid-cols-4 gap-2" role="grid">
        {mainButtons.flat().map((btn) => (
          <Button
            key={btn}
            onClick={() => handleButtonClick(btn)}
            className={`${getButtonClass(btn)} ${btn === '0' ? 'col-span-2' : ''} text-xl md:text-2xl`}
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

export default BasicCalculator;