import React, { useState, useEffect, useMemo } from 'react';
import { RuffiniResult } from '../../types';
import { solveWithRuffini } from '../../lib/polynomial';
import RuffiniResultDisplay from '../ruffini/RuffiniResultDisplay';

const RuffiniSolver: React.FC = () => {
    const [degree, setDegree] = useState(2);
    const [coefficients, setCoefficients] = useState<string[]>(['1', '0', '-4']);
    const [result, setResult] = useState<RuffiniResult | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const newCoeffs = Array(degree + 1).fill('0');
        newCoeffs[0] = '1';
        setCoefficients(newCoeffs);
        setResult(null);
        setError('');
    }, [degree]);
    
    const handleCoefficientChange = (index: number, value: string) => {
        if (/^-?\d*$/.test(value)) {
            const newCoeffs = [...coefficients];
            newCoeffs[index] = value;
            setCoefficients(newCoeffs);
        }
    };

    const handleSolve = () => {
        setError('');
        setResult(null);
        const numericCoefficients = coefficients.map(c => parseInt(c, 10));

        if (numericCoefficients.some(isNaN)) {
            setError('All coefficients must be valid integers.');
            return;
        }
        if (numericCoefficients[0] === 0) {
            setError('The leading coefficient (for the highest power of x) cannot be zero.');
            return;
        }
        
        try {
            const ruffiniResult = solveWithRuffini(numericCoefficients);
            setResult(ruffiniResult);
        } catch (e: any) {
            setError(e.message || "An unexpected error occurred during calculation.");
        }
    };
    
    const coefficientInputs = useMemo(() => {
        return coefficients.map((c, i) => {
            const power = degree - i;
            let label: string;
            if (power > 1) label = `x^${power}`;
            else if (power === 1) label = 'x';
            else label = 'Constant';

            return (
                <div key={i} className="flex-1 min-w-[70px]">
                    <label className="block text-center text-sm font-medium text-base-content/80 mb-1">{label}</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="-?[0-9]*"
                        value={c}
                        onChange={(e) => handleCoefficientChange(i, e.target.value)}
                        onFocus={(e) => e.target.select()}
                        className="w-full h-12 bg-base-100 rounded-lg text-center font-mono text-xl text-base-content focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label={`Coefficient for ${label}`}
                        data-keyboard-aware="true"
                    />
                </div>
            );
        });
    }, [coefficients, degree]);

    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-170px)] sm:max-h-[520px] gap-4">
            <div className="flex-shrink-0 bg-base-300/50 p-3 rounded-lg flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-2">
                    <label htmlFor="degree-select" className="font-semibold">Degree:</label>
                    <select
                        id="degree-select"
                        value={degree}
                        onChange={(e) => setDegree(Number(e.target.value))}
                        className="bg-base-100 border border-base-300 rounded-md p-2"
                    >
                        {Array.from({ length: 8 }, (_, i) => i + 2).map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={handleSolve}
                    className="w-full sm:w-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus font-semibold transition-colors"
                >
                    Solve
                </button>
            </div>
            
            <div className="flex-shrink-0">
                <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
                    {coefficientInputs}
                </div>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2 result-scroll">
                 {error && <div className="mt-4 p-3 bg-red-500/10 text-red-500 rounded-lg text-center font-semibold">{error}</div>}
                 {result ? (
                    <RuffiniResultDisplay result={result} />
                 ) : (
                    <div className="flex items-center justify-center h-full text-center text-base-content/50">
                        <p>Enter coefficients and click Solve.</p>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default RuffiniSolver;