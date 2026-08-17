import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SearchBar } from '@/components/SearchBar';
import { TypeFilter } from '@/components/TypeFilter';
import { PokemonGrid } from '@/components/PokemonGrid';
import { PokemonModal } from '@/components/PokemonModal';
import { usePokemonList } from '@/hooks/usePokemonList';
import { getPokemonDetail, getPokemonByType } from '@/services/pokemonApi';
import { Pokemon } from '@/types/pokemon';
import { PokemonApiError } from '@/utils/errors';

export function Home() {
  const { name } = useParams();
  const navigate = useNavigate();

  // 1. DEFAULT mode state (uses paginated list)
  const {
    pokemon: defaultPokemon,
    loading: defaultLoading,
    loadingMore,
    error: defaultError,
    hasMore,
    loadMore,
    retry: retryDefault,
  } = usePokemonList(20);

  // Active query and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // 2. SEARCH mode state
  const [searchPokemon, setSearchPokemon] = useState<Pokemon[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<Error | null>(null);

  // 3. FILTER mode state
  const [filterPokemon, setFilterPokemon] = useState<Pokemon[]>([]);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterError, setFilterError] = useState<Error | null>(null);

  // 4. MODAL state
  const [modalPokemon, setModalPokemon] = useState<Pokemon | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<PokemonApiError | null>(null);

  // Scroll detection for sticky header styles
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine current active mode for background grid
  let currentMode: 'DEFAULT' | 'SEARCH' | 'FILTER' = 'DEFAULT';
  if (searchQuery) {
    currentMode = 'SEARCH';
  } else if (selectedType) {
    currentMode = 'FILTER';
  }

  // Handle Search Input (clears filter)
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setSelectedType(null);
    }
  };

  // Handle Type Filter click (clears search)
  const handleSelectType = (type: string | null) => {
    setSelectedType(type);
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
        const detail = await getPokemonDetail(searchQuery);
        if (active) {
          setSearchPokemon([detail]);
        }
      } catch (err) {
        if (active) {
          if (err instanceof PokemonApiError && err.status === 404) {
            setSearchPokemon([]); // Triggers EmptyState
          } else {
            setSearchError(err instanceof Error ? err : new Error('An error occurred during search.'));
          }
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
  }, [searchQuery]);

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
        const list = await getPokemonByType(selectedType);
        // Resolve detailed data in parallel for a clean render.
        // Cap it to 40 items to avoid rate limiting or blocking the client.
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

  // Modal Fetching Effect
  useEffect(() => {
    if (!name) {
      setModalPokemon(null);
      setModalError(null);
      return;
    }

    let active = true;
    async function fetchModalDetail() {
      setModalLoading(true);
      setModalError(null);
      try {
        const detail = await getPokemonDetail(name);
        if (active) {
          setModalPokemon(detail);
        }
      } catch (err) {
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

  return (
    <div className="min-h-screen bg-appBg">
      {/* Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-appBg/85 border-b border-border shadow-soft backdrop-blur-md py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Branding */}
            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="Pokéball">
                🔴
              </span>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white font-heading">
                Dexora
              </h1>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full md:w-auto">
              <SearchBar value={searchQuery} onSearch={handleSearch} />
            </div>
          </div>

          {/* Type Filters */}
          <div className="mt-6">
            <TypeFilter selectedType={selectedType} onSelectType={handleSelectType} />
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PokemonGrid
          pokemon={gridProps.pokemon}
          loading={gridProps.loading}
          error={gridProps.error}
          onRetry={gridProps.onRetry}
          onCardClick={(pokemonName) => navigate(`/pokemon/${pokemonName}`)}
        />

        {/* Load More Trigger (Default Mode Only) */}
        {currentMode === 'DEFAULT' && hasMore && !gridProps.error && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={defaultLoading || loadingMore}
              className="flex items-center gap-2.5 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-appBg disabled:pointer-events-none disabled:opacity-60 dark:focus:ring-offset-slate-900"
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
      {name && (
        <PokemonModal
          pokemon={modalPokemon}
          isLoading={modalLoading}
          error={modalError}
          onClose={() => navigate('/')}
          onRetry={handleModalRetry}
        />
      )}
    </div>
  );
}
