import React from "react"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={onClose} />
            {/* Modal content */}
            <div
                className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md mx-4 relative z-50"
                onClick={e => e.stopPropagation()}
            >
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                {title && <div className="px-6 pt-6 pb-2 text-lg font-semibold">{title}</div>}
                <div className="px-6 pb-6 pt-2">{children}</div>
            </div>
        </div>
    )
}

export default Modal; 