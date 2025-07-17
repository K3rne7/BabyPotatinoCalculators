
import React, { useState, useMemo } from 'react';
import { ConversionCategory } from '../../../types';
import CustomSelect from '../../ui/CustomSelect';

type UnitSystem = 'metric' | 'imperial';
type Gender = 'male' | 'female';
type BmiFormula = 
    | 'standard' 
    | 'trefethen' 
    | 'corpulence' 
    | 'bmiForAge' 
    | 'adjustedForSeniors'
    | 'forAthletes'
    | 'bai'
    | 'ffmi'
    | 'whtr';

interface BmiResult {
    value: number | null;
    category: string;
    color: string;
    details?: string;
    disclaimer?: string;
}

const formulaOptions = [
    { value: 'h_bmi', label: 'BMI Variations', isHeader: true },
    { value: 'standard', label: 'Standard BMI', description: 'The classic Quetelet index. (kg/m²)' },
    { value: 'trefethen', label: 'New BMI (Trefethen)', description: 'Proposed in 2013 to account for natural scaling. (1.3 * kg / m^2.5)' },
    { value: 'bmiForAge', label: 'BMI-for-Age (Children)', description: 'Interprets standard BMI based on age & gender percentiles for children (2-20 yrs).' },
    { value: 'adjustedForSeniors', label: 'Adjusted BMI (Seniors)', description: 'Uses standard BMI with adjusted category ranges for older adults (65+).' },
    { value: 'forAthletes', label: 'BMI for Athletes', description: 'Calculates standard BMI with a note about its limitations for muscular builds.' },
    { value: 'h_body_comp', label: 'Body Composition Indices', isHeader: true },
    { value: 'bai', label: 'Body Adiposity Index (BAI)', description: 'Estimates body fat using hip circumference and height. ((hip / height^1.5) - 18)' },
    { value: 'ffmi', label: 'Fat-Free Mass Index (FFMI)', description: 'Assesses muscularity, requires body fat %. (Lean Mass / height²)' },
    { value: 'whtr', label: 'Waist-to-Height Ratio (WHtR)', description: 'Measures central obesity, a key health risk indicator. (Waist / Height)' },
    { value: 'corpulence', label: 'Corpulence Index (PI)', description: 'An alternative to BMI, also known as the Ponderal Index. (kg/m³)' },
];


// --- Category and Interpretation Logic ---

