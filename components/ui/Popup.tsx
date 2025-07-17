
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useOutsideClick } from '../../hooks/useOutsideClick';

type PopupPosition = 'top-center' | 'bottom-center' | 'bottom-left' | 'auto';

interface PopupProps {
    target: HTMLElement | null;
    onClose: () => void;
    children: React.ReactNode;
    position?: PopupPosition;
    className?: string;
}

const Popup: React.FC<PopupProps> = ({ target, onClose, children, position = 'auto', className = '' }) => {
    const popupRef = useRef<HTMLDivElement>(null);
    // Position off-screen initially to prevent layout shift (shaking)
    const [style, setStyle] = useState<React.CSSProperties>({ position: 'fixed', top: '-9999px', left: '-9999px', opacity: 0 });
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = useCallback(() => {
        if (isClosing) return;
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 200); // Animation duration
    }, [isClosing, onClose]);

    useOutsideClick(popupRef, (event) => {
        if (target && !target.contains(event.target as Node)) {
            handleClose();
        }
    });

    useEffect(() => {
        if (target && popupRef.current) {
            const targetRect = target.getBoundingClientRect();
            const popupRect = popupRef.current.getBoundingClientRect();
            const boundary = document.getElementById('calculator-boundary')?.getBoundingClientRect();
            const containerRect = boundary || { top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight, width: window.innerWidth, height: window.innerHeight };
            
            const margin = 2; // Reduced margin for closer positioning
            let top = 0;
            let left = 0;

            let effectivePosition = position;

            if (position === 'auto') {
                // Default to top, but flip to bottom if not enough space
                if (targetRect.top - popupRect.height - margin > containerRect.top) {
                    effectivePosition = 'top-center';
                } else {
                    effectivePosition = 'bottom-center';
                }
            }

            switch(effectivePosition) {
                case 'top-center':
                    top = targetRect.top - popupRect.height - margin;
                    left = targetRect.left + targetRect.width / 2 - popupRect.width / 2;
                    break;
                case 'bottom-left':
                    top = targetRect.bottom + margin;
                    left = targetRect.left;
                    break;
                case 'bottom-center':
                default:
                    top = targetRect.bottom + margin;
                    left = targetRect.left + targetRect.width / 2 - popupRect.width / 2;
                    break;
            }
            
            // Clamp position to be within the calculator boundary
            top = Math.max(containerRect.top + margin, Math.min(top, containerRect.bottom - popupRect.height - margin));
            left = Math.max(containerRect.left + margin, Math.min(left, containerRect.right - popupRect.width - margin));

            setStyle({
                position: 'fixed',
                top: `${top}px`,
                left: `${left}px`,
                zIndex: 100,
                opacity: 1
            });
        }
    }, [target, position]);

    if (!target) return null;

    return createPortal(
        <div
            ref={popupRef}
            style={style}
            className={`popup-panel animate-fade-in-up ${isClosing ? 'animate-fade-out' : ''} ${className}`}
        >
            {children}
        </div>,
        document.body
    );
};

export default Popup;
