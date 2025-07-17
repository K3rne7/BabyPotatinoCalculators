


import React, { useEffect, useRef } from 'react';
import { GraphFunction } from '../../types';
import { useCoreAppContext } from '../../hooks/useCoreAppContext';
import { useGraphingContext } from '../../hooks/useGraphingContext';

interface FunctionPlotOptions {
  target: HTMLDivElement;
  width?: number;
  height?: number;
  grid?: boolean;
  xAxis?: { label?: string; domain?: [number, number], color?: string };
  yAxis?: { label?: string; domain?: [number, number], color?: string };
  data: {
    fn: string;
    color: string;
    graphType: 'polyline';
  }[];
  tip?: {
    xLine?: boolean;
    yLine?: boolean;
    renderer?: (x: number, y: number, index: number) => string;
  };
  plugins?: any[];
}

declare const functionPlot: any;

interface GraphDisplayProps {
  functions: GraphFunction[];
}

const sanitizeExpressionForPlot = (exp: string): string => {
  return exp.replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-')
            .replace(/π/g, '(pi)');
};

const GraphDisplay: React.FC<GraphDisplayProps> = ({ functions }) => {
  const graphRef = useRef<HTMLDivElement>(null);
  const { theme } = useCoreAppContext(); 
  const { exportRequestTimestamp } = useGraphingContext();
  const instanceRef = useRef<any>(null);

  // PNG Export Logic
  useEffect(() => {
    if (exportRequestTimestamp === null) return;

    let attempts = 0;
    const maxAttempts = 10;
    const interval = 100;

    const tryExport = () => {
        const svgElement = graphRef.current?.querySelector('svg');
        if (svgElement) {
            const serializer = new XMLSerializer();
            const source = serializer.serializeToString(svgElement);
            
            const canvas = document.createElement('canvas');
            const rect = svgElement.getBoundingClientRect();
            
            const scale = 2; // For higher resolution
            canvas.width = rect.width * scale;
            canvas.height = rect.height * scale;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const img = new Image();
            const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            img.onload = () => {
              // Set background color based on theme
              ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#121829' : '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              URL.revokeObjectURL(url);
              
              const pngUrl = canvas.toDataURL('image/png');
              const link = document.createElement('a');
              link.download = `calculator-graph-${Date.now()}.png`;
              link.href = pngUrl;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            };

            img.onerror = () => {
              console.error("Failed to load SVG image for canvas conversion.");
              URL.revokeObjectURL(url);
            };
            
            img.src = url;
        } else {
            attempts++;
            if (attempts < maxAttempts) {
                setTimeout(tryExport, interval);
            } else {
                console.error('Could not find SVG element to export after multiple attempts.');
            }
        }
    };
    
    tryExport();

  }, [exportRequestTimestamp]);


  useEffect(() => {
    const container = graphRef.current;
    if (!container) return;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const themeColors = {
        grid: isDark ? 'hsla(210, 40%, 98%, 0.1)' : 'hsla(215, 28%, 17%, 0.1)',
        axis: isDark ? 'hsla(210, 40%, 98%, 0.4)' : 'hsla(215, 28%, 17%, 0.4)',
        text: isDark ? 'hsl(210, 40%, 98%)' : 'hsl(215, 28%, 17%)',
    };


    const plot = () => {
        if (typeof functionPlot === 'undefined' || container.clientWidth === 0 || container.clientHeight === 0) {
            container.innerHTML = `<div class="flex items-center justify-center h-full text-yellow-500 p-4 text-center"><p>Graphing area is initializing...</p></div>`;
            return;
        }

        const data = functions
          .map(f => ({ ...f, expression: sanitizeExpressionForPlot(f.expression) }))
          .filter(f => f.expression.trim() !== '')
          .map(f => ({
            fn: f.expression,
            color: f.color,
            graphType: 'polyline' as const,
          }));

        try {
          container.innerHTML = '';
          instanceRef.current = functionPlot({
            target: container,
            width: container.clientWidth,
            height: container.clientHeight,
            grid: true,
            xAxis: { label: 'x-axis', color: themeColors.axis },
            yAxis: { label: 'y-axis', color: themeColors.axis },
            data,
            tip: {
              xLine: true,
              yLine: true,
              renderer: (x: number, y: number) => `(${x.toFixed(3)}, ${y.toFixed(3)})`
            }
          });

          // Post-plot SVG styling for theme-awareness
          const svg = container.querySelector('svg');
          if(svg) {
              svg.querySelectorAll('.grid .tick line').forEach(el => el.setAttribute('stroke', themeColors.grid));
              svg.querySelectorAll('.axis .tick text').forEach(el => el.setAttribute('fill', themeColors.text));
              svg.querySelectorAll('.axis-label').forEach(el => el.setAttribute('fill', themeColors.text));
          }

        } catch (e) {
          console.error("Function plot error:", e);
          container.innerHTML = `<div class="flex items-center justify-center h-full text-red-500 p-4 text-center"><p>Error plotting function. Check your expression(s).<br/><small class="opacity-70">${(e as Error)?.message || ''}</small></p></div>`;
        }
    };

    const resizeObserver = new ResizeObserver(plot);
    resizeObserver.observe(container);

    // Defer initial plot to ensure the container has rendered and has its dimensions
    const timerId = setTimeout(plot, 0);

    return () => {
      clearTimeout(timerId);
      resizeObserver.disconnect();
    };
  }, [functions, theme]);

  return <div ref={graphRef} className="w-full h-full" />;
};

export default GraphDisplay;
