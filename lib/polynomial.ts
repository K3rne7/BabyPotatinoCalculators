
import { math } from './mathInstance';
import type { Complex } from 'mathjs';
import { RuffiniResult, RuffiniStep } from '../types';

function getDivisors(n: number): number[] {
    const num = Math.abs(Math.round(n));
    if (num === 0) return [0];
    const divisors = new Set<number>();
    for (let i = 1; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            divisors.add(i);
            divisors.add(-i);
            divisors.add(num / i);
            divisors.add(-(num / i));
        }
    }
    return Array.from(divisors).sort((a, b) => a - b);
}

function syntheticDivision(coeffs: number[], root: number): { quotient: number[], remainder: number, table: RuffiniStep['table'] } {
    const n = coeffs.length;
    let quotient: number[] = [];
    let tableBottomRow: (number | null)[] = [null];
    let tableResultRow: number[] = [coeffs[0]];

    let current: number = coeffs[0];
    for (let i = 1; i < n; i++) {
        quotient.push(current);
        const product = current * root;
        tableBottomRow.push(product);
        current = coeffs[i] + product;
        tableResultRow.push(current);
    }

    const remainder = current;
    return { quotient, remainder, table: { topRow: coeffs, bottomRow: tableBottomRow, resultRow: tableResultRow } };
}

function formatRootForLatex(root: number | Complex): string {
    if (typeof root === 'number') {
        if (Math.abs(root) < 1e-9) return 'x';
        try {
            const frac = math.fraction(root);
            const sign = frac.s > 0 ? '-' : '+';
            if (Number(frac.d) === 1) { // Integer root
                return `(x ${sign} ${frac.n})`;
            } else { // Fractional root
                return `(x ${sign} \\frac{${frac.n}}{${frac.d}})`;
            }
        } catch {
             const sign = root > 0 ? '-' : '+';
             return `(x ${sign} ${Math.abs(root)})`;
        }
    }
    // Complex roots are generally not displayed this way, handled by quadratic factor.
    return '';
}

function formatPolynomialForLatex(coeffs: number[]): string {
    if (coeffs.every(c => Math.abs(c) < 1e-9)) return '0';
    const degree = coeffs.length - 1;
    let str = '';
    
    for (let i = 0; i <= degree; i++) {
        const c = coeffs[i];
        if (Math.abs(c) < 1e-9) continue;
        const power = degree - i;

        const sign = c > 0 ? (str === '' ? '' : '+') : '-';
        const absC = Math.abs(c);

        let coeffStr = '';
        try {
            const frac = math.fraction(absC);
            if (Number(frac.d) === 1) { // Integer
                coeffStr = (Number(frac.n) === 1 && power > 0) ? '' : `${frac.n}`;
            } else { // Fraction
                coeffStr = `\\frac{${frac.n}}{${frac.d}}`;
            }
        } catch {
            coeffStr = absC.toString();
        }

        if (power > 1) {
            str += ` ${sign} ${coeffStr}x^${power}`;
        } else if (power === 1) {
            str += ` ${sign} ${coeffStr}x`;
        } else { // power === 0
            str += ` ${sign} ${coeffStr}`;
        }
    }
    
    return `(${str.trim()})`;
}

export function solveWithRuffini(initialCoefficients: number[]): RuffiniResult {
    let currentCoeffs = [...initialCoefficients];
    const foundRoots: (number | Complex)[] = [];
    const steps: RuffiniStep[] = [];

    const findAndProcessRoot = (rootsToTry: Set<number>): boolean => {
        for (const root of Array.from(rootsToTry).sort((a,b) => Math.abs(a) - Math.abs(b))) {
            const { quotient, remainder, table } = syntheticDivision(currentCoeffs, root);
            if (Math.abs(remainder) < 1e-9) {
                foundRoots.push(root);
                steps.push({ root, coefficients: currentCoeffs, table });
                currentCoeffs = quotient;
                return true;
            }
        }
        return false;
    };
    
    while (currentCoeffs.length > 3 && foundRoots.length < initialCoefficients.length - 1) {
        const leadingCoeff = currentCoeffs[0];
        const constantTerm = currentCoeffs[currentCoeffs.length - 1];

        if (constantTerm === 0) { // Factor out x
            if (findAndProcessRoot(new Set([0]))) continue;
        }

        const p = getDivisors(constantTerm);
        const q = getDivisors(leadingCoeff);

        const integerRoots = new Set(p);
        if (findAndProcessRoot(integerRoots)) continue;

        const rationalRoots = new Set<number>();
        for (const pi of p) {
            for (const qi of q) {
                if (qi !== 0) rationalRoots.add(pi / qi);
            }
        }
        if (findAndProcessRoot(rationalRoots)) continue;

        break;
    }

    let finalPolynomial = currentCoeffs;
    if (finalPolynomial.length === 3) {
        const [a, b, c] = finalPolynomial;
        const delta = b * b - 4 * a * c;
        if (delta >= 0) {
            const r1 = (-b + Math.sqrt(delta)) / (2 * a);
            const r2 = (-b - Math.sqrt(delta)) / (2 * a);
            foundRoots.push(r1, r2);
            finalPolynomial = [a];
        } else { // Complex roots
            const realPart = -b / (2 * a);
            const imagPart = Math.sqrt(-delta) / (2 * a);
            foundRoots.push(math.complex(realPart, imagPart), math.complex(realPart, -imagPart));
            finalPolynomial = [a];
        }
    } else if (finalPolynomial.length === 2) {
        const [a, b] = finalPolynomial;
        if (a !== 0) {
            foundRoots.push(-b/a);
            finalPolynomial = [a];
        }
    }

    const rationalRoots = foundRoots.filter(r => typeof r === 'number') as number[];
    let finalString = '';

    const leadingCoeff = finalPolynomial.length === 1 ? finalPolynomial[0] : (finalPolynomial.length > 1 ? finalPolynomial[0] : 1);
    
    let tempFinalPoly = [...finalPolynomial];
    let commonFactor = leadingCoeff;
    const numCommonFactor = Number(commonFactor);

    if (numCommonFactor !== 1 && tempFinalPoly.length > 1) {
        tempFinalPoly = tempFinalPoly.map(c => c / numCommonFactor);
    }
    
    if (numCommonFactor !== 1) {
         if (numCommonFactor === -1) {
            finalString += '-';
         } else {
             try {
                const frac = math.fraction(commonFactor);
                if (Number(frac.d) === 1) { // Integer
                    finalString += (BigInt(frac.s) * (frac.n as bigint)).toString();
                } else { // Fraction
                    finalString += `${frac.s === -1 ? '-' : ''}\\frac{${frac.n}}{${frac.d}}`;
                }
            } catch {
                finalString += commonFactor;
            }
         }
    }

    finalString += rationalRoots.map(formatRootForLatex).join('');
    
    if (tempFinalPoly.length > 1) {
        finalString += formatPolynomialForLatex(tempFinalPoly);
    }
    
    if(finalString.trim() === '') finalString = '0';
    if(finalString.trim() === '-') finalString = '-1';


    return { roots: foundRoots, steps, finalPolynomial, finalString };
}
