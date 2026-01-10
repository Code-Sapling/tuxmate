'use client';

import { useState, useRef } from 'react';
import { Check, Copy, X, Download } from 'lucide-react';
import { AurDrawerSettings } from './AurDrawerSettings';

interface CommandDrawerProps {
    isOpen: boolean;
    isClosing: boolean;
    onClose: () => void;
    command: string;
    selectedCount: number;
    copied: boolean;
    onCopy: () => void;
    onDownload: () => void;
    // AUR settings
    showAur: boolean;
    aurAppNames: string[];
    hasYayInstalled: boolean;
    setHasYayInstalled: (value: boolean) => void;
    selectedHelper: 'yay' | 'paru';
    setSelectedHelper: (helper: 'yay' | 'paru') => void;
    distroColor: string;
}

/**
 * Command drawer that shows the generated install command.
 * Acts as a bottom sheet on mobile (swipe to dismiss) and a centered modal on desktop.
 * If you're reading this, yes, I did spend way too much time on the animations.
 */
export function CommandDrawer({
    isOpen,
    isClosing,
    onClose,
    command,
    selectedCount,
    copied,
    onCopy,
    onDownload,
    showAur,
    aurAppNames,
    hasYayInstalled,
    setHasYayInstalled,
    selectedHelper,
    setSelectedHelper,
    distroColor,
}: CommandDrawerProps) {
    // Swipe-to-dismiss for mobile users who hate tapping tiny X buttons
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartY = useRef(0);
    const DISMISS_THRESHOLD = 100; // Feels right™

    const handleTouchStart = (e: React.TouchEvent) => {
        dragStartY.current = e.touches[0].clientY;
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const delta = e.touches[0].clientY - dragStartY.current;
        // Only allow dragging down (positive delta)
        setDragOffset(Math.max(0, delta));
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        if (dragOffset > DISMISS_THRESHOLD) {
            onClose();
        }
        setDragOffset(0);
    };

    if (!isOpen) return null;

    // Copy command and auto-close after a celebratory 3 seconds
    const handleCopyAndClose = () => {
        onCopy();
        setTimeout(onClose, 3000);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                onClick={onClose}
                aria-hidden="true"
                style={{ animation: isClosing ? 'fadeOut 0.3s ease-out forwards' : 'fadeIn 0.3s ease-out' }}
            />

            {/* Drawer */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="drawer-title"
                className="fixed z-50 bg-[var(--bg-secondary)] rounded-t-xl md:rounded-lg shadow-2xl
                    bottom-0 left-0 right-0
                    md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-[90vw]"
                style={{
                    boxShadow: '0 0 0 1px var(--border-primary), 0 20px 60px -10px rgba(0, 0, 0, 0.5)',
                    animation: isClosing
                        ? 'slideDown 0.3s cubic-bezier(0.32, 0, 0.67, 0) forwards'
                        : dragOffset > 0 ? 'none' : 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    maxHeight: '80vh',
                    transform: dragOffset > 0 ? `translateY(${dragOffset}px)` : undefined,
                    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    border: '1px solid var(--border-primary)',
                }}
            >
                {/* Drawer Handle - mobile only, draggable */}
                <div
                    className="flex justify-center pt-3 pb-2 md:hidden cursor-grab active:cursor-grabbing touch-none"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className="w-12 h-1.5 bg-[var(--text-muted)]/40 rounded-full"
                        onClick={onClose}
                    />
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-5 rounded-full" style={{ backgroundColor: distroColor }}></div>
                            <div>
                                <h3 id="drawer-title" className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">Terminal Preview</h3>
                                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                                    {selectedCount} apps selected
                                </p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 rounded-md hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                        aria-label="Close drawer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto bg-[var(--bg-primary)]/50" style={{ maxHeight: 'calc(80vh - 140px)' }}>
                    {showAur && (
                        <AurDrawerSettings
                            aurAppNames={aurAppNames}
                            hasYayInstalled={hasYayInstalled}
                            setHasYayInstalled={setHasYayInstalled}
                            selectedHelper={selectedHelper}
                            setSelectedHelper={setSelectedHelper}
                            distroColor={distroColor}
                        />
                    )}

                    {/* Terminal preview - where the magic gets displayed */}
                    <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)]">
                            <span className="text-xs font-mono text-[var(--text-muted)]">bash</span>

                            {/* Desktop action buttons */}
                            <div className="hidden md:flex items-center gap-2">
                                <button
                                    onClick={onDownload}
                                    className="h-8 px-4 flex items-center gap-2 rounded-md hover:bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all text-xs font-medium"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Script</span>
                                </button>
                                <button
                                    onClick={handleCopyAndClose}
                                    className={`h-8 px-4 flex items-center gap-2 rounded-md text-xs font-medium transition-all ${copied
                                        ? 'shadow-sm'
                                        : 'hover:bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                        }`}
                                    style={{
                                        backgroundColor: copied ? distroColor : 'transparent',
                                        color: copied ? '#000' : undefined,
                                    }}
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    <span>{copied ? 'Copied' : 'Copy'}</span>
                                </button>
                            </div>
                        </div>

                        <div className="p-4 font-mono text-sm overflow-x-auto bg-[var(--bg-secondary)]">
                            <div className="flex gap-3">
                                <span className="select-none shrink-0 font-bold" style={{ color: distroColor }}>$</span>
                                <code
                                    className="text-[var(--text-primary)] break-all whitespace-pre-wrap select-text"
                                    style={{
                                        lineHeight: '1.6',
                                        fontFamily: 'var(--font-jetbrains-mono), monospace'
                                    }}
                                >
                                    {command}
                                </code>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Actions */}
                <div className="md:hidden flex items-stretch gap-3 px-4 py-3 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                    <button
                        onClick={onDownload}
                        className="flex-1 h-11 flex items-center justify-center gap-2 rounded-md bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] active:scale-[0.98] transition-all font-medium text-sm"
                    >
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                    <button
                        onClick={handleCopyAndClose}
                        className={`flex-1 h-11 flex items-center justify-center gap-2 rounded-md font-medium text-sm active:scale-[0.98] transition-all shadow-sm ${copied
                            ? 'text-black'
                            : 'text-[var(--text-primary)] bg-[var(--bg-tertiary)] border border-[var(--border-primary)]'
                            }`}
                        style={{
                            backgroundColor: copied ? distroColor : undefined,
                        }}
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>
        </>
    );
}
