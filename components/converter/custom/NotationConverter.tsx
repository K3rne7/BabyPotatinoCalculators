import React, { useState, useEffect } from 'react';
import { ConversionCategory } from '../../../types';
import { math } from '../../../lib/mathInstance';

const NotationConverter: React.FC<{ category: ConversionCategory }> = ({ category }) => {
    
    // State for Fraction <-> Decimal
    const [fraction, setFraction] = useState('1/8');
    const [decimal, setDecimal] = useState('0.125');
    const [fractionToDecimal, setFractionToDecimal] = useState(true);

    // State for Standard <-> Scientific
    const [standard, setStandard] = useState('12345');
    const [scientific, setScientific] = useState('1.2345e+4');
    const [standardToScientific, setStandardToScientific] = useState(true);

    // Fraction/Decimal Conversion Logic
    useEffect(() => {
        if (fractionToDecimal) {
            try {
                const result = math.evaluate(fraction);
                setDecimal(math.format(result, { precision: 14 }));
            } catch {
                setDecimal('Invalid Fraction');
            }
        }
    }, [fraction, fractionToDecimal]);

    useEffect(() => {
        if (!fractionToDecimal) {
            try {
                const num = parseFloat(decimal);
                if (isNaN(num)) throw new Error();
                const frac = math.fraction(num);
                setFraction(`${frac.n}/${frac.d}`);
            } catch {
                setFraction('Invalid Decimal');
            }
        }
    }, [decimal, fractionToDecimal]);

    // Standard/Scientific Conversion Logic
    useEffect(() => {
        if (standardToScientific) {
            try {
                const num = parseFloat(standard);
                if (isNaN(num)) throw new Error();
                setScientific(num.toExponential(4));
            } catch {
                setScientific('Invalid Number');
            }
        }
    }, [standard, standardToScientific]);
    
    useEffect(() => {
        if (!standardToScientific) {
            try {
                const num = parseFloat(scientific);
                if (isNaN(num)) throw new Error();
                setStandard(num.toString());
            } catch {
                setStandard('Invalid Notation');
            }
        }
    }, [scientific, standardToScientific]);

    const inputClasses = "w-full bg-base-100 rounded-lg p-3 text-2xl text-right font-mono outline-none focus:ring-2 focus:ring-primary break-all";

    const ConverterCard: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
        <div className="bg-base-200 p-4 rounded-xl space-y-3">
            <h3 className="font-bold text-lg text-base-content">{title}</h3>
            {children}
        </div>
    );
    
    const SwapButton: React.FC<{onClick: () => void}> = ({onClick}) => (
        <div className="flex justify-center -my-1">
             <button onClick={onClick} className="p-2 rounded-full bg-base-300 hover:bg-primary hover:text-white transition-colors" aria-label="Swap conversion direction">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 12l-4-4m4 4l4-4m6 8v-12m0 12l-4-4m4 4l4-4" /></svg>
            </button>
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            <ConverterCard title="Fraction ↔ Decimal">
                <div className="space-y-2">
                    <label className="text-sm font-semibold opacity-70">
                        {fractionToDecimal ? 'From Fraction' : 'To Fraction'}
                    </label>
                    <input type="text" value={fraction} onChange={(e) => setFraction(e.target.value)} onFocus={(e) => { setFractionToDecimal(true); e.target.select(); }} className={inputClasses} data-keyboard-aware="true" />
                </div>
                <SwapButton onClick={() => setFractionToDecimal(prev => !prev)}/>
                <div className="space-y-2">
                    <label className="text-sm font-semibold opacity-70">
                        {fractionToDecimal ? 'To Decimal' : 'From Decimal'}
                    </label>
                    <input type="text" value={decimal} onChange={(e) => setDecimal(e.target.value)} onFocus={(e) => { setFractionToDecimal(false); e.target.select(); }} className={inputClasses} data-keyboard-aware="true" />
                </div>
            </ConverterCard>

            <ConverterCard title="Standard ↔ Scientific Notation">
                 <div className="space-y-2">
                    <label className="text-sm font-semibold opacity-70">
                        {standardToScientific ? 'From Standard' : 'To Standard'}
                    </label>
                    <input type="text" value={standard} onChange={(e) => setStandard(e.target.value)} onFocus={(e) => { setStandardToScientific(true); e.target.select(); }} className={inputClasses} data-keyboard-aware="true" />
                </div>
                <SwapButton onClick={() => setStandardToScientific(prev => !prev)}/>
                <div className="space-y-2">
                    <label className="text-sm font-semibold opacity-70">
                       {standardToScientific ? 'To Scientific' : 'From Scientific'}
                    </label>
                    <input type="text" value={scientific} onChange={(e) => setScientific(e.target.value)} onFocus={(e) => { setStandardToScientific(false); e.target.select(); }} className={inputClasses} data-keyboard-aware="true" />
                </div>
            </ConverterCard>
        </div>
    );
};

export default NotationConverter;