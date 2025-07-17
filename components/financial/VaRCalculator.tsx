import React, { useState, useCallback } from 'react';
import { calculateVaR } from '../../lib/finance';
import CustomSelect from '../ui/CustomSelect';

const formatCurrency = (value: number | null) => {
    if (value === null || isNaN(value)) return '---';
    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

type VaRMethod = 'historic' | 'parametric';

const confidenceOptions = [
    { value: '90', label: '90%' },
    { value: '95', label: '95%' },
    { value: '99', label: '99%' },
];

const VaRCalculator: React.FC = () => {
    const [returnsInput, setReturnsInput] = useState('1.2, -0.5, 3.4, 2.1, -1.0, 0.8, -2.5, 1.5');
    const [portfolioValue, setPortfolioValue] = useState('1000000');
    const [confidence, setConfidence] = useState('95');
    const [method, setMethod] = useState<VaRMethod>('historic');
    const [result, setResult] = useState<number | null>(null);
    const [error, setError] = useState('');

    const handleCalculate = useCallback(() => {
        setError('');
        const pValue = parseFloat(portfolioValue);
        const cLevel = parseInt(confidence, 10);
        
        const numbers = returnsInput
            .split(/[\s,]+/)
            .filter(n => n.trim() !== '')
            .map(Number);

        if (numbers.some(isNaN)) {
            setError('Returns data contains non-numeric values.');
            setResult(null);
            return;
        }
        if (isNaN(pValue) || pValue <= 0) {
            setError('Please enter a valid, positive portfolio value.');
            setResult(null);
            return;
        }
        if (numbers.length < 10 && method === 'historic') {
            setError('Historic VaR requires at least 10 data points for meaningful results.');
            setResult(null);
            return;
        }

        const varResult = calculateVaR(numbers, pValue, cLevel, method);
        setResult(varResult);

    }, [returnsInput, portfolioValue, confidence, method]);

    return (
        <div className="space-y-6">
             <div className="text-center">
                <h3 className="text-xl font-bold">Value at Risk (VaR)</h3>
                <p className="text-sm text-base-content/70 mt-1">Estimate the potential loss in value of a portfolio over a defined period for a given confidence interval.</p>
            </div>
            <div className="bg-base-200 p-4 rounded-xl space-y-4">
                 <div>
                    <label htmlFor="returns-var" className="block text-sm font-semibold text-base-content mb-1">Periodic Returns (%, comma-separated)</label>
                    <textarea
                        id="returns-var" value={returnsInput} onChange={(e) => setReturnsInput(e.target.value)}
                        className="w-full h-24 bg-base-100 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                        data-keyboard-aware="true"
                    />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-base-content mb-1">Portfolio Value</label>
                        <div className="relative">
                           <input type="text" inputMode="decimal" value={portfolioValue} onChange={e => setPortfolioValue(e.target.value)} onFocus={e => e.target.select()} className="w-full h-12 bg-base-100 rounded-lg font-mono text-xl px-4 pr-8" data-keyboard-aware="true"/>
                           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50 font-semibold text-xl">$</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-base-content mb-1">Confidence Level</label>
                         <CustomSelect value={confidence} onChange={setConfidence} options={confidenceOptions} variant="solid" />
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-semibold text-base-content mb-2">Calculation Method</label>
                    <div className="flex bg-base-100 rounded-lg p-1 gap-1">
                        <button onClick={() => setMethod('historic')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${method === 'historic' ? 'bg-accent/80 text-black' : 'hover:bg-base-300/50'}`}>Historic</button>
                        <button onClick={() => setMethod('parametric')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${method === 'parametric' ? 'bg-accent/80 text-black' : 'hover:bg-base-300/50'}`}>Parametric</button>
                    </div>
                </div>
                <button onClick={handleCalculate} className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-focus font-semibold text-lg">
                    Calculate VaR
                </button>
            </div>
            {error && <div className="p-3 bg-red-500/10 text-red-500 rounded-lg text-center font-semibold">{error}</div>}
            {result !== null && (
                <div className="animate-fade-in-up bg-base-200 p-4 rounded-xl text-center">
                    <h3 className="font-bold text-lg mb-2">Value at Risk ({confidence}%)</h3>
                    <p className="text-4xl font-mono font-bold text-red-500">{`$${formatCurrency(result)}`}</p>
                    <p className="text-sm text-base-content/70 mt-1">
                        With {confidence}% confidence, your portfolio's maximum expected loss in one period is {formatCurrency(result)}.
                    </p>
                </div>
            )}
        </div>
    );
};

export default VaRCalculator;