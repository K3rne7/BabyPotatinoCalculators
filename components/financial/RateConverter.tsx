
import React, { useState, useEffect, useCallback } from 'react';
import { calculateEffectiveAnnualRate, calculateNominalRate } from '../../lib/finance';
import CustomSelect from '../ui/CustomSelect';

const compoundingOptions = [
    { value: '1', label: 'Annually' },
    { value: '2', label: 'Semi-Annually' },
    { value: '4', label: 'Quarterly' },
    { value: '12', label: 'Monthly' },
    { value: '52', label: 'Weekly' },
    { value: '365', label: 'Daily' },
    { value: '0', label: 'Continuously' },
];

const formatPercent = (value: number | string | null): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (num === null || isNaN(num)) return '';
    return Number(num.toFixed(4)).toString();
};

const RateConverter: React.FC = () => {
    const [nominalRate, setNominalRate] = useState('5');
    const [effectiveRate, setEffectiveRate] = useState('');
    const [compounding, setCompounding] = useState('12');
    const [direction, setDirection] = useState<'nominalToEffective' | 'effectiveToNominal'>('nominalToEffective');

    const calculate = useCallback(() => {
        const c = parseInt(compounding, 10);

        if (direction === 'nominalToEffective') {
            const nRate = parseFloat(nominalRate);
            if (isNaN(nRate) || nRate < 0) {
                setEffectiveRate('');
                return;
            }
            const result = calculateEffectiveAnnualRate(nRate, c);
            setEffectiveRate(formatPercent(result));
        } else { // effectiveToNominal
            const eRate = parseFloat(effectiveRate);
            if (isNaN(eRate) || eRate < 0) {
                setNominalRate('');
                return;
            }
            const result = calculateNominalRate(eRate, c);
            setNominalRate(formatPercent(result));
        }
    }, [nominalRate, effectiveRate, compounding, direction]);

    useEffect(() => {
        calculate();
    }, [calculate]);

    const handleSwap = () => {
        setDirection(prev => prev === 'nominalToEffective' ? 'effectiveToNominal' : 'nominalToEffective');
    };

    const InputField = ({ label, value, onChange, onFocus }: { label: string, value: string, onChange: (val: string) => void, onFocus: () => void }) => (
        <div className="flex flex-col gap-2 p-4 rounded-lg bg-base-100 h-32">
            <label className="text-sm font-semibold opacity-70">{label}</label>
            <div className="relative flex-grow flex items-end">
                <input
                    type="text" inputMode="decimal" value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={onFocus}
                    className="w-full bg-transparent text-4xl text-right font-mono outline-none break-all"
                    placeholder="0"
                    data-keyboard-aware="true" />
                <span className="text-2xl font-semibold text-base-content/50 ml-2">%</span>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 max-w-lg mx-auto">
            <div className="text-center">
                <h3 className="text-xl font-bold">Nominal vs. Effective Interest Rate</h3>
                <p className="text-sm text-base-content/70 mt-1">Convert between the stated (nominal) rate and the true (effective) rate after accounting for compounding.</p>
            </div>

            <div className="space-y-4">
                <InputField
                    label={direction === 'nominalToEffective' ? 'From: Nominal Rate (APR)' : 'To: Nominal Rate (APR)'}
                    value={nominalRate}
                    onChange={setNominalRate}
                    onFocus={() => setDirection('nominalToEffective')}
                />
                
                <div className="flex justify-center items-center gap-4 -my-2 z-10">
                    <div className="border-t border-base-300 flex-grow"></div>
                     <button onClick={handleSwap} className="p-2 rounded-full bg-base-300 hover:bg-primary hover:text-white transition-colors" aria-label="Swap conversion direction">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 12l-4-4m4 4l4-4m6 8v-12m0 12l-4-4m4 4l4-4" /></svg>
                    </button>
                    <div className="border-t border-base-300 flex-grow"></div>
                </div>

                <InputField
                    label={direction === 'effectiveToNominal' ? 'From: Effective Rate (EAR)' : 'To: Effective Rate (EAR)'}
                    value={effectiveRate}
                    onChange={setEffectiveRate}
                    onFocus={() => setDirection('effectiveToNominal')}
                />

                <div className="bg-base-200 p-4 rounded-xl">
                    <label className="block text-sm font-semibold text-base-content mb-2 text-center">Compounding Frequency</label>
                    <CustomSelect value={compounding} onChange={setCompounding} options={compoundingOptions} variant="solid" />
                </div>
            </div>
        </div>
    );
};

export default RateConverter;
