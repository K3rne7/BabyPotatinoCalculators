

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Display from '../ui/Display';
import Button from '../ui/Button';
import Popup from '../ui/Popup';
import { useCalculatorContext } from '../../hooks/useCalculatorContext';
import { AngleMode, NumberFormat } from '../../types';
import MemoryPopup from '../ui/MemoryPopup';

const ariaLabels: { [key: string]: string } = {
    'x²': 'Square', 'x³': 'Cube', 'x!': 'Factorial',
    '|x|': 'Absolute Value',
    'nPr': 'Permutations', 'nCr': 'Combinations',
    'sin': 'Sine', 'sin⁻¹': 'Inverse Sine',
    'cos': 'Cosine', 'cos⁻¹': 'Inverse Cosine',
    'tan': 'Tangent', 'tan⁻¹': 'Inverse Tangent',
    'sinh': 'Hyperbolic Sine', 'sinh⁻¹': 'Inverse Hyperbolic Sine',
    'cosh': 'Hyperbolic Cosine', 'cosh⁻¹': 'Inverse Hyperbolic Cosine',
    'tanh': 'Hyperbolic Tangent', 'tanh⁻¹': 'Inverse Hyperbolic Tangent',
    '√': 'Square Root', '³√': 'Cube Root',
    'xʸ': 'Power', 'ʸ√x': 'Nth Root',
    '(': 'Open Parenthesis', ')': 'Close Parenthesis',
    '+/-': 'Toggle Sign', 'F-E': 'Number Format Toggle',
    '1/x': 'Reciprocal', 'logy(x)': 'Logarithm with custom base',
    'ln': 'Natural Logarithm', 'eˣ': 'e to the power of x',
    'π': 'Pi', 'e': "Euler's Number",
    'x': 'Variable x',
    'log': 'Logarithm base 10', '10ˣ': '10 to the power of x',
    '÷': 'Divide', '×': 'Multiply', '−': 'Subtract', '+': 'Add', '=': 'Equals',
    '.': 'Decimal Point',
    '2nd': 'Toggle secondary functions',
    'M+': 'Memory Add',
    'F↔D': 'Fraction-Decimal Toggle',
    'DEL': 'Delete',
    'AC': 'All Clear',
};

interface SciButtonConfig {
    base: string;
    shift?: string;
    value?: string;
    shiftValue?: string;
    type: string;
    className?: string;
}

