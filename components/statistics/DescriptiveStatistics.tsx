
import React, { useState, useCallback } from 'react';
import type { DescriptiveStatisticsResults } from '../../types';
import { calculateDescriptiveStatistics } from '../../lib/statistics';
import HistogramChart from './HistogramChart';
import BoxPlotChart from './BoxPlotChart';
import CustomSelect from '../ui/CustomSelect';

const formatNumber = (num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(num)) return 'N/A';
    // Format to max 4 decimal places and remove trailing zeros.
    return Number(num.toFixed(4)).toString();
};

const calculationModeOptions = [
    { value: 'simple', label: 'Simple Statistics' },
    { value: 'weighted', label: 'Weighted Mean' },
];

const DescriptiveStatistics: React.FC = () => {
    const [dataInput, setDataInput] = useState<string>('8, 2, 7, 5, 8, 4, 7, 6, 9, 7');
    const [weightsInput, setWeightsInput] = useState<string>('1, 1, 1, 1, 1, 1, 1, 1, 1, 1');
    const [mode, setMode] = useState('simple');
    const [results, setResults] = useState<DescriptiveStatisticsResults | null>(null);
    const [error, setError] = useState<string>('');

    const calculateStats = useCallback(() => {
        setError('');
        setResults(null);

        const numbers = dataInput.split(/[\s,]+/).filter(n => n.trim() !== '').map(Number);
        const weights = weightsInput.split(/[\s,]+/).filter(w => w.trim() !== '').map(Number);

        if (numbers.some(isNaN) || (mode === 'weighted' && weights.some(isNaN))) {
            setError('Dataset or weights contain non-numeric values.');
            return;
        }

        if (numbers.length < 2) {
            setError('Please enter at least two numbers.');
            return;
        }
        
        if (mode === 'weighted' && numbers.length !== weights.length) {
            setError('The number of data points must equal the number of weights.');
            return;
        }

        try {
            const stats = calculateDescriptiveStatistics(numbers, mode === 'weighted' ? weights : []);
            if (stats) {
                setResults(stats);
            } else {
                 setError('Could not calculate statistics. Please check your input.');
            }
        } catch (e: any) {
            setError(e.message || 'An error occurred during calculation.');
        }
    }, [dataInput, weightsInput, mode]);

    const ResultItem: React.FC<{ label: string; value: string | string[]; description?: string }> = ({ label, value, description }) => (
        <div className="bg-base-100 p-3 rounded-lg flex justify-between items-center text-sm relative group">
            <span className="font-semibold text-base-content/80">{label}</span>
            <span className="font-mono font-bold text-primary">{Array.isArray(value) ? value.join(', ') : value}</span>
            {description && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 text-xs bg-base-300 text-base-content rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {description}
                </div>
            )}
        </div>
    );

    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-170px)] sm:max-h-[520px] gap-4">
             <div className="flex-shrink-0">
                <h2 className="text-xl font-bold text-center mb-1">Descriptive Statistics</h2>
                 <p className="text-sm text-center text-base-content/60">Enter a set of numbers separated by commas or spaces.</p>
             </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
                 <CustomSelect 
                    value={mode}
                    onChange={setMode}
                    options={calculationModeOptions}
                    variant="solid"
                 />
                <textarea
                    value={dataInput}
                    onChange={(e) => setDataInput(e.target.value)}
                    placeholder="e.g., 8, 2, 7, 5, 8"
                    className="w-full h-20 bg-base-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary text-base-content transition-shadow text-base"
                    aria-label="Data set input"
                    data-keyboard-aware="true"
                />
                 {mode === 'weighted' && (
                     <textarea
                        value={weightsInput}
                        onChange={(e) => setWeightsInput(e.target.value)}
                        placeholder="Weights, e.g., 1, 2, 1, 3, 1"
                        className="w-full h-16 bg-base-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary text-base-content transition-shadow text-base animate-fade-in-up"
                        aria-label="Weights input"
                        data-keyboard-aware="true"
                    />
                 )}
                <button
                    onClick={calculateStats}
                    className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-focus font-semibold transition-colors"
                >
                    Calculate
                </button>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2 result-scroll">
                 {error && <div className="mt-2 p-3 bg-red-500/10 text-red-500 rounded-lg text-center font-semibold text-sm">{error}</div>}
                 {results && (
                     <div className="space-y-4 animate-fade-in-up">
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                             <ResultItem label="Count" value={formatNumber(results.count)} />
                             <ResultItem label="Sum" value={formatNumber(results.sum)} />
                             <ResultItem label="Mean" value={formatNumber(results.mean)} />
                              {results.weightedMean !== null && <ResultItem label="Weighted Mean" value={formatNumber(results.weightedMean)} />}
                             <ResultItem label="Median" value={formatNumber(results.median)} description="The middle value of the dataset. Also known as Quartile 2 (Q2) or the 50th percentile."/>
                             <ResultItem label="Mode" value={results.mode.map(formatNumber)} />
                             <ResultItem label="Range" value={formatNumber(results.range)} />
                             <ResultItem label="Minimum" value={formatNumber(results.min)} />
                             <ResultItem label="Maximum" value={formatNumber(results.max)} />
                             <ResultItem label="Variance (Sample)" value={formatNumber(results.varianceSample)} description="σ² estimate for a sample of a larger population." />
                             <ResultItem label="Variance (Population)" value={formatNumber(results.variancePopulation)} description="σ² for the entire population data."/>
                             <ResultItem label="Std. Dev (Sample)" value={formatNumber(results.stdDevSample)} description="σ for a sample." />
                             <ResultItem label="Std. Dev (Population)" value={formatNumber(results.stdDevPopulation)} description="σ for the population." />
                             <ResultItem label="Coefficient of Variation" value={`${formatNumber(results.coefficientOfVariation)}%`} description="(σ / μ) * 100%. Relative variability."/>
                             <ResultItem label="Quartile 1 (Q1)" value={formatNumber(results.q1)} description="The 25th percentile. 25% of data points are below this value."/>
                             <ResultItem label="Quartile 2 (Q2)" value={formatNumber(results.median)} description="The 50th percentile. Same as the Median." />
                             <ResultItem label="Quartile 3 (Q3)" value={formatNumber(results.q3)} description="The 75th percentile. 75% of data points are below this value."/>
                             <ResultItem label="Interquartile Range" value={formatNumber(results.iqr)} description="Q3 - Q1. The range of the middle 50% of data."/>
                             <ResultItem label="Skewness" value={formatNumber(results.skewness)} description="Measures asymmetry. >0: right-skewed, <0: left-skewed, ≈0: symmetric." />
                             <ResultItem label="Kurtosis (Excess)" value={formatNumber(results.kurtosis)} description="Measures 'tailedness'. >0: heavy tails, <0: light tails."/>
                         </div>
                         <div className="space-y-4 pt-4">
                             <div>
                                 <h3 className="font-bold text-lg text-center mb-2">Histogram</h3>
                                 <div className="bg-base-100 p-2 rounded-lg">
                                    <HistogramChart data={dataInput.split(/[\s,]+/).map(Number).filter(n => !isNaN(n))} />
                                 </div>
                             </div>
                              <div>
                                 <h3 className="font-bold text-lg text-center mb-2">Box Plot</h3>
                                 <div className="bg-base-100 p-2 rounded-lg">
                                    <BoxPlotChart stats={results} />
                                 </div>
                             </div>
                         </div>
                     </div>
                 )}
            </div>
        </div>
    );
};

export default DescriptiveStatistics;
