import React, { useState } from 'react';
import LoanCalculator from '../financial/LoanCalculator';
import InvestmentCalculator from '../financial/InvestmentCalculator';
import CompoundInterestCalculator from '../financial/CompoundInterestCalculator';
import BondCalculator from '../financial/BondCalculator';
import Placeholder from './Placeholder';
import CustomSelect from '../ui/CustomSelect';
import RateConverter from '../financial/RateConverter';
import YtmCalculator from '../financial/YtmCalculator';
import CurrencyConverter from '../financial/CurrencyConverter';
import MarketAnalysisCalculator from '../financial/MarketAnalysisCalculator';
import VaRCalculator from '../financial/VaRCalculator';

const financialTools = [
    { value: "h_loan", label: "Loans & Mortgages", isHeader: true },
    { value: 'loan', label: 'Loan & Mortgage Calculator' },
    { value: "h_invest", label: "Investment & Interest", isHeader: true },
    { value: 'investment', label: 'Investment Analysis (NPV, IRR, MIRR)' },
    { value: 'interest', label: 'Compound Interest Calculator' },
    { value: 'rates', label: 'Rate Converter (Nominal/Effective)' },
    { value: "h_bonds", label: "Bonds & Markets", isHeader: true },
    { value: 'bonds', label: 'Bond Valuation & Risk' },
    { value: 'ytm', label: 'Yield to Maturity (YTM)' },
    { value: "h_risk", label: "Market & Risk Analysis", isHeader: true },
    { value: 'market', label: 'Market Returns & Volatility' },
    { value: 'var', label: 'Value at Risk (VaR)' },
    { value: "h_currency", label: "Foreign Exchange", isHeader: true },
    { value: 'currency', label: 'Currency Converter' },
];

const FinancialCalculator: React.FC = () => {
    const [activeTool, setActiveTool] = useState('loan');

    const ActiveComponent = () => {
        switch (activeTool) {
            case 'loan':
                return <LoanCalculator />;
            case 'investment':
                return <InvestmentCalculator />;
            case 'interest':
                return <CompoundInterestCalculator />;
            case 'bonds':
                return <BondCalculator />;
            case 'rates':
                return <RateConverter />;
            case 'ytm':
                return <YtmCalculator />;
            case 'market':
                return <MarketAnalysisCalculator />;
            case 'var':
                return <VaRCalculator />;
            case 'currency':
                return <CurrencyConverter />;
            default:
                const toolName = financialTools.find(t => t.value === activeTool)?.label || 'Coming Soon';
                return <Placeholder title={toolName} />;
        }
    }

    return (
        <div className="flex flex-col h-full w-full bg-base-100/50 rounded-lg shadow-inner overflow-hidden">
             <header className="flex-shrink-0 bg-base-200 p-3 border-b border-base-300/50">
                <CustomSelect
                    value={activeTool}
                    onChange={(val) => setActiveTool(val)}
                    options={financialTools}
                    variant="solid"
                />
            </header>
            <main className="flex-1 overflow-y-auto p-3 sm:p-4 result-scroll">
                <ActiveComponent />
            </main>
        </div>
    );
};

export default FinancialCalculator;