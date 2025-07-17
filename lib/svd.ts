
/*
 * Singular Value Decomposition (SVD) + 2‑norm Condition Number
 * ============================================================
 * ✅ **Works for rank‑deficient matrices** (e.g. 3×3 with determinant 0):
 *    left singular vectors `U` are now fully orthonormal, even when some
 *    singular values are exactly zero – no more `[0,0,0]` columns.
 *
 * Pure **TypeScript** implementation on top of **math.js ≥ v9**.
 * Compatible with Node & browser. Target sizes: 2 × 2 → 8 × 8.
 *
 * ────────────────────────────────────────────────────────────────
 * Algorithm (economy‑size Golub–Kahan + orthogonal completion)
 *
 * 1. G := Aᵀ·A  → eigen‑decomp with `math.eigs`  ⇒ (λᵢ, vᵢ)
 * 2. σᵢ = √λᵢ  (k = min(m,n))  ordered DESC
 * 3. V := [v₁ … v_k] (columns)   ← right singular vectors
 * 4. U_partial := A·V·Σ⁻¹  for σᵢ > ε  (ε = 2⁻⁵²)          (rank r)
 * 5. If r < k  → **complete U** with an orthonormal basis of the null
 *    space of A (Gram–Schmidt over the canonical basis).
 * 6. κ₂(A) = σ₁ / σ_k  (∞ if σ_k ≈ 0).
 *
 * Complexity O(n³) – negligible for n ≤ 8.
 *
 * ============================================================ */

import type { Matrix, Complex } from 'mathjs';
import { math } from './mathInstance';

/* ----------------------------- Types ----------------------------- */
export interface SVDResult {
  /** Left singular vectors U (m × k, k = min(m,n)) */
  u: number[][];
  /** Singular values σᵢ ≥ 0, sorted descending (length k) */
  q: number[];
  /** Right singular vectors V (n × k, **not** transposed) */
  v: number[][];
}

/* Helpers */
const EPS = Number.EPSILON * 16; // relaxed epsilon for singular‑value ≈ 0

function toNumberArray (x: number[] | Complex[] | Matrix): number[] {
  const arr: (number | Complex | bigint)[] = Array.isArray(x) ? x : (x as Matrix).toArray() as any[];
  return arr.map(v => (typeof v === 'number' ? v : typeof v === 'bigint' ? Number(v) : (v as Complex).re));
}

/**
 * Build an orthonormal basis that **completes** the given set of
 * orthonormal vectors (columns) to size `k`.
 *
 * @param Ucols  current orthonormal columns (m × r)
 * @param m      ambient dimension
 * @param k      desired final number of columns (≤ m)
 * @returns      m × k matrix with full orthonormal columns
 */
function completeOrthonormalBasis (Ucols: number[][], m: number, k: number): number[][] {
  const cols = Ucols.map(col => [...col]); // deep copy to avoid mutating input

  // Canonical basis e₀, …, e_{m‑1}
  for (let i = 0; cols.length < k && i < m; ++i) {
    let v: number[] = Array.from({ length: m }, (_, j) => (j === i ? 1 : 0));

    // Gram–Schmidt: subtract projections onto existing cols
    for (const c of cols) {
      const dot = c.reduce((s, cj, idx) => s + cj * v[idx], 0);
      for (let idx = 0; idx < m; ++idx) v[idx] -= dot * c[idx];
    }

    // Normalise if non‑zero
    const norm = Math.hypot(...v);
    if (norm > EPS) {
      v = v.map(x => x / norm);
      cols.push(v);
    }
  }

  // Should now have k columns; if not, fall back to QR of a random mat.
  if (cols.length < k) {
    const Rnd = math.matrix(math.random([m, k - cols.length], -1, 1));
    const Qextra = (math.qr(Rnd) as { Q: Matrix }).Q as Matrix;
    const extraCols: number[][] = (Qextra as Matrix).toArray() as number[][];
    for (const col of extraCols) {
      // Ensure orthogonal to previous cols
      let v = [...col];
      for (const c of cols) {
        const dot = c.reduce((s, cj, idx) => s + cj * v[idx], 0);
        for (let idx = 0; idx < m; ++idx) v[idx] -= dot * c[idx];
      }
      const norm = Math.hypot(...v);
      if (norm > EPS) cols.push(v.map(x => x / norm));
      if (cols.length === k) break;
    }
  }

  return cols.slice(0, k); // m × k (array‑of‑columns)
}

