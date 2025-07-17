
import React, { useState, useCallback } from 'react';
import { calculateCompoundInterest } from '../../lib/finance';
import CustomSelect from '../ui/CustomSelect';

const formatCurrency = (value: number) => {
    if (isNaN(value)) return '---';
    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

const compoundingOptions = [
    { value: '1', label: 'Annually' },
    { value: '2', label: 'Semi-Annually' },
    { value: '4', label: 'Quarterly' },
    { value: '12', label: 'Monthly' },
    { value: '365', label: 'Daily' },
    { value: '0', label: 'Continuously' }, // Special value for continuous
];

const CompoundInterestCalculator: React.FC = () => {
    const [principal, setPrincipal] = useState('10000');
    const [rate, setRate] = useState('5');
    const [term, setTerm] = useState('10');
    const [compounding, setCompounding] = useState('12'); // Monthly
    const [results, setResults] = useState<{ futureValue: number; totalInterest: number } | null>(null);
    const [error, setError] = useState('');

    const handleCalculate = useCallback(() => {
        setError('');
        const p = parseFloat(principal);
        const r = parseFloat(rate);
        const t = parseFloat(term);
        const c = parseInt(compounding, 10);

        if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r < 0 || t <= 0) {
            setError('Please enter valid, positive numbers for all fields.');
            setResults(null);
            return;
        }

        const calcResults = calculateCompoundInterest(p, r, t, c);
        setResults(calcResults);

    }, [principal, rate, term, compounding]);
    
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

    return (
        <div className="space-y-6">
            <div className="bg-base-200 p-4 rounded-xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Principal Amount" value={principal} onChange={setPrincipal} unit="$" />
                    <InputField label="Annual Interest Rate" value={rate} onChange={setRate} unit="%" />
                    <InputField label="Time Period" value={term} onChange={setTerm} unit="Years" />
                    <div>
                        <label className="block text-sm font-semibold text-base-content mb-1">Compounding Frequency</label>
                        <CustomSelect value={compounding} onChange={setCompounding} options={compoundingOptions} variant="solid" />
                    </div>
                </div>
                 <button
                    onClick={handleCalculate}
                    className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-focus font-semibold transition-colors text-lg"
                >
                    Calculate
                </button>
            </div>
             {error && <div className="p-3 bg-red-500/10 text-red-500 rounded-lg text-center font-semibold">{error}</div>}
             {results && (
                <div className="animate-fade-in-up bg-base-200 p-4 rounded-xl">
                    <h3 className="font-bold text-lg mb-3 text-center">Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-base-100 p-3 rounded-lg text-center">
                            <h4 className="text-sm text-base-content/70">Future Value</h4>
                            <p className="text-3xl font-bold text-primary my-1">{`$${formatCurrency(results.futureValue)}`}</p>
                        </div>
                        <div className="bg-base-100 p-3 rounded-lg text-center">
                            <h4 className="text-sm text-base-content/70">Total Interest Earned</h4>
                            <p className="text-3xl font-bold text-green-500 my-1">{`$${formatCurrency(results.totalInterest)}`}</p>
                        </div>
                    </div>
                </div>
             )}
        </div>
    );
};

export default CompoundInterestCalculator;
