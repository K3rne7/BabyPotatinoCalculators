
import React, { useState, useRef } from 'react';
import Button from '../ui/Button';
import Popup from '../ui/Popup';

interface GraphingKeypadProps {
  onKeyPress: (value: string) => void;
  isShift: boolean;
  setIsShift: (value: boolean | ((prev: boolean) => boolean)) => void;
}

const ariaLabels: { [key: string]: string } = {
    '2nd': 'Toggle secondary functions',
    'x²': 'Square', '√': 'Square Root',
    'xʸ': 'Power', 'ʸ√x': 'Nth Root',
    'DEL': 'Delete', 'C': 'Clear',
    'x': 'Variable x',
    '|x|': 'Absolute Value',
    'n!': 'Factorial',
    'sin': 'Sine', 'sin⁻¹': 'Inverse Sine',
    'cos': 'Cosine', 'cos⁻¹': 'Inverse Cosine',
    'tan': 'Tangent', 'tan⁻¹': 'Inverse Tangent',
    '(': 'Open Parenthesis',
    ')': 'Close Parenthesis',
    'π': 'Pi',
    'log': 'Logarithm base 10', '10^x': '10 to the power of x',
    'ln': 'Natural Logarithm', 'e^x': 'e to the power of x',
    '÷': 'Divide', '×': 'Multiply', '+': 'Add', '−': 'Subtract',
    '.': 'Decimal Point'
};


const keypadLayout = [
    // Row 1
    { base: '2nd', value: '2nd', type: 'mod' },
    { base: 'sin', shift: 'sin⁻¹', value: 'sin(', shiftValue: 'asin(', type: 'fn' },
    { base: 'cos', shift: 'cos⁻¹', value: 'cos(', shiftValue: 'acos(', type: 'fn' },
    { base: 'tan', shift: 'tan⁻¹', value: 'tan(', shiftValue: 'atan(', type: 'fn' },
    { base: 'C', value: 'C', type: 'clear' },
    { base: 'DEL', value: 'DEL', type: 'clear' },

    // Row 2
    { base: 'xʸ', shift: 'ʸ√x', value: '^', shiftValue: 'nthRoot(', type: 'fn' },
    { base: 'x²', shift: '√', value: '^2', shiftValue: 'sqrt(', type: 'fn' },
    { base: '7', value: '7', type: 'num' },
    { base: '8', value: '8', type: 'num' },
    { base: '9', value: '9', type: 'num' },
    { base: '÷', value: '÷', type: 'op' },

    // Row 3
    { base: 'log', shift: '10^x', value: 'log10(', shiftValue: '10^', type: 'fn' },
    { base: 'ln', shift: 'e^x', value: 'log(', shiftValue: 'exp(', type: 'fn' },
    { base: '4', value: '4', type: 'num' },
    { base: '5', value: '5', type: 'num' },
    { base: '6', value: '6', type: 'num' },
    { base: '×', value: '×', type: 'op' },

    // Row 4
    { base: '(', value: '(', type: 'fn' },
    { base: ')', value: ')', type: 'fn' },
    { base: '1', value: '1', type: 'num' },
    { base: '2', value: '2', type: 'num' },
    { base: '3', value: '3', type: 'num' },
    { base: '−', value: '−', type: 'op' },
    
    // Row 5
    { base: 'x', shift: '|x|', value: 'x', shiftValue: 'abs(', type: 'var' },
    { base: 'π', shift: 'n!', value: 'π', shiftValue: 'factorial(', type: 'fn' },
    { base: '0', value: '0', type: 'num', className: "col-span-2" },
    { base: '.', value: '.', type: 'num' },
    { base: '+', value: '+', type: 'op' },
];

const GraphingKeypad: React.FC<GraphingKeypadProps> = ({ onKeyPress, isShift, setIsShift }) => {
  const [isVarPopupOpen, setIsVarPopupOpen] = useState(false);
  const varLongPressTimer = useRef<number | undefined>(undefined);
  const varButtonRef = useRef<HTMLButtonElement>(null);

  const handleVarMouseDown = () => {
    varLongPressTimer.current = window.setTimeout(() => {
        setIsVarPopupOpen(true);
    }, 500);
  };

  const handleVarMouseUp = () => {
    if (varLongPressTimer.current) {
      window.clearTimeout(varLongPressTimer.current);
    }
  };
  
  const handleVarPopupSelect = (variable: string) => {
      onKeyPress(variable);
      setIsVarPopupOpen(false);
  }

  const getButtonClass = (btn: typeof keypadLayout[0]) => {
    const type = btn.type;
    switch (type) {
      case 'op': return 'bg-primary/80 hover:bg-primary-focus text-white';
      case 'fn': case 'var': return 'bg-base-300 hover:bg-opacity-80';
      case 'nav': return 'bg-base-300 hover:bg-opacity-80 font-bold';
      case 'clear': return 'bg-secondary hover:bg-opacity-80 text-secondary-content';
      case 'mod': return `font-bold ${isShift ? 'bg-primary text-white' : 'bg-base-300'}`;
      case 'num': return 'bg-base-100 hover:bg-base-300';
      default: return 'bg-base-100 hover:bg-base-300';
    }
  };
  
  return (
    <div className="grid grid-cols-6 gap-1" role="grid">
        {isVarPopupOpen && (
             <Popup target={varButtonRef.current} onClose={() => setIsVarPopupOpen(false)} position="top-center">
                <div className="p-1 flex gap-1">
                    {['x', 'y', 'z', 'k', 'h'].map(v => (
                        <button key={v} onClick={() => handleVarPopupSelect(v)} className="flex items-center justify-center w-10 h-10 rounded-md text-xl font-mono font-semibold bg-base-200 hover:bg-primary hover:text-white transition-colors no-selection-menu">
                            {v}
                        </button>
                    ))}
                </div>
            </Popup>
        )}

        {keypadLayout.map((btn, index) => {
            const current = isShift && btn.shift ? { label: btn.shift, value: btn.shiftValue || btn.value } : { label: btn.base, value: btn.value };
            
            if (btn.type === 'var') {
                return (
                    <Button
                        key={index}
                        ref={varButtonRef}
                        onMouseDown={handleVarMouseDown}
                        onMouseUp={handleVarMouseUp}
                        onMouseLeave={handleVarMouseUp}
                        onTouchStart={handleVarMouseDown}
                        onTouchEnd={handleVarMouseUp}
                        onClick={() => {
                            if (!isVarPopupOpen) {
                                onKeyPress(current.value);
                            }
                        }}
                        className={`${getButtonClass(btn)} h-10 text-base sm:h-12 sm:text-lg font-mono`}
                        aria-label={ariaLabels[current.label] || current.label}
                        role="gridcell"
                        dangerouslySetInnerHTML={{ __html: current.label }}
                    >
                    </Button>
                );
            }

            return (
                <Button
                    key={index}
                    onClick={() => btn.type === 'mod' ? setIsShift(p => !p) : onKeyPress(current.value)}
                    className={`${getButtonClass(btn)} h-10 text-base sm:h-12 sm:text-lg ${btn.className || ''}`}
                    aria-label={ariaLabels[current.label] || current.label}
                    aria-pressed={btn.type === 'mod' ? isShift : undefined}
                    role="gridcell"
                    dangerouslySetInnerHTML={{ __html: current.label.replace('⁻¹', '<sup>-1</sup>').replace('ʸ√x', '<sup>y</sup>√x') }}
                >
                </Button>
            );
        })}
    </div>
  );
};

export default GraphingKeypad;
