
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { RuffiniResult, RuffiniStep } from '../../types';
import { math } from '../../lib/mathInstance';
import type { Complex } from 'mathjs';

const formatValue = (val: Complex | number): string => {
    if (typeof val === 'number') {
        if (isNaN(val)) return 'N/A';
        if (Math.abs(val) < 1e-9) return '0';
        try {
            const frac = math.fraction(val);
            const n = frac.n;
            const d = frac.d;
            if (Number(d) < 1000) { // Prefer fractions for reasonable denominators
                return Number(d) === 1 ? `${(BigInt(frac.s) * (n as bigint))}` : `${frac.s < 0 ? '-' : ''}${n}/${d}`;
            }
        } catch {}
        // Fallback to decimal, using toPrecision for better formatting of various number sizes
        return Number.parseFloat(val.toPrecision(6)).toString();
    }
    if (val && typeof val === 'object' && 're' in val && 'im' in val) {
        if (Math.abs(val.im) < 1e-9) return formatValue(val.re);
        const reStr = formatValue(val.re);
        const imStr = formatValue(Math.abs(val.im));
        return `${reStr} ${val.im >= 0 ? '+' : '-'} ${imStr}i`;
    }
    return 'Invalid';
}


const RuffiniTable: React.FC<{ step: RuffiniStep }> = ({ step }) => {
    const { topRow, bottomRow, resultRow } = step.table;
    const numCoeffs = topRow.length;

    return (
        <div className="bg-base-100 p-3 rounded-lg my-4 overflow-x-auto inline-block">
            <table className="border-collapse font-mono">
                <tbody>
                    {/* Top Row: coefficients */}
                    <tr>
                        <td className="py-1 pr-2"></td>
                        <td className="py-1 pl-2 border-r-2 border-base-content/50"></td>
                        {topRow.map((c, i) => (
                            <td key={`top-${i}`} className={`px-2 py-1 text-center font-semibold text-base-content ${i === numCoeffs - 1 ? 'border-l-2 border-base-content/50' : ''}`}>
                                {formatValue(c)}
                            </td>
                        ))}
                    </tr>

                    {/* Middle Row: root and products */}
                    <tr className="border-b-2 border-base-content/50">
                        <td className="py-1 pr-2 font-bold text-lg text-base-content">{formatValue(step.root)}</td>
                        <td className="py-1 pl-2 border-r-2 border-base-content/50"></td>
                        {bottomRow.map((c, i) => (
                             <td key={`bottom-${i}`} className={`px-2 py-1 text-center text-base-content ${i === numCoeffs - 1 ? 'border-l-2 border-base-content/50' : ''}`}>
                                {c !== null ? formatValue(c) : ''}
                            </td>
                        ))}
                    </tr>

                    {/* Result Row */}
                    <tr>
                        <td className="pt-1 pr-2"></td>
                        <td className="pt-1 pl-2 border-r-2 border-base-content/50"></td>
                        {resultRow.map((c, i) => (
                             <td key={`res-${i}`} className={`px-2 pt-1 text-center font-bold ${i === numCoeffs - 1 ? 'border-l-2 border-base-content/50 text-primary' : 'text-base-content'}`}>
                                {formatValue(c)}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};


const RuffiniResultDisplay: React.FC<{ result: RuffiniResult }> = ({ result }) => {
    return (
        <div className="space-y-6 mt-4 animate-fade-in-up">
            <div>
                <h3 className="text-lg font-bold">Roots Found</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                   {result.roots.length > 0 ? result.roots.map((root, i) => (
                       <span key={i} className="px-3 py-1 bg-primary/20 text-primary font-mono rounded-full text-sm">
                           {formatValue(root)}
                       </span>
                   )) : <p className="text-sm text-base-content/70">No rational roots found.</p>}
                </div>
            </div>

             {result.steps.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold">Steps</h3>
                    {result.steps.map((step, i) => (
                        <RuffiniTable key={i} step={step} />
                    ))}
                </div>
             )}

            <div>
                <h3 className="text-lg font-bold">Final Factored Form</h3>
                 <div className="mt-2 p-4 bg-base-100 rounded-lg text-center text-xl katex-display">
                    <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[[rehypeKatex, { output: 'mathml' }]]}
                    >
                       {`$$ ${result.finalString} $$`}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
};

export default RuffiniResultDisplay;
