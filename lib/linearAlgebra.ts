
import type { Complex } from 'mathjs';
import { math } from './mathInstance';

/**
 * Calculates the Reduced Row Echelon Form (RREF) of a matrix with complex numbers.
 * @param A The input matrix as a 2D array of numbers and/or Complex objects.
 * @param eps A small tolerance for comparing numbers to zero.
 * @returns The RREF of the matrix.
 */
export function rref(A: (number | Complex)[][], eps = 1e-12): (number | Complex)[][] {
  // Create a deep copy to avoid modifying the original matrix, and ensure all elements are Complex
  const M: Complex[][] = A.map(row => row.map(cell => math.complex(cell as any)));
  const rows = M.length;
  const cols = M[0]?.length || 0;
  let lead = 0;

  for (let r = 0; r < rows; r++) {
    if (lead >= cols) break;
    let i = r;
    while ((math.abs(M[i][lead]) as unknown as number) < eps) {
      i++;
      if (i === rows) {
        i = r;
        lead++;
        if (lead === cols) {
           // Before returning, simplify complex numbers with near-zero imaginary parts
           return M.map(row => row.map(c => Math.abs(c.im) < eps ? c.re : c));
        }
      }
    }
    [M[i], M[r]] = [M[r], M[i]]; // swap rows

    const lv = M[r][lead];
    for (let j = 0; j < cols; j++) {
      M[r][j] = math.divide(M[r][j], lv) as Complex;
    }

    for (let u = 0; u < rows; u++) {
      if (u !== r) {
        const factor = M[u][lead];
        for (let j = 0; j < cols; j++) {
          const term = math.multiply(factor, M[r][j]) as Complex;
          M[u][j] = math.subtract(M[u][j], term) as Complex;
        }
      }
    }
    lead++;
  }
  
  // Simplify complex numbers with near-zero imaginary parts before returning
  return M.map(row => row.map(c => Math.abs(c.im) < eps ? c.re : c));
}

/**
 * Calculates the rank of a matrix (can be complex).
 * The rank is the number of non-zero rows in its RREF.
 * @param A The input matrix.
 * @param eps A small tolerance for comparing numbers to zero.
 * @returns The rank of the matrix.
 */
export function rank(A: (number | Complex)[][], eps = 1e-12): number {
  const rrefMatrix = rref(A, eps);
  // A row is non-zero if at least one of its elements has a magnitude greater than eps
  return rrefMatrix.filter(row => row.some(v => (math.abs(v) as number) > eps)).length;
}