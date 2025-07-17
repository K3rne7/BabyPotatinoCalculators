
import React, { useState, useCallback } from 'react';
import { calculateFrenchAmortization, calculateItalianAmortization, AmortizationRow, LoanSummary } from '../../lib/finance';
import AmortizationTable from './AmortizationTable';

type AmortizationType = 'french' | 'italian';

const formatCurrency = (value: number) => {
    if (isNaN(value)) return '---';
    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

const LoanCalculator: React.FC = () => {
    const [principal, setPrincipal] = useState('100000');
    const [rate, setRate] = useState('3.5');
    const [term, setTerm] = useState('30');
    const [amortizationType, setAmortizationType] = useState<AmortizationType>('french');
    const [results, setResults] = useState<{ schedule: AmortizationRow[], summary: LoanSummary } | null>(null);
    const [error, setError] = useState('');

    const handleCalculate = useCallback(() => {
        setError('');
        const p = parseFloat(principal);
        const r = parseFloat(rate);
        const t = parseFloat(term);

        if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r < 0 || t <= 0) {
            setError('Please enter valid, positive numbers for all fields.');
            setResults(null);
            return;
        }

        const calcResults = amortizationType === 'french'
            ? calculateFrenchAmortization(p, r, t)
            : calculateItalianAmortization(p, r, t);
        
        setResults(calcResults);

    }, [principal, rate, term, amortizationType]);

    const InputField: React.FC<{ label: string, value: string, onChange: (val: string) => void, unit: string }> = ({ label, value, onChange, unit }) => (
        <div>
            <label className="block text-sm font-semibold text-base-content mb-1">{label}</label>
            <div className="relative">
                <input
                    type="text"
                    inputMode="decimal"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="w-full h-12 bg-base-100 rounded-lg text-left font-mono text-xl text-base-content focus:outline-none focus:ring-2 focus:ring-primary px-4 pr-12"
                    data-keyboard-aware="true"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50 font-semibold text-sm">{unit}</span>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="bg-base-200 p-4 rounded-xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField label="Loan Amount" value={principal} onChange={setPrincipal} unit="$" />
                    <InputField label="Annual Interest Rate" value={rate} onChange={setRate} unit="%" />
                    <InputField label="Loan Term" value={term} onChange={setTerm} unit="Years" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-base-content mb-2">Amortization Type</label>
                    <div className="flex bg-base-100 rounded-lg p-1 gap-1">
                        <button onClick={() => setAmortizationType('french')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${amortizationType === 'french' ? 'bg-accent/80 text-black' : 'hover:bg-base-300/50'}`}>French (Fixed Payment)</button>
                        <button onClick={() => setAmortizationType('italian')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${amortizationType === 'italian' ? 'bg-accent/80 text-black' : 'hover:bg-base-300/50'}`}>Italian (Fixed Principal)</button>
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
                <div className="animate-fade-in-up">
                    <div className="bg-base-200 p-4 rounded-xl text-center">
                        <h3 className="font-bold text-lg mb-3">Loan Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-base-100 p-3 rounded-lg">
                                <h4 className="text-sm text-base-content/70">Monthly Payment</h4>
                                <p className="text-2xl font-bold text-primary">
                                    {results.summary.monthlyPayment === -1 ? 'Varies' : `$${formatCurrency(results.summary.monthlyPayment)}`}
                                </p>
                            </div>
                            <div className="bg-base-100 p-3 rounded-lg">
                                <h4 className="text-sm text-base-content/70">Total Interest</h4>
                                <p className="text-2xl font-bold text-red-500">{`$${formatCurrency(results.summary.totalInterest)}`}</p>
                            </div>
                            <div className="bg-base-100 p-3 rounded-lg">
                                <h4 className="text-sm text-base-content/70">Total Paid</h4>
                                <p className="text-2xl font-bold">{`$${formatCurrency(results.summary.totalPayment)}`}</p>
                            </div>
                        </div>
                    </div>
                    <AmortizationTable schedule={results.schedule} />
                </div>
            )}
        </div>
    );
};

export default LoanCalculator;
