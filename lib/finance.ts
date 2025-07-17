
import { math } from './mathInstance';

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface LoanSummary {
    monthlyPayment: number;
    totalInterest: number;
    totalPayment: number;
}

// French Amortization (Equal Payments)
export function calculateFrenchAmortization(principal: number, annualRate: number, termYears: number): { schedule: AmortizationRow[], summary: LoanSummary } {
    const monthlyRate = annualRate / 100 / 12;
    const termMonths = termYears * 12;

    if (principal <= 0 || annualRate < 0 || termYears <= 0) {
        return { schedule: [], summary: { monthlyPayment: 0, totalInterest: 0, totalPayment: 0 }};
    }

    if (monthlyRate === 0) { // No interest
        const monthlyPayment = principal / termMonths;
        const schedule: AmortizationRow[] = [];
        let remainingBalance = principal;
        for (let i = 1; i <= termMonths; i++) {
            remainingBalance -= monthlyPayment;
            schedule.push({
                month: i,
                payment: monthlyPayment,
                principal: monthlyPayment,
                interest: 0,
                remainingBalance: remainingBalance < 1e-9 ? 0 : remainingBalance,
            });
        }
        return { schedule, summary: { monthlyPayment, totalInterest: 0, totalPayment: principal }};
    }

    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
    
    const schedule: AmortizationRow[] = [];
    let remainingBalance = principal;
    let totalInterest = 0;

    for (let i = 1; i <= termMonths; i++) {
        const interest = remainingBalance * monthlyRate;
        const principalPaid = monthlyPayment - interest;
        remainingBalance -= principalPaid;
        totalInterest += interest;

        schedule.push({
            month: i,
            payment: monthlyPayment,
            principal: principalPaid,
            interest: interest,
            remainingBalance: remainingBalance < 1e-9 ? 0 : remainingBalance, // Handle floating point inaccuracies
        });
    }

    const summary = {
        monthlyPayment,
        totalInterest,
        totalPayment: principal + totalInterest
    };

    return { schedule, summary };
}

// Italian Amortization (Constant Principal Payment)
export function calculateItalianAmortization(principal: number, annualRate: number, termYears: number): { schedule: AmortizationRow[], summary: LoanSummary } {
    const monthlyRate = annualRate / 100 / 12;
    const termMonths = termYears * 12;
    
    if (principal <= 0 || annualRate < 0 || termYears <= 0) {
        return { schedule: [], summary: { monthlyPayment: 0, totalInterest: 0, totalPayment: 0 }};
    }

    const constantPrincipal = principal / termMonths;
    const schedule: AmortizationRow[] = [];
    let remainingBalance = principal;
    let totalInterest = 0;

    for (let i = 1; i <= termMonths; i++) {
        const interest = remainingBalance * monthlyRate;
        const payment = constantPrincipal + interest;
        remainingBalance -= constantPrincipal;
        totalInterest += interest;

        schedule.push({
            month: i,
            payment: payment,
            principal: constantPrincipal,
            interest: interest,
            remainingBalance: remainingBalance < 1e-9 ? 0 : remainingBalance,
        });
    }

    const summary = {
        monthlyPayment: -1, // Sentinel value for "Varies"
        totalInterest,
        totalPayment: principal + totalInterest,
    };
    
    return { schedule, summary };
}

// Net Present Value (NPV)
export function calculateNPV(rate: number, cashFlows: number[]): number {
    const discountRate = rate / 100;
    let npv = cashFlows[0] || 0; // Initial investment
    for (let i = 1; i < cashFlows.length; i++) {
        npv += cashFlows[i] / Math.pow(1 + discountRate, i);
    }
    return npv;
}

// Internal Rate of Return (IRR) using Newton-Raphson method
export function calculateIRR(cashFlows: number[], guess: number = 0.1): number | null {
    const maxIterations = 50;
    const tolerance = 1e-7;
    let irr = guess;

    for (let i = 0; i < maxIterations; i++) {
        let npv = 0;
        let dNpv = 0; // Derivative of NPV
        for (let t = 0; t < cashFlows.length; t++) {
            npv += cashFlows[t] / Math.pow(1 + irr, t);
            if (t > 0) {
                dNpv -= (t * cashFlows[t]) / Math.pow(1 + irr, t + 1);
            }
        }
        
        if (Math.abs(npv) < tolerance) {
            return irr * 100; // Return as a percentage
        }

        if (dNpv === 0) break; // Avoid division by zero
        
        const newIrr = irr - npv / dNpv;
        if (Math.abs(newIrr - irr) < tolerance) {
            return newIrr * 100; // Return as a percentage
        }
        irr = newIrr;
    }
    return null; // Failed to converge
}

