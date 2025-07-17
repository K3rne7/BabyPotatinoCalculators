import React from 'react';
import type { TrigFunction } from '../modes/TrigCircleCalculator';
import CustomSelect from '../ui/CustomSelect';

interface TrigControlsProps {
    angle: number;
    setAngle: (angle: number) => void;
    selectedFunc: TrigFunction;
    setSelectedFunc: (func: TrigFunction) => void;
}

const functionGroups: { label: string; functions: TrigFunction[] }[] = [
    { label: 'Direct', functions: ['sin', 'cos', 'tan', 'csc', 'sec', 'cot'] },
    { label: 'Inverse', functions: ['asin', 'acos', 'atan'] },
    { label: 'Hyperbolic', functions: ['sinh', 'cosh', 'tanh'] },
];

const TrigControls: React.FC<TrigControlsProps> = ({ angle, setAngle, selectedFunc, setSelectedFunc }) => {

    const selectOptions = functionGroups.flatMap(group => ([
        { value: group.label, label: group.label, isHeader: true },
        ...group.functions.map(f => ({ value: f, label: f }))
    ]));

    return (
        <div className="bg-base-200 p-3 rounded-lg space-y-4">
            <div>
                <label htmlFor="trig-func-select" className="block text-sm font-medium text-base-content/80 mb-1">Function</label>
                <CustomSelect
                    options={selectOptions}
                    value={selectedFunc}
                    onChange={(val) => setSelectedFunc(val as TrigFunction)}
                    variant="solid"
                />
            </div>

            <div>
                <label htmlFor="angle-slider" className="block text-sm font-medium text-base-content/80 mb-1">Angle: {angle.toFixed(1)}°</label>
                <input
                    id="angle-slider"
                    type="range"
                    min="0"
                    max="360"
                    step="0.1"
                    value={angle}
                    onChange={(e) => setAngle(parseFloat(e.target.value))}
                    className="w-full h-2 bg-base-300 rounded-lg appearance-none cursor-pointer range-thumb:bg-primary"
                />
            </div>
        </div>
    );
};

export default TrigControls;