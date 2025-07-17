
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ConversionCategory, Unit, ConversionType } from '../../types';
import { conversionCategories, conversionFormulas } from '../../lib/conversions';
import ConverterKeypad from './ConverterKeypad';
import CustomSelect from '../ui/CustomSelect';

interface UnitConverterProps {
  categoryKey: string;
}

const SwapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
)

const UnitConverter: React.FC<UnitConverterProps> = ({ categoryKey }) => {
    const category = conversionCategories[categoryKey] as ConversionCategory & { units: Record<string, Unit>, baseUnit?: string};
    const containerRef = useRef<HTMLDivElement>(null);

    // This function is now only for lazy initialization of state.
    // It runs once when the component mounts.
    const getInitialUnits = () => {
        const unitKeys = Object.keys(category.units);
        const saved = localStorage.getItem(`converter-units-${categoryKey}`);
        if(saved) {
            try {
                const {from, to} = JSON.parse(saved);
                if(unitKeys.includes(from) && unitKeys.includes(to)) {
                    return { from, to };
                }
            } catch (e) {
                console.error("Failed to parse saved unit preferences:", e);
            }
        }
        return { from: unitKeys[0], to: unitKeys[1] || unitKeys[0]};
    };

    const [fromUnit, setFromUnit] = useState<string>(() => getInitialUnits().from);
    const [toUnit, setToUnit] = useState<string>(() => getInitialUnits().to);
    
    const [fromValue, setFromValue] = useState<string>('1');
    const [toValue, setToValue] = useState<string>('');
    const [activeInput, setActiveInput] = useState<'from' | 'to'>('from');

    const performConversion = useCallback((valueStr: string, from: string, to: string, cat: typeof category): string => {
        if (!cat || !cat.units || !cat.units[from] || !cat.units[to]) {
            return ''; 
        }

        const value = parseFloat(valueStr);
        if (isNaN(value) || valueStr.trim() === '' || valueStr.endsWith('.')) {
            return '';
        }

        let result: number;
        if (cat.type === ConversionType.FUNCTIONAL && cat.convert) {
            result = cat.convert(value, from, to);
        } else { // Standard conversion
            result = conversionFormulas.standard(value, cat.units[from], cat.units[to]);
        }

        if (isNaN(result)) return 'Error';

        // Use scientific notation for very large or very small numbers
        if (Math.abs(result) > 1e9 || (Math.abs(result) < 1e-6 && result !== 0)) {
            return result.toExponential(6);
        }

        return parseFloat(result.toPrecision(12)).toString();

    }, []);

    useEffect(() => {
        containerRef.current?.focus();
        // Perform initial conversion on mount
        const result = performConversion(fromValue, fromUnit, toUnit, category);
        setToValue(result);
        // This effect runs only on mount, so dependencies are stable.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        localStorage.setItem(`converter-units-${categoryKey}`, JSON.stringify({ from: fromUnit, to: toUnit }));
    }, [fromUnit, toUnit, categoryKey]);
    
    useEffect(() => {
        if(activeInput === 'from') {
           const result = performConversion(fromValue, fromUnit, toUnit, category);
           setToValue(result);
        }
    }, [fromValue, fromUnit, toUnit, activeInput, performConversion, category]);
    
    useEffect(() => {
        if(activeInput === 'to') {
            const result = performConversion(toValue, toUnit, fromUnit, category);
            setFromValue(result);
        }
    }, [toValue, fromUnit, toUnit, activeInput, performConversion, category]);

    const handleKeypadPress = useCallback((key: string) => {
        const currentVal = activeInput === 'from' ? fromValue : toValue;
        const setter = activeInput === 'from' ? setFromValue : setToValue;
        
        if (key === 'AC') {
            setter('0');
        } else if (key === 'DEL') {
            setter(currentVal.slice(0, -1) || '0');
        } else if (key === '.' && currentVal.includes('.')) {
            return;
        } else {
            if (currentVal === '0' && key !== '.') {
                setter(key);
            } else {
                 if (currentVal.length < 15) {
                    setter(currentVal + key);
                 }
            }
        }
    }, [activeInput, fromValue, toValue]);
    
    const handleSwap = useCallback(() => {
        const oldFromUnit = fromUnit;
        setFromUnit(toUnit);
        setToUnit(oldFromUnit);
        setActiveInput('from'); 
    }, [fromUnit, toUnit]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        e.preventDefault();
        const key = e.key;

        if (/[0-9.]/.test(key)) {
            handleKeypadPress(key);
        } else if (key === 'Backspace') {
            handleKeypadPress('DEL');
        } else if (key === 'Escape') {
            handleKeypadPress('AC');
        } else if (key === 'ArrowUp' || key === 'ArrowDown') {
            setActiveInput(prev => prev === 'from' ? 'to' : 'from');
        } else if (key === 'Enter') {
            handleSwap();
        }
    }, [handleKeypadPress, handleSwap]);

    const renderUnitPanel = (
        type: 'from' | 'to',
        value: string,
        unitKey: string,
        onUnitChange: (key: string) => void
    ) => {
        const isActive = activeInput === type;
        const unitOptions = Object.keys(category.units).map(key => ({
            value: key,
            label: category.units[key].name,
        }));

        return (
            <div 
                className={`flex flex-col gap-2 p-3 rounded-lg transition-all duration-200 cursor-pointer h-32
                ${isActive ? 'bg-primary/10 ring-2 ring-primary' : 'bg-base-200/50 hover:bg-base-200/80'}`}
                onClick={() => setActiveInput(type)}
            >
                <CustomSelect
                    value={unitKey}
                    onChange={onUnitChange}
                    options={unitOptions}
                />
                <div className="flex-grow flex items-end">
                     <div
                        role="textbox"
                        aria-readonly="true"
                        aria-label={`${type} value is ${value || '0'}`}
                        className="w-full bg-transparent text-4xl lg:text-5xl text-right font-mono outline-none break-all"
                     >
                        {value || '0'}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div 
            ref={containerRef}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className="flex flex-col gap-4 outline-none"
            aria-label={`Unit converter for ${category.name}. Use arrow keys to switch input fields.`}
        >
            <div className="flex-grow flex flex-col justify-center gap-4">
                 {renderUnitPanel('from', fromValue, fromUnit, setFromUnit)}
                 <div className="flex justify-center -my-2">
                     <button onClick={handleSwap} className="p-2 rounded-full bg-base-300/50 hover:bg-primary hover:text-white transition-colors btn-glass" aria-label="Swap units">
                         <SwapIcon />
                     </button>
                 </div>
                 {renderUnitPanel('to', toValue, toUnit, setToUnit)}
            </div>
            <div className="flex-shrink-0">
                <ConverterKeypad onKeyPress={handleKeypadPress} />
            </div>
        </div>
    );
};

export default UnitConverter;