// Modified Internal Rate of Return (MIRR)
export function calculateMIRR(cashFlows: number[], financeRate: number, reinvestRate: number): number | null {
    const fRate = financeRate / 100;
    const rRate = reinvestRate / 100;
    const n = cashFlows.length - 1;
    if (n <= 0) return null;

    const positiveFlows = cashFlows.slice(1).filter(cf => cf > 0);
    const negativeFlows = cashFlows.filter(cf => cf < 0);

    const fvPositive = positiveFlows.reduce((sum, cf, t) => {
        // Here `t` is index in positiveFlows array, we need original time period
        const originalIndex = cashFlows.indexOf(cf, t + 1); // Find original index after time 0
        return sum + cf * Math.pow(1 + rRate, n - originalIndex);
    }, 0);

    const pvNegative = negativeFlows.reduce((sum, cf) => {
        const originalIndex = cashFlows.indexOf(cf);
        return sum + cf / Math.pow(1 + fRate, originalIndex);
    }, 0);
    
    if (pvNegative >= 0 || fvPositive <= 0) return null;

    const mirr = Math.pow(fvPositive / -pvNegative, 1 / n) - 1;
    return mirr * 100;
}


// Payback Period (Simple and Discounted)
export function calculatePaybackPeriod(initialInvestment: number, cashFlows: number[], discountRate: number): { simple: number | null, discounted: number | null } {
    const absInvestment = Math.abs(initialInvestment);
    
    // Simple Payback
    let cumulativeFlow = 0;
    let simplePayback: number | null = null;
    for (let i = 0; i < cashFlows.length; i++) {
        cumulativeFlow += cashFlows[i];
        if (cumulativeFlow >= absInvestment) {
            const previousCumulative = cumulativeFlow - cashFlows[i];
            simplePayback = i + (absInvestment - previousCumulative) / cashFlows[i];
            break;
        }
    }
    
    // Discounted Payback
    let cumulativeDiscountedFlow = 0;
    let discountedPayback: number | null = null;
    const rate = discountRate / 100;

    for (let i = 0; i < cashFlows.length; i++) {
        const discountedFlow = cashFlows[i] / Math.pow(1 + rate, i + 1);
        cumulativeDiscountedFlow += discountedFlow;
        if (cumulativeDiscountedFlow >= absInvestment) {
            const previousCumulative = cumulativeDiscountedFlow - discountedFlow;
            discountedPayback = i + (absInvestment - previousCumulative) / discountedFlow;
            break;
        }
    }
    
    return { simple: simplePayback, discounted: discountedPayback };
}


// Compound Interest
export function calculateCompoundInterest(principal: number, annualRate: number, termYears: number, timesCompounded: number): { futureValue: number, totalInterest: number } {
    const rate = annualRate / 100;
    let futureValue: number;

    if (timesCompounded === 0) { // Continuous compounding
        futureValue = principal * Math.exp(rate * termYears);
    } else {
        futureValue = principal * Math.pow(1 + rate / timesCompounded, timesCompounded * termYears);
    }
    
    const totalInterest = futureValue - principal;
    return { futureValue, totalInterest };
}


// Bond Valuation with Duration and Convexity
export function calculateBondMetrics(faceValue: number, couponRate: number, marketRate: number, yearsToMaturity: number, paymentsPerYear: number) {
    const periods = yearsToMaturity * paymentsPerYear;
    const couponPayment = (faceValue * (couponRate / 100)) / paymentsPerYear;
    const ytmPerPeriod = marketRate / 100 / paymentsPerYear;

    let price = 0;
    let weightedTimeSum = 0;
    let convexitySum = 0;

    for (let t = 1; t <= periods; t++) {
        const cashFlow = (t === periods) ? couponPayment + faceValue : couponPayment;
        const pvFactor = 1 / Math.pow(1 + ytmPerPeriod, t);
        const pvCashFlow = cashFlow * pvFactor;
        
        price += pvCashFlow;
        weightedTimeSum += t * pvCashFlow;
        convexitySum += t * (t + 1) * pvCashFlow / Math.pow(1 + ytmPerPeriod, 2);
    }
    
    const macaulayDuration = weightedTimeSum / price / paymentsPerYear; // Annualized
    const modifiedDuration = macaulayDuration / (1 + ytmPerPeriod);
    const convexity = convexitySum / price;
    
    return {
        price,
        macaulayDuration: isNaN(macaulayDuration) ? null : macaulayDuration,
        modifiedDuration: isNaN(modifiedDuration) ? null : modifiedDuration,
        convexity: isNaN(convexity) ? null : convexity,
    };
}


