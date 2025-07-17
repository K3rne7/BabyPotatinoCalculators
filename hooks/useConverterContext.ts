import { useContext } from 'react';
import { ConverterContext } from '../context/ConverterContext';

export const useConverterContext = () => {
  const context = useContext(ConverterContext);
  if (context === undefined) {
    throw new Error('useConverterContext must be used within a ConverterProvider');
  }
  return context;
};
