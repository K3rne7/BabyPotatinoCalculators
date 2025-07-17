import React, { useState, useEffect, useCallback } from 'react';
import { ConversionCategory } from '../../../types';
import CustomSelect from '../../ui/CustomSelect';

interface BaseConverterProps {
    category: ConversionCategory;
}

const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';

// Robustly converts a string from a given base to a BigInt
const stringToBigInt = (value: string, base: number): bigint => {
    let result = 0n;
    const baseBigInt = BigInt(base);
    for (const char of value.toLowerCase()) {
        const digitValue = DIGITS.indexOf(char);
        if (digitValue === -1 || digitValue >= base) {
            throw new Error('Invalid character for base');
        }
        result = result * baseBigInt + BigInt(digitValue);
    }
    return result;
};


const isValidForBase = (value: string, base: number): boolean => {
    if (value.trim() === '') return true;
    const validChars = DIGITS.slice(0, base);
    return new RegExp(`^[${validChars}]+$`, 'i').test(value);
};

const BaseConverter: React.FC<BaseConverterProps> = ({ category }) => {
    const [fromBase, setFromBase] = useState(10);
    const [toBase, setToBase] = useState(16);
    const [fromValue, setFromValue] = useState('255');
    const [toValue, setToValue] = useState('FF');
    const [error, setError] = useState('');

    const convert = useCallback((value: string, from: number, to: number) => {
        if (value.trim() === '') {
            setError('');
            return '';
        }
        if (!isValidForBase(value, from)) {
            setError(`Invalid number for base ${from}`);
            return '';
        }
        
        setError('');
        try {
            const bigIntValue = stringToBigInt(value, from);
            return bigIntValue.toString(to).toUpperCase();
        } catch (e) {
            setError('Conversion error');
            return '';
        }
    }, []);

    useEffect(() => {
        setToValue(convert(fromValue, fromBase, toBase));
    }, [fromValue, fromBase, toBase, convert]);

    const handleFromValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setFromValue(val);
    };
    
    const handleSwap = () => {
        setFromBase(toBase);
        setToBase(fromBase);
        setFromValue(toValue);
    };

    const baseOptions = Array.from({ length: 35 }, (_, i) => {
        const base = i + 2;
        let label = `Base ${base}`;
        if (base === 2) label += ' (Binary)';
        if (base === 8) label += ' (Octal)';
        if (base === 10) label += ' (Decimal)';
        if (base === 16) label += ' (Hex)';
        return { value: String(base), label };
    });

    const renderInput = (value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => (
         <input
            type="text"
            value={value}
            onChange={onChange}
            onFocus={(e) => e.target.select()}
            className="w-full bg-base-100 rounded-lg p-4 text-2xl md:text-3xl text-right font-mono outline-none focus:ring-2 focus:ring-primary break-all"
            data-keyboard-aware="true"
        />
    );


    return (
        <div className="flex flex-col gap-4">
            <p className="text-sm text-base-content/60 text-center">
                Enter a number in the 'From' field. It will be converted automatically.
            </p>
            {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
            
            <div className="flex flex-col gap-2">
                <label className="font-semibold text-base-content">From</label>
                <CustomSelect
                    value={String(fromBase)}
                    onChange={(val) => setFromBase(parseInt(val, 10))}
                    options={baseOptions}
                    variant="solid"
                    className="justify-center"
                />
                {renderInput(fromValue, handleFromValueChange)}
            </div>
            
            <div className="flex justify-center">
                 <button onClick={handleSwap} className="p-2 rounded-full bg-base-300 hover:bg-primary hover:text-white transition-colors" aria-label="Swap bases">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                </button>
            </div>

            <div className="flex flex-col gap-2">
                <label className="font-semibold text-base-content">To</label>
                 <CustomSelect
                    value={String(toBase)}
                    onChange={(val) => setToBase(parseInt(val, 10))}
                    options={baseOptions}
                    variant="solid"
                    className="justify-center"
                />
                <input
                    type="text"
                    readOnly
                    value={toValue}
                    className="w-full bg-base-100 rounded-lg p-4 text-2xl md:text-3xl text-right font-mono outline-none break-all"
                />
            </div>
        </div>
    );
};

export default BaseConverter;