// Yield to Maturity (YTM) using Newton-Raphson
export function calculateYTM(bondPrice: number, faceValue: number, couponRate: number, yearsToMaturity: number, paymentsPerYear: number, guess: number = 0.05): number | null {
    const periods = yearsToMaturity * paymentsPerYear;
    const couponPayment = (faceValue * (couponRate / 100)) / paymentsPerYear;
    const tolerance = 1e-7;
    const maxIterations = 100;

    let periodicYtm = guess / paymentsPerYear;

    for (let i = 0; i < maxIterations; i++) {
        let priceFunction = -bondPrice;
        let priceDerivative = 0;

        for (let t = 1; t <= periods; t++) {
            priceFunction += couponPayment / Math.pow(1 + periodicYtm, t);
            priceDerivative -= (t * couponPayment) / Math.pow(1 + periodicYtm, t + 1);
        }
        priceFunction += faceValue / Math.pow(1 + periodicYtm, periods);
        priceDerivative -= (periods * faceValue) / Math.pow(1 + periodicYtm, periods + 1);

        if (Math.abs(priceFunction) < tolerance) {
            return periodicYtm * paymentsPerYear * 100; // Annualized percentage
        }

        if (priceDerivative === 0) break;
        
        const newYtm = periodicYtm - priceFunction / priceDerivative;
        
        if (Math.abs(newYtm - periodicYtm) < tolerance) {
            return newYtm * paymentsPerYear * 100; // Annualized percentage
        }
        periodicYtm = newYtm;
    }

    return null; // Did not converge
}


// Effective Annual Rate (EAR) from Nominal
export function calculateEffectiveAnnualRate(nominalRate: number, compoundingPeriods: number): number {
    const nRate = nominalRate / 100;
    if (compoundingPeriods <= 0) { // Continuous
        return (Math.exp(nRate) - 1) * 100;
    }
    return (Math.pow(1 + nRate / compoundingPeriods, compoundingPeriods) - 1) * 100;
}

// Nominal Rate from Effective Annual Rate (EAR)
export function calculateNominalRate(effectiveRate: number, compoundingPeriods: number): number {
    const eRate = effectiveRate / 100;
    if (compoundingPeriods <= 0) { // Continuous
        return Math.log(1 + eRate) * 100;
    }
    return compoundingPeriods * (Math.pow(1 + eRate, 1 / compoundingPeriods) - 1) * 100;
}

// Market Analysis Stats
export function calculateMarketStats(returns: number[]) {
    const decimalReturns = returns.map(r => r / 100);
    const n = decimalReturns.length;
    if (n === 0) return { arithmetic: null, geometric: null, volatility: null };
    
    const arithmetic = Number(math.mean(decimalReturns)) * 100;
    const volatility = Number(math.std(decimalReturns, 'unbiased')) * 100;
    
    const productOfGrowth = decimalReturns.reduce((prod, r) => prod * (1 + r), 1);
    const geometric = (Math.pow(productOfGrowth, 1 / n) - 1) * 100;
    
    return { arithmetic, geometric, volatility };
}

// Value at Risk (VaR)
export function calculateVaR(returns: number[], portfolioValue: number, confidenceLevel: number, method: 'historic' | 'parametric') {
    const decimalReturns = returns.map(r => r / 100);
    const n = decimalReturns.length;
    if (n === 0) return null;

    let varReturn: number;
    if (method === 'historic') {
        const quantile = 1 - confidenceLevel / 100;
        varReturn = math.quantileSeq(decimalReturns, quantile) as unknown as number;
    } else { // Parametric
        const mean = math.mean(decimalReturns) as number;
        const stdDev = math.std(decimalReturns) as number;
        const zScores: Record<number, number> = { 90: 1.282, 95: 1.645, 99: 2.326 };
        const z = zScores[confidenceLevel] || 1.645;
        varReturn = mean - z * stdDev;
    }
    // VaR is expressed as a positive loss value
    return -varReturn * portfolioValue;
}
