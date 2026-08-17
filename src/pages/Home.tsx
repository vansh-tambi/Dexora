import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SearchBar } from '@/components/SearchBar';
import { TypeFilter } from '@/components/TypeFilter';
import { PokemonGrid } from '@/components/PokemonGrid';
import { PokeBall } from '@/components/PokeBall';

const PokemonModal = lazy(() =>
  import('@/components/PokemonModal').then((m) => ({ default: m.PokemonModal }))
);
import { usePokemonList } from '@/hooks/usePokemonList';
import { useTheme } from '@/hooks/useTheme';
import { useFavorites } from '@/hooks/useFavorites';
import { getPokemonDetail, getPokemonByType, getPokemonList } from '@/services/pokemonApi';
import type { Pokemon, PokemonListItem } from '@/types/pokemon';
import { PokemonApiError } from '@/utils/errors';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

export function Home() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [isFirstMount, setIsFirstMount] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsFirstMount(false), 1200);
    return () => clearTimeout(t);
  }, []);
  const [masterList, setMasterList] = useState<PokemonListItem[]>([]);

  useEffect(() => {
    async function loadMasterList() {
      try {
        const data = await getPokemonList(2000, 0);
        setMasterList(data.results);
      } catch (err) {
        // Silent fallback
      }
    }
    loadMasterList();
  }, []);
  // 1. Theme and Favorites Hooks
  const { theme, toggleTheme } = useTheme();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Active query, filter, and mode states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isFavoritesMode, setIsFavoritesMode] = useState(false);

  // 2. DEFAULT mode state (uses paginated list)
  const {
    pokemon: defaultPokemon,
    loading: defaultLoading,
    loadingMore,
    error: defaultError,
    hasMore,
    loadMore,
    retry: retryDefault,
  } = usePokemonList(20);

  // 3. SEARCH mode state
  const [searchPokemon, setSearchPokemon] = useState<Pokemon[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<Error | null>(null);

  // 4. FILTER mode state
  const [filterPokemon, setFilterPokemon] = useState<Pokemon[]>([]);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterError, setFilterError] = useState<Error | null>(null);

  // 5. FAVORITES mode state
  const [favPokemon, setFavPokemon] = useState<Pokemon[]>([]);
  const [favLoading, setFavLoading] = useState(false);
  const [favError, setFavError] = useState<Error | null>(null);

  // 6. MODAL details state
  const [modalPokemon, setModalPokemon] = useState<Pokemon | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<PokemonApiError | null>(null);

  // Scroll detection for sticky header styles
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine current active mode for background grid
  let currentMode: 'DEFAULT' | 'SEARCH' | 'FILTER' | 'FAVORITES' = 'DEFAULT';
  if (isFavoritesMode) {
    currentMode = 'FAVORITES';
  } else if (searchQuery) {
    currentMode = 'SEARCH';
  } else if (selectedType) {
    currentMode = 'FILTER';
  }

  // Handle Search Input (clears filters & favorites)
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setSelectedType(null);
      setIsFavoritesMode(false);
    }
  };

  // Handle Type Filter click (clears search & favorites)
  const handleSelectType = (type: string | null) => {
    setSelectedType(type);
    setSearchQuery('');
    setIsFavoritesMode(false);
  };

  // Handle Favorites toggle filter (clears type & search)
  const handleToggleFavoritesMode = () => {
    setIsFavoritesMode((prev) => !prev);
    setSelectedType(null);
    setSearchQuery('');
  };

  // Search Effect
  useEffect(() => {
    if (!searchQuery) {
      setSearchPokemon([]);
      setSearchError(null);
      return;
    }

    let active = true;
    async function performSearch() {
      setSearchLoading(true);
      setSearchError(null);
      try {
        const query = searchQuery.toLowerCase().trim();
        
        // If master list is empty, fetch it inline
        let currentMaster = masterList;
        if (currentMaster.length === 0) {
          const data = await getPokemonList(2000, 0);
          currentMaster = data.results;
          setMasterList(currentMaster);
        }

        // Find matches containing the search string
        const matches = currentMaster.filter((item) =>
          item.name.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
          if (active) {
            setSearchPokemon([]);
          }
          return;
        }

        // Fetch details in parallel for matching names, capped at first 40 items
        const details = await Promise.all(
          matches.slice(0, 40).map((item) => getPokemonDetail(item.name))
        );

        if (active) {
          setSearchPokemon(details);
        }
      } catch (err) {
        if (active) {
          setSearchError(err instanceof Error ? err : new Error('Search failed'));
        }
      } finally {
        if (active) {
          setSearchLoading(false);
        }
      }
    }

    performSearch();

    return () => {
      active = false;
    };
  }, [searchQuery, masterList]);

  // Filter Effect
  useEffect(() => {
    if (!selectedType) {
      setFilterPokemon([]);
      setFilterError(null);
      return;
    }

    let active = true;
    async function performFilter() {
      setFilterLoading(true);
      setFilterError(null);
      try {
        const list = await getPokemonByType(selectedType as string);
        const details = await Promise.all(
          list.slice(0, 40).map((item) => getPokemonDetail(item.name))
        );

        if (active) {
          setFilterPokemon(details);
        }
      } catch (err) {
        if (active) {
          setFilterError(err instanceof Error ? err : new Error('An error occurred filtering types.'));
        }
      } finally {
        if (active) {
          setFilterLoading(false);
        }
      }
    }

    performFilter();

    return () => {
      active = false;
    };
  }, [selectedType]);

  // Favorites Details Resolution Effect
  useEffect(() => {
    if (!isFavoritesMode) {
      setFavPokemon([]);
      setFavError(null);
      return;
    }

    let active = true;
    async function resolveFavorites() {
      if (favorites.length === 0) {
        setFavPokemon([]);
        return;
      }
      setFavLoading(true);
      setFavError(null);
      try {
        const details = await Promise.all(
          favorites.map((favName) => getPokemonDetail(favName))
        );
        if (active) {
          setFavPokemon(details);
        }
      } catch (err) {
        if (active) {
          setFavError(err instanceof Error ? err : new Error('Failed to load favorites details.'));
        }
      } finally {
        if (active) {
          setFavLoading(false);
        }
      }
    }

    resolveFavorites();

    return () => {
      active = false;
    };
  }, [isFavoritesMode, favorites]);

  // Favorites Error Retry Helper
  const handleFavoritesRetry = () => {
    setFavLoading(true);
    setFavError(null);
    Promise.all(favorites.map((favName) => getPokemonDetail(favName)))
      .then((details) => setFavPokemon(details))
      .catch((err) => setFavError(err instanceof Error ? err : new Error('Failed to load favorites details.')))
      .finally(() => setFavLoading(false));
  };

  // Modal Fetching Effect
  useEffect(() => {
    if (!name) {
      setModalPokemon(null);
      setModalError(null);
      return;
    }

    const controller = new AbortController();
    let active = true;

    async function fetchModalDetail() {
      setModalLoading(true);
      setModalError(null);
      try {
        const detail = await getPokemonDetail(name as string, controller.signal);
        if (active) {
          setModalPokemon(detail);
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        if (active) {
          setModalError(
            err instanceof PokemonApiError
              ? err
              : new PokemonApiError('Failed to load Pokémon details')
          );
        }
      } finally {
        if (active) {
          setModalLoading(false);
        }
      }
    }

    fetchModalDetail();

    return () => {
      active = false;
      controller.abort();
    };
  }, [name]);

  // Helper to re-attempt fetching detail for the modal on error
  const handleModalRetry = () => {
    if (!name) return;
    setModalError(null);
    setModalLoading(true);
    getPokemonDetail(name)
      .then((p) => setModalPokemon(p))
      .catch((e) =>
        setModalError(
          e instanceof PokemonApiError ? e : new PokemonApiError('Failed to load Pokémon details')
        )
      )
      .finally(() => setModalLoading(false));
  };

  // Map modes to active values
  const getGridProps = () => {
    switch (currentMode) {
      case 'FAVORITES':
        return {
          pokemon: favPokemon,
          loading: favLoading,
          error: favError,
          onRetry: handleFavoritesRetry,
        };
      case 'SEARCH':
        return {
          pokemon: searchPokemon,
          loading: searchLoading,
          error: searchError,
          onRetry: () => setSearchQuery(searchQuery),
        };
      case 'FILTER':
        return {
          pokemon: filterPokemon,
          loading: filterLoading,
          error: filterError,
          onRetry: () => setSelectedType(selectedType),
        };
      case 'DEFAULT':
      default:
        return {
          pokemon: defaultPokemon,
          loading: defaultLoading,
          error: defaultError,
          onRetry: retryDefault,
        };
    }
  };

  const gridProps = getGridProps();
  const { scrollY } = useScroll();
  const headerPadding = useTransform(scrollY, [0, 80], ['1.25rem', '0.75rem']);

  return (
    <div className="min-h-screen bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Sticky Header */}
      <motion.header
        style={{ paddingTop: headerPadding, paddingBottom: headerPadding }}
        className={`sticky top-0 z-40 transition-colors duration-300 ${
          isScrolled
            ? 'bg-appBg/85 border-b border-border shadow-soft backdrop-blur-md'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Branding & Toggles Row */}
            <div className="flex items-center justify-between w-full md:w-auto gap-6">
              <div className="flex items-center gap-2">
                <PokeBall variant="branding" size={28} />
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
                  Dexora
                </h1>
              </div>

              {/* Header Action Controls */}
              <div className="flex items-center gap-2">
                {/* Favorites Mode Switch */}
                <button
                  type="button"
                  onClick={handleToggleFavoritesMode}
                  className={`rounded-full p-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-appBg dark:focus:ring-offset-slate-900 motion-reduce:transition-none ${
                    isFavoritesMode
                      ? 'bg-red-50 text-red-500 dark:bg-red-950/30 dark:text-red-400'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                  }`}
                  aria-label={isFavoritesMode ? 'View default Pokémon list' : 'View favorite Pokémon'}
                >
                  <PokeBall
                    key={isFavoritesMode ? 'fav-switch-active' : 'fav-switch-inactive'}
                    variant="favorite"
                    active={isFavoritesMode}
                    size={20}
                    className={isFavoritesMode ? 'animate-catch text-red-500' : 'text-slate-500 dark:text-slate-400'}
                  />
                </button>

                {/* Theme Toggle Button */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="rounded-full bg-slate-100 p-2.5 text-slate-500 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-appBg dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:focus:ring-offset-slate-900"
                  aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                >
                  {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Controls Search Field */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full md:w-auto">
              <SearchBar value={searchQuery} onSearch={handleSearch} />
            </div>
          </div>

          {/* Type Filters */}
          <div className="mt-6">
            <TypeFilter selectedType={selectedType} onSelectType={handleSelectType} />
          </div>
        </div>
      </motion.header>

      {/* Main Grid Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PokemonGrid
          pokemon={gridProps.pokemon}
          loading={gridProps.loading}
          error={gridProps.error}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onRetry={gridProps.onRetry}
          isFirstMount={isFirstMount}
          onCardClick={(pokemonName) => navigate(`/pokemon/${pokemonName}`)}
        />

        {/* Load More Trigger (Default Mode Only) */}
        {currentMode === 'DEFAULT' && hasMore && !gridProps.error && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={defaultLoading || loadingMore}
              className="flex items-center gap-2.5 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-appBg disabled:pointer-events-none disabled:opacity-60 dark:focus:ring-offset-slate-900 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {loadingMore && (
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {loadingMore ? 'Loading...' : 'Load More Pokémon'}
            </button>
          </div>
        )}
      </main>

      {/* Pokémon Detail Modal Layer */}
      <AnimatePresence>
        {name && (
          <Suspense fallback={null}>
            <PokemonModal
              key="detail-modal"
              pokemon={modalPokemon}
              isLoading={modalLoading}
              error={modalError}
              isFavorite={isFavorite(name)}
              onToggleFavorite={() => toggleFavorite(name)}
              onClose={() => navigate('/')}
              onRetry={handleModalRetry}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}
