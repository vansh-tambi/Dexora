# Pokémon Explorer

Dexora (Pokémon Explorer) is a modern, responsive, and highly accessible digital Pokédex web application. It enables users to discover, search, filter, sort, and compare Pokémon, featuring a tactile visual design with dynamic light/dark modes, smooth Framer Motion spring physics, custom mouse interactions, and localStorage-backed favorites persistence.

## Features
- **Instant Search**: Controlled search bar with debounced input targeting PokéAPI query strings.
- **Type Filtering**: Category pills highlighting Pokémon by element type utilizing gradient palettes from a custom type color system.
- **Interactive Sorting**: Dynamic sorting by **ID (Asc/Desc)**, **Name (A-Z/Z-A)**, **Attack**, **Speed**, and **HP**.
- **Side-by-Side Comparison**: Compare statistics (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed) of any two Pokémon with stat-winner highlights.
- **Intersection Pagination**: Infinite-scroll pagination using a manual "Load More" action.
- **Responsive Layout**: Designed to scale flawlessly from mobile viewports (375px) up to ultra-wide desktop monitors (1280px+).
- **Persistent Favorites**: Save favorites directly via inline card heart toggles or detail modal buttons. Saved favorites persist across page reloads.
- **Dynamic Theme (Light & Dark)**: Toggle themes with system preference detection and localStorage persistence.
- **Shareable URLs**: URL parameter integration (e.g. `/pokemon/pikachu`) allowing direct page loads into detail views without resetting grid list contexts.
- **Strict A11y & Motion Control**: Native semantic button mappings, high-contrast badges, scroll locks, keyboard focus trapping/restoration, and full `prefers-reduced-motion` animation control.

## Tech Stack
- **React**: Modern functional component library.
- **TypeScript**: Strict compile-time safety and typed data schemas.
- **Vite**: Ultra-fast module bundling and hot-reload dev server.
- **Tailwind CSS**: Utility-first CSS styling.
- **Framer Motion**: Tactile spring-physics motion animations.
- **React Router**: Client-side URL paths and parameters mapping.
- **Lucide React**: Vector icons.

## API Used
- **PokéAPI v2**: Consumes details, listings, and type classifications directly via `https://pokeapi.co/api/v2`.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/vansh-tambi/Dexora.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Dexora
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Running Locally
- Start the local development server:
   ```bash
   npm run dev
   ```
- Build production assets:
   ```bash
   npm run build
   ```
- Preview the compiled production build:
   ```bash
   npm run preview
   ```

## Project Structure
```
src/
├── components/
│   ├── CompareModal.tsx
│   ├── CustomCursor.tsx
│   ├── EmptyState.tsx
│   ├── ErrorState.tsx
│   ├── LoadingSkeleton.tsx
│   ├── PokeBall.tsx
│   ├── PokemonCard.tsx
│   ├── PokemonGrid.tsx
│   ├── PokemonModal.tsx
│   ├── SearchBar.tsx
│   ├── SortSelect.tsx
│   └── TypeFilter.tsx
├── hooks/
│   ├── useDebounce.ts
│   ├── useFavorites.ts
│   ├── usePokemonList.ts
│   ├── usePrefersReducedMotion.ts
│   └── useTheme.ts
├── pages/
│   └── Home.tsx
├── services/
│   └── pokemonApi.ts
├── styles/
│   └── index.css
├── types/
│   └── pokemon.ts
├── utils/
│   ├── motion.ts
│   └── typeColors.ts
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

## Challenges Faced
- **Performance & Code-Splitting**: Code-splitting heavy components like `PokemonModal` using `React.lazy()` and `<Suspense>` while maintaining seamless Framer Motion exit animations required wrapping modal states in `<AnimatePresence>` boundaries.
- **1:1 Custom Mouse Pointer**: Achieving zero lag on the custom Pokéball cursor required bypassing React component state updates and driving DOM `translate3d` coordinates inside a `requestAnimationFrame` loop.
- **Search Debouncing & State Merging**: Balancing responsive inputs and network conservation required a robust debouncer. The solution splits input state into local variables and debounced queries, allowing immediate keyboard responsiveness while throttling API fetches.
- **URL Routing & Modal Integration**: Opening a modal via the URL `/pokemon/:name` while maintaining the background grid context required routing them both to the `<Home />` layout. Isolating the modal details query prevents the background list from re-rendering or resetting when opening/closing the details panel.
- **Accessibility & Focus Restoration**: Making the modal fully accessible required active focus trapping. Restoring focus to the exact initiating `PokemonCard` on closure was solved by capturing the `document.activeElement` reference in a `useRef` hook during the mounting phase and focusing it on unmount.

## Future Improvements
- **Evolution Chains**: Fetching species endpoint parameters to render interactive linear evolution branches inside the detail modal.
- **Statistical Radar Chart**: Visualizing the 6 base stats using custom canvas-based radial spider charts.
