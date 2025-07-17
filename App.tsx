
import React, { useEffect } from 'react';
import { CoreAppProvider } from './context/CoreAppContext';
import { CalculatorProvider } from './context/CalculatorContext';
import { GraphingProvider } from './context/GraphingContext';
import { ProgrammerProvider } from './context/ProgrammerContext';
import { ConverterProvider } from './context/ConverterContext';
import Calculator from './components/Calculator';
import HistoryPanel from './components/history/HistoryPanel';
import ModeSelector from './components/ui/ModeSelector';
import SettingsModal from './components/ui/SettingsModal';
import { useCoreAppContext } from './hooks/useCoreAppContext';
import { useGraphingContext } from './hooks/useGraphingContext';
import { CalculatorMode } from './types';

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


const AppContent: React.FC = () => {
  const { mode, isHistoryVisible, toggleHistory, closeHistory, toggleSettings } = useCoreAppContext();
  const { requestExport } = useGraphingContext();

  useEffect(() => {
    const scrollContainer = document.getElementById('calculator-boundary');
    if (!scrollContainer) return;

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (target.matches('input[data-keyboard-aware="true"], textarea[data-keyboard-aware="true"]')) {
        // Add class to enable scrolling and padding
        scrollContainer.classList.add('keyboard-active');
        
        // Use a small timeout to let the UI update and keyboard start appearing
        setTimeout(() => {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }, 200);
      }
    };

    const handleFocusOut = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (target.matches('input[data-keyboard-aware="true"], textarea[data-keyboard-aware="true"]')) {
        // Remove class to disable scrolling and padding, and scroll to top
        scrollContainer.classList.remove('keyboard-active');
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const handleViewportResize = () => {
      const visualViewport = window.visualViewport;
      if (!visualViewport) return;

      // Heuristic to detect if the keyboard is likely closed.
      const isKeyboardClosed = visualViewport.height > window.innerHeight - 100;

      if (isKeyboardClosed && scrollContainer.classList.contains('keyboard-active')) {
        // Check if any keyboard-aware element is currently focused. If not, we can safely reset the view.
        const focusedElement = document.activeElement;
        const isInputFocused = focusedElement && focusedElement.matches('input[data-keyboard-aware="true"], textarea[data-keyboard-aware="true"]');
        
        if (!isInputFocused) {
            scrollContainer.classList.remove('keyboard-active');
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    window.visualViewport?.addEventListener('resize', handleViewportResize);

    return () => {
        document.removeEventListener('focusin', handleFocusIn);
        document.removeEventListener('focusout', handleFocusOut);
        window.visualViewport?.removeEventListener('resize', handleViewportResize);
        if (scrollContainer) {
            scrollContainer.classList.remove('keyboard-active');
        }
    };
  }, []);


  return (
    <div className="min-h-screen font-sans">
      <main className="flex flex-col h-screen p-2 sm:p-4 gap-4">
        <div className="flex-grow flex items-center justify-center relative">
          <div id="calculator-boundary" className="w-full max-w-lg mx-auto p-4 flex flex-col gap-4 relative h-[calc(100vh-3rem)] max-h-[750px] glass">
            <div className="flex justify-between items-center flex-shrink-0">
              <ModeSelector />
              <div className="flex items-center gap-2">
                {mode === CalculatorMode.Graphing && (
                  <button
                    onClick={requestExport}
                    className="p-2 rounded-full hover:bg-base-300/50 transition-colors"
                    aria-label="Export Graph as PNG"
                  >
                    <ExportIcon />
                  </button>
                )}
                <button
                  onClick={toggleHistory}
                  className="p-2 rounded-full hover:bg-base-300/50 transition-colors"
                  aria-label="Toggle History Panel"
                >
                  <HistoryIcon />
                </button>
                 <button
                  onClick={toggleSettings}
                  className="p-2 rounded-full hover:bg-base-300/50 transition-colors"
                  aria-label="Toggle Settings"
                >
                  <SettingsIcon />
                </button>
              </div>
            </div>
            <div className="flex-grow min-h-0">
                <Calculator />
            </div>
          </div>
        </div>
        
        {/* History Panel Overlay */}
        {isHistoryVisible && (
            <div
                className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ease-in-out"
                onClick={closeHistory}
                aria-hidden="true"
            />
        )}
        <HistoryPanel />
        <SettingsModal />
      </main>
    </div>
  )
}

const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <CoreAppProvider>
      <CalculatorProvider>
        <GraphingProvider>
          <ProgrammerProvider>
            <ConverterProvider>
              {children}
            </ConverterProvider>
          </ProgrammerProvider>
        </GraphingProvider>
      </CalculatorProvider>
    </CoreAppProvider>
  );
};


const App: React.FC = () => {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
};

export default App;