
import React, { useState, useEffect, useRef } from 'react';
import { useCoreAppContext } from '../hooks/useCoreAppContext';
import { CalculatorMode } from '../types';
import BasicCalculator from './modes/BasicCalculator';
import ScientificCalculator from './modes/ScientificCalculator';
import GraphingCalculator from './modes/GraphingCalculator';
import ProgrammerCalculator from './modes/ProgrammerCalculator';
import ConverterCalculator from './modes/ConverterCalculator';
import LinearAlgebraCalculator from './modes/LinearAlgebraCalculator';
import ComplexCalculator from './modes/ComplexCalculator';
import AICalculator from './modes/AICalculator';
import ElectronicsCalculator from './modes/ElectronicsCalculator';
import RuffiniSolver from './modes/RuffiniSolver';
import TrigCircleCalculator from './modes/TrigCircleCalculator';
import StatisticsCalculator from './modes/StatisticsCalculator';
import FinancialCalculator from './modes/FinancialCalculator';

// Helper function to get the component based on the mode
const getComponentForMode = (mode: CalculatorMode): JSX.Element => {
    switch (mode) {
      case CalculatorMode.Basic:
        return <BasicCalculator />;
      case CalculatorMode.Scientific:
        return <ScientificCalculator />;
      case CalculatorMode.Graphing:
        return <GraphingCalculator />;
      case CalculatorMode.LinearAlgebra:
        return <LinearAlgebraCalculator />;
      case CalculatorMode.Programmer:
        return <ProgrammerCalculator />;
      case CalculatorMode.Converter:
        return <ConverterCalculator />;
      case CalculatorMode.Complex:
        return <ComplexCalculator />;
      case CalculatorMode.Electronics:
        return <ElectronicsCalculator />;
      case CalculatorMode.AICalculator:
        return <AICalculator />;
      case CalculatorMode.Ruffini:
        return <RuffiniSolver />;
      case CalculatorMode.TrigCircle:
        return <TrigCircleCalculator />;
      case CalculatorMode.Statistics:
        return <StatisticsCalculator />;
      case CalculatorMode.Financial:
        return <FinancialCalculator />;
      default:
        return <BasicCalculator />;
    }
};

const Calculator: React.FC = () => {
  const { mode } = useCoreAppContext();
  const [activeComponent, setActiveComponent] = useState(() => getComponentForMode(mode));
  const [animationClass, setAnimationClass] = useState('animate-fade-in-up');
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip the animation on the very first render
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }

    // When mode changes, start fade-out animation
    setAnimationClass('animate-fade-out');
    
    // After fade-out duration, switch component and start fade-in
    const timer = setTimeout(() => {
      setActiveComponent(getComponentForMode(mode));
      setAnimationClass('animate-fade-in-up');
    }, 200); // This duration should match the fade-out animation time (0.2s)

    return () => clearTimeout(timer);
  }, [mode]);


  return <div className={`w-full h-full ${animationClass}`}>{activeComponent}</div>;
};

export default Calculator;