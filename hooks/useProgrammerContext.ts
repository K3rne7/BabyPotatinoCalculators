import { useContext } from 'react';
import { ProgrammerContext } from '../context/ProgrammerContext';

export const useProgrammerContext = () => {
  const context = useContext(ProgrammerContext);
  if (context === undefined) {
    throw new Error('useProgrammerContext must be used within a ProgrammerProvider');
  }
  return context;
};
