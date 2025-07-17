import { useContext } from 'react';
import { CoreAppContext } from '../context/CoreAppContext';

export const useCoreAppContext = () => {
  const context = useContext(CoreAppContext);
  if (context === undefined) {
    throw new Error('useCoreAppContext must be used within a CoreAppProvider');
  }
  return context;
};
