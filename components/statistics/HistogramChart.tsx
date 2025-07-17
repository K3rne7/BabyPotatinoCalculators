
import React, { useMemo, useState } from 'react';
import { useCoreAppContext } from '../../hooks/useCoreAppContext';

interface HistogramChartProps {
    data: number[];
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

const HistogramChart: React.FC<HistogramChartProps> = ({ data }) => {
    const { theme } = useCoreAppContext();
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const [tooltip, setTooltip] = useState<{ content: string, x: number, y: number } | null>(null);
    
    const colors = {
        grid: isDark ? 'hsl(var(--bc) / 0.15)' : 'hsl(var(--bc) / 0.1)',
        axis: 'hsl(var(--bc) / 0.7)',
        text: 'hsl(var(--bc))',
        bar: 'hsl(var(--p))',
        barHover: 'hsl(var(--pf))',
    };

    const width = 500;
    const height = 300;
    const padding = { top: 20, right: 20, bottom: 40, left: 40 };

    const { bins, xDomain, yDomain } = useMemo(() => {
        if (data.length === 0) return { bins: [], xDomain: [0, 1], yDomain: [0, 1] };

        // Freedman-Diaconis rule for bin width
        const sortedData = [...data].sort((a, b) => a - b);
        const q1 = sortedData[Math.floor(sortedData.length / 4)];
        const q3 = sortedData[Math.floor(sortedData.length * 3 / 4)];
        const iqr = q3 - q1;
        let binWidth = (2 * iqr) / Math.pow(sortedData.length, 1 / 3);
        
        const min = sortedData[0];
        const max = sortedData[sortedData.length - 1];
        
        if(binWidth <= 0){
             // Fallback to Sturges' formula if IQR is 0
            const numBinsFallback = Math.ceil(1 + Math.log2(sortedData.length));
            binWidth = (max - min) / numBinsFallback || 1;
        }

        const numBins = Math.ceil((max - min) / binWidth) || 1;
        const generatedBins = Array.from({ length: numBins }, () => ({ count: 0, x0: 0, x1: 0 }));

        generatedBins.forEach((bin, i) => {
            bin.x0 = min + i * binWidth;
            bin.x1 = min + (i + 1) * binWidth;
            bin.count = sortedData.filter(d => d >= bin.x0 && d < bin.x1).length;
        });
        
        // Ensure the last data point is included if it falls exactly on the last boundary
        const lastBin = generatedBins[generatedBins.length -1];
        if(max === lastBin.x1) {
            lastBin.count++;
        }

        const maxY = Math.max(...generatedBins.map(b => b.count), 0);
        return {
            bins: generatedBins,
            xDomain: [generatedBins[0]?.x0 ?? 0, generatedBins[generatedBins.length - 1]?.x1 ?? 1],
            yDomain: [0, maxY],
        };
    }, [data]);

    const xScale = (value: number) => padding.left + ((value - xDomain[0]) / (xDomain[1] - xDomain[0])) * (width - padding.left - padding.right);
    const yScale = (value: number) => height - padding.bottom - ((value - yDomain[0]) / (yDomain[1] - yDomain[0] || 1)) * (height - padding.top - padding.bottom);
    
    const handleMouseOver = (e: React.MouseEvent, bin: typeof bins[0]) => {
        const rect = (e.target as SVGRectElement).getBoundingClientRect();
        const containerRect = (e.target as SVGRectElement).closest('svg')?.getBoundingClientRect();
        if(!containerRect) return;

        setTooltip({
            content: `<b>Range:</b> [${bin.x0.toFixed(2)}, ${bin.x1.toFixed(2)})<br/><b>Count:</b> ${bin.count}`,
            x: rect.x + rect.width / 2 - containerRect.left,
            y: rect.y - containerRect.top - 5
        });
    };
    
    const handleMouseOut = () => setTooltip(null);
    
    const numYTicks = 5;
    const yTicks = Array.from({ length: numYTicks + 1 }, (_, i) => yDomain[0] + (i / numYTicks) * (yDomain[1] - yDomain[0]));

    return (
        <div className="relative w-full">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full font-sans">
                {/* Axes and Grid */}
                <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke={colors.axis} />
                <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke={colors.axis} />

                {yTicks.map(tick => (
                    <g key={`y-tick-${tick}`} transform={`translate(0, ${yScale(tick)})`}>
                        <line x1={padding.left} x2={width - padding.right} stroke={colors.grid} strokeWidth="0.5" strokeDasharray="2,2" />
                        <text x={padding.left - 8} y="5" textAnchor="end" fontSize="11" fill={colors.text}>
                            {Math.round(tick)}
                        </text>
                    </g>
                ))}
                
                {/* Bars */}
                {bins.map((bin, i) => {
                    const x = xScale(bin.x0);
                    const y = yScale(bin.count);
                    const barWidth = xScale(bin.x1) - x;
                    const barHeight = height - padding.bottom - y;

                    return (
                        <g key={i}>
                            <rect
                                x={x}
                                y={y}
                                width={barWidth - 1}
                                height={barHeight}
                                fill={colors.bar}
                                className="transition-colors duration-150 hover:fill-primary-focus"
                                onMouseOver={(e) => handleMouseOver(e, bin)}
                                onMouseOut={handleMouseOut}
                            />
                             {bins.length < 15 && (
                                <text x={x + barWidth / 2} y={height - padding.bottom + 15} textAnchor="middle" fontSize="10" fill={colors.text}>
                                    {bin.x0.toFixed(0)}
                                </text>
                            )}
                        </g>
                    );
                })}
                 <text x={width/2} y={height-5} textAnchor="middle" fontSize="12" fontWeight="bold" fill={colors.text}>Value</text>
                 <text x={15} y={height/2} transform={`rotate(-90, 15, ${height/2})`} textAnchor="middle" fontSize="12" fontWeight="bold" fill={colors.text}>Frequency</text>
            </svg>
            {tooltip && <Tooltip {...tooltip} />}
        </div>
    );
};

export default HistogramChart;
