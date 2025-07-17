import React from 'react';
import { useProgrammerContext } from '../../hooks/useProgrammerContext';
import { WordSize } from '../../types';

const WordSizeSelector: React.FC = () => {
    const { wordSize, setWordSize, isSigned, setSigned } = useProgrammerContext();
    const sizes = [
        { label: 'QWORD', value: WordSize.QWORD, description: '64-bit' },
        { label: 'DWORD', value: WordSize.DWORD, description: '32-bit' },
        { label: 'WORD', value: WordSize.WORD, description: '16-bit' },
        { label: 'BYTE', value: WordSize.BYTE, description: '8-bit' },
    ];

    const signedness = [
        { label: 'Unsigned', value: false },
        { label: 'Signed', value: true },
    ];

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-start bg-base-200/50 rounded-lg p-1 gap-1">
                {sizes.map(s => (
                    <button
                        key={s.label}
                        onClick={() => setWordSize(s.value)}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors w-full ${wordSize === s.value ? 'bg-primary text-white shadow-sm' : 'hover:bg-base-300/50'}`}
                        title={s.description}
                        aria-pressed={wordSize === s.value}
                    >
                        {s.label}
                    </button>
                ))}
            </div>
            <div className="flex items-center justify-start bg-base-200/50 rounded-lg p-1 gap-1">
                 {signedness.map(s => (
                     <button
                        key={s.label}
                        onClick={() => setSigned(s.value)}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors w-full ${isSigned === s.value ? 'bg-accent/80 text-black shadow-sm' : 'hover:bg-base-300/50'}`}
                        aria-pressed={isSigned === s.value}
                    >
                        {s.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default WordSizeSelector;