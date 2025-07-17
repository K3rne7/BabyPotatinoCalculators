import React, { useState, useCallback } from 'react';
import { calculateMarketStats } from '../../lib/finance';

const formatPercent = (value: number | null): string => {
    if (value === null || isNaN(value)) return '---';
    return `${value.toFixed(4)}%`;
};

const MarketAnalysisCalculator: React.FC = () => {
    const [returnsInput, setReturnsInput] = useState('1.2, -0.5, 3.4, 2.1, -1.0, 0.8');
    const [results, setResults] = useState<{
        arithmetic: number | null;
        geometric: number | null;
        volatility: number | null;
    } | null>(null);
    const [error, setError] = useState('');

    const handleCalculate = useCallback(() => {
        setError('');
        const numbers = returnsInput
            .split(/[\s,]+/)
            .filter(n => n.trim() !== '')
            .map(Number);

        if (numbers.some(isNaN)) {
            setError('Dataset contains non-numeric values. Please use only numbers, spaces, and commas.');
            setResults(null);
            return;
        }

        if (numbers.length < 2) {
            setError('Please enter at least two returns to calculate statistics.');
            setResults(null);
            return;
        }

        const stats = calculateMarketStats(numbers);
        setResults(stats);

    }, [returnsInput]);
    
    const ResultItem: React.FC<{ label: string; value: string; description: string; }> = ({ label, value, description }) => (
        <div className="bg-base-100 p-3 rounded-lg text-center flex flex-col">
            <h4 className="text-sm text-base-content/70 font-semibold">{label}</h4>
            <p className="text-3xl font-bold text-primary my-1">{value}</p>
            <p className="text-xs text-base-content/60 mt-auto">{description}</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-xl font-bold">Market Returns Analysis</h3>
                <p className="text-sm text-base-content/70 mt-1">Analyze a series of historical returns for an asset or portfolio.</p>
            </div>
             <div className="bg-base-200 p-4 rounded-xl space-y-4">
                <div>
                    <label htmlFor="returns" className="block text-sm font-semibold text-base-content mb-1">Periodic Returns (%, comma-separated)</label>
                    <textarea
                        id="returns"
                        value={returnsInput}
                        onChange={(e) => setReturnsInput(e.target.value)}
                        placeholder="e.g., 1.5, -0.8, 2.1"
                        className="w-full h-24 bg-base-100 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary text-base-content transition-shadow text-base font-mono"
                        data-keyboard-aware="true"
                    />
                </div>
                <button
                    onClick={handleCalculate}
                    className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-focus font-semibold transition-colors text-lg"
                >
                    Analyze Returns
                </button>
            </div>
             {error && <div className="p-3 bg-red-500/10 text-red-500 rounded-lg text-center font-semibold">{error}</div>}
             {results && (
                <div className="animate-fade-in-up bg-base-200 p-4 rounded-xl">
                     <h3 className="font-bold text-lg mb-3 text-center">Analysis Results</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <ResultItem label="Arithmetic Mean" value={formatPercent(results.arithmetic)} description="The simple average return per period." />
                        <ResultItem label="Geometric Mean" value={formatPercent(results.geometric)} description="The average compound rate of return." />
                        <ResultItem label="Volatility (Std. Dev)" value={formatPercent(results.volatility)} description="Measures the risk or dispersion of returns." />
                     </div>
                </div>
            )}
        </div>
    );
};

export default MarketAnalysisCalculator;