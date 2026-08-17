import { useState, useEffect, useCallback } from 'react';
import { PokemonListItem } from '@/types/pokemon';
import { getPokemonList } from '@/services/pokemonApi';
import { PokemonApiError } from '@/utils/errors';

interface UsePokemonListResult {
  pokemon: PokemonListItem[];
  loading: boolean;
  loadingMore: boolean;
  error: PokemonApiError | null;
  hasMore: boolean;
  loadMore: () => void;
}

export function usePokemonList(limit: number = 20): UsePokemonListResult {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<PokemonApiError | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    const controller = new AbortController();
    let ignore = false;

    async function fetchInitial() {
      try {
        setLoading(true);
        setError(null);
        const data = await getPokemonList(limit, 0);
        if (!ignore) {
          setPokemon(data.results);
          setHasMore(data.next !== null);
          setOffset(limit);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof PokemonApiError ? err : new PokemonApiError('Failed to fetch list'));
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchInitial();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [limit]);

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      setError(null);
      
      const data = await getPokemonList(limit, offset);
      
      setPokemon((prev) => [...prev, ...data.results]);
      setHasMore(data.next !== null);
      setOffset((prev) => prev + limit);
    } catch (err) {
      setError(err instanceof PokemonApiError ? err : new PokemonApiError('Failed to fetch more data'));
    } finally {
      setLoadingMore(false);
    }
  }, [loading, loadingMore, hasMore, limit, offset]);

  return {
    pokemon,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
  };
}
