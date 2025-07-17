import React, { useState } from 'react';
import TrigControls from '../trig_circle/TrigControls';
import TrigCircleSVG from '../trig_circle/TrigCircleSVG';
import TrigInfoBox from '../trig_circle/TrigInfoBox';
import Trig2DGraph from '../trig_circle/Trig2DGraph';

export type TrigFunction = 
    | 'sin' | 'cos' | 'tan' | 'csc' | 'sec' | 'cot'
    | 'asin' | 'acos' | 'atan'
    | 'sinh' | 'cosh' | 'tanh';

const TrigCircleCalculator: React.FC = () => {
    const [angle, setAngle] = useState(45); // in degrees
    const [selectedFunc, setSelectedFunc] = useState<TrigFunction>('sin');

    return (
        <div className="flex flex-col h-full gap-3">
            <div className="flex flex-col lg:flex-row gap-3 flex-grow overflow-y-auto pr-2">
                {/* Left side with graphs */}
                <div className="w-full lg:w-2/3 flex flex-col gap-3 order-2 lg:order-1 min-h-[300px]">
                    <div className="flex-1 bg-base-100 rounded-lg p-2 min-h-0">
                         <Trig2DGraph
                            angle={angle}
                            selectedFunc={selectedFunc}
                         />
                    </div>
                     <div className="flex-1 bg-base-100 rounded-lg p-2 min-h-0">
                        <TrigCircleSVG
                            angle={angle}
                            selectedFunc={selectedFunc}
                        />
                    </div>
                </div>

                {/* Right side with controls and info */}
                <div className="w-full lg:w-1/3 space-y-3 order-1 lg:order-2 flex-shrink-0">
                    <TrigControls
                        angle={angle}
                        setAngle={setAngle}
                        selectedFunc={selectedFunc}
                        setSelectedFunc={setSelectedFunc}
                    />
                    <TrigInfoBox
                        angle={angle}
                        radius={1} // Info box should always use unit circle radius
                        selectedFunc={selectedFunc}
                    />
                </div>
            </div>
        </div>
    );
};

export default TrigCircleCalculator;