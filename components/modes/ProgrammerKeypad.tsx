

import React, { useState } from 'react';
import Button from '../ui/Button';
import { useProgrammerContext } from '../../hooks/useProgrammerContext';

const keypadLayout = [
    { key: '2nd', base: '2nd' }, { key: 'lsl', base: 'LSL', shift: 'LSR', op: true }, { key: 'or', base: 'OR', shift: 'ROR', op: true }, { key: 'xor', base: 'XOR', shift: 'ROL', op: true }, { key: 'not', base: 'NOT', op: true }, { key: 'and', base: 'AND', op: true },
    { key: 'A', base: 'A' }, { key: 'B', base: 'B' }, { key: '7', base: '7' }, { key: '8', base: '8' }, { key: '9', base: '9' }, { key: 'DEL', base: 'DEL' },
    { key: 'C', base: 'C' }, { key: 'D', base: 'D' }, { key: '4', base: '4' }, { key: '5', base: '5' }, { key: '6', base: '6' }, { key: 'AC', base: 'AC' },
    { key: 'E', base: 'E' }, { key: 'F', base: 'F' }, { key: '1', base: '1' }, { key: '2', base: '2' }, { key: '3', base: '3' }, { key: '=', base: '=' },
    { key: '0', base: '0', className: 'col-span-6' }
];

const ariaLabels: { [key: string]: string } = {
  'LSL': 'Logical Shift Left', 'LSR': 'Logical Shift Right',
  'ROL': 'Rotate Left', 'ROR': 'Rotate Right',
  'OR': 'Bitwise OR', 'XOR': 'Bitwise XOR',
  'NOT': 'Bitwise NOT', 'AND': 'Bitwise AND',
  'DEL': 'Delete', 'AC': 'All Clear',
  '=': 'Equals', '2nd': 'Toggle secondary functions'
};

const ProgrammerKeypad: React.FC = () => {
    const { handleProgrammerKeyClick, programmerBase } = useProgrammerContext();
    const [isShift, setIsShift] = useState(false);

    const isEnabled = (btn: string): boolean => {
        if (['DEL', 'AC', '=', 'AND', 'OR', 'XOR', 'NOT', 'LSL', 'LSR', 'ROL', 'ROR'].includes(btn)) {
            return true;
        }
        const value = parseInt(btn, 16);
        return !isNaN(value) && value < programmerBase;
    };

    const getButtonClass = (btn: { base: string, op?: boolean }) => {
        if (btn.base === '=') return 'btn-glass-primary';
        if (['AC', 'DEL'].includes(btn.base)) return 'btn-glass-secondary';
        if (btn.op) return 'bg-base-300/70 text-sm';
        if (btn.base === '2nd') return isShift ? 'bg-primary text-white' : 'bg-base-300/70';
        return 'bg-base-300/50';
    };

    return (
        <div className="flex flex-col gap-1">
            <div className="grid grid-cols-6 gap-1" role="grid">
                {keypadLayout.map((btnConfig) => {
                    const { key, base, shift, op, className } = btnConfig;
                    
                    const currentLabel = isShift && shift ? shift : base;
                    const enabled = isEnabled(currentLabel);

                    if (base === '2nd') {
                        return (
                             <Button
                                key={key}
                                onClick={() => setIsShift(p => !p)}
                                className={`h-12 text-base md:text-lg ${getButtonClass({base})}`}
                                aria-pressed={isShift}
                                aria-label={ariaLabels['2nd']}
                                role="gridcell"
                            >
                                2nd
                            </Button>
                        );
                    }

                    return (
                        <Button
                            key={key}
                            onClick={() => handleProgrammerKeyClick(currentLabel)}
                            className={`
                                h-12 text-base md:text-lg
                                ${getButtonClass({ base, op })}
                                ${!enabled ? 'opacity-30 cursor-not-allowed' : ''}
                                ${className || ''}
                            `}
                            disabled={!enabled}
                            aria-label={ariaLabels[currentLabel] || `Button ${currentLabel}`}
                            role="gridcell"
                        >
                            {currentLabel}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgrammerKeypad;