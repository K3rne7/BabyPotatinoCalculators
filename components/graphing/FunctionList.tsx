
import React from 'react';
import { GraphFunction } from '../../types';
import FunctionInput from './FunctionInput';

interface FunctionListProps {
  functions: GraphFunction[];
  onAdd: () => void;
  onUpdate: (id: string, expression: string) => void;
  onRemove: (id: string) => void;
  activeInputId: string | null;
  setActiveInputId: (id: string) => void;
  onCursorChange: (id: string, position: number) => void;
  inputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
}

const AddIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
);


const FunctionList: React.FC<FunctionListProps> = ({ functions, onAdd, onUpdate, onRemove, activeInputId, setActiveInputId, onCursorChange, inputRefs }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="max-h-24 overflow-y-auto space-y-2 pr-2">
        {functions.map(func => (
          <FunctionInput
            key={func.id}
            id={func.id}
            expression={func.expression}
            color={func.color}
            onUpdate={onUpdate}
            onRemove={onRemove}
            isActive={activeInputId === func.id}
            onFocus={setActiveInputId}
            onCursorChange={onCursorChange}
            setRef={(el) => (inputRefs.current[func.id] = el)}
          />
        ))}
      </div>
      <button
        onClick={onAdd}
        className="flex items-center justify-center gap-2 w-full p-2 bg-primary text-white rounded-lg hover:bg-primary-focus transition-colors font-semibold"
      >
        <AddIcon />
        Add Function
      </button>
    </div>
  );
};

export default FunctionList;
