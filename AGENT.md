# TuxMate - Agent Guidelines

This document helps AI assistants understand how to work with this codebase.

## Project Overview

TuxMate is a Linux bulk app installer web app. Users select apps, pick their distro, and get a ready-to-run terminal command.

**Stack**: Next.js 14, TypeScript, Tailwind CSS, GSAP animations

## Code Style

### Comments

Single-line `//` comments only. No JSDoc blocks.

**Good:**
```ts
// Everything the app needs to work
export function useLinuxInit() { ... }

// Quick one-liner for copy-paste warriors
export function generateSimpleCommand() { ... }

// Vim-style keyboard navigation. Because real devs don't use mice.
export function useKeyboardNavigation() { ... }
```

**Never do this:**
```ts
/**
 * This is a multi-line JSDoc block.
 * We don't use these here.
 */
```

### Tone

Comments should sound like a senior dev wrote them. Brief, practical, occasionally witty.

- ✅ "Arch with AUR packages - this is where it gets fun"
- ✅ "Memoized because React was having a moment"  
- ❌ "This function handles the complex orchestration of..."
- ❌ "Leveraging advanced patterns to optimize..."

### Formatting

- `'use client';` at top of client components
- CSS variables for theming: `var(--bg-primary)`, `var(--text-muted)`, etc.
- Tailwind for utilities, CSS variables for colors
- GSAP for entrance animations

## Key Patterns

### State Management
- All state lives in hooks (`useLinuxInit`, `useTheme`, etc.)
- localStorage persistence with hydration handling
- No external state libraries

### Distro Handling
- Configs in `src/lib/data.ts`
- Each distro: id, name, color, icon, installPrefix
- Package names: `app.targets[distroId]`

### AUR Detection
- `src/lib/aur.ts` handles Arch AUR package detection
- Patterns: `-bin`, `-git`, `-appimage` suffixes
- Known AUR list for edge cases

### Nix Handling
- `src/lib/nixUnfree.ts` detects unfree packages (Discord, Slack, Spotify, Steam, etc.)
- Nix outputs declarative config, not shell scripts
- Preview: clean config snippet
- Download: includes unfree warning comment if needed
- Set `KNOWN_UNFREE_PACKAGES` contains lowercase package names
- **Verify Licenses**: Always check `nixpkgs` for license status. If `free = false`, add to `KNOWN_UNFREE_PACKAGES`.
  - Example: `heroic` is GPLv3 (free), `discord` is unfree. Don't guess.

### Command Generation
- `useLinuxInit` generates clipboard one-liner (preview)
- `generateInstallScript` creates downloadable files
- Nix: downloads `configuration.nix`, others download `.sh`
- Each distro has its own generator in `src/lib/scripts/`

## File Structure

```
src/
├── app/           # Next.js pages
├── components/    # UI by domain
│   ├── app/       # App grid (CategorySection, AppItem)
│   ├── command/   # Footer, drawer, shortcuts
│   ├── common/    # Tooltip, GlobalStyles
│   ├── distro/    # Distro selector
│   ├── header/    # Help modal, links
│   └── ui/        # Theme toggle
├── hooks/         # Custom hooks
└── lib/           # Data, utilities, scripts
    ├── aur.ts     # Arch AUR package detection
    ├── nixUnfree.ts # Nix unfree package detection
    ├── data.ts    # All apps and distro configs
    └── scripts/   # Per-distro generators
```

## Don't

- No JSDoc blocks
- No "educational" comments explaining obvious things
- No buzzwords (leveraging, orchestrating, paradigm)
- No unnecessary abstractions
- Don't ignore existing patterns
- Don't add unused exports (dead code)
- Don't duplicate logic across files - centralize

## Do

- Keep comments concise
- Match existing code style
- Test on mobile (drawer = bottom sheet)
- Use distro brand color for accents
- Persist preferences to localStorage
- One file per distro in `scripts/` (e.g., `nix.ts`, `arch.ts`)
- Follow AUR pattern when adding distro-specific detection
