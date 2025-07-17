
import React from 'react';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
)

const ConverterHistoryPanel: React.FC<{ isVisible: boolean, onClose: () => void }> = ({ isVisible, onClose }) => {
  // Mock history functionality as it's not available in the context.
  const converterHistory: any[] = [];
  const clearConverterHistory = () => {};

  return (
    <>
    <aside className={`fixed top-0 right-0 w-full max-w-sm h-full bg-base-200 shadow-2xl p-4 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Conversion History</h2>
        <div className="flex items-center gap-2">
            {converterHistory.length > 0 && (
            <button 
                onClick={clearConverterHistory} 
                className="text-sm text-primary hover:underline focus:outline-none"
            >
                Clear
            </button>
            )}
            <button onClick={onClose} className="p-2 rounded-full hover:bg-base-300" aria-label="Close history">
                <CloseIcon />
            </button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto space-y-3 pr-1">
        {converterHistory.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-base-content/50">
            <p>Your recent conversions will appear here.</p>
          </div>
        ) : (
          converterHistory.map((item) => (
            <div key={item.id} className="bg-base-100 p-3 rounded-lg">
                <p className="text-xs text-base-content/60 mb-1">{item.category}</p>
                <div className="flex flex-col gap-1">
                    <p className="text-base font-mono truncate"><span className="font-semibold">{item.fromValue}</span> {item.fromUnit}</p>
                    <p className="text-base-content/50 font-sans text-sm">equals</p>
                    <p className="text-lg font-mono truncate"><span className="font-semibold">{item.toValue}</span> {item.toUnit}</p>
                </div>
            </div>
          ))
        )}
      </div>
    </aside>
    {isVisible && <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose}></div>}
    </>
  );
};

export default ConverterHistoryPanel;