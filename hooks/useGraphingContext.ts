import { useContext } from 'react';
import { GraphingContext } from '../context/GraphingContext';

export const useGraphingContext = () => {
  const context = useContext(GraphingContext);
  if (context === undefined) {
    throw new Error('useGraphingContext must be used within a GraphingProvider');
  }
  return context;
};
