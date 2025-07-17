
import React, { useState, useMemo } from 'react';
import ColorSelect, { ColorOption } from './ColorSelect';
import Resistor from './Resistor';
import { RESISTOR_COLORS, ColorCode } from '../../lib/electronics';

type BandCount = 4 | 5 | 6;

const BAND_CONFIG = {
    4: ['digit1', 'digit2', 'multiplier', 'tolerance'],
    5: ['digit1', 'digit2', 'digit3', 'multiplier', 'tolerance'],
    6: ['digit1', 'digit2', 'digit3', 'multiplier', 'tolerance', 'tcr'],
};

const getOptionsForBand = (bandType: string): ColorOption[] => {
    return Object.entries(RESISTOR_COLORS)
        .filter(([, code]) => {
            if (bandType.startsWith('digit')) return code.digit !== null;
            if (bandType === 'multiplier') return code.multiplier !== null;
            if (bandType === 'tolerance') return code.tolerance !== null;
            if (bandType === 'tcr') return code.tcr !== null;
            return false;
        })
        .map(([key, code]) => ({
            value: key,
            label: code.name,
            color: code.color,
        }));
};

const formatValue = (value: number): string => {
    if (value >= 1e9) return `${(value / 1e9).toPrecision(3)} GΩ`;
    if (value >= 1e6) return `${(value / 1e6).toPrecision(3)} MΩ`;
    if (value >= 1e3) return `${(value / 1e3).toPrecision(3)} kΩ`;
    return `${value.toPrecision(3)} Ω`;
};

const ResistorColorCodeCalculator: React.FC = () => {
    const [bandCount, setBandCount] = useState<BandCount>(4);
    const [colors, setColors] = useState<string[]>(['brown', 'black', 'orange', 'gold']);

    const handleColorChange = (index: number, color: string) => {
        const newColors = [...colors];
        newColors[index] = color;
        setColors(newColors);
    };

    const handleBandCountChange = (newCount: BandCount) => {
        const defaults: Record<BandCount, string[]> = {
            4: ['brown', 'black', 'orange', 'gold'],
            5: ['brown', 'black', 'black', 'red', 'brown'],
            6: ['brown', 'black', 'black', 'red', 'brown', 'red'],
        };
        setBandCount(newCount);
        setColors(defaults[newCount]);
    };

    const calculation = useMemo(() => {
        const bandTypes = BAND_CONFIG[bandCount];
        const selectedColorCodes = colors.map(c => RESISTOR_COLORS[c]);

        let digits: number[] = [];
        let multiplier: number | null = null;
        let tolerance: number | null = null;
        let tcr: number | null = null;

        selectedColorCodes.forEach((code, index) => {
            const type = bandTypes[index];
            if (type.startsWith('digit')) digits.push(code.digit as number);
            if (type === 'multiplier') multiplier = code.multiplier;
            if (type === 'tolerance') tolerance = code.tolerance;
            if (type === 'tcr') tcr = code.tcr;
        });

        if (digits.includes(null) || multiplier === null) {
            return { value: null, tolerance, tcr, text: 'Invalid selection' };
        }
        
        const baseValue = parseInt(digits.join(''), 10);
        const finalValue = baseValue * multiplier;
        const text = `${formatValue(finalValue)}`;

        return { value: finalValue, tolerance, tcr, text };
    }, [colors, bandCount]);

    const resultText = `${calculation.text}${calculation.tolerance ? ` ±${calculation.tolerance}%` : ''}`;

    return (
        <div className="space-y-6">
            <div className="bg-base-200 p-2 rounded-lg">
                <div className="flex justify-center gap-1">
                    {([4, 5, 6] as BandCount[]).map(count => (
                        <button
                            key={count}
                            onClick={() => handleBandCountChange(count)}
                            className={`px-4 py-1.5 text-sm font-semibold rounded-md flex-1 transition-colors ${
                                bandCount === count ? 'bg-primary text-white' : 'hover:bg-base-300'
                            }`}
                        >
                            {count}-Band
                        </button>
                    ))}
                </div>
            </div>

            <Resistor bandColors={colors.map(c => RESISTOR_COLORS[c].color)} />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {BAND_CONFIG[bandCount].map((bandType, index) => (
                    <div key={index} className="flex flex-col items-center gap-1">
                        <label className="text-xs font-bold uppercase opacity-70">
                            {bandType.replace(/(\d)/, ' $1')}
                        </label>
                        <ColorSelect
                            value={colors[index]}
                            options={getOptionsForBand(bandType)}
                            onChange={(color) => handleColorChange(index, color)}
                        />
                    </div>
                ))}
            </div>

            <div className="bg-base-200 p-4 rounded-xl text-center space-y-2">
                <h3 className="font-bold text-lg">Result</h3>
                <p className="text-3xl font-mono font-bold text-primary">{calculation.value === null ? calculation.text : resultText}</p>
                {calculation.tcr !== null && (
                    <p className="text-sm opacity-70">TCR: {calculation.tcr} ppm/K</p>
                )}
            </div>
        </div>
    );
};

export default ResistorColorCodeCalculator;