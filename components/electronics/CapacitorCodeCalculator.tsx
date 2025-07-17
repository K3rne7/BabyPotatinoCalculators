import React, { useState, useMemo } from 'react';

// Common EIA tolerance codes for capacitors
const TOLERANCE_CODES: Record<string, string> = {
    'B': '±0.1 pF', 'C': '±0.25 pF', 'D': '±0.5 pF',
    'F': '±1%', 'G': '±2%', 'J': '±5%',
    'K': '±10%', 'M': '±20%', 'Z': '+80%, -20%',
};

const formatCapacitance = (pF: number): { value: string, unit: string }[] => {
    if (isNaN(pF) || pF < 0) return [];
    
    const results = [];
    results.push({ value: pF.toString(), unit: 'pF' });
    results.push({ value: (pF / 1000).toString(), unit: 'nF' });
    results.push({ value: (pF / 1000000).toString(), unit: 'µF' });
    
    return results;
};

const CapacitorCodeCalculator: React.FC = () => {
    const [code, setCode] = useState('104K');
    
    const { value, tolerance, error } = useMemo(() => {
        let numericCode = code.replace(/[a-zA-Z]/g, '').trim();
        let letterCode = (code.match(/[a-zA-Z]/) || [''])[0].toUpperCase();

        if (numericCode.length === 0 && letterCode.length === 0) {
            return { value: [], tolerance: null, error: null };
        }
        
        let pF = 0;
        
        if (numericCode.includes('R')) {
             pF = parseFloat(numericCode.replace('R', '.'));
        } else if (numericCode.length === 3) {
            const d1 = parseInt(numericCode[0], 10);
            const d2 = parseInt(numericCode[1], 10);
            const multiplier = parseInt(numericCode[2], 10);
            if (isNaN(d1) || isNaN(d2) || isNaN(multiplier)) {
                return { value: [], tolerance: null, error: 'Invalid numeric code.'};
            }
            pF = (d1 * 10 + d2) * Math.pow(10, multiplier);
        } else if (numericCode.length > 0 && numericCode.length < 3) {
             pF = parseInt(numericCode, 10);
        } else if (numericCode.length > 3) {
             return { value: [], tolerance: null, error: 'Code must be 2 or 3 digits.'};
        }
        
        if (isNaN(pF)) {
            return { value: [], tolerance: null, error: 'Invalid input value.'};
        }

        return {
            value: formatCapacitance(pF),
            tolerance: TOLERANCE_CODES[letterCode] || null,
            error: null
        };

    }, [code]);

    return (
        <div className="space-y-6 max-w-sm mx-auto">
            <div className="text-center">
                <h3 className="text-xl font-bold">EIA Capacitor Code</h3>
                <p className="text-sm text-base-content/70 mt-1">Enter a standard 2/3 digit code (e.g., 104, 471, 4R7) with an optional tolerance letter (J, K, M).</p>
            </div>

            <div>
                <label htmlFor="cap-code" className="block text-sm font-semibold text-base-content mb-2">Capacitor Code</label>
                <input
                    type="text"
                    id="cap-code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    onFocus={(e) => e.target.select()}
                    className="w-full p-4 bg-base-100 rounded-lg font-mono text-3xl text-center tracking-widest focus:ring-2 focus:ring-primary outline-none"
                    placeholder="e.g. 104K"
                    data-keyboard-aware="true"
                />
            </div>
            
            {error && <div className="p-3 bg-red-500/10 text-red-500 rounded-lg text-center font-semibold">{error}</div>}

            {!error && value.length > 0 && (
                <div className="bg-base-200 p-4 rounded-xl text-center space-y-4">
                     <h3 className="font-bold text-lg">Result</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                         {value.map(val => (
                             <div key={val.unit} className="bg-base-100 p-2 rounded-lg">
                                 <p className="font-mono text-xl text-primary font-bold">{val.value}</p>
                                 <p className="text-xs opacity-70">{val.unit}</p>
                             </div>
                         ))}
                     </div>
                     {tolerance && (
                         <div>
                            <p className="font-semibold">Tolerance</p>
                            <p className="font-mono text-lg text-accent">{tolerance}</p>
                         </div>
                     )}
                </div>
            )}
        </div>
    );
};

export default CapacitorCodeCalculator;