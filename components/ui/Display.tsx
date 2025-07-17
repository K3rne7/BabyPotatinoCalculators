import React, { useRef, useEffect } from 'react';
import { useCalculatorContext } from '../../hooks/useCalculatorContext';

const Display: React.FC = () => {
  const { 
    expression, 
    setExpression, 
    cursorPosition, 
    setCursorPosition, 
    isResult, 
    setIsResult,
    inputError
  } = useCalculatorContext();
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync the actual input's cursor with the state's cursor position.
  useEffect(() => {
    if (inputRef.current) {
      const input = inputRef.current;
      input.selectionStart = cursorPosition;
      input.selectionEnd = cursorPosition;

      // For results, scroll to the beginning. For input, scroll to the end.
      if (isResult && input.scrollWidth > input.clientWidth) {
        input.scrollLeft = 0;
      } else if (!isResult && input.scrollWidth > input.clientWidth) {
        // This scrolls to the end, which is the typical behavior for calculators
        // and keeps the cursor visible when appending.
        input.scrollLeft = input.scrollWidth;
      }
    }
  }, [expression, cursorPosition, isResult]);

  const getFontSize = (text: string) => {
    const len = text.length || 1;
    if (len > 42) return 'text-base';
    if (len > 35) return 'text-lg';
    if (len > 28) return 'text-xl';
    if (len > 21) return 'text-2xl';
    if (len > 15) return 'text-3xl';
    if (len > 10) return 'text-4xl';
    return 'text-5xl';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // When user types, it's no longer a result
    if(isResult) setIsResult(false);
    setExpression(e.target.value);
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
    // Update our cursor position state whenever the user clicks or uses arrow keys.
    setCursorPosition(e.currentTarget.selectionStart || 0);
  };
  
  const baseClasses = `w-full h-full bg-transparent font-mono text-right outline-none text-base-content transition-all duration-200 ${getFontSize(expression)}`;
  const errorClass = inputError ? 'input-error-shake' : '';

  return (
    <div className="rounded-lg p-4 w-full h-28 flex items-end justify-end overflow-hidden glass-display">
      <input
        ref={inputRef}
        type="text"
        role="textbox"
        aria-live="polite"
        aria-readonly={isResult}
        value={expression}
        onChange={handleChange}
        onSelect={handleSelect}
        placeholder="0"
        className={`${baseClasses} ${errorClass} no-selection-menu`}
        aria-label="Calculator display"
        inputMode="none"
      />
    </div>
  );
};

export default Display;