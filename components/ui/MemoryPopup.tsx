
import React from 'react';
import Popup from './Popup';

interface MemoryPopupProps {
    target: HTMLElement | null;
    onSelect: (action: string) => void;
    onClose: () => void;
}

const MemoryPopup: React.FC<MemoryPopupProps> = ({ target, onSelect, onClose }) => {
    const actions = ['MC', 'MR', 'M-'];

    return (
        <Popup target={target} onClose={onClose} position="bottom-center">
            <div className="p-1 flex gap-1">
                {actions.map(action => (
                    <button 
                        key={action} 
                        onClick={() => onSelect(action)} 
                        className="flex items-center justify-center w-12 h-10 rounded-md text-lg font-semibold bg-base-200/50 hover:bg-primary/80 hover:text-white transition-colors no-selection-menu"
                    >
                        {action}
                    </button>
                ))}
            </div>
        </Popup>
    );
};

export default MemoryPopup;