const getStandardBmiCategory = (bmi: number | null): { category: string, color: string } => {
    if (bmi === null) return { category: 'N/A', color: 'text-base-content' };
    if (bmi < 16) return { category: 'Severe Thinness', color: 'text-blue-500' };
    if (bmi < 17) return { category: 'Moderate Thinness', color: 'text-blue-400' };
    if (bmi < 18.5) return { category: 'Mild Thinness', color: 'text-sky-400' };
    if (bmi < 25) return { category: 'Normal Weight', color: 'text-green-500' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-500' };
    if (bmi < 35) return { category: 'Obese Class I', color: 'text-orange-500' };
    if (bmi < 40) return { category: 'Obese Class II', color: 'text-red-500' };
    return { category: 'Obese Class III', color: 'text-red-700' };
};

const getAdjustedForSeniorsCategory = (bmi: number | null): { category: string, color: string } => {
    if (bmi === null) return { category: 'N/A', color: 'text-base-content' };
    if (bmi < 22) return { category: 'Underweight', color: 'text-sky-400' };
    if (bmi < 27) return { category: 'Normal Weight', color: 'text-green-500' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-500' };
    return { category: 'Obese', color: 'text-red-500' };
};

const getBmiForAgeCategory = (age: number, gender: Gender): { category: string, disclaimer: string } => {
    let disclaimer;
    if (age < 2 || age > 20) {
        disclaimer = "BMI-for-age percentile is most accurate for individuals aged 2-20. The result shown uses standard categories.";
    } else {
        disclaimer = `Interpretation is based on general CDC growth charts for a ${age}-year-old ${gender}. For clinical assessment, consult a healthcare provider.`;
    }
    return { category: "BMI-for-Age Percentile", disclaimer };
};


const getBaiCategory = (bai: number | null, gender: Gender): { category: string, color: string } => {
    if (bai === null) return { category: 'N/A', color: 'text-base-content' };
    if (gender === 'female') {
        if (bai < 21) return { category: 'Underweight', color: 'text-sky-400' };
        if (bai < 33) return { category: 'Healthy', color: 'text-green-500' };
        if (bai < 39) return { category: 'Overweight', color: 'text-yellow-500' };
        return { category: 'Obese', color: 'text-red-500' };
    } else { // male
        if (bai < 8) return { category: 'Underweight', color: 'text-sky-400' };
        if (bai < 21) return { category: 'Healthy', color: 'text-green-500' };
        if (bai < 26) return { category: 'Overweight', color: 'text-yellow-500' };
        return { category: 'Obese', color: 'text-red-500' };
    }
};

const getFfmiCategory = (ffmi: number | null, gender: Gender): { category: string, color: string } => {
    if (ffmi === null) return { category: 'N/A', color: 'text-base-content' };
    if (gender === 'female') {
        if (ffmi < 13) return { category: 'Below Average', color: 'text-sky-400' };
        if (ffmi < 16) return { category: 'Average', color: 'text-green-500' };
        if (ffmi < 18) return { category: 'Above Average', color: 'text-yellow-500' };
        return { category: 'Very Muscular', color: 'text-orange-500' };
    } else { // male
        if (ffmi < 17) return { category: 'Below Average', color: 'text-sky-400' };
        if (ffmi < 20) return { category: 'Average', color: 'text-green-500' };
        if (ffmi < 22) return { category: 'Above Average', color: 'text-yellow-500' };
        if (ffmi < 25) return { category: 'Very Muscular', color: 'text-orange-500' };
        return { category: 'Extremely Muscular', color: 'text-red-500' };
    }
};

const getWhtrCategory = (whtr: number | null): { category: string, color: string } => {
    if (whtr === null) return { category: 'N/A', color: 'text-base-content' };
    if (whtr < 0.4) return { category: 'Underweight', color: 'text-sky-400' };
    if (whtr < 0.5) return { category: 'Healthy', color: 'text-green-500' };
    if (whtr < 0.6) return { category: 'Overweight', color: 'text-yellow-500' };
    return { category: 'Obese', color: 'text-red-500' };
};


const BmiCalculator: React.FC<{ category: ConversionCategory }> = () => {
    const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
    const [gender, setGender] = useState<Gender>('male');
    const [age, setAge] = useState('30');
    // Metric units: height (cm), weight (kg), waist (cm), hip (cm)
    const [height, setHeight] = useState('175');
    const [weight, setWeight] = useState('70');
    const [waist, setWaist] = useState('85');
    const [hip, setHip] = useState('95');
    const [bodyFat, setBodyFat] = useState('20');
    const [formula, setFormula] = useState<BmiFormula>('standard');
    
    const needsWaist = formula === 'whtr';
    const needsHip = formula === 'bai';
    const needsBodyFat = formula === 'ffmi';

    const result = useMemo<BmiResult>(() => {
        const h = parseFloat(height);
        const w = parseFloat(weight);
        const a = parseInt(age, 10);
        const waistCirc = parseFloat(waist);
        const hipCirc = parseFloat(hip);
        const bf = parseFloat(bodyFat);

        if (isNaN(h) || isNaN(w) || isNaN(a) || h <= 0 || w <= 0 || a <= 0) {
            return { value: null, ...getStandardBmiCategory(null) };
        }

        // Convert all inputs to metric for uniform calculation
        const weightKg = unitSystem === 'imperial' ? w * 0.453592 : w;
        const heightCm = unitSystem === 'imperial' ? h * 2.54 : h;
        const heightM = heightCm / 100;
        const waistCm = unitSystem === 'imperial' ? waistCirc * 2.54 : waistCirc;
        const hipCm = unitSystem === 'imperial' ? hipCirc * 2.54 : hipCirc;

        let res: number | null = null;
        let cat: { category: string, color: string, disclaimer?: string, details?: string } = { category: '', color: '' };
        
        switch (formula) {
            case 'standard':
                res = weightKg / Math.pow(heightM, 2);
                cat = getStandardBmiCategory(res);
                break;
            case 'trefethen':
                res = 1.3 * weightKg / Math.pow(heightM, 2.5);
                cat = getStandardBmiCategory(res);
                break;
            case 'corpulence':
                 res = weightKg / Math.pow(heightM, 3);
                 cat = { category: 'Ponderal Index', color: 'text-primary' }; // Has its own scale, less defined categories
                 break;
            case 'bmiForAge':
                res = weightKg / Math.pow(heightM, 2);
                const { category: ageCat, disclaimer } = getBmiForAgeCategory(a, gender);
                cat = { ...getStandardBmiCategory(res), category: ageCat, disclaimer };
                break;
            case 'adjustedForSeniors':
                res = weightKg / Math.pow(heightM, 2);
                cat = getAdjustedForSeniorsCategory(res);
                if (a < 65) cat.disclaimer = "These categories are intended for adults aged 65 and over.";
                break;
            case 'forAthletes':
                res = weightKg / Math.pow(heightM, 2);
                cat = { ...getStandardBmiCategory(res), disclaimer: "BMI does not differentiate between fat and muscle mass. For athletes, it may misclassify muscular individuals as overweight. Consider using FFMI or consulting a professional." };
                break;
            case 'bai':
                if (isNaN(hipCm)) return { value: null, ...getBaiCategory(null, gender) };
                res = (hipCm / Math.pow(heightM, 1.5)) - 18;
                cat = getBaiCategory(res, gender);
                break;
            case 'ffmi':
                if (isNaN(bf)) return { value: null, ...getFfmiCategory(null, gender) };
                const leanMass = weightKg * (1 - (bf / 100));
                const ffmi = leanMass / Math.pow(heightM, 2);
                res = ffmi + 6.1 * (1.8 - heightM); // Normalized FFMI
                cat = getFfmiCategory(res, gender);
                cat.details = `Lean Mass: ${leanMass.toFixed(1)} kg`;
                break;
            case 'whtr':
                if (isNaN(waistCm)) return { value: null, ...getWhtrCategory(null) };
                res = waistCm / heightCm;
                cat = getWhtrCategory(res);
                break;
            default:
                return { value: null, ...getStandardBmiCategory(null) };
        }
        
        return { value: res, ...cat };
    }, [age, height, weight, waist, hip, bodyFat, unitSystem, formula, gender]);

    const handleUnitChange = (system: UnitSystem) => {
        if (system === unitSystem) return;

        const convert = (value: string, toMetric: boolean, precision: number = 1) => {
            const num = parseFloat(value);
            if(isNaN(num)) return value;
            return toMetric ? (num * 2.54).toFixed(precision) : (num / 2.54).toFixed(precision);
        };
        const convertWeight = (value: string, toMetric: boolean, precision: number = 1) => {
            const num = parseFloat(value);
            if(isNaN(num)) return value;
            return toMetric ? (num * 0.453592).toFixed(precision) : (num / 0.453592).toFixed(precision);
        };

        const toMetric = system === 'metric';
        setHeight(val => convert(val, toMetric, 0));
        setWeight(val => convertWeight(val, toMetric, 1));
        setWaist(val => convert(val, toMetric, 1));
        setHip(val => convert(val, toMetric, 1));
        
        setUnitSystem(system);
    };

    const InputField: React.FC<{label: string, value: string, onChange: (val: string) => void, unit: string}> = ({label, value, onChange, unit}) => (
        <div className="flex-1">
            <label className="block text-sm font-medium text-base-content/80 mb-1">{label}</label>
             <div className="relative">
                <input
                    type="text"
                    inputMode="decimal"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="w-full h-12 bg-base-100 rounded-lg text-center font-mono text-xl text-base-content focus:outline-none focus:ring-2 focus:ring-primary pr-12"
                    data-keyboard-aware="true"
                />
                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50">{unit}</span>
             </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-base-200 p-2 rounded-lg">
                <div className="flex justify-center gap-1">
                    {(['metric', 'imperial'] as UnitSystem[]).map(system => (
                        <button key={system} onClick={() => handleUnitChange(system)} className={`px-4 py-1.5 text-sm font-semibold rounded-md flex-1 transition-colors ${unitSystem === system ? 'bg-primary text-white' : 'hover:bg-base-300'}`}>
                            {system.charAt(0).toUpperCase() + system.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
            
             <div className="grid grid-cols-2 gap-4">
                <InputField label="Weight" value={weight} onChange={setWeight} unit={unitSystem === 'metric' ? 'kg' : 'lbs'} />
                <InputField label="Height" value={height} onChange={setHeight} unit={unitSystem === 'metric' ? 'cm' : 'in'} />
                <InputField label="Age" value={age} onChange={setAge} unit="yrs" />
                 <div className="flex-1">
                    <label className="block text-sm font-medium text-base-content/80 mb-1">Gender</label>
                    <div className="h-12 bg-base-100 rounded-lg p-1 flex gap-1">
                       {(['male', 'female'] as Gender[]).map(g => (
                            <button key={g} onClick={() => setGender(g)} className={`px-2 py-1.5 text-xs font-semibold rounded-md flex-1 transition-colors ${gender === g ? 'bg-accent/80 text-black' : 'hover:bg-base-300/50'}`}>
                                {g.charAt(0).toUpperCase() + g.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {(needsWaist || needsHip || needsBodyFat) &&
                <div className="bg-base-200/50 p-3 rounded-lg space-y-3 animate-fade-in-up">
                    <h4 className="text-sm font-semibold text-center text-base-content/70">Additional Measurements</h4>
                    <div className="flex gap-4 justify-center">
                        {needsWaist && <InputField label="Waist" value={waist} onChange={setWaist} unit={unitSystem === 'metric' ? 'cm' : 'in'} />}
                        {needsHip && <InputField label="Hip" value={hip} onChange={setHip} unit={unitSystem === 'metric' ? 'cm' : 'in'} />}
                        {needsBodyFat && <InputField label="Body Fat" value={bodyFat} onChange={setBodyFat} unit="%" />}
                    </div>
                </div>
            }

             <div>
                <label className="block text-sm font-medium text-base-content/80 mb-1">Formula</label>
                <CustomSelect 
                    value={formula}
                    onChange={(val) => setFormula(val as BmiFormula)}
                    options={formulaOptions}
                    variant="solid"
                />
                <p className="text-xs text-center mt-2 text-base-content/60 px-2">{formulaOptions.find(f => f.value === formula)?.description}</p>
            </div>
            
            <div className="bg-base-200 p-4 rounded-xl text-center space-y-2 animate-fade-in-up">
                <h3 className="font-bold text-lg">Result</h3>
                {result.value !== null ? (
                    <>
                        <p className="text-5xl font-mono font-bold" style={{color: result.color}}>{result.value.toFixed(1)}</p>
                        <p className="font-semibold" style={{color: result.color}}>{result.category}</p>
                        {result.details && <p className="text-sm text-base-content/70">{result.details}</p>}
                    </>
                ) : (
                    <p className="text-base-content/70">Enter valid inputs to see results.</p>
                )}
            </div>
             {result.disclaimer && (
                <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-300 rounded-lg text-center text-xs font-semibold">
                    {result.disclaimer}
                </div>
            )}
        </div>
    );
};

export default BmiCalculator;
