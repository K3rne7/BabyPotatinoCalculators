import React, { useMemo } from 'react';
import type { TrigFunction } from '../modes/TrigCircleCalculator';
import { useCoreAppContext } from '../../hooks/useCoreAppContext';

interface Trig2DGraphProps {
    angle: number;
    selectedFunc: TrigFunction;
}

type FunctionType = 'direct' | 'inverse' | 'hyperbolic';

const getFunctionType = (func: TrigFunction): FunctionType => {
    if (['asin', 'acos', 'atan'].includes(func)) return 'inverse';
    if (['sinh', 'cosh', 'tanh'].includes(func)) return 'hyperbolic';
    return 'direct';
};

const Trig2DGraph: React.FC<Trig2DGraphProps> = ({ angle, selectedFunc }) => {
    const { theme } = useCoreAppContext();
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const colors = {
        grid: isDark ? 'hsla(var(--bc) / 0.1)' : 'hsla(var(--bc) / 0.1)',
        axis: isDark ? 'hsla(var(--bc) / 0.4)' : 'hsla(var(--bc) / 0.4)',
        text: 'hsl(var(--bc))',
        curve: 'hsl(var(--p))',
        segment: isDark ? '#a3e635' : '#581c87', // lime-500, purple-900
    };

    const width = 500;
    const height = 300;
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };

    const functionType = getFunctionType(selectedFunc);

    const { xDomain, yDomain, xTicks, yTicks, xTickLabels, yTickLabels } = useMemo(() => {
        switch (functionType) {
            case 'inverse':
                return {
                    xDomain: [-1.5, 1.5],
                    yDomain: [-Math.PI, Math.PI],
                    xTicks: [-1, -0.5, 0, 0.5, 1],
                    yTicks: [-Math.PI, -Math.PI/2, 0, Math.PI/2, Math.PI],
                    xTickLabels: (tick: number) => tick.toString(),
                    yTickLabels: (tick: number) => {
                        if (tick === 0) return '0';
                        if (tick === Math.PI) return 'π';
                        if (tick === -Math.PI) return '-π';
                        if (tick === Math.PI/2) return 'π/2';
                        if (tick === -Math.PI/2) return '-π/2';
                        return '';
                    }
                };
            case 'hyperbolic':
                return {
                    xDomain: [-3, 3],
                    yDomain: [-5, 5],
                    xTicks: [-3, -2, -1, 0, 1, 2, 3],
                    yTicks: [-4, -2, 0, 2, 4],
                    xTickLabels: (tick: number) => tick.toString(),
                    yTickLabels: (tick: number) => tick.toString(),
                };
            case 'direct':
            default:
                 const yMax = ['tan', 'csc', 'sec', 'cot'].includes(selectedFunc) ? 4 : 1.5;
                return {
                    xDomain: [0, 2 * Math.PI],
                    yDomain: [-yMax, yMax],
                    xTicks: [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI],
                    yTicks: Array.from({length: Math.floor(yMax*2)+1}, (_, i) => Math.round(-yMax + i)),
                    xTickLabels: (tick: number) => {
                         if (tick === 0) return '0';
                         if (tick === Math.PI/2) return 'π/2';
                         if (tick === Math.PI) return 'π';
                         if (tick === (3 * Math.PI) / 2) return '3π/2';
                         if (tick === 2 * Math.PI) return '2π';
                         return '';
                    },
                    yTickLabels: (tick: number) => tick.toString(),
                };
        }
    }, [functionType, selectedFunc]);

    const xScale = (x: number) => padding.left + ((x - xDomain[0]) / (xDomain[1] - xDomain[0])) * (width - padding.left - padding.right);
    const yScale = (y: number) => (height - padding.bottom) - ((y - yDomain[0]) / (yDomain[1] - yDomain[0])) * (height - padding.top - padding.bottom);

    const func = useMemo(() => {
        switch (selectedFunc) {
            case 'sin': return Math.sin;
            case 'cos': return Math.cos;
            case 'tan': return Math.tan;
            case 'csc': return (x: number) => 1 / Math.sin(x);
            case 'sec': return (x: number) => 1 / Math.cos(x);
            case 'cot': return (x: number) => 1 / Math.tan(x);
            case 'asin': return Math.asin;
            case 'acos': return Math.acos;
            case 'atan': return Math.atan;
            case 'sinh': return Math.sinh;
            case 'cosh': return Math.cosh;
            case 'tanh': return Math.tanh;
            default: return (x: number) => NaN;
        }
    }, [selectedFunc]);

    const pathData = useMemo(() => {
        let d = '';
        let lastYIsValid = false;
        const [xMin, xMax] = xDomain;

        for (let i = 0; i <= width; i++) {
            const xVal = xMin + (i / width) * (xMax - xMin);
            
            // For inverse functions with restricted domains
            if (functionType === 'inverse' && (selectedFunc === 'asin' || selectedFunc === 'acos') && (xVal < -1 || xVal > 1)) {
                lastYIsValid = false;
                continue;
            }

            const yVal = func(xVal);
            const yIsValid = isFinite(yVal) && yVal >= yDomain[0] * 1.1 && yVal <= yDomain[1] * 1.1;

            if (yIsValid) {
                const px = xScale(xVal);
                const py = yScale(yVal);
                if (lastYIsValid) {
                    d += ` L ${px} ${py}`;
                } else {
                    d += ` M ${px} ${py}`;
                }
            }
            lastYIsValid = yIsValid;
        }
        return d;
    }, [func, width, xDomain, yDomain, xScale, yScale, functionType, selectedFunc]);
    
    const { currentXValue, currentYValue } = useMemo(() => {
        const rad = angle * (Math.PI / 180);
        let xVal: number;
        
        switch(functionType) {
            case 'inverse':
                // The input to the inverse function is the result of the direct function
                if (selectedFunc === 'asin') xVal = Math.sin(rad);
                else if (selectedFunc === 'acos') xVal = Math.cos(rad);
                else if (selectedFunc === 'atan') xVal = Math.tan(rad);
                else xVal = NaN;
                break;
            case 'direct':
            case 'hyperbolic':
            default:
                 xVal = rad;
                 break;
        }
        
        // Clamp xVal to domain for stability
        const clampedX = Math.max(xDomain[0], Math.min(xVal, xDomain[1]));
        const yVal = func(clampedX);

        return { currentXValue: clampedX, currentYValue: yVal };

    }, [angle, selectedFunc, functionType, func, xDomain]);
    
    const currentX = xScale(currentXValue);
    const currentY = yScale(currentYValue);

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Grid Lines */}
            {yTicks.map(tick => (
                <line key={`y-grid-${tick}`} x1={padding.left} y1={yScale(tick)} x2={width - padding.right} y2={yScale(tick)} stroke={colors.grid} strokeWidth="0.5"/>
            ))}
            {xTicks.map(tick => (
                <line key={`x-grid-${tick}`} x1={xScale(tick)} y1={padding.top} x2={xScale(tick)} y2={height - padding.bottom} stroke={colors.grid} strokeWidth="0.5"/>
            ))}

            {/* Axes */}
            <line x1={padding.left} y1={yScale(0)} x2={width - padding.right} y2={yScale(0)} stroke={colors.axis} strokeWidth="1" />
            <line x1={xScale(0)} y1={padding.top} x2={xScale(0)} y2={height - padding.bottom} stroke={colors.axis} strokeWidth="1" />
            
            {/* Ticks and Labels */}
            {xTicks.map((tick) => (
                 <g key={`x-tick-${tick}`}>
                    <text x={xScale(tick)} y={height - padding.bottom + 22} fill={colors.text} textAnchor="middle" fontSize="16" className="font-sans">{xTickLabels(tick)}</text>
                </g>
            ))}
             {yTicks.filter(t => t !== 0).map(tick => (
                 <g key={`y-tick-${tick}`}>
                    <text x={padding.left - 10} y={yScale(tick) + 5} fill={colors.text} textAnchor="end" fontSize="14" className="font-sans">{yTickLabels(tick)}</text>
                </g>
            ))}

            {/* Function Curve */}
            <path d={pathData} stroke={colors.curve} strokeWidth="2.5" fill="none" />
            
            {/* Moving Segment */}
            {isFinite(currentYValue) && currentY >= padding.top && currentY <= height - padding.bottom && (
                 <>
                    <line x1={currentX} y1={yScale(0)} x2={currentX} y2={currentY} stroke={colors.segment} strokeWidth="2.5" />
                    <circle cx={currentX} cy={currentY} r="4" fill={colors.segment} />
                 </>
            )}
        </svg>
    );
};

export default Trig2DGraph;