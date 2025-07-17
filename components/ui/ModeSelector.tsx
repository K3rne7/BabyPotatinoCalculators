
import React from 'react';
import { useCoreAppContext } from '../../hooks/useCoreAppContext';
import { CalculatorMode } from '../../types';
import CustomSelect from './CustomSelect';

const ModeSelector: React.FC = () => {
  const { mode, setMode } = useCoreAppContext();

  const options = Object.values(CalculatorMode).map(m => ({
    value: m,
    label: m,
  }));

  return (
    <div className="relative w-44">
      <CustomSelect 
        value={mode}
        onChange={(val) => setMode(val as CalculatorMode)}
        options={options}
        variant="solid"
      />
    </div>
  );
};

export default ModeSelector;
