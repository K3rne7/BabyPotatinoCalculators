import React, { useState, useCallback } from 'react';
import { calculateBondMetrics } from '../../lib/finance';
import CustomSelect from '../ui/CustomSelect';

const formatCurrency = (value: number) => {
    if (isNaN(value)) return '---';
    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

const formatNumber = (value: number | null, digits = 4) => {
    if (value === null || isNaN(value)) return '---';
    return value.toFixed(digits);
}

const paymentFrequencyOptions = [
    { value: '1', label: 'Annually' },
    { value: '2', label: 'Semi-Annually' },
    { value: '4', label: 'Quarterly' },
];

interface BondResults {
    price: number;
    macaulayDuration: number | null;
    modifiedDuration: number | null;
    convexity: number | null;
}

const BondCalculator: React.FC = () => {
    const [faceValue, setFaceValue] = useState('1000');
    const [couponRate, setCouponRate] = useState('5');
    const [marketRate, setMarketRate] = useState('4');
    const [term, setTerm] = useState('10');
    const [frequency, setFrequency] = useState('2'); // Semi-Annually
    const [results, setResults] = useState<BondResults | null>(null);
    const [error, setError] = useState('');

    const handleCalculate = useCallback(() => {
        setError('');
        const fv = parseFloat(faceValue);
        const cr = parseFloat(couponRate);
        const mr = parseFloat(marketRate);
        const t = parseFloat(term);
        const freq = parseInt(frequency, 10);

        if (isNaN(fv) || isNaN(cr) || isNaN(mr) || isNaN(t) || fv <= 0 || cr < 0 || mr < 0 || t <= 0) {
            setError('Please enter valid, positive numbers for all fields.');
            setResults(null);
            return;
        }

        const metrics = calculateBondMetrics(fv, cr, mr, t, freq);
        setResults(metrics);

    }, [faceValue, couponRate, marketRate, term, frequency]);

    const InputField: React.FC<{ label: string, value: string, onChange: (val: string) => void, unit: string }> = ({ label, value, onChange, unit }) => (
        <div>
            <label className="block text-sm font-semibold text-base-content mb-1">{label}</label>
            <div className="relative">
                <input
                    type="text" inputMode="decimal" value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="w-full h-12 bg-base-100 rounded-lg text-left font-mono text-xl text-base-content focus:outline-none focus:ring-2 focus:ring-primary px-4 pr-12"
                    data-keyboard-aware="true" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50 font-semibold text-sm">{unit}</span>
            </div>
        </div>
    );
    
    const getPriceDescription = () => {
        if(results === null) return '';
        const fv = parseFloat(faceValue);
        if (Math.abs(results.price - fv) < 0.01) return 'The bond is trading at Par.'
        if (results.price > fv) return 'The bond is trading at a Premium.'
        return 'The bond is trading at a Discount.'
    };
    
    const ResultItem: React.FC<{ label: string; value: string; description: string; }> = ({ label, value, description }) => (
        <div className="bg-base-100 p-3 rounded-lg text-center flex flex-col">
            <h4 className="text-sm text-base-content/70 font-semibold">{label}</h4>
            <p className="text-2xl font-bold text-primary my-1">{value}</p>
            <p className="text-xs text-base-content/60 mt-auto">{description}</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="bg-base-200 p-4 rounded-xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Face Value (Par)" value={faceValue} onChange={setFaceValue} unit="$" />
                    <InputField label="Annual Coupon Rate" value={couponRate} onChange={setCouponRate} unit="%" />
                    <InputField label="Annual Market Rate (YTM)" value={marketRate} onChange={setMarketRate} unit="%" />
                    <InputField label="Years to Maturity" value={term} onChange={setTerm} unit="Yrs" />
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-base-content mb-1">Coupon Payments per Year</label>
                        <CustomSelect value={frequency} onChange={setFrequency} options={paymentFrequencyOptions} variant="solid" />
                    </div>
                </div>
                <button onClick={handleCalculate} className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-focus font-semibold transition-colors text-lg" >
                    Calculate
                </button>
            </div>
            {error && <div className="p-3 bg-red-500/10 text-red-500 rounded-lg text-center font-semibold">{error}</div>}
            {results !== null && (
                <div className="animate-fade-in-up bg-base-200 p-4 rounded-xl space-y-4">
                    <div className="text-center">
                         <h3 className="font-bold text-lg mb-2">Calculated Bond Price</h3>
                         <p className="text-4xl font-mono font-bold text-primary">{`$${formatCurrency(results.price)}`}</p>
                         <p className="text-sm text-base-content/70 mt-1">{getPriceDescription()}</p>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <ResultItem label="Macaulay Duration" value={formatNumber(results.macaulayDuration)} description="Weighted avg. time to receive cash flows (in years)." />
                        <ResultItem label="Modified Duration" value={formatNumber(results.modifiedDuration)} description="Price sensitivity to a 1% change in interest rates." />
                        <ResultItem label="Convexity" value={formatNumber(results.convexity, 2)} description="Measures the curvature of the price-yield relationship." />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BondCalculator;