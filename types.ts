
import type React from 'react';
import type { Complex } from 'mathjs';

export enum CalculatorMode {
  Basic = 'Basic',
  Scientific = 'Scientific',
  Ruffini = "Ruffini's Rule",
  Graphing = 'Graphing',
  TrigCircle = 'Trigonometric',
  LinearAlgebra = 'Linear Algebra',
  Complex = 'Complex',
  Programmer = 'Programmer',
  Converter = 'Converter',
  Electronics = 'Electronics',
  AICalculator = 'AI Calculator',
  Statistics = 'Statistics',
  Financial = 'Financial',
}

export type Theme = 'light' | 'dark' | 'system';

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
}

export interface GraphFunction {
  id:string;
  expression: string;
  color: string;
}

export type Language = 'en' | 'it' | 'es' | 'fr';

export enum AngleMode {
  Rad = 'RAD',
  Deg = 'DEG',
  Grad = 'GRAD',
}

export enum ProgrammerBase {
  Hex = 16,
  Dec = 10,
  Oct = 8,
  Bin = 2,
}

export enum WordSize {
  QWORD = 64, // Quad Word
  DWORD = 32, // Double Word
  WORD = 16,
  BYTE = 8,
}

// Types for the new Universal Converter Mode

export enum ConversionType {
  STANDARD = 'STANDARD', // For linear conversions (e.g., length, mass)
  FUNCTIONAL = 'FUNCTIONAL', // For non-linear conversions (e.g., temperature)
  CUSTOM = 'CUSTOM', // For conversions requiring a unique component (e.g., base conversion)
}

export interface Unit {
  name: string;
  plural: string;
  // Factor to convert this unit TO the base unit of its category
  toBase: number; 
}

export interface ConversionCategory {
  name: string;
  type: ConversionType;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  units?: Record<string, Unit>;
  baseUnit?: string;
  // For FUNCTIONAL type
  convert?: (value: number, from: string, to: string) => number;
  // For CUSTOM type
  component?: React.FC<{ category: ConversionCategory }>;
}

export type ConversionConfigs = Record<string, ConversionCategory>;

// Result type for Linear Algebra mode
export type MatrixOperationResult =
  | number
  | Complex
  | (number | Complex)[][] // A plain matrix result
  | { L: (number | Complex)[][]; U: (number | Complex)[][]; p: number[] } // LU
  | { Q: (number | Complex)[][]; R: (number | Complex)[][] } // QR
  | { u: number[][]; q: number[]; v: number[][] } // SVD
  | { values: (number | Complex)[]; eigenvectors: (number | Complex)[][] }; // Eigs

export type NumberFormat = 'auto' | 'sci' | 'eng' | 'fix';

export interface RuffiniStep {
    root: number;
    coefficients: number[];
    table: {
        topRow: number[];
        bottomRow: (number | null)[];
        resultRow: number[];
    };
}

export interface RuffiniResult {
    roots: (number | Complex)[];
    steps: RuffiniStep[];
    finalPolynomial: number[];
    finalString: string;
}


// Types for Statistics mode
export interface DescriptiveStatisticsResults {
    count: number;
    sum: number;
    mean: number;
    weightedMean: number | null;
    median: number;
    mode: number[];
    varianceSample: number;
    variancePopulation: number;
    stdDevSample: number;
    stdDevPopulation: number;
    min: number;
    max: number;
    range: number;
    q1: number;
    q3: number;
    iqr: number;
    skewness: number;
    kurtosis: number;
    coefficientOfVariation: number;
    outliers: number[];
}


export type { Complex }; // Re-export for convenience