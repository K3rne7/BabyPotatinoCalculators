
import React, { useState, useMemo, useCallback } from 'react';

type Gender = 'male' | 'female';

interface BmrInputs {
    weight: string;
    height: string;
    age: string;
    gender: Gender;
    bodyFat: string;
}

const initialInputs: BmrInputs = {
    weight: '70',
    height: '175',
    age: '30',
    gender: 'male',
    bodyFat: '20',
};

const activityLevels = [
    { label: 'Sedentary', description: 'Little or no exercise', value: 1.2 },
    { label: 'Lightly Active', description: 'Light exercise/sports 1-3 days/week', value: 1.375 },
    { label: 'Moderately Active', description: 'Moderate exercise/sports 3-5 days/week', value: 1.55 },
    { label: 'Very Active', description: 'Hard exercise/sports 6-7 days a week', value: 1.725 },
    { label: 'Extra Active', description: 'Very hard exercise & physical job', value: 1.9 },
];

const BmrCalculator: React.FC = () => {
    const [inputs, setInputs] = useState<BmrInputs>(initialInputs);
    const [activityLevel, setActivityLevel] = useState<number>(1.2);

    const handleInputChange = useCallback((field: keyof BmrInputs, value: string) => {
        setInputs(prev => ({ ...prev, [field]: value }));
    }, []);
    
    const handleReset = () => {
        setInputs(initialInputs);
        setActivityLevel(1.2);
    };

    const results = useMemo(() => {
        const w = parseFloat(inputs.weight);
        const h = parseFloat(inputs.height);
        const a = parseFloat(inputs.age);
        const bf = parseFloat(inputs.bodyFat);
        
        const areBaseInputsValid = !isNaN(w) && !isNaN(h) && !isNaN(a) && w > 0 && h > 0 && a > 0;
        const isBodyFatValid = !isNaN(bf) && bf > 0;

        let mifflinBmr: number | null = null;
        let harrisBmr: number | null = null;
        let katchBmr: number | null = null;
        
        if (areBaseInputsValid) {
            const s = inputs.gender === 'male' ? 5 : -161;
            mifflinBmr = (10 * w) + (6.25 * h) - (5 * a) + s;

            if (inputs.gender === 'male') {
                harrisBmr = (13.397 * w) + (4.799 * h) - (5.677 * a) + 88.362;
            } else {
                harrisBmr = (9.247 * w) + (3.098 * h) - (4.330 * a) + 447.593;
            }
        }

        if (areBaseInputsValid && isBodyFatValid) {
            const lbm = w * (1 - (bf / 100));
            katchBmr = 370 + (21.6 * lbm);
        }

        return { mifflinBmr, harrisBmr, katchBmr };
    }, [inputs]);

    const InputField: React.FC<{ name: keyof BmrInputs; label: string; unit: string; isOptional?: boolean; }> = ({ name, label, unit, isOptional = false }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-base-content/80 mb-1">
                {label} {isOptional && <span className="text-xs opacity-70">(Optional)</span>}
            </label>
            <div className="relative">
                <input
                    type="text" inputMode="decimal" id={name} name={name} value={inputs[name]}
                    onChange={(e) => handleInputChange(name, e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="w-full h-12 bg-base-100 rounded-lg text-center font-mono text-xl text-base-content focus:outline-none focus:ring-2 focus:ring-primary pr-12"
                    data-keyboard-aware="true" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50">{unit}</span>
            </div>
        </div>
    );
    
    const ResultCard: React.FC<{ title: string; description: string; bmrValue: number | null; tdeeValue: number | null; }> = ({ title, description, bmrValue, tdeeValue }) => (
        <div className="bg-base-100 p-4 rounded-lg text-center border border-base-300/50">
            <h4 className="font-semibold text-lg text-base-content">{title}</h4>
            <p className="text-xs text-base-content/60 mt-1 mb-3">{description}</p>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm font-bold opacity-70">BMR (Resting)</p>
                    <p className="text-2xl font-mono text-secondary font-bold">
                        {bmrValue !== null ? bmrValue.toFixed(0) : '---'}
                    </p>
                    <p className="text-xs opacity-70">calories/day</p>
                </div>
                <div>
                    <p className="text-sm font-bold opacity-70">TDEE (Active)</p>
                    <p className="text-2xl font-mono text-primary font-bold">
                        {tdeeValue !== null ? tdeeValue.toFixed(0) : '---'}
                    </p>
                     <p className="text-xs opacity-70">calories/day</p>
                </div>
            </div>
        </div>
    );


    return (
        <div className="space-y-6">
            <p className="text-sm text-center text-base-content/70">
                Your <strong className="text-base-content">Basal Metabolic Rate (BMR)</strong> is the number of calories your body needs for basic life-sustaining functions at rest.
            </p>

            <div className="bg-base-200 p-4 rounded-xl space-y-4">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InputField name="weight" label="Weight" unit="kg" />
                    <InputField name="height" label="Height" unit="cm" />
                    <InputField name="age" label="Age" unit="yrs" />
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-base-content/80 mb-1">Gender</label>
                        <select id="gender" name="gender" value={inputs.gender} onChange={(e) => handleInputChange('gender', e.target.value as Gender)}
                            className="w-full h-12 bg-base-100 rounded-lg text-center font-semibold text-base-content focus:outline-none focus:ring-2 focus:ring-primary appearance-none px-4">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                 </div>
                 <div className="flex justify-center">
                     <div className="w-full md:w-1/2">
                        <InputField name="bodyFat" label="Body Fat" unit="%" isOptional />
                     </div>
                 </div>
            </div>
            
            <div className="bg-base-200 p-4 rounded-xl space-y-3">
                <h3 className="font-semibold text-base-content text-center">Daily Activity Level</h3>
                <p className="text-xs text-center text-base-content/60 -mt-2">Select an activity level to estimate your Total Daily Energy Expenditure (TDEE).</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {activityLevels.map(level => (
                        <button
                            key={level.value}
                            onClick={() => setActivityLevel(level.value)}
                            className={`p-2 rounded-lg text-left transition-colors ${activityLevel === level.value ? 'bg-primary text-white shadow-md' : 'bg-base-100 hover:bg-base-300'}`}
                        >
                            <p className="font-bold text-sm">{level.label}</p>
                            <p className="text-xs opacity-80">{level.description}</p>
                        </button>
                    ))}
                </div>
            </div>
            
             <div className="space-y-4">
                 <h3 className="text-xl font-bold text-center">Results</h3>
                 <ResultCard
                    title="Mifflin-St Jeor"
                    description="The modern standard, recommended for the general population."
                    bmrValue={results.mifflinBmr}
                    tdeeValue={results.mifflinBmr ? results.mifflinBmr * activityLevel : null}
                />
                 <ResultCard
                    title="Revised Harris-Benedict"
                    description="A classic formula, widely used for many years."
                    bmrValue={results.harrisBmr}
                    tdeeValue={results.harrisBmr ? results.harrisBmr * activityLevel : null}
                />
                 <ResultCard
                    title="Katch-McArdle"
                    description="Requires body fat %. Highly accurate for leaner individuals."
                    bmrValue={results.katchBmr}
                    tdeeValue={results.katchBmr ? results.katchBmr * activityLevel : null}
                />
                 <button onClick={handleReset} className="w-full mt-2 py-2 bg-base-300 hover:bg-opacity-80 rounded-lg font-semibold text-sm">
                    Reset All
                 </button>
            </div>
        </div>
    );
};

export default BmrCalculator;
