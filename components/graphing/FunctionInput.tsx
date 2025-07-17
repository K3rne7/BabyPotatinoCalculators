import React from 'react';

interface FunctionInputProps {
  id: string;
  expression: string;
  color: string;
  isActive: boolean;
  onUpdate: (id: string, expression: string) => void;
  onRemove: (id: string) => void;
  onFocus: (id: string) => void;
  onCursorChange: (id: string, position: number) => void;
  setRef: (element: HTMLInputElement | null) => void;
}

const RemoveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
)

const FunctionInput: React.FC<FunctionInputProps> = ({ id, expression, color, isActive, onUpdate, onRemove, onFocus, onCursorChange, setRef }) => {
  const activeClasses = isActive ? 'ring-2 ring-primary' : '';

  const handleFocus = () => {
    onFocus(id);
  };
  
  const handleSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
    onCursorChange(id, e.currentTarget.selectionStart || 0);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(id, e.target.value);
    onCursorChange(id, e.target.selectionStart || 0);
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <div className={`flex items-center gap-2 flex-grow bg-base-100 rounded-lg p-2 transition-all duration-200 ${activeClasses}`}>
        <span className="font-bold text-lg text-primary" style={{ color: color }}>f(x)=</span>
        <input
          ref={setRef}
          type="text"
          value={expression}
          onChange={handleChange}
          onFocus={handleFocus}
          onSelect={handleSelect}
          placeholder="e.g. x * sin(x)"
          className="w-full bg-transparent outline-none font-mono text-base-content no-selection-menu"
          aria-label={`Function expression for ${color}`}
          inputMode="none"
        />
      </div>
       <button 
        onClick={() => onRemove(id)}
        className="p-2 rounded-full hover:bg-base-300 text-base-content/70 hover:text-red-500 transition-colors"
        aria-label={`Remove function ${expression}`}
      >
        <RemoveIcon />
      </button>
    </div>
  );
};

export default FunctionInput;