const ScientificCalculator: React.FC = () => {
  const { handleButtonClick, angleMode, setAngleMode, numberFormat, setNumberFormat, fixPrecision, setFixPrecision, autoPrecision, setAutoPrecision, isDigitMode, setIsDigitMode } = useCalculatorContext();
  const [isShift, setIsShift] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [activePopup, setActivePopup] = useState<{ name: string, target: HTMLElement | null }>({ name: '', target: null });
  const longPressTimer = useRef<number | undefined>(undefined);
  
  const varButtonRef = useRef<HTMLButtonElement>(null);
  const openBracketButtonRef = useRef<HTMLButtonElement>(null);
  const closeBracketButtonRef = useRef<HTMLButtonElement>(null);
  const memoryButtonRef = useRef<HTMLButtonElement>(null);
  const angleButtonRef = useRef<HTMLButtonElement>(null);
  const formatButtonRef = useRef<HTMLButtonElement>(null);

  const handleMouseDown = (popupName: string, targetRef: React.RefObject<HTMLButtonElement>) => {
    longPressTimer.current = window.setTimeout(() => {
        setActivePopup({ name: popupName, target: targetRef.current });
    }, 500);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
    }
  };
  
  const closeActivePopup = () => setActivePopup({ name: '', target: null });

  const handlePopupAction = (action: string) => {
    handleButtonClick(action);
    closeActivePopup();
  };

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    e.preventDefault();
    const key = e.key;
    const shift = e.shiftKey;

    if (key.length === 1 && /[0-9.]/.test(key)) {
        handleButtonClick(key);
    } else {
        switch (key.toLowerCase()) {
            case 'enter': case '=': handleButtonClick('='); break;
            case 'backspace': handleButtonClick('DEL'); break;
            case 'escape': handleButtonClick('AC'); break;
            case '+': handleButtonClick('+'); break;
            case '-': handleButtonClick('−'); break;
            case '*': handleButtonClick('×'); break;
            case '/': handleButtonClick('÷'); break;
            case '^': handleButtonClick('^'); break;
            case '(': handleButtonClick('('); break;
            case ')': handleButtonClick(')'); break;
            case '|': handleButtonClick('abs('); break;
            case 's': handleButtonClick(shift ? 'asinh(' : 'sinh('); break;
            case 'c': handleButtonClick(shift ? 'acosh(' : 'cosh('); break;
            case 't': handleButtonClick(shift ? 'atanh(' : 'tanh('); break;
            case 'l': handleButtonClick(shift ? '10^' : 'log10('); break;
            case 'n': handleButtonClick(shift ? 'exp(' : 'log('); break;
            case 'p': handleButtonClick('π'); break;
            case 'e': handleButtonClick('e'); break;
            case 'r': handleButtonClick(shift ? 'cbrt(' : 'sqrt('); break;
            case 'x': handleButtonClick('x'); break;
            case 'shift': setIsShift(p => !p); break;
            case '!': handleButtonClick('!'); break;
        }
    }
  }, [handleButtonClick]);

  const buttonLayout: SciButtonConfig[][] = [
    [
      { base: '|x|', shift: 'nPr', value: 'abs(', shiftValue: 'permutations(', type: 'fn' },
      { base: 'x!', shift: 'nCr', value: '!', shiftValue: 'combinations(', type: 'fn' },
      { base: 'x²', shift: 'x³', value: '^2', shiftValue: '^3', type: 'fn' },
      { base: '√', shift: '³√', value: 'sqrt(', shiftValue: 'cbrt(', type: 'fn' },
      { base: 'xʸ', shift: 'ʸ√x', value: '^', shiftValue: 'nthRoot(', type: 'fn' },
      { base: 'F-E', type: 'fn' },
    ],
    [
      { base: 'sinh', shift: 'sinh⁻¹', value: 'sinh(', shiftValue: 'asinh(', type: 'fn' },
      { base: 'sin', shift: 'sin⁻¹', value: 'sin(', shiftValue: 'asin(', type: 'fn' },
      { base: '7', value: '7', type: 'num' },
      { base: '8', value: '8', type: 'num' },
      { base: '9', value: '9', type: 'num' },
      { base: '÷', value: '÷', type: 'op' },
    ],
    [
      { base: 'cosh', shift: 'cosh⁻¹', value: 'cosh(', shiftValue: 'acosh(', type: 'fn' },
      { base: 'cos', shift: 'cos⁻¹', value: 'cos(', shiftValue: 'acos(', type: 'fn' },
      { base: '4', value: '4', type: 'num' },
      { base: '5', value: '5', type: 'num' },
      { base: '6', value: '6', type: 'num' },
      { base: '×', value: '×', type: 'op' },
    ],
    [
      { base: 'tanh', shift: 'tanh⁻¹', value: 'tanh(', shiftValue: 'atanh(', type: 'fn' },
      { base: 'tan', shift: 'tan⁻¹', value: 'tan(', shiftValue: 'atan(', type: 'fn' },
      { base: '1', value: '1', type: 'num' },
      { base: '2', value: '2', type: 'num' },
      { base: '3', value: '3', type: 'num' },
      { base: '−', value: '−', type: 'op' },
    ],
    [
      { base: '(', value: '(', type: 'fn' },
      { base: ')', value: ')', type: 'fn' },
      { base: '+/-', value: '+/-', type: 'fn' },
      { base: '0', value: '0', type: 'num' },
      { base: '.', value: '.', type: 'num' },
      { base: '+', value: '+', type: 'op' },
    ],
    [
      { base: '1/x', shift: 'logy(x)', value: '1/(', shiftValue: 'log', type: 'fn' },
      { base: 'ln', shift: 'eˣ', value: 'log(', shiftValue: 'exp(', type: 'fn' },
      { base: 'π', shift: 'e', value: 'π', shiftValue: 'e', type: 'fn' },
      { base: 'x', value: 'x', type: 'var' },
      { base: 'log', shift: '10ˣ', value: 'log10(', shiftValue: '10^', type: 'fn' },
      { base: '=', value: '=', type: 'op' },
    ],
  ];
  
  const cycleNumberFormat = () => {
    const formats: NumberFormat[] = ['auto', 'sci', 'eng', 'fix'];
    const currentIndex = formats.indexOf(numberFormat);
    const nextIndex = (currentIndex + 1) % formats.length;
    setNumberFormat(formats[nextIndex]);
    setIsDigitMode(false);
  };

  const cycleAngleMode = () => {
    const modes = [AngleMode.Rad, AngleMode.Deg, AngleMode.Grad];
    const currentIndex = modes.indexOf(angleMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setAngleMode(modes[nextIndex]);
  };

  const getButtonClass = (type?: string, isShiftActive?: boolean) => {
    switch (type) {
      case 'op': return 'bg-primary/80 hover:bg-primary-focus text-white';
      case 'clear': return 'bg-secondary/80 hover:brightness-115 text-white';
      case 'mod': return `font-bold ${isShiftActive ? 'bg-primary text-white' : 'bg-base-300/70 hover:bg-base-300'}`;
      case 'fn': case 'var': return 'bg-base-300/70 hover:bg-base-300';
      case 'num':
      default: return 'bg-base-200/60 hover:bg-base-200/90';
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="flex flex-col gap-1 h-full outline-none"
      aria-label="Scientific Calculator. Use your keyboard for input. Use letters for functions (e.g., 's' for sin)."
    >
        <Display />
        <div className="grid grid-cols-6 gap-1" role="grid">
            <Button onClick={() => setIsShift(!isShift)} className={`${getButtonClass('mod', isShift)} text-base md:text-lg`} aria-pressed={isShift} aria-label={ariaLabels['2nd']} role="gridcell">
                2nd
            </Button>
            <Button
                ref={angleButtonRef}
                onMouseDown={() => handleMouseDown('angle', angleButtonRef)}
                onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
                onTouchStart={() => handleMouseDown('angle', angleButtonRef)} onTouchEnd={handleMouseUp}
                onClick={() => { if (activePopup.name !== 'angle') cycleAngleMode(); }}
                className={`${getButtonClass('fn')} text-sm`}
                aria-label={`Current angle mode: ${angleMode}. Click to cycle, long press to select.`}
                role="gridcell"
            >
                {angleMode}
            </Button>
            <Button
                ref={memoryButtonRef}
                onMouseDown={() => handleMouseDown('memory', memoryButtonRef)}
                onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
                onTouchStart={() => handleMouseDown('memory', memoryButtonRef)} onTouchEnd={handleMouseUp}
                onClick={() => { if (activePopup.name !== 'memory') handleButtonClick('M+'); }}
                className={`${getButtonClass('fn')} text-base md:text-lg`}
                aria-label={ariaLabels['M+']}
                role="gridcell"
            >
                M+
            </Button>
            <Button onClick={() => handleButtonClick('F↔D')} className={`${getButtonClass('fn')} text-sm`} aria-label={ariaLabels['F↔D']} role="gridcell">F↔D</Button>
            <Button onClick={() => handleButtonClick('DEL')} className={`${getButtonClass('clear')} text-base md:text-lg`} aria-label={ariaLabels['DEL']} role="gridcell">DEL</Button>
            <Button onClick={() => handleButtonClick('AC')} className={`${getButtonClass('clear')} text-base md:text-lg`} aria-label={ariaLabels['AC']} role="gridcell">AC</Button>
        </div>
      
        <div className="grid grid-cols-6 grid-rows-6 gap-1 flex-grow" role="grid">
            {buttonLayout.flat().map((btn, index) => {
                const current = isShift && btn.shift ? { label: btn.shift, value: btn.shiftValue || btn.value } : { label: btn.base, value: btn.value };
                
                if (btn.type === 'var') {
                    return (
                        <Button 
                            key={`${btn.base}-${index}`} 
                            ref={varButtonRef}
                            onMouseDown={() => handleMouseDown('variable', varButtonRef)}
                            onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
                            onTouchStart={() => handleMouseDown('variable', varButtonRef)} onTouchEnd={handleMouseUp}
                            onClick={() => { if(activePopup.name !== 'variable') handleButtonClick(current.value)}}
                            className={`${getButtonClass(btn.type, isShift)} text-lg font-mono h-full`} 
                            aria-label={ariaLabels[current.label] || current.label} role="gridcell"
                        >
                            {current.label}
                        </Button>
                    );
                }

                if(btn.base === 'F-E') {
                    const precision = numberFormat === 'fix' ? fixPrecision : autoPrecision;
                    const displayLabel = isDigitMode ? `D:${precision}` : numberFormat.toUpperCase();
                    return (
                        <Button
                            key={`${btn.base}-${index}`}
                            ref={formatButtonRef}
                            onMouseDown={() => handleMouseDown('format', formatButtonRef)}
                            onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
                            onTouchStart={() => handleMouseDown('format', formatButtonRef)} onTouchEnd={handleMouseUp}
                            onClick={() => { if (activePopup.name !== 'format') cycleNumberFormat(); }}
                            className={`${getButtonClass('fn')} text-sm h-full`}
                            aria-label={`Current number format: ${numberFormat}. Click to cycle, long press to select.`} role="gridcell"
                        >
                            {displayLabel}
                        </Button>
                    );
                }

                if (btn.base === '(') {
                    return (
                        <Button
                            key={`${btn.base}-${index}`} ref={openBracketButtonRef}
                            onMouseDown={() => handleMouseDown('openBracket', openBracketButtonRef)}
                            onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
                            onTouchStart={() => handleMouseDown('openBracket', openBracketButtonRef)} onTouchEnd={handleMouseUp}
                            onClick={() => { if (activePopup.name !== 'openBracket') handleButtonClick(current.value || ''); }}
                            className={`${getButtonClass(btn.type, isShift)} text-lg h-full`}
                            aria-label={ariaLabels[current.label] || current.label} role="gridcell"
                        >
                            {btn.base}
                        </Button>
                    );
                }

                if (btn.base === ')') {
                    return (
                        <Button
                            key={`${btn.base}-${index}`} ref={closeBracketButtonRef}
                            onMouseDown={() => handleMouseDown('closeBracket', closeBracketButtonRef)}
                            onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
                            onTouchStart={() => handleMouseDown('closeBracket', closeBracketButtonRef)} onTouchEnd={handleMouseUp}
                            onClick={() => { if (activePopup.name !== 'closeBracket') handleButtonClick(current.value || ''); }}
                            className={`${getButtonClass(btn.type, isShift)} text-lg h-full`}
                            aria-label={ariaLabels[current.label] || current.label} role="gridcell"
                        >
                            {btn.base}
                        </Button>
                    );
                }

                return (
                    <Button 
                        key={`${btn.base}-${index}`} onClick={() => handleButtonClick(current.value || '')} 
                        className={`${getButtonClass(btn.type, isShift)} text-sm h-full`}
                        aria-label={ariaLabels[current.label] || current.label}
                        role="gridcell"
                        dangerouslySetInnerHTML={{ __html: current.label.replace('⁻¹', '<sup>-1</sup>').replace('³√','∛').replace('ʸ√x','<sup>y</sup>√x') }} 
                    />
                );
            })}
        </div>

        {/* --- POPUPS --- */}
        {activePopup.name === 'variable' && (
            <Popup target={activePopup.target} onClose={closeActivePopup} position="top-center">
                <div className="p-1 flex gap-1">
                    {['x', 'y', 'z', 'k', 'h'].map(v => (
                        <button key={v} onClick={() => handlePopupAction(v)} className="flex items-center justify-center w-10 h-10 rounded-md text-xl font-mono font-semibold bg-base-200/50 hover:bg-primary hover:text-white transition-colors no-selection-menu">
                            {v}
                        </button>
                    ))}
                </div>
            </Popup>
        )}
        
        {activePopup.name === 'openBracket' && (
            <Popup target={activePopup.target} onClose={closeActivePopup} position="top-center">
                <div className="p-1 flex gap-1">
                    {['[', '{'].map(b => (
                        <button key={b} onClick={() => handlePopupAction(b)} className="flex items-center justify-center w-10 h-10 rounded-md text-xl font-mono font-semibold bg-base-200/50 hover:bg-primary hover:text-white transition-colors no-selection-menu">
                            {b}
                        </button>
                    ))}
                </div>
            </Popup>
        )}
        
        {activePopup.name === 'closeBracket' && (
            <Popup target={activePopup.target} onClose={closeActivePopup} position="top-center">
                <div className="p-1 flex gap-1">
                    {[']', '}'].map(b => (
                        <button key={b} onClick={() => handlePopupAction(b)} className="flex items-center justify-center w-10 h-10 rounded-md text-xl font-mono font-semibold bg-base-200/50 hover:bg-primary hover:text-white transition-colors no-selection-menu">
                            {b}
                        </button>
                    ))}
                </div>
            </Popup>
        )}

        {activePopup.name === 'memory' && (
            <MemoryPopup target={activePopup.target} onSelect={handlePopupAction} onClose={closeActivePopup} />
        )}

        {activePopup.name === 'angle' && (
            <Popup target={activePopup.target} onClose={closeActivePopup} position="bottom-center">
                <div className="p-1 flex gap-1">
                    {[AngleMode.Rad, AngleMode.Deg, AngleMode.Grad].map(mode => (
                        <button key={mode} onClick={() => { setAngleMode(mode); closeActivePopup(); }} className="flex items-center justify-center w-14 h-10 rounded-md text-sm font-semibold bg-base-200/50 hover:bg-primary hover:text-white transition-colors no-selection-menu">
                            {mode}
                        </button>
                    ))}
                </div>
            </Popup>
        )}

        {activePopup.name === 'format' && (
            <Popup target={activePopup.target} onClose={closeActivePopup} position="bottom-left">
                 <div className="p-2 flex flex-col gap-2 w-[180px]">
                    <div className="flex items-center justify-between gap-2 p-2 border-b border-base-300/50">
                        <label htmlFor="format-digits" className="text-sm font-semibold">
                            {numberFormat === 'fix' ? 'Decimals:' : 'Digits:'}
                        </label>
                        <input
                            id="format-digits" type="number"
                            min={numberFormat === 'fix' ? "0" : "1"} max="40"
                            value={numberFormat === 'fix' ? fixPrecision : autoPrecision}
                            onKeyDown={(e) => e.stopPropagation()}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (!isNaN(val)) {
                                    if(numberFormat === 'fix') setFixPrecision(val); else setAutoPrecision(val);
                                    setIsDigitMode(true);
                                }
                            }}
                            className="w-20 bg-base-200/50 rounded-md p-1 text-center font-mono"
                        />
                    </div>
                    {(['auto', 'sci', 'eng', 'fix'] as NumberFormat[]).map(format => (
                        <button
                            key={format} onClick={() => { setNumberFormat(format); setIsDigitMode(false); }}
                            className={`w-full text-left px-3 py-2 text-sm rounded-md font-semibold transition-colors duration-150 no-selection-menu ${numberFormat === format ? 'bg-primary text-white' : 'hover:bg-base-300/50'}`}
                        >
                            {format.toUpperCase()}
                        </button>
                    ))}
                </div>
            </Popup>
        )}
    </div>
  );
};

export default ScientificCalculator;