/* --------------------------- Core SVD --------------------------- */
export function svd (A: number[][]): SVDResult {
  const Am: Matrix = math.matrix(A);
  const [m, n] = Am.size();
  const k = Math.min(m, n);

  /* 1 – eigen‑decomp of AᵀA */
  const G: Matrix = math.multiply(math.transpose(Am), Am) as Matrix;
  const { values: λraw, eigenvectors } = math.eigs(G) as {
    values: number[] | Complex[] | Matrix;
    eigenvectors: { value: number | Complex; vector: number[] | Matrix }[];
  };

  // Fallback for legacy `.vectors` API
  const rawVectors: (number[] | Matrix)[] = eigenvectors
    ? eigenvectors.map(ev => ev.vector)
    : ((math.eigs(G) as any).vectors as Matrix).toArray() as (number[] | Matrix)[];

  /* 2 – singular values & ordering */
  const λ: number[] = toNumberArray(λraw);
  const order = λ.map((val, idx) => ({ val, idx })).sort((a, b) => b.val - a.val);
  const σ: number[] = order.map(o => Math.sqrt(Math.max(o.val, 0)));

  /* 3 – build V (n × k) in the chosen order */
  const Vcols = order.map(o => rawVectors[o.idx]);
  const V: Matrix = (math.matrixFromColumns
    ? (math as any).matrixFromColumns(...Vcols.map(v => Array.isArray(v) ? math.matrix(v) : v))
    : math.concat(...Vcols, 1)) as Matrix; // n × k

  /* 4 – U_partial = A·V·Σ⁻¹  (rank r columns) */
  const ΣinvArr = σ.map(s => (s > EPS ? 1 / s : 0));
  const Σinv: Matrix = math.diag(ΣinvArr) as Matrix; // k × k
  const U_partial: Matrix = math.multiply(Am, V, Σinv) as Matrix; // m × k

  // Extract columns & determine numerical rank r
  const Ucols: number[][] = (U_partial as Matrix).toArray() as number[][]; // array‑of‑rows
  // Transpose to columns
  const UcolArr: number[][] = Array.from({ length: k }, (_, j) => Ucols.map(r => r[j]));
  const r = ΣinvArr.filter(inv => inv !== 0).length;

  // Norm‑normalise first r columns (guard vs numerical drift)
  for (let j = 0; j < r; ++j) {
    const norm = Math.hypot(...UcolArr[j]);
    if (norm > EPS) UcolArr[j] = UcolArr[j].map(x => x / norm);
  }

  /* 5 – Complete U to k columns if rank deficient */
  const UfullCols = r === k ? UcolArr : completeOrthonormalBasis(UcolArr.slice(0, r), m, k);

  // Convert back to m × k matrix (array‑of‑arrays rows)
  const U_rows: number[][] = Array.from({ length: m }, () => Array(k).fill(0));
  for (let j = 0; j < k; ++j) {
    for (let i = 0; i < m; ++i) U_rows[i][j] = UfullCols[j][i];
  }

  return {
    u: U_rows,
    q: σ,
    v: V.toArray() as number[][],
  };
}

/* -------------------- Condition number κ₂ -------------------- */
export function conditionNumber (A: number[][]): number {
  const { q } = svd(A);
  const σ_max = q[0];
  const σ_min = q[q.length - 1];
  return σ_min > EPS ? σ_max / σ_min : Infinity;
}

/* -------------------------- Self‑test -------------------------- */
if ((import.meta as any).vitest) {
  const random = () => Math.random() * 2 - 1;
  for (let n = 2; n <= 8; ++n) {
    for (let t = 0; t < 200; ++t) {
      const A = Array.from({ length: n }, () => Array.from({ length: n }, random));
      // Force some singular cases
      if (t % 3 === 0) A[n - 1] = Array(n).fill(0);

      const { u, q, v } = svd(A);
      const Arec = math.multiply(u, math.diag(q), math.transpose(v)) as Matrix;
      const frob = math.norm(math.subtract(A, Arec) as Matrix, 'fro') as number;
      if (frob > 1e-7) throw new Error(`SVD recon failed n=${n}`);
      if (Math.abs(conditionNumber(A) - q[0] / (q[q.length - 1] || 1)) > 1e-7)
        throw new Error('κ₂ mismatch');
    }
  }
  // eslint-disable-next-line no-console
  console.log('✓ svd.ts self‑test passed (rank‑deficient included)');
}