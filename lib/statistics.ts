
import { math } from './mathInstance';
import type { DescriptiveStatisticsResults } from '../types';

/**
 * Calculates a comprehensive set of descriptive statistics for a given dataset.
 *
 * @param data - An array of numbers for which to calculate statistics.
 * @param weights - An optional array of weights corresponding to the data points for weighted mean calculation.
 * @returns A results object or null if data is insufficient.
 */
export function calculateDescriptiveStatistics(data: number[], weights: number[] = []): DescriptiveStatisticsResults | null {
    const n = data.length;
    if (n < 2) return null;
    
    data.sort((a, b) => a - b);

    const sum = math.sum(data) as number;
    const mean = math.mean(data) as number;
    const stdDevPopulation = math.std(data, 'uncorrected') as number;

    // --- Weighted Mean ---
    let weightedMean: number | null = null;
    if (weights.length === n) {
        const weightedSum = data.reduce((acc, val, i) => acc + val * weights[i], 0);
        const sumOfWeights = weights.reduce((acc, w) => acc + w, 0);
        if (sumOfWeights !== 0) {
            weightedMean = weightedSum / sumOfWeights;
        }
    }

    // --- Skewness (Sample) ---
    // Using G1 formula for sample skewness
    const skewnessNumerator = math.sum(data.map(x => Math.pow(x - mean, 3)));
    const skewnessDenominator = (n - 1) * (n - 2) * Math.pow(stdDevPopulation * Math.sqrt(n / (n - 1)), 3) / n;
    const skewness = skewnessDenominator !== 0 ? skewnessNumerator / skewnessDenominator : 0;
    
    // --- Kurtosis (Excess, Sample) ---
    // Using G2 formula for sample excess kurtosis
    const m4 = math.sum(data.map(x => Math.pow(x - mean, 4))) / n;
    const m2 = math.sum(data.map(x => Math.pow(x - mean, 2))) / n;
    let kurtosis = NaN;
    if (m2 !== 0) {
        const term1 = ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * (m4 / Math.pow(m2, 2));
        const term2 = (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
        kurtosis = term1 - term2;
    }
    
    const min = data[0];
    const max = data[n - 1];
    const q1 = math.quantileSeq(data, 0.25, false) as number;
    const median = math.median(data) as number;
    const q3 = math.quantileSeq(data, 0.75, false) as number;
    const iqr = q3 - q1;

    // --- Outlier Detection ---
    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;
    const outliers = data.filter(x => x < lowerFence || x > upperFence);

    return {
        count: n,
        sum,
        mean,
        weightedMean,
        median,
        mode: math.mode(data) as number[],
        varianceSample: math.variance(data, 'unbiased') as number,
        variancePopulation: math.variance(data, 'uncorrected') as number,
        stdDevSample: math.std(data, 'unbiased') as number,
        stdDevPopulation,
        min,
        max,
        range: max - min,
        q1,
        q3,
        iqr,
        skewness,
        kurtosis,
        coefficientOfVariation: mean !== 0 ? (stdDevPopulation / mean) * 100 : 0,
        outliers,
    };
}
