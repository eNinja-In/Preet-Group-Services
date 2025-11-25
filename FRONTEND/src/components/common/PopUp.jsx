import React, { useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';

// --- Content Renderer Utility ---

/**
 * Renders the data content based on its type.
 * @param {object} props
 * @param {any} props.data - The content prop.
 * @returns {React.ReactNode} A React component tree for the content.
 */
const ModalContent = ({ data }) => {
    if (data === undefined || data === null) {
        return null;
    }

    // Handle React Components (JSX, Custom Elements)
    if (React.isValidElement(data) || typeof data === 'function') {
        return <>{data}</>;
    }

    // Handle plain text/numbers
    if (typeof data === 'string' || typeof data === 'number') {
        return (
            <p className="text-lg text-gray-700 p-2 text-center whitespace-pre-wrap">
                {data}
            </p>
        );
    }

    // Handle Objects (rendered as key-value list)
    if (typeof data === 'object' && !Array.isArray(data)) {
        const entries = Object.entries(data);
        if (entries.length === 0) return null;

        return (
            <div className="w-full divide-y divide-gray-200">
                {entries.map(([key, value], i) => (
                    <div
                        key={i}
                        className="flex flex-wrap items-start py-3 px-1"
                    >
                        <div className="w-1/3 text-base font-semibold text-blue-600 pr-2">
                            {key.toUpperCase()}
                        </div>
                        <div className="w-2/3 text-left text-base text-gray-800 wrap-break-word">
                            {String(value)}
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    
    // Fallback for other array types or unexpected data
    return <>{data}</>;
};

// --- Main Modal Component ---

export default function Modal({
    data,
    title,
    isOpen,
    onClose,
    className = '',
    closeOnClickOutside = true,
    actions = null,
    isContentScrollable = true,
}) {
    
    const handleClose = useCallback(() => {
        // Calls the parent's function to set isOpen to false
        onClose(false); 
    }, [onClose]);

    // Handler for clicking the background overlay
    const handleClickOutside = useCallback((e) => {
        // The type for 'e' is removed here!
        if (e.target === e.currentTarget && closeOnClickOutside) {
            handleClose();
        }
    }, [closeOnClickOutside, handleClose]);

    // Effect to handle the ESC key press and body scroll locking
    useEffect(() => {
        if (!isOpen) {
            document.body.style.overflow = ''; // Re-enable scroll
            return;
        }

        document.body.style.overflow = 'hidden'; // Lock scroll when open

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                handleClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = ''; // Clean up on unmount/close
        };
    }, [isOpen, handleClose]);
    
    if (!isOpen) {
        return null;
    }

    const contentClasses = isContentScrollable 
        ? 'overflow-y-auto max-h-[calc(80vh-120px)] p-4' // Calculated height for scrollable content
        : 'p-4';

    const modalMarkup = (
        // 1. Modal Overlay (Screen Dimmer)
        <div 
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 transition-opacity duration-300"
            onClick={handleClickOutside}
            aria-modal="true" 
            role="dialog"
            aria-labelledby={title ? 'modal-title' : undefined}
        >
            {/* 2. Modal Content Container */}
            <div
                className={`
                    max-w-3xl w-full mx-4 sm:mx-6 md:w-auto 
                    bg-white rounded-lg shadow-2xl border border-gray-200
                    flex flex-col transform transition-transform duration-300 scale-100
                    ${className}
                `}
                // Prevents closing the modal when clicking on the content itself
                onClick={(e) => e.stopPropagation()}
            >
                {/* 3. Modal Header (Title & Close Button) */}
                <div className="flex justify-between items-center p-5 border-b border-gray-200 relative">
                    {title && (
                        <h2 id="modal-title" className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            {title}
                        </h2>
                    )}
                    <button
                        type="button"
                        onClick={handleClose}
                        className="ml-auto p-1.5 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Close modal"
                    >
                        {/* Close Icon */}
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* 4. Modal Body (Content) */}
                <div className={`${contentClasses}`}>
                    <ModalContent data={data} />
                </div>

                {/* 5. Modal Footer (Actions) */}
                {actions && (
                    <div className="flex justify-end items-center p-5 border-t border-gray-200 space-x-3">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
    
    // Render the modal via a Portal to the document body
    return createPortal(modalMarkup, document.body);
}

// Optional: Add default props
Modal.defaultProps = {
    isOpen: false,
    closeOnClickOutside: true,
    isContentScrollable: true,
};