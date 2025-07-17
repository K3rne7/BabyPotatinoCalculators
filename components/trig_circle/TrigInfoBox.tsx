
import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { TrigFunction } from '../modes/TrigCircleCalculator';

interface TrigInfoBoxProps {
    angle: number;
    radius: number;
    selectedFunc: TrigFunction;
}

const TrigInfoBox: React.FC<TrigInfoBoxProps> = ({ angle, radius, selectedFunc }) => {

    const { formula, radAngle, x, y } = useMemo(() => {
        const rad = angle * (Math.PI / 180);
        const cosVal = Math.cos(rad);
        const sinVal = Math.sin(rad);

        const coords = {
            x: radius * cosVal,
            y: radius * sinVal,
        };

        let calculatedResult: number = NaN;
        let formulaStr = '';

        const directResult = (val: number) => isFinite(val) ? val.toFixed(4) : 'Undefined';

        switch(selectedFunc) {
            case 'sin':
                calculatedResult = sinVal;
                formulaStr = `\\begin{aligned} \\sin(\\theta) &= \\frac{y}{r} \\\\ &= \\frac{${coords.y.toFixed(2)}}{${radius}} \\\\ &= ${directResult(calculatedResult)} \\end{aligned}`;
                break;
            case 'cos':
                calculatedResult = cosVal;
                formulaStr = `\\begin{aligned} \\cos(\\theta) &= \\frac{x}{r} \\\\ &= \\frac{${coords.x.toFixed(2)}}{${radius}} \\\\ &= ${directResult(calculatedResult)} \\end{aligned}`;
                break;
            case 'tan':
                calculatedResult = sinVal / cosVal;
                formulaStr = `\\begin{aligned} \\tan(\\theta) &= \\frac{y}{x} \\\\ &= \\frac{${coords.y.toFixed(2)}}{${coords.x.toFixed(2)}} \\\\ &= ${directResult(calculatedResult)} \\end{aligned}`;
                break;
            case 'csc':
                calculatedResult = 1 / sinVal;
                formulaStr = `\\begin{aligned} \\csc(\\theta) &= \\frac{r}{y} \\\\ &= \\frac{${radius}}{${coords.y.toFixed(2)}} \\\\ &= ${directResult(calculatedResult)} \\end{aligned}`;
                break;
            case 'sec':
                calculatedResult = 1 / cosVal;
                formulaStr = `\\begin{aligned} \\sec(\\theta) &= \\frac{r}{x} \\\\ &= \\frac{${radius}}{${coords.x.toFixed(2)}} \\\\ &= ${directResult(calculatedResult)} \\end{aligned}`;
                break;
            case 'cot':
                calculatedResult = cosVal / sinVal;
                formulaStr = `\\begin{aligned} \\cot(\\theta) &= \\frac{x}{y} \\\\ &= \\frac{${coords.x.toFixed(2)}}{${coords.y.toFixed(2)}} \\\\ &= ${directResult(calculatedResult)} \\end{aligned}`;
                break;
            case 'asin':
                calculatedResult = Math.asin(sinVal) * (180/Math.PI);
                formulaStr = `\\arcsin(${sinVal.toFixed(2)}) = ${directResult(calculatedResult)}°`;
                break;
            case 'acos':
                calculatedResult = Math.acos(cosVal) * (180/Math.PI);
                formulaStr = `\\arccos(${cosVal.toFixed(2)}) = ${directResult(calculatedResult)}°`;
                break;
            case 'atan':
                calculatedResult = Math.atan(sinVal / cosVal) * (180/Math.PI);
                formulaStr = `\\arctan(${(sinVal / cosVal).toFixed(2)}) = ${directResult(calculatedResult)}°`;
                break;
            case 'sinh':
                calculatedResult = Math.sinh(rad);
                formulaStr = `\\sinh(\\theta_{rad}) = ${directResult(calculatedResult)}`;
                break;
            case 'cosh':
                calculatedResult = Math.cosh(rad);
                formulaStr = `\\cosh(\\theta_{rad}) = ${directResult(calculatedResult)}`;
                break;
            case 'tanh':
                calculatedResult = Math.tanh(rad);
                formulaStr = `\\tanh(\\theta_{rad}) = ${directResult(calculatedResult)}`;
                break;
            default:
                 calculatedResult = NaN;
                 formulaStr = `${selectedFunc} not implemented`;
        }

        return {
            formula: `$$ ${formulaStr} $$`,
            radAngle: rad,
            x: coords.x,
            y: coords.y
        };

    }, [angle, radius, selectedFunc]);
    
    return (
        <div className="bg-base-200 p-3 rounded-lg space-y-2 text-center text-sm">
            <h3 className="font-bold text-base-content">Calculations</h3>
            <div className="bg-base-100 p-2 rounded-md">
                <p>Angle (rad): {radAngle.toFixed(4)}</p>
                <p>Point (x, y): ({x.toFixed(2)}, {y.toFixed(2)})</p>
            </div>
             <div className="katex-display text-base">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {formula}
                </ReactMarkdown>
            </div>
        </div>
    );
};

export default TrigInfoBox;