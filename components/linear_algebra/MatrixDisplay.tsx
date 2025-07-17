

import React from 'react';
import type { Complex } from 'mathjs';
import { math as mathjs } from '../../lib/mathInstance';
import type { MatrixOperationResult } from '../../types';

const formatNumber = (num: number) => {
    if (typeof num !== 'number' || isNaN(num)) return 'N/A';
    // Per request, format to max 6 decimal places and remove trailing zeros.
    return Number.parseFloat(num.toFixed(6));
};

const formatComplex = (val: Complex | number): string => {
    if (typeof val === 'number') return String(formatNumber(val));
    if (val && typeof val === 'object' && 're' in val && 'im' in val) {
        if (Math.abs(val.im) < 1e-9) return String(formatNumber(val.re));
        return `${formatNumber(val.re)} ${val.im >= 0 ? '+' : '-'} ${formatNumber(Math.abs(val.im))}i`;
    }
    return 'Invalid Value';
}

const SimpleMatrix: React.FC<{ matrix: (number|Complex)[][], title?: string }> = ({ matrix, title }) => {
     if (!matrix || matrix.length === 0) return null;
     
     return (
        <div className="flex flex-col items-center gap-1">
            {title && <h4 className="font-semibold text-sm text-base-content/80">{title}</h4>}
            <div className="font-mono text-base text-base-content border-l-2 border-r-2 border-base-content/50 px-2 py-1 overflow-x-auto">
                <table className="table-auto">
                    <tbody>
                        {matrix.map((row, r) => (
                            <tr key={r}>
                                {row.map((cell, c) => (
                                    <td key={c} className="px-2 py-0.5 text-center">{formatComplex(cell)}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
     );
};


const VectorList: React.FC<{ vectors: (number|Complex)[][], title: string }> = ({ vectors, title }) => {
    return (
        <div className="flex flex-col items-center gap-1">
            <h4 className="font-semibold text-sm text-base-content/80">{title}</h4>
            <div className="space-y-1">
                {vectors.map((vec, i) => (
                    <pre key={i} className="px-2 py-1 text-left">
                        v<sub>{i+1}</sub>: [{vec.map(formatComplex).join(', ')}]
                    </pre>
                ))}
            </div>
        </div>
    );
};


interface MatrixDisplayProps {
    data: MatrixOperationResult | number | null | undefined; // Can be a number, a matrix, or a complex object
}

const MatrixDisplay: React.FC<MatrixDisplayProps> = ({ data }) => {
    if (data === null || data === undefined) {
        return null;
    }

    // Is it a simple number? (Determinant, Rank, Trace, etc.)
    if (typeof data === 'number') {
        return <div className="text-3xl sm:text-4xl font-mono text-center text-primary font-bold">{formatNumber(data)}</div>;
    }
    
    // Is it a complex number?
    if (mathjs.isComplex(data)) {
        return <div className="text-3xl sm:text-4xl font-mono text-center text-primary font-bold">{formatComplex(data)}</div>;
    }

    // Is it a simple matrix? (Inverse, Transpose, RREF etc.)
    if (Array.isArray(data) && Array.isArray(data[0])) {
         return <SimpleMatrix matrix={data} />;
    }

    // Is it a complex object from a decomposition?
    if (typeof data === 'object' && !Array.isArray(data)) {
        // SVD Decomposition
        if ('u' in data && 'q' in data && 'v' in data) {
            // q is a vector of singular values, display it as a column vector
            const singularValuesMatrix = data.q.map((val: number) => [val]);
            return (
                <div className="flex flex-nowrap justify-start items-start gap-4">
                    <SimpleMatrix matrix={data.u} title="U" />
                    <SimpleMatrix matrix={singularValuesMatrix} title="Σ (Singular Values)" />
                    <SimpleMatrix matrix={data.v} title="V" />
                </div>
            );
        }
        // LU Decomposition
        if ('L' in data && 'U' in data) {
            return (
                <div className="flex flex-nowrap justify-start items-start gap-4">
                    <SimpleMatrix matrix={data.L} title="L (Lower)" />
                    <SimpleMatrix matrix={data.U} title="U (Upper)" />
                    {'p' in data && data.p && <p className="w-full text-center text-xs font-mono">Permutation Vector: [{data.p.join(', ')}]</p>}
                </div>
            );
        }
        // QR Decomposition
        if ('Q' in data && 'R' in data) {
            return (
                <div className="flex flex-nowrap justify-start items-start gap-4">
                    <SimpleMatrix matrix={data.Q} title="Q (Orthogonal)" />
                    <SimpleMatrix matrix={data.R} title="R (Upper)" />
                </div>
            );
        }
        // Eigenvalue/Eigenvector Decomposition
        if ('values' in data && 'eigenvectors' in data) {
            const formatEigenvalue = formatComplex;
            return (
                 <div className="flex flex-col items-center gap-3">
                    <div>
                        <h4 className="font-semibold text-sm text-center text-base-content/80">Eigenvalues (λ)</h4>
                        <pre className="text-center">[{data.values.map(formatEigenvalue).join(', ')}]</pre>
                    </div>
                    <VectorList vectors={data.eigenvectors} title="Eigenvectors" />
                 </div>
            );
        }
    }
    
    // Fallback for unexpected data structure
    return <div className="text-sm text-yellow-500">Could not display result format.</div>;
};

export default MatrixDisplay;