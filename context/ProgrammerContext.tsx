import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { ProgrammerBase, WordSize } from '../types';

const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';

const stringToBigIntWithBase = (value: string, base: number): bigint | null => {
    if (base < 2 || base > 36) return null;
    let result = 0n;
    const baseBigInt = BigInt(base);
    for (const char of value.toLowerCase()) {
        const digitValue = DIGITS.indexOf(char);
        if (digitValue === -1 || digitValue >= base) return null;
        result = result * baseBigInt + BigInt(digitValue);
    }
    return result;
};

interface ProgrammerContextType {
  programmerBase: ProgrammerBase;
  setProgrammerBase: (base: ProgrammerBase) => void;
  wordSize: WordSize;
  setWordSize: (size: WordSize) => void;
  isSigned: boolean;
  setSigned: (signed: boolean) => void;
  programmerValue: bigint;
  handleProgrammerKeyClick: (key: string) => void;
  programmerDisplayValue: string;
}

export const ProgrammerContext = createContext<ProgrammerContextType | undefined>(undefined);

export const ProgrammerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [programmerBase, setProgrammerBase] = useState<ProgrammerBase>(ProgrammerBase.Dec);
  const [wordSize, setWordSize] = useState<WordSize>(WordSize.QWORD);
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [programmerValue, setProgrammerValue] = useState<bigint>(0n);
  const [isEnteringProgrammer, setIsEnteringProgrammer] = useState<boolean>(true);
  const [programmerPendingOp, setProgrammerPendingOp] = useState<{ operand: bigint, op: string } | null>(null);

  const applyWordSizeMask = useCallback((value: bigint, size: WordSize = wordSize) => {
    const bitSize = BigInt(size);
    const mask = (1n << bitSize) - 1n;
    return value & mask;
  }, [wordSize]);

  const handleProgrammerKeyClick = useCallback((key: string) => {
    const performOperation = (op: string, operand1: bigint, operand2: bigint) => {
        let result = 0n;
        const sizeN = BigInt(wordSize);
        
        // Ensure shift/rotate amount is a reasonable number, not a huge bigint
        const shiftAmount = BigInt.asIntN(32, operand2);

        switch (op) {
            case 'AND': result = operand1 & operand2; break;
            case 'OR':  result = operand1 | operand2; break;
            case 'XOR': result = operand1 ^ operand2; break;
            case 'LSL': result = operand1 << shiftAmount; break;
            case 'LSR': result = operand1 >> shiftAmount; break; // Arithmetic shift
            case 'ROL': {
                const shift = shiftAmount % sizeN;
                if (shift === 0n) return operand1;
                result = (operand1 << shift) | (operand1 >> (sizeN - shift));
                break;
            }
            case 'ROR': {
                const shift = shiftAmount % sizeN;
                if (shift === 0n) return operand1;
                result = (operand1 >> shift) | (operand1 << (sizeN - shift));
                break;
            }
            default: return operand2;
        }
        return applyWordSizeMask(result);
    };

    const isDigit = /^[0-9A-F]$/i.test(key);
    if (isDigit) {
        const digitValue = parseInt(key, 16);
        if (digitValue >= programmerBase) return;

        let newValue: bigint;
        if (isEnteringProgrammer) {
            newValue = BigInt(digitValue);
            setIsEnteringProgrammer(false);
        } else {
            const currentString = programmerValue.toString(programmerBase);
            const newString = currentString === '0' ? key.toLowerCase() : currentString + key.toLowerCase();
            const parsed = stringToBigIntWithBase(newString, programmerBase);
            newValue = parsed !== null ? parsed : programmerValue;
        }
        setProgrammerValue(applyWordSizeMask(newValue));
        return;
    }

    switch(key) {
        case 'AC':
            setProgrammerValue(0n);
            setProgrammerPendingOp(null);
            setIsEnteringProgrammer(true);
            break;
        case 'DEL':
            if (!isEnteringProgrammer && programmerValue !== 0n) {
                const currentString = programmerValue.toString(programmerBase);
                const newString = currentString.slice(0, -1) || '0';
                const newValue = stringToBigIntWithBase(newString, programmerBase);
                setProgrammerValue(newValue !== null ? applyWordSizeMask(newValue) : 0n);
            }
            break;
        case 'NOT':
            setProgrammerValue(val => applyWordSizeMask(~val));
            setIsEnteringProgrammer(true);
            break;
        case '=':
            if (programmerPendingOp) {
                const result = performOperation(programmerPendingOp.op, programmerPendingOp.operand, programmerValue);
                setProgrammerValue(result);
                setProgrammerPendingOp(null);
                setIsEnteringProgrammer(true);
            }
            break;
        default: // Binary operators (AND, OR, LSL, ROR etc)
            if (programmerPendingOp) {
                const result = performOperation(programmerPendingOp.op, programmerPendingOp.operand, programmerValue);
                 setProgrammerValue(result);
                 setProgrammerPendingOp({ operand: result, op: key });
            } else {
                 setProgrammerPendingOp({ operand: programmerValue, op: key });
            }
            setIsEnteringProgrammer(true);
            break;
    }
  }, [programmerBase, programmerValue, isEnteringProgrammer, programmerPendingOp, applyWordSizeMask, wordSize]);
  
  const handleSetWordSize = (size: WordSize) => {
    setWordSize(size);
    setProgrammerValue(val => applyWordSizeMask(val, size));
    if(programmerPendingOp) {
      setProgrammerPendingOp(prev => prev ? ({...prev, operand: applyWordSizeMask(prev.operand, size)}) : null);
    }
  };
  
  const programmerDisplayValue = programmerValue.toString(programmerBase).toUpperCase();

  const value = {
    programmerBase,
    setProgrammerBase,
    wordSize,
    setWordSize: handleSetWordSize,
    isSigned,
    setSigned: setIsSigned,
    programmerValue,
    handleProgrammerKeyClick,
    programmerDisplayValue,
  };

  return <ProgrammerContext.Provider value={value}>{children}</ProgrammerContext.Provider>;
};
