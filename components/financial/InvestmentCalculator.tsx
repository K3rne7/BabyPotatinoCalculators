import React, { useState, useCallback } from 'react';
import { calculateNPV, calculateIRR, calculatePaybackPeriod, calculateMIRR } from '../../lib/finance';

const formatCurrency = (value: number) => {
    if (isNaN(value)) return '---';
    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

const formatYears = (years: number | null): string => {
    if (years === null || isNaN(years)) return 'N/A';
    return `${years.toFixed(2)} years`;
};

const InvestmentCalculator: React.FC = () => {
    const [cashFlowsInput, setCashFlowsInput] = useState('-1000, 300, 300, 300, 300');
    const [discountRate, setDiscountRate] = useState('8');
    const [financeRate, setFinanceRate] = useState('6');
    const [reinvestRate, setReinvestRate] = useState('7');
    const [results, setResults] = useState<{
        npv: number;
        irr: number | null;
        mirr: number | null;
        payback: { simple: number | null; discounted: number | null; };
    } | null>(null);
    const [error, setError] = useState('');

    const handleCalculate = useCallback(() => {
        setError('');
        const dRate = parseFloat(discountRate);
        const fRate = parseFloat(financeRate);
        const rRate = parseFloat(reinvestRate);
        const cashFlows = cashFlowsInput
            .split(',')
            .map(cf => parseFloat(cf.trim()))
            .filter(cf => !isNaN(cf));

        if (isNaN(dRate) || dRate < 0 || isNaN(fRate) || fRate < 0 || isNaN(rRate) || rRate < 0) {
            setError('Please enter valid, non-negative rates.');
            setResults(null);
            return;
        }

        if (cashFlows.length < 2 || cashFlows[0] >= 0) {
            setError('Please provide at least two cash flows, starting with a negative initial investment.');
            setResults(null);
            return;
        }

        const npv = calculateNPV(dRate, cashFlows);
        const irr = calculateIRR(cashFlows);
        const mirr = calculateMIRR(cashFlows, fRate, rRate);
        const payback = calculatePaybackPeriod(cashFlows[0], cashFlows.slice(1), dRate);

        setResults({ npv, irr, mirr, payback });

    }, [cashFlowsInput, discountRate, financeRate, reinvestRate]);

    const ResultItem: React.FC<{ label: string; value: string; description: string; }> = ({ label, value, description }) => (
        <div className="bg-base-100 p-3 rounded-lg text-center flex flex-col">
            <h4 className="text-sm text-base-content/70 font-semibold">{label}</h4>
            <p className="text-3xl font-bold text-primary my-1">{value}</p>
            <p className="text-xs text-base-content/60 mt-auto">{description}</p>
        </div>
    );
    
    const RateInput: React.FC<{label: string, value: string, onChange: (v:string) => void}> = ({label, value, onChange}) => (
        <div>
            <label className="block text-xs font-semibold text-base-content mb-1">{label}</label>
            <div className="relative">
                <input type="text" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} onFocus={(e) => e.target.select()} className="w-full h-10 bg-base-100 rounded-lg text-left font-mono text-lg px-3 pr-8" data-keyboard-aware="true" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 font-semibold text-sm">%</span>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="bg-base-200 p-4 rounded-xl space-y-4">
                <div>
                    <label htmlFor="cashflows" className="block text-sm font-semibold text-base-content mb-1">Cash Flows (comma-separated)</label>
                    <textarea id="cashflows" value={cashFlowsInput} onChange={(e) => setCashFlowsInput(e.target.value)} placeholder="e.g., -1000, 300, 300, 350, 400" className="w-full h-24 bg-base-100 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary text-base-content transition-shadow text-base font-mono" data-keyboard-aware="true" />
                     <p className="text-xs text-base-content/60 mt-1">The first value should be the initial investment (negative).</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <RateInput label="Discount Rate (for NPV)" value={discountRate} onChange={setDiscountRate} />
                    <RateInput label="Finance Rate (for MIRR)" value={financeRate} onChange={setFinanceRate} />
                    <RateInput label="Reinvestment Rate (for MIRR)" value={reinvestRate} onChange={setReinvestRate} />
                </div>
                <button onClick={handleCalculate} className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-focus font-semibold transition-colors text-lg" >
                    Calculate
                </button>
            </div>
            {error && <div className="p-3 bg-red-500/10 text-red-500 rounded-lg text-center font-semibold">{error}</div>}
            {results && (
                <div className="animate-fade-in-up bg-base-200 p-4 rounded-xl">
                    <h3 className="font-bold text-lg mb-3 text-center">Results</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ResultItem label="Net Present Value (NPV)" value={`$${formatCurrency(results.npv)}`} description="If > 0, the investment is profitable at this discount rate." />
                        <ResultItem label="Internal Rate of Return (IRR)" value={results.irr !== null ? `${formatCurrency(results.irr)}%` : 'N/A'} description="The project's expected rate of return. Accept if IRR > cost of capital." />
                        <ResultItem label="Modified IRR (MIRR)" value={results.mirr !== null ? `${formatCurrency(results.mirr)}%` : 'N/A'} description="More realistic return rate assuming different finance/reinvestment rates." />
                         <ResultItem label="Payback Period" value={formatYears(results.payback.simple)} description="Time to recover initial investment (ignores time value of money)." />
                         <ResultItem label="Discounted Payback Period" value={formatYears(results.payback.discounted)} description="Time to recover investment considering the time value of money." />
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvestmentCalculator;