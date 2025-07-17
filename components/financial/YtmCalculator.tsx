
import React, { useState, useCallback } from 'react';
import { calculateYTM } from '../../lib/finance';
import CustomSelect from '../ui/CustomSelect';

const formatPercent = (value: number) => {
    if (isNaN(value)) return '---';
    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
    }).format(value);
};

const paymentFrequencyOptions = [
    { value: '1', label: 'Annually' },
    { value: '2', label: 'Semi-Annually' },
    { value: '4', label: 'Quarterly' },
];

const YtmCalculator: React.FC = () => {
    const [bondPrice, setBondPrice] = useState('980');
    const [faceValue, setFaceValue] = useState('1000');
    const [couponRate, setCouponRate] = useState('4');
    const [term, setTerm] = useState('10');
    const [frequency, setFrequency] = useState('2');
    const [result, setResult] = useState<number | null>(null);
    const [error, setError] = useState('');

    const handleCalculate = useCallback(() => {
        setError('');
        const price = parseFloat(bondPrice);
        const fv = parseFloat(faceValue);
        const cr = parseFloat(couponRate);
        const t = parseFloat(term);
        const freq = parseInt(frequency, 10);

        if (isNaN(price) || isNaN(fv) || isNaN(cr) || isNaN(t) || price <= 0 || fv <= 0 || cr < 0 || t <= 0) {
            setError('Please enter valid, positive numbers for all fields.');
            setResult(null);
            return;
        }

        const ytm = calculateYTM(price, fv, cr, t, freq);
        setResult(ytm);
        if (ytm === null) {
            setError('Calculation did not converge. Try adjusting inputs or checking for unusual values (e.g., extremely high coupon rate).');
        }

    }, [bondPrice, faceValue, couponRate, term, frequency]);

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
            <div className="text-center">
                <h3 className="text-xl font-bold">Yield to Maturity (YTM)</h3>
                <p className="text-sm text-base-content/70 mt-1">Calculate the total annualized return of a bond held until it matures.</p>
            </div>
            <div className="bg-base-200 p-4 rounded-xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Current Bond Price" value={bondPrice} onChange={setBondPrice} unit="$" />
                    <InputField label="Face Value (Par)" value={faceValue} onChange={setFaceValue} unit="$" />
                    <InputField label="Annual Coupon Rate" value={couponRate} onChange={setCouponRate} unit="%" />
                    <InputField label="Years to Maturity" value={term} onChange={setTerm} unit="Yrs" />
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-base-content mb-1">Coupon Payments per Year</label>
                        <CustomSelect value={frequency} onChange={setFrequency} options={paymentFrequencyOptions} variant="solid" />
                    </div>
                </div>
                <button
                    onClick={handleCalculate}
                    className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-focus font-semibold transition-colors text-lg"
                >
                    Calculate YTM
                </button>
            </div>
            {error && <div className="p-3 bg-red-500/10 text-red-500 rounded-lg text-center font-semibold">{error}</div>}
            {result !== null && (
                <div className="animate-fade-in-up bg-base-200 p-4 rounded-xl text-center">
                    <h3 className="font-bold text-lg mb-2">Yield to Maturity (YTM)</h3>
                    <p className="text-4xl font-mono font-bold text-primary">{`${formatPercent(result)}%`}</p>
                </div>
            )}
        </div>
    );
};

export default YtmCalculator;
