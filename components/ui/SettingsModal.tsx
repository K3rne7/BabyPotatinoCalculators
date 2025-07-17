
import React, { useState } from 'react';
import { useCoreAppContext } from '../../hooks/useCoreAppContext';
import ThemeSwitcher from './ThemeSwitcher';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069s-3.585-.011-4.85-.069c-3.252-.149-4.771-1.664-4.919-4.919-.058-1.265-.069-1.644-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.415 2.175 8.796 2.163 12 2.163zm0 1.44c-3.117 0-3.486.01-4.71.066-2.923.133-4.144 1.354-4.277 4.277-.056 1.224-.066 1.595-.066 4.71s.01 3.486.066 4.71c.133 2.923 1.354 4.144 4.277 4.277 1.224.056 1.595.066 4.71.066s3.486-.01 4.71-.066c2.923-.133 4.144-1.354 4.277-4.277.056-1.224.066-1.595-.066-4.71s-.01-3.486-.066-4.71c-.133-2.923-1.354-4.144-4.277-4.277-1.224-.056-1.595-.066-4.71-.066zm0 2.88a5.517 5.517 0 100 11.034 5.517 5.517 0 000-11.034zm0 1.44a4.077 4.077 0 110 8.154 4.077 4.077 0 010-8.154zm4.654-4.162a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z"/>
    </svg>
);


const SettingsModal: React.FC = () => {
    const { isSettingsVisible, closeSettings } = useCoreAppContext();
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            closeSettings();
            setIsClosing(false);
        }, 200); // Match animation duration
    };

    if (!isSettingsVisible) {
        return null;
    }

    const instagramStyle: React.CSSProperties = {
        background: 'linear-gradient(to right, hsl(var(--p)), hsl(var(--s)))',
    };

    return (
        <div 
            className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${isClosing ? 'animate-fade-out' : 'animate-fade-in-up'}`}
            onClick={handleClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="w-full max-w-sm p-6 space-y-6 glass-panel rounded-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Settings</h2>
                    <button onClick={handleClose} className="p-2 -mr-2 rounded-full hover:bg-base-300/50" aria-label="Close settings">
                        <CloseIcon />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Theme</h3>
                        <ThemeSwitcher />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-3">Follow Me</h3>
                        <a 
                            href="https://www.instagram.com/babypotatino"
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-3 p-3 rounded-lg hover:opacity-90 transition-opacity"
                            style={instagramStyle}
                        >
                            <InstagramIcon className="h-6 w-6 text-white"/>
                            <span className="font-semibold text-white">@babypotatino</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
