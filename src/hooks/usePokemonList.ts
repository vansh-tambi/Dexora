import { useState, useEffect, useCallback } from 'react';
import { Pokemon } from '@/types/pokemon';
import { getPokemonList, getPokemonDetail } from '@/services/pokemonApi';
import { PokemonApiError } from '@/utils/errors';

interface UsePokemonListResult {
  pokemon: Pokemon[];
  loading: boolean;
  loadingMore: boolean;
  error: PokemonApiError | null;
  hasMore: boolean;
  loadMore: () => void;
  retry: () => void;
}

export function usePokemonList(limit: number = 20): UsePokemonListResult {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<PokemonApiError | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);
  const [trigger, setTrigger] = useState<number>(0);

  useEffect(() => {
    let ignore = false;

    async function fetchInitial() {
      try {
        setLoading(true);
        setError(null);
        const data = await getPokemonList(limit, 0);
        
        const details = await Promise.all(
          data.results.map((item) => getPokemonDetail(item.name))
        );

        if (!ignore) {
          setPokemon(details);
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
    };
  }, [limit, trigger]);

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      setError(null);
      
      const data = await getPokemonList(limit, offset);
      
      const details = await Promise.all(
        data.results.map((item) => getPokemonDetail(item.name))
      );
      
      setPokemon((prev) => [...prev, ...details]);
      setHasMore(data.next !== null);
      setOffset((prev) => prev + limit);
    } catch (err) {
      setError(err instanceof PokemonApiError ? err : new PokemonApiError('Failed to fetch more data'));
    } finally {
      setLoadingMore(false);
    }
  }, [loading, loadingMore, hasMore, limit, offset]);

  const retry = useCallback(() => {
    setTrigger((t) => t + 1);
  }, []);

  return {
    pokemon,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    retry,
  };
}
