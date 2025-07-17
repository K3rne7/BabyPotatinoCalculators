import React from 'react';
import type { TrigFunction } from '../modes/TrigCircleCalculator';
import { useCoreAppContext } from '../../hooks/useCoreAppContext';

interface TrigCircleSVGProps {
    angle: number;
    selectedFunc: TrigFunction;
}

const TrigCircleSVG: React.FC<TrigCircleSVGProps> = ({ angle, selectedFunc }) => {
    const { theme } = useCoreAppContext();
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const colors = {
        grid: isDark ? 'hsla(var(--bc) / 0.1)' : 'hsla(var(--bc) / 0.1)',
        axis: isDark ? 'hsla(var(--bc) / 0.3)' : 'hsla(var(--bc) / 0.4)',
        text: 'hsl(var(--bc))',
        circle: 'hsl(var(--p) / 0.5)',
        hypotenuse: 'hsl(var(--p))',
        point: 'hsl(var(--p))',
        segment: isDark ? '#a3e635' : '#581c87', // lime-500, purple-900
    };

    const viewBoxSize = 250;
    const center = viewBoxSize / 2;
    const effectiveRadius = 110;

    const rad = angle * (Math.PI / 180);
    const x = center + effectiveRadius * Math.cos(rad);
    const y = center - effectiveRadius * Math.sin(rad);

    // For tangent line
    const tanX = center + effectiveRadius;
    const tanY = center - effectiveRadius * Math.tan(rad);

    // For cotangent line
    const cotY = center - effectiveRadius;
    const cotX = center + effectiveRadius / Math.tan(rad);

    const isInverse = selectedFunc.startsWith('a');

    const getArcPath = (r: number, startAngle: number, endAngle: number) => {
        const start = { x: center + r * Math.cos(startAngle), y: center - r * Math.sin(startAngle) };
        const end = { x: center + r * Math.cos(endAngle), y: center - r * Math.sin(endAngle) };
        const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";
        // Sweep flag is 1 for positive angles, 0 for negative, but we use 0 to draw correctly in SVG coords
        return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
    };

    const renderFunctionLine = () => {
        const commonProps = { strokeWidth: "2.5", strokeLinecap: "round" as const };
        switch (selectedFunc) {
            case 'sin':
                return <line x1={x} y1={y} x2={x} y2={center} stroke={colors.segment} {...commonProps} />;
            case 'cos':
                return <line x1={x} y1={y} x2={center} y2={y} stroke={colors.segment} {...commonProps} />;
            case 'tan':
                return <>
                    <line x1={tanX} y1={center} x2={tanX} y2={tanY} stroke={colors.segment} {...commonProps} />
                    <line x1={center} y1={center} x2={tanX} y2={tanY} stroke={colors.text} opacity="0.3" strokeDasharray="2" strokeWidth="1" />
                </>;
            case 'csc':
                 return <line x1={center} y1={center} x2={cotX} y2={cotY} stroke={colors.segment} {...commonProps} />;
            case 'sec':
                 return <line x1={center} y1={center} x2={tanX} y2={tanY} stroke={colors.segment} {...commonProps} />;
            case 'cot':
                return <>
                    <line x1={center} y1={cotY} x2={cotX} y2={cotY} stroke={colors.segment} {...commonProps} />
                    <line x1={center} y1={center} x2={cotX} y2={cotY} stroke={colors.text} opacity="0.3" strokeDasharray="2" strokeWidth="1"/>
                </>
            default:
                return null;
        }
    };

    return (
        <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Axes */}
            <line x1="0" y1={center} x2={viewBoxSize} y2={center} stroke={colors.axis} strokeWidth="1" />
            <line x1={center} y1="0" x2={center} y2={viewBoxSize} stroke={colors.axis} strokeWidth="1" />

            {/* Circle */}
            <circle cx={center} cy={center} r={effectiveRadius} fill="transparent" stroke={colors.circle} strokeWidth="1.5" />
            
            {/* Angle Arc */}
            <path d={getArcPath(20, 0, rad)} fill="none" stroke={colors.hypotenuse} className={`${isInverse ? 'stroke-2' : ''}`} strokeWidth="1.5" />
            <text x={center + 25} y={center - 10} fontSize="10" fill={colors.text}>θ</text>

            {/* Hypotenuse */}
            <line x1={center} y1={center} x2={x} y2={y} stroke={colors.hypotenuse} strokeWidth="1.5" />

            {/* Function-specific lines */}
            {renderFunctionLine()}

            {/* Point P */}
            <circle cx={x} cy={y} r="3" fill={colors.point} />
            <text x={x + 5} y={y > center ? y + 12 : y - 5} fontSize="9" fill={colors.text} className="font-sans">{`P(x,y)`}</text>

            {/* Axes Labels */}
            <text x={viewBoxSize - 15} y={center - 5} fontSize="11" fill={colors.text} className="font-sans">X</text>
            <text x={center + 5} y={15} fontSize="11" fill={colors.text} className="font-sans">Y</text>
            <text x={center + effectiveRadius - 10} y={center + 12} fontSize="9" fill={colors.text} className="font-sans">r</text>
        </svg>
    );
};

export default TrigCircleSVG;