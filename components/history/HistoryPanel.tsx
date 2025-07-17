
import React from 'react';
import { useCalculatorContext } from '../../hooks/useCalculatorContext';
import { useCoreAppContext } from '../../hooks/useCoreAppContext';
import { HistoryEntry } from '../../types';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
)

const HistoryItem: React.FC<{ item: HistoryEntry, onLoad: (expression: string) => void }> = ({ item, onLoad }) => {
    return (
        <button 
            onClick={() => onLoad(item.expression)}
            className="w-full text-left p-3 rounded-lg hover:bg-base-300/50 transition-colors duration-200"
            title={`Click to load: ${item.expression}`}
        >
            <p className="text-sm text-base-content/60 truncate">{item.expression}</p>
            <p className="text-xl font-semibold text-base-content truncate">{item.result}</p>
        </button>
    );
};


const HistoryPanel: React.FC = () => {
  const { isHistoryVisible, closeHistory } = useCoreAppContext();
  const { history, clearHistory, loadFromHistory } = useCalculatorContext();

  return (
    <aside className={`fixed top-0 right-0 w-full max-w-sm h-full p-4 flex flex-col z-50 transform transition-transform duration-300 ease-in-out glass-panel rounded-l-2xl ${isHistoryVisible ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">History</h2>
        <div className="flex items-center gap-2">
            {history.length > 0 && (
            <button 
                onClick={clearHistory} 
                className="text-sm text-primary hover:underline focus:outline-none"
            >
                Clear
            </button>
            )}
            <button onClick={closeHistory} className="p-2 rounded-full hover:bg-base-300/50" aria-label="Close history">
                <CloseIcon />
            </button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto space-y-2 pr-1 result-scroll">
        {history.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-base-content/50">
            <p>Your calculations will appear here.</p>
          </div>
        ) : (
          history.map((item) => (
            <HistoryItem key={item.id} item={item} onLoad={loadFromHistory} />
          ))
        )}
      </div>
    </aside>
  );
};

export default HistoryPanel;