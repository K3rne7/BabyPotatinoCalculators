


import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import ConverterKeypad from '../ConverterKeypad';

type LogicOperation = 'AND' | 'OR' | 'XOR' | 'NOT' | 'NAND' | 'NOR';

const LogicConverter: React.FC = () => {
    const [opA, setOpA] = useState('255');
    const [opB, setOpB] = useState('170');
    const [operation, setOperation] = useState<LogicOperation>('AND');
    const [activeOperand, setActiveOperand] = useState<'A' | 'B'>('A');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      containerRef.current?.focus();
    }, []);

    const result = useMemo(() => {
        const a = parseInt(opA, 10) || 0;
        const b = parseInt(opB, 10) || 0;

        let res: number;
        switch (operation) {
            case 'AND': res = a & b; break;
            case 'OR':  res = a | b; break;
            case 'XOR': res = a ^ b; break;
            case 'NOT': res = ~a; break; // NOT only uses operand A
            case 'NAND': res = ~(a & b); break;
            case 'NOR': res = ~(a | b); break;
            default: res = 0;
        }
        return res | 0;

    }, [opA, opB, operation]);
    
    const toBinary = (num: number | string, pad = 8): string => {
        let n = typeof num === 'string' ? (parseInt(num, 10) || 0) : num;
        return (n >>> 0).toString(2).padStart(pad, '0');
    };
    
    const operations: LogicOperation[] = ['AND', 'OR', 'XOR', 'NOT', 'NAND', 'NOR'];
    const needsSecondOperand = !['NOT'].includes(operation);

    const handleKeypadPress = useCallback((key: string) => {
        if (key === '.') return;

        const setter = activeOperand === 'A' ? setOpA : setOpB;
        const currentVal = activeOperand === 'A' ? opA : opB;

        if (key === 'AC') {
            setter('0');
        } else if (key === 'DEL') {
            setter(currentVal.slice(0, -1) || '0');
        } else {
            if (currentVal === '0') {
                setter(key);
            } else {
                 if (currentVal.length < 10) {
                    setter(currentVal + key);
                 }
            }
        }
    }, [activeOperand, opA, opB]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        e.preventDefault();
        if (/[0-9]/.test(e.key)) {
            handleKeypadPress(e.key);
        } else if (e.key === 'Backspace') {
            handleKeypadPress('DEL');
        } else if (e.key === 'Escape') {
            handleKeypadPress('AC');
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            if (!needsSecondOperand) return;
            setActiveOperand(prev => prev === 'A' ? 'B' : 'A');
        }
    }, [handleKeypadPress, needsSecondOperand]);

    const OperandPanel: React.FC<{
        label: string;
        value: string;
        binaryValue: string;
        isActive: boolean;
        onClick: () => void;
        isDisabled?: boolean;
    }> = ({ label, value, binaryValue, isActive, onClick, isDisabled = false }) => {
        const activeClasses = isActive ? 'bg-primary/10 ring-2 ring-primary' : 'bg-base-100 hover:bg-base-200';
        const disabledClasses = isDisabled ? 'opacity-40 cursor-not-allowed' : '';

        return (
            <button
                onClick={!isDisabled ? onClick : undefined}
                disabled={isDisabled}
                aria-pressed={isActive}
                className={`flex flex-col gap-2 p-3 rounded-lg transition-all duration-200 h-28 text-left ${activeClasses} ${disabledClasses}`}
            >
                <label className="font-semibold text-sm opacity-70 pointer-events-none">{label}</label>
                <div className="flex-grow flex items-end justify-end">
                    <p className="w-full text-4xl text-right font-mono outline-none break-all pointer-events-none">
                        {value || '0'}
                    </p>
                </div>
                 <p className="text-xs font-mono text-right opacity-50 -mt-1 pointer-events-none">{binaryValue}</p>
            </button>
        )
    };

    return (
        <div 
            ref={containerRef}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className="flex flex-col gap-4 text-base-content outline-none"
            aria-label="Logic Gate Calculator. Use arrow keys to switch active operand."
        >
            <div className="flex-grow space-y-4 flex flex-col">
                <OperandPanel
                    label="Operand A"
                    value={opA}
                    binaryValue={toBinary(opA)}
                    isActive={activeOperand === 'A'}
                    onClick={() => setActiveOperand('A')}
                />

                <div className="flex flex-col items-center gap-2 -my-2">
                    <div className="p-1 bg-base-200 rounded-lg flex flex-wrap gap-1 justify-center">
                        {operations.map(op => (
                            <button key={op} onClick={() => setOperation(op)} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${operation === op ? 'bg-primary text-white' : 'hover:bg-base-300'}`}>
                                {op}
                            </button>
                        ))}
                    </div>
                </div>

                <OperandPanel
                    label="Operand B"
                    value={opB}
                    binaryValue={toBinary(opB)}
                    isActive={activeOperand === 'B'}
                    onClick={() => setActiveOperand('B')}
                    isDisabled={!needsSecondOperand}
                />
            
                <div className="border-t border-base-300 my-1"></div>

                <div className="space-y-1 text-center">
                    <label className="font-bold text-lg">Result</label>
                    <p className="text-primary text-3xl font-mono font-bold">{result}</p>
                    <p className="text-md font-mono opacity-70">{toBinary(result, 32)}</p>
                </div>
            </div>
            
            <div className="flex-shrink-0">
                <ConverterKeypad onKeyPress={handleKeypadPress} />
            </div>
        </div>
    );
};

export default LogicConverter;
