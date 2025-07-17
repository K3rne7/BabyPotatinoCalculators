
import React, { useState } from 'react';
import { DescriptiveStatisticsResults } from '../../types';
import { useCoreAppContext } from '../../hooks/useCoreAppContext';

interface BoxPlotChartProps {
    stats: DescriptiveStatisticsResults;
}

const Tooltip: React.FC<{ content: string; x: number; y: number }> = ({ content, x, y }) => {
    return (
        <div 
            className="absolute p-2 text-xs bg-base-300 text-base-content rounded-md shadow-lg pointer-events-none"
            style={{ left: x, top: y, transform: 'translate(-50%, -100%)' }}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};


const BoxPlotChart: React.FC<BoxPlotChartProps> = ({ stats }) => {
    const { theme } = useCoreAppContext();
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    const [tooltip, setTooltip] = useState<{ content: string, x: number, y: number } | null>(null);

    const colors = {
        grid: isDark ? 'hsl(var(--bc) / 0.15)' : 'hsl(var(--bc) / 0.1)',
        axis: 'hsl(var(--bc) / 0.7)',
        text: 'hsl(var(--bc))',
        box: 'hsl(var(--p) / 0.2)',
        boxStroke: 'hsl(var(--p))',
        median: 'hsl(var(--s))',
        outlier: 'hsl(var(--a))',
    };

    const width = 500;
    const height = 150;
    const padding = { top: 20, right: 20, bottom: 40, left: 20 };

    const dataMin = stats.min;
    const dataMax = stats.max;
    const range = dataMax - dataMin;
    const extendedRange = range === 0 ? 1 : range * 1.2;
    const domainMin = dataMin - (extendedRange - range) / 2;
    const domainMax = dataMax + (extendedRange - range) / 2;

    const xScale = (value: number) => {
        if (domainMax === domainMin) return padding.left;
        return padding.left + ((value - domainMin) / (domainMax - domainMin)) * (width - padding.left - padding.right);
    };

    const lowerWhisker = Math.max(stats.min, stats.q1 - 1.5 * stats.iqr);
    const upperWhisker = Math.min(stats.max, stats.q3 + 1.5 * stats.iqr);

    const boxY = padding.top;
    const boxHeight = height - padding.top - padding.bottom;
    const centerY = boxY + boxHeight / 2;
    
    const handleMouseOver = (e: React.MouseEvent, label: string, value: number) => {
        const rect = (e.target as SVGRectElement).getBoundingClientRect();
        const containerRect = (e.target as SVGRectElement).closest('svg')?.getBoundingClientRect();
        if (!containerRect) return;

        setTooltip({
            content: `<b>${label}:</b> ${value.toFixed(2)}`,
            x: rect.x + rect.width / 2 - containerRect.left,
            y: rect.y - containerRect.top - 5
        });
    };

    const handleMouseOut = () => setTooltip(null);
    
    const numTicks = 5;
    const ticks = Array.from({ length: numTicks + 1 }, (_, i) => domainMin + (i / numTicks) * (domainMax - domainMin));

    return (
        <div className="relative w-full">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full font-sans">
                {/* Ticks and Grid */}
                {ticks.map((tick, i) => (
                    <g key={i} transform={`translate(${xScale(tick)}, 0)`}>
                        <line y1={padding.top} y2={height - padding.bottom} stroke={colors.grid} strokeWidth="1" />
                        <text y={height - padding.bottom + 15} textAnchor="middle" fontSize="11" fill={colors.text}>
                            {tick.toFixed(1)}
                        </text>
                    </g>
                ))}

                {/* Center Line */}
                <line x1={xScale(lowerWhisker)} y1={centerY} x2={xScale(upperWhisker)} y2={centerY} stroke={colors.axis} strokeWidth="1.5" />

                {/* Box */}
                <rect 
                    x={xScale(stats.q1)} 
                    y={boxY} 
                    width={xScale(stats.q3) - xScale(stats.q1)} 
                    height={boxHeight} 
                    fill={colors.box} 
                    stroke={colors.boxStroke} 
                    strokeWidth="2" 
                    rx="2"
                    onMouseOver={(e) => handleMouseOver(e, 'IQR', stats.iqr)}
                    onMouseOut={handleMouseOut}
                />

                {/* Whiskers */}
                <line x1={xScale(lowerWhisker)} y1={boxY} x2={xScale(lowerWhisker)} y2={boxY + boxHeight} stroke={colors.axis} strokeWidth="2" onMouseOver={(e) => handleMouseOver(e, 'Lower Fence', lowerWhisker)} onMouseOut={handleMouseOut}/>
                <line x1={xScale(upperWhisker)} y1={boxY} x2={xScale(upperWhisker)} y2={boxY + boxHeight} stroke={colors.axis} strokeWidth="2" onMouseOver={(e) => handleMouseOver(e, 'Upper Fence', upperWhisker)} onMouseOut={handleMouseOut}/>

                {/* Median Line */}
                <line 
                    x1={xScale(stats.median)} 
                    y1={boxY} 
                    x2={xScale(stats.median)} 
                    y2={boxY + boxHeight} 
                    stroke={colors.median} 
                    strokeWidth="3"
                    onMouseOver={(e) => handleMouseOver(e, 'Median', stats.median)} 
                    onMouseOut={handleMouseOut}
                />
                
                 {/* Outliers */}
                {stats.outliers.map((outlier, i) => (
                    <circle 
                        key={i} 
                        cx={xScale(outlier)} 
                        cy={centerY} 
                        r="4" 
                        fill={colors.outlier} 
                        stroke={colors.text} 
                        strokeWidth="0.5"
                        onMouseOver={(e) => handleMouseOver(e, 'Outlier', outlier)} 
                        onMouseOut={handleMouseOut}
                    />
                ))}
            </svg>
            {tooltip && <Tooltip {...tooltip} />}
        </div>
    );
};

export default BoxPlotChart;
