
import React, { createContext, useState, ReactNode } from 'react';
import { GraphFunction } from '../types';

const GRAPH_COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#eab308', '#a855f7', '#f97316',
];

interface GraphingContextType {
  functions: GraphFunction[];
  addFunction: () => string;
  updateFunction: (id: string, expression: string) => void;
  removeFunction: (id: string) => void;
  updateCursorPosition: (id: string, position: number) => void;
  graphCursorPositions: Record<string, number>;
  requestExport: () => void;
  exportRequestTimestamp: number | null;
}

export const GraphingContext = createContext<GraphingContextType | undefined>(undefined);

export const GraphingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [functions, setFunctions] = useState<GraphFunction[]>([
    { id: '1', expression: 'x*x', color: GRAPH_COLORS[0] },
    { id: '2', expression: 'sin(x)', color: GRAPH_COLORS[1] },
  ]);
  const [graphCursorPositions, setGraphCursorPositions] = useState<Record<string, number>>({});
  const [exportRequestTimestamp, setExportRequestTimestamp] = useState<number | null>(null);

  const updateCursorPosition = (id: string, position: number) => {
    setGraphCursorPositions(prev => ({ ...prev, [id]: position }));
  };

  const addFunction = (): string => {
    const newId = new Date().toISOString();
    setFunctions(prev => {
      const nextColor = GRAPH_COLORS[prev.length % GRAPH_COLORS.length];
      return [...prev, { id: newId, expression: '', color: nextColor }];
    });
    setGraphCursorPositions(prev => ({...prev, [newId]: 0}));
    return newId;
  };

  const updateFunction = (id: string, newExpression: string) => {
    setFunctions(prev => prev.map(f => (f.id === id ? { ...f, expression: newExpression } : f)));
  };
  
  const removeFunction = (id: string) => {
    setFunctions(prev => prev.filter(f => f.id !== id));
  };
  
  const requestExport = () => {
    setExportRequestTimestamp(Date.now());
  };

  const value = {
    functions,
    addFunction,
    updateFunction,
    removeFunction,
    updateCursorPosition,
    graphCursorPositions,
    requestExport,
    exportRequestTimestamp,
  };

  return <GraphingContext.Provider value={value}>{children}</GraphingContext.Provider>;
};
