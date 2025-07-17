import React, { createContext, ReactNode } from 'react';

// The context no longer holds any state or functions related to history.
interface ConverterContextType {}

export const ConverterContext = createContext<ConverterContextType | undefined>(undefined);

export const ConverterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // The value is an empty object as there's no shared state for the converter anymore.
  const value = {};

  return <ConverterContext.Provider value={value}>{children}</ConverterContext.Provider>;
};
