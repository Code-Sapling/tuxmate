'use client';

import {
    ChevronRight, Globe, MessageCircle, Code2, FileCode, Wrench,
    Terminal, Command, Play, Palette, Gamepad2, Briefcase,
    Network, Lock, Share2, Cpu, type LucideIcon
} from 'lucide-react';

// Map category names to their icons. If you add a category, add an icon here.
const CATEGORY_ICONS: Record<string, LucideIcon> = {
    'Web Browsers': Globe,
    'Communication': MessageCircle,
    'Dev: Languages': Code2,
    'Dev: Editors': FileCode,
    'Dev: Tools': Wrench,
    'Terminal': Terminal,
    'CLI Tools': Command,
    'Media': Play,
    'Creative': Palette,
    'Gaming': Gamepad2,
    'Office': Briefcase,
    'VPN & Network': Network,
    'Security': Lock,
    'File Sharing': Share2,
    'System': Cpu,
};

// Tailwind colors as hex
const COLOR_MAP: Record<string, string> = {
    'orange': '#f97316',
    'blue': '#3b82f6',
    'emerald': '#10b981',
    'sky': '#0ea5e9',
    'yellow': '#eab308',
    'slate': '#64748b',
    'zinc': '#71717a',
    'rose': '#f43f5e',
    'purple': '#a855f7',
    'red': '#ef4444',
    'indigo': '#6366f1',
    'cyan': '#06b6d4',
    'green': '#22c55e',
    'teal': '#14b8a6',
    'gray': '#6b7280',
};

/**
 * Collapsible category header with icon, chevron, and selection badge.
 * Uses color-mix for dynamic tinting because we're fancy like that.
 */
export function CategoryHeader({
    category,
    isExpanded,
    isFocused,
    onToggle,
    selectedCount,
    onFocus,
    color = 'gray',
}: {
    category: string;
    isExpanded: boolean;
    isFocused: boolean;
    onToggle: () => void;
    selectedCount: number;
    onFocus?: () => void;
    color?: string;
}) {
    const hexColor = COLOR_MAP[color] || COLOR_MAP['gray'];

    return (
        <button
            data-nav-id={`category:${category}`}
            onClick={(e) => { e.stopPropagation(); onFocus?.(); onToggle(); }}
            tabIndex={-1}
            aria-expanded={isExpanded}
            aria-label={`${category} category, ${selectedCount} apps selected`}
            // AccessGuide-style: subtle bg with colored left border accent
            className={`category-header group w-full h-8 flex items-center gap-2 text-sm font-semibold
        border-l-4
        px-3 mb-3
        transition-all duration-200 outline-none
        hover:bg-[color-mix(in_srgb,var(--header-color),transparent_80%)]`}
            style={{
                color: 'var(--text-primary)',
                borderColor: hexColor,
                backgroundColor: isFocused
                    ? `color-mix(in srgb, ${hexColor}, transparent 75%)` // 25% opacity for focus
                    : `color-mix(in srgb, ${hexColor}, transparent 90%)`, // 10% opacity for default
                '--header-color': hexColor,
            } as React.CSSProperties}
        >
            <ChevronRight
                className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                style={{ color: hexColor }}
            />
            {(() => {
                const Icon = CATEGORY_ICONS[category] || Terminal;
                return <Icon className="w-4 h-4" style={{ color: hexColor }} />;
            })()}
            <span className="flex-1 text-left">{category}</span>
            {selectedCount > 0 && (
                <span
                    className="text-xs font-bold ml-1.5 px-1.5 py-0.5 rounded"
                    style={{
                        transition: 'color 0.5s',
                        color: hexColor,
                        backgroundColor: `color-mix(in srgb, ${hexColor}, transparent 85%)`
                    }}
                >
                    {selectedCount}
                </span>
            )}
        </button>
    );
}
