import React, { useState, useEffect } from 'react';

type Field = 'voltage' | 'current' | 'resistance';

const OhmsLawCalculator: React.FC = () => {
    const [values, setValues] = useState({ voltage: '12', current: '0.5', resistance: '' });
    const [calculate, setCalculate] = useState<Field>('resistance');
    const [error, setError] = useState('');

    useEffect(() => {
        const v = parseFloat(values.voltage);
        const i = parseFloat(values.current);
        const r = parseFloat(values.resistance);
        
        setError('');
        
        let newValues = { ...values };

        try {
            if (calculate === 'voltage') {
                if (isNaN(i) || isNaN(r)) return;
                const result = i * r;
                if (!isFinite(result)) throw new Error("Result is not finite.");
                newValues.voltage = String(parseFloat(result.toPrecision(6)));
            } else if (calculate === 'current') {
                if (isNaN(v) || isNaN(r) || r === 0) return;
                const result = v / r;
                if (!isFinite(result)) throw new Error("Result is not finite.");
                newValues.current = String(parseFloat(result.toPrecision(6)));
            } else { // resistance
                if (isNaN(v) || isNaN(i) || i === 0) return;
                const result = v / i;
                if (!isFinite(result)) throw new Error("Result is not finite.");
                newValues.resistance = String(parseFloat(result.toPrecision(6)));
            }
             setValues(newValues);
        } catch(e: any) {
            setError(e.message);
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.voltage, values.current, values.resistance, calculate]);
    
    const handleInputChange = (field: Field, value: string) => {
        if (value.match(/^[0-9.]*$/)) {
             setValues(prev => ({ ...prev, [field]: value }));
        }
    };
    
    const InputField = ({ field, label, unit }: { field: Field; label: string; unit: string }) => {
        const isCalculating = calculate === field;
        return (
            <div className="w-full">
                <label htmlFor={field} className="block text-sm font-medium text-base-content/80">{label}</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                        type="text"
                        inputMode="decimal"
                        name={field}
                        id={field}
                        value={values[field]}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        onFocus={(e) => e.target.select()}
                        disabled={isCalculating}
                        className={`w-full p-3 pr-12 rounded-lg font-mono text-2xl transition-all duration-200
                            ${isCalculating 
                                ? 'bg-primary/10 text-primary border-primary focus:ring-primary focus:border-primary' 
                                : 'bg-base-100 border-base-300 focus:ring-primary focus:border-primary'
                            }`}
                        placeholder="0"
                        aria-label={label}
                        data-keyboard-aware="true"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-base-content/50 sm:text-sm">{unit}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-sm mx-auto">
             <div className="text-center p-4 bg-base-200 rounded-lg">
                <h3 className="text-2xl font-bold font-serif italic text-primary">V = I × R</h3>
                <p className="text-sm text-base-content/70">The fundamental relationship between voltage, current, and resistance.</p>
            </div>
            
             <div className="space-y-2">
                <label className="text-base font-semibold text-base-content">Calculate for:</label>
                <div className="grid grid-cols-3 gap-2">
                    {(['voltage', 'current', 'resistance'] as Field[]).map(f => (
                        <button key={f} onClick={() => setCalculate(f)}
                            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors
                            ${calculate === f ? 'bg-primary text-white' : 'bg-base-300 hover:bg-base-300'}`}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <InputField field="voltage" label="Voltage (V)" unit="V" />
                <InputField field="current" label="Current (I)" unit="A" />
                <InputField field="resistance" label="Resistance (R)" unit="Ω" />
            </div>
            {error && <div className="text-red-500 text-center">{error}</div>}
        </div>
    );
};

export default OhmsLawCalculator;