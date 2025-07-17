import React, { useState, useEffect, useCallback } from 'react';
import { ConversionCategory } from '../../../types';
import CustomSelect from '../../ui/CustomSelect';
import { CURRENCIES } from '../../../lib/currencies';

const LoadingSpinner = () => (
    <div className="w-6 h-6 border-2 border-transparent border-t-primary rounded-full animate-spin"></div>
);

const CurrencyConverter: React.FC<{ category: ConversionCategory }> = ({ category }) => {
    const [fromCurrency, setFromCurrency] = useState('EUR');
    const [toCurrency, setToCurrency] = useState('USD');
    const [fromValue, setFromValue] = useState('100');
    const [toValue, setToValue] = useState('');
    const [activeInput, setActiveInput] = useState<'from' | 'to'>('from');
    
    const [rate, setRate] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const getRate = useCallback(async (from: string, to: string) => {
        if (from === to) {
            setRate(1);
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
            if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.message || `Failed to fetch rates (HTTP ${response.status})`);
            }
            const data = await response.json();
            const rateValue = data.rates[to];
            
            if (typeof rateValue !== 'number') {
                 throw new Error(`Could not find rate for ${to} in the API response.`);
            }
            setRate(rateValue);

        } catch (e: any) {
            console.error(e);
            setError(e.message || 'Failed to fetch exchange rate. Check your internet connection.');
            setRate(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getRate(fromCurrency, toCurrency);
    }, [fromCurrency, toCurrency, getRate]);

    useEffect(() => {
        if (activeInput === 'from' && rate !== null) {
            const val = parseFloat(fromValue);
            if (!isNaN(val)) {
                setToValue(parseFloat((val * rate).toPrecision(6)).toString());
            } else {
                setToValue('');
            }
        }
    }, [fromValue, rate, activeInput]);

    useEffect(() => {
        if (activeInput === 'to' && rate !== null) {
            const val = parseFloat(toValue);
            if (!isNaN(val) && rate !== 0) {
                setFromValue(parseFloat((val / rate).toPrecision(6)).toString());
            } else {
                setFromValue('');
            }
        }
    }, [toValue, rate, activeInput]);
    
    const handleSwap = () => {
        const tempFromValue = fromValue;
        setFromValue(toValue);
        setToValue(tempFromValue);
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const currencyOptions = Object.keys(CURRENCIES).map(key => ({
        value: key,
        label: `${CURRENCIES[key]} (${key})`
    })).sort((a, b) => a.label.localeCompare(b.label));

    const renderPanel = (
        type: 'from' | 'to',
        value: string,
        currency: string,
        onValueChange: (val: string) => void,
        onCurrencyChange: (curr: string) => void
    ) => {
        const isTarget = type !== activeInput;
        return (
            <div 
                className={`flex flex-col gap-2 p-4 rounded-lg transition-all duration-200 h-36
                ${activeInput === type ? 'bg-primary/10 ring-2 ring-primary' : 'bg-base-100 hover:bg-base-200'}`}
            >
                <CustomSelect
                    value={currency}
                    onChange={onCurrencyChange}
                    options={currencyOptions}
                />
                <div className="flex-grow flex items-end justify-end">
                    {isLoading && isTarget ? (
                        <LoadingSpinner />
                    ) : (
                        <input
                            type="text"
                            inputMode="decimal"
                            value={value}
                            onChange={e => onValueChange(e.target.value)}
                            onFocus={(e) => { setActiveInput(type); e.target.select(); }}
                            className="w-full bg-transparent text-4xl text-right font-mono outline-none break-all"
                            placeholder="0"
                            aria-label={`${type} currency value`}
                            data-keyboard-aware="true"
                        />
                    )}
                </div>
            </div>
        );
    };
    
    return (
        <div className="flex flex-col gap-4">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 p-3 rounded-lg text-center text-sm">
                <strong>Disclaimer:</strong> Rates are provided by frankfurter.app and may be delayed. Use for informational purposes only.
            </div>
            {renderPanel('from', fromValue, fromCurrency, setFromValue, setFromCurrency)}
            <div className="flex justify-center -my-2 z-10">
                 <button onClick={handleSwap} className="p-2 rounded-full bg-base-300 hover:bg-primary hover:text-white transition-colors" aria-label="Swap currencies">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                </button>
            </div>
            {renderPanel('to', toValue, toCurrency, setToValue, setToCurrency)}
            {error && <div className="p-3 bg-red-500/10 text-red-500 rounded-lg text-center font-semibold text-sm">{error}</div>}
        </div>
    );
};

export default CurrencyConverter;