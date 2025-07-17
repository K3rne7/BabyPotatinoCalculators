
import React, { useState, useEffect, useRef } from 'react';
import { useGraphingContext } from '../../hooks/useGraphingContext';
import GraphDisplay from '../graphing/GraphDisplay';
import FunctionList from '../graphing/FunctionList';
import GraphingKeypad from '../graphing/GraphingKeypad';

const GraphingCalculator: React.FC = () => {
  const { functions, addFunction, updateFunction, removeFunction, graphCursorPositions, updateCursorPosition } = useGraphingContext();
  const [activeInputId, setActiveInputId] = useState<string | null>(null);
  const [isShift, setIsShift] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Set the first function as active on initial load
  useEffect(() => {
    if (!activeInputId && functions.length > 0) {
      setActiveInputId(functions[0].id);
    }
  }, [functions, activeInputId]);
  
  // Effect to restore cursor position after a state update
  useEffect(() => {
    if (activeInputId && inputRefs.current[activeInputId]) {
      const input = inputRefs.current[activeInputId];
      const pos = graphCursorPositions[activeInputId] ?? input?.value.length ?? 0;
      input?.focus();
      input?.setSelectionRange(pos, pos);
    }
  }, [functions, activeInputId, graphCursorPositions]);

  const handleAddFunction = () => {
    const newId = addFunction();
    setActiveInputId(newId);
  };

  const handleKeypadPress = (value: string) => {
    if (!activeInputId) return;

    const targetFunc = functions.find(f => f.id === activeInputId);
    if (!targetFunc) return;

    const currentExpression = targetFunc.expression;
    const cursorPos = graphCursorPositions[activeInputId] ?? currentExpression.length;
    let newExpression: string;
    let newCursorPos: number;

    switch (value) {
        case 'DEL':
            if (cursorPos > 0) {
                newExpression = currentExpression.slice(0, cursorPos - 1) + currentExpression.slice(cursorPos);
                newCursorPos = cursorPos - 1;
            } else {
                return; // Nothing to delete
            }
            break;
        case 'C':
            newExpression = '';
            newCursorPos = 0;
            break;
        default: {
            // Logic for inserting multiplication sign automatically
            const lastChar = currentExpression.slice(0, cursorPos).trim().slice(-1);
            const isNumberOrVar = (char: string) => /\d|x|y|z|k|h|π/.test(char) || char === ')';

            const functionLikeValues = [
              // functions
              'sin(', 'cos(', 'tan(', 'asin(', 'acos(', 'atan(', 
              'log(', 'log10(', 'sqrt(', 'abs(', 'nthRoot(', 'exp(', 'factorial(',
              // variables
              'x', 'y', 'z', 'k', 'h',
              // constants
              'π',
              // other
              '(', '10^'
            ];

            let textToInsert = value;
            if (value !== ')' && value !== '^' && isNumberOrVar(lastChar) && functionLikeValues.includes(value)) {
                textToInsert = '*' + value;
            }
            
            newExpression = currentExpression.slice(0, cursorPos) + textToInsert + currentExpression.slice(cursorPos);
            newCursorPos = cursorPos + textToInsert.length;
        }
    }
    
    updateFunction(activeInputId, newExpression);
    updateCursorPosition(activeInputId, newCursorPos);
  };


  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-170px)] sm:max-h-[600px] gap-4 overflow-y-auto pr-2">
      <div className="flex-grow bg-base-100 rounded-lg p-2 relative min-h-[200px]">
        <GraphDisplay functions={functions} />
      </div>
      <div className="flex-shrink-0">
        <FunctionList
          functions={functions}
          onAdd={handleAddFunction}
          onUpdate={updateFunction}
          onRemove={removeFunction}
          activeInputId={activeInputId}
          setActiveInputId={setActiveInputId}
          onCursorChange={updateCursorPosition}
          inputRefs={inputRefs}
        />
      </div>
      <div className="flex-shrink-0">
        <GraphingKeypad onKeyPress={handleKeypadPress} isShift={isShift} setIsShift={setIsShift} />
      </div>
    </div>
  );
};

export default GraphingCalculator;
