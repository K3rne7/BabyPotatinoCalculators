
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { math as mathjs } from '../../lib/mathInstance';
import type { Matrix, Complex } from 'mathjs';
import MatrixInput from '../linear_algebra/MatrixInput';
import MatrixDisplay from '../linear_algebra/MatrixDisplay';
import OperationSelector from '../linear_algebra/OperationSelector';
import { rref, rank } from '../../lib/linearAlgebra';
import { svd } from '../../lib/svd';
import { MatrixOperationResult } from '../../types';

// Helper to robustly convert a math.js matrix to a plain array, or return the data if it's already an array.
const toArray = (data: unknown): unknown => {
  if (data && typeof (data as { toArray?: unknown }).toArray === 'function') {
    return (data as { toArray: () => unknown }).toArray();
  }
  return data;
};

// Type guard for Eigenvectors from math.eigs
interface Eigenvector {
    value: number | Complex;
    vector: Matrix;
}
function isEigenvectorArray(d: any[]): d is Eigenvector[] {
    return d && d.length > 0 && d[0].hasOwnProperty('vector') && d[0].hasOwnProperty('value');
}


const LinearAlgebraCalculator: React.FC = () => {
    const [matrixA, setMatrixA] = useState<string[][]>([['1', '2'], ['3', '4']]);
    const [matrixB, setMatrixB] = useState<string[][]>([['5', '6'], ['7', '8']]);
    const [vectorB, setVectorB] = useState<string>('1, 0');
    const [exponentK, setExponentK] = useState<string>('2');
    const [operation, setOperation] = useState<string>('ADD');
    
    const [result, setResult] = useState<MatrixOperationResult | null>(null);
    const [error, setError] = useState<string>('');
    const [activeMatrix, setActiveMatrix] = useState<'A' | 'B'>('A');
    const containerRef = useRef<HTMLDivElement>(null);

    // Adjust vector b's length to match matrix A's rows
    useEffect(() => {
        const vec_array = vectorB.split(',').map(s => s.trim());
        if (vec_array.length !== matrixA.length) {
            const newVector = Array.from({ length: matrixA.length }, (_, i) => vec_array[i] || '0');
            setVectorB(newVector.join(', '));
        }
    }, [matrixA.length, vectorB]);

    useEffect(() => {
        containerRef.current?.focus();
    }, []);

    const handleOperation = useCallback(() => {
        try {
            setError('');
            setResult(null);
            
            const parseCellValue = (cell: string, context: string) => {
                try {
                    return mathjs.evaluate(cell.trim() || '0');
                } catch {
                    throw new Error(`Invalid value in ${context}: "${cell}"`);
                }
            };
            
            const parsedMatrixA = matrixA.map((row, r) => row.map((cell, c) => parseCellValue(cell, `Matrix A at (${r+1},${c+1})`)));
            const parsedMatrixB = matrixB.map((row, r) => row.map((cell, c) => parseCellValue(cell, `Matrix B at (${r+1},${c+1})`)));
            const parsedVectorB = vectorB.split(',').map((cell, i) => parseCellValue(cell, `Vector b at index ${i+1}`));

            const toRealMatrix = (matrix: (number|Complex)[][], opName: string): number[][] => {
                return matrix.map(row => row.map(cell => {
                    if(typeof cell === 'number') return cell;
                    if(mathjs.isComplex(cell)) {
                        if (Math.abs(cell.im) > 1e-12) {
                            throw new Error(`${opName} with custom SVD is only implemented for real matrices.`);
                        }
                        return cell.re;
                    }
                    throw new Error(`Unexpected cell type in matrix for ${opName}.`);
                }));
            };

            const matA = mathjs.matrix(parsedMatrixA);
            const matB = mathjs.matrix(parsedMatrixB);
            let res: MatrixOperationResult;

            switch (operation) {
                // Basic
                case 'ADD': res = toArray(mathjs.add(matA, matB)) as (number|Complex)[][]; break;
                case 'SUB': res = toArray(mathjs.subtract(matA, matB)) as (number|Complex)[][]; break;
                case 'MUL': res = toArray(mathjs.multiply(matA, matB)) as (number|Complex)[][]; break;
                
                // Properties
                case 'DET_A': res = mathjs.det(matA); break;
                case 'RANK_A': res = rank(parsedMatrixA); break;
                case 'TRACE_A': res = mathjs.trace(matA); break;
                case 'NORM_A': res = mathjs.number(mathjs.norm(matA)); break;
                case 'COND_A': {
                    const realMatrixA = toRealMatrix(parsedMatrixA, 'cond(A)');
                    const svdResult = svd(realMatrixA);
                    const singularValues = svdResult.q as number[];

                    if (singularValues.length === 0) {
                        res = 0;
                    } else {
                        const s_max = Math.max(...singularValues);
                        const s_min = Math.min(...singularValues.filter(s => s > 1e-12));
                        if (s_min === 0 || !isFinite(s_min)) {
                            res = Infinity;
                        } else {
                            res = s_max / s_min;
                        }
                    }
                    break;
                }

                // Forms & Solvers
                case 'INV_A': res = toArray(mathjs.inv(matA)) as (number|Complex)[][]; break;
                case 'TRANS_A': res = toArray(mathjs.transpose(matA)) as (number|Complex)[][]; break;
                case 'RREF_A': res = rref(parsedMatrixA); break;
                case 'PSEUDO_INV_A': res = toArray(mathjs.pinv(matA)) as (number|Complex)[][]; break;
                case 'SOLVE_AX_B': res = toArray(mathjs.lusolve(matA, parsedVectorB)) as (number | Complex)[][]; break;

                // Decompositions
                case 'LU_A': 
                    const lu = mathjs.lup(matA);
                    res = { L: toArray(lu.L) as (number | Complex)[][], U: toArray(lu.U) as (number | Complex)[][], p: toArray(lu.p) as number[] };
                    break;
                case 'QR_A': 
                    const qr = mathjs.qr(matA);
                    res = { Q: toArray(qr.Q) as (number | Complex)[][], R: toArray(qr.R) as (number | Complex)[][] };
                    break;
                case 'SVD_A': {
                    const realMatrixA = toRealMatrix(parsedMatrixA, 'SVD');
                    const svdResult = svd(realMatrixA);
                    res = { u: svdResult.u, q: svdResult.q, v: svdResult.v };
                    break;
                }
                case 'EIGS_A': {
                    const eigsResult = mathjs.eigs(matA);
                    const values = toArray(eigsResult.values) as (number | Complex)[];
                    const eigenvectors = eigsResult.eigenvectors;

                    if (eigenvectors && isEigenvectorArray(eigenvectors)) {
                         const eigenvectorsAsArrays = eigenvectors.map(ev => 
                            toArray(ev.vector) as (number | Complex)[]
                        );
                        res = {
                            values: values,
                            eigenvectors: eigenvectorsAsArrays,
                        };
                    } else {
                        throw new Error("Could not parse eigenvectors from math.eigs result.");
                    }
                    break;
                }

                // Advanced
                case 'POW_A_K': {
                    const k = mathjs.evaluate(exponentK);
                    if (typeof k !== 'number' && !mathjs.isComplex(k) && !mathjs.isBigNumber(k)) {
                        throw new Error("Exponent must be a number or complex number.");
                    }
                    const powResult = mathjs.pow(matA, k);
                    if (mathjs.isMatrix(powResult)) {
                        res = toArray(powResult) as (number | Complex)[][];
                    } else {
                        // It's a scalar value
                        if (mathjs.isComplex(powResult)) {
                            res = powResult;
                        } else if (Array.isArray(powResult)) {
                            throw new Error('Unexpected array result for matrix power.');
                        } else {
                            // This handles number, BigNumber, Fraction, etc., converting them to a standard 'number'.
                            res = mathjs.number(powResult);
                        }
                    }
                    break;
                }
                case 'EXPM_A':
                    res = toArray(mathjs.expm(matA)) as (number | Complex)[][];
                    break;
                    
                default: throw new Error('Selected operation is not implemented or supported.');
            }
            
            setResult(res);

        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError(String(e));
            }
            setResult(null);
        }
    }, [matrixA, matrixB, operation, vectorB, exponentK]);
    
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleOperation();
        }
    }, [handleOperation]);

    const ResultDisplay = () => (
        <div 
            role="log"
            aria-live="polite"
            aria-atomic="true"
            className="bg-base-200 p-3 rounded-lg min-h-[100px] flex flex-col"
            aria-label="Calculation Result Area"
        >
            <div className="flex justify-between items-center mb-1 flex-shrink-0">
                <h3 className="font-bold text-base-content">Result</h3>
                {(result || error) && (
                    <button 
                        onClick={() => { setResult(null); setError(''); }}
                        className="text-xs text-primary hover:underline"
                    >
                        Clear
                    </button>
                )}
            </div>
            <div className="result-scroll flex-grow overflow-auto">
                {error && <div className="text-red-500 text-center font-semibold p-2 break-words text-sm">{error}</div>}
                {!error && result !== null && <MatrixDisplay data={result} />}
                {!error && result === null && (
                    <div className="flex items-center justify-center h-full text-center text-base-content/50 text-sm">
                        Select an operation and click Calculate
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div 
            ref={containerRef}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className="flex flex-col gap-3 h-full max-h-[calc(100vh-220px)] sm:max-h-[520px] outline-none"
            aria-label="Linear Algebra Calculator. Press Ctrl+Enter or Command+Enter to calculate."
        >
            <div className="flex-shrink-0">
                <ResultDisplay />
            </div>
            <div className="flex-grow flex flex-col gap-3 overflow-y-auto pr-2">
                <OperationSelector 
                    operation={operation}
                    onOperationChange={setOperation}
                    onCalculate={handleOperation}
                    vectorB={vectorB}
                    setVectorB={setVectorB}
                    exponentK={exponentK}
                    setExponentK={setExponentK}
                />
                <MatrixInput
                    name="A"
                    matrix={matrixA}
                    setMatrix={setMatrixA}
                    isActive={activeMatrix === 'A'}
                    onActivate={() => setActiveMatrix('A')}
                />
                <MatrixInput
                    name="B"
                    matrix={matrixB}
                    setMatrix={setMatrixB}
                    isActive={activeMatrix === 'B'}
                    onActivate={() => setActiveMatrix('B')}
                />
            </div>
        </div>
    );
};

export default LinearAlgebraCalculator;
