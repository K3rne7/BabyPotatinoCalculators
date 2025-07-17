

import React from 'react';
import { useProgrammerContext } from '../../hooks/useProgrammerContext';
import { ProgrammerBase, WordSize } from '../../types';

interface BaseRowProps {
  base: ProgrammerBase;
  label: string;
  value: bigint;
  isActive: boolean;
  onBaseChange: (base: ProgrammerBase) => void;
  isSigned?: boolean;
  wordSize?: WordSize;
}

const BaseRow: React.FC<BaseRowProps> = ({ base, label, value, isActive, onBaseChange, isSigned, wordSize }) => {
  let displayValue: string;

  if (label === 'DEC' && isSigned && wordSize) {
      const size = BigInt(wordSize);
      const signBitMask = 1n << (size - 1n);
      // Check if the sign bit is set for the current value and wordsize
      if ((value & signBitMask) !== 0n) {
          // It's a negative number, compute two's complement value
          const fullRange = 1n << size;
          displayValue = (value - fullRange).toString(10);
      } else {
          // It's a positive number
          displayValue = value.toString(10);
      }
  } else {
      displayValue = value.toString(base).toUpperCase();
  }

  const activeClass = isActive ? 'bg-primary/20 text-primary font-bold' : 'hover:bg-base-300/50';

  return (
    <button
      onClick={() => onBaseChange(base)}
      className={`flex items-center w-full p-1.5 rounded-md transition-colors text-left ${activeClass}`}
      aria-label={`Switch to ${label} base. Current value: ${displayValue}`}
      aria-pressed={isActive}
    >
      <span className="w-10 font-semibold text-xs opacity-70">{label}</span>
      <span className="flex-1 font-mono text-sm tracking-wider break-all">{displayValue}</span>
    </button>
  );
};

const ProgrammerDisplay: React.FC = () => {
  const { programmerValue, programmerBase, setProgrammerBase, isSigned, wordSize } = useProgrammerContext();

  return (
    <div className="flex flex-col gap-1 p-1 bg-base-200/50 rounded-lg">
      <BaseRow base={ProgrammerBase.Hex} label="HEX" value={programmerValue} isActive={programmerBase === ProgrammerBase.Hex} onBaseChange={setProgrammerBase} />
      <BaseRow base={ProgrammerBase.Dec} label="DEC" value={programmerValue} isActive={programmerBase === ProgrammerBase.Dec} onBaseChange={setProgrammerBase} isSigned={isSigned} wordSize={wordSize} />
      <BaseRow base={ProgrammerBase.Oct} label="OCT" value={programmerValue} isActive={programmerBase === ProgrammerBase.Oct} onBaseChange={setProgrammerBase} />
      <BaseRow base={ProgrammerBase.Bin} label="BIN" value={programmerValue} isActive={programmerBase === ProgrammerBase.Bin} onBaseChange={setProgrammerBase} />
    </div>
  );
};

export default ProgrammerDisplay;