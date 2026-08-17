import type { Pokemon } from '@/types/pokemon';
import { PokemonCard } from './PokemonCard';
import { PokemonGridSkeleton } from './LoadingSkeleton';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';

interface PokemonGridProps {
  pokemon: Pokemon[];
  loading: boolean;
  error: Error | null;
  favorites: string[];
  onToggleFavorite: (name: string) => void;
  isFirstMount: boolean;
  onRetry?: () => void;
  onCardClick?: (name: string) => void;
}

export function PokemonGrid({
  pokemon,
  loading,
  error,
  favorites,
  onToggleFavorite,
  isFirstMount,
  onRetry,
  onCardClick,
}: PokemonGridProps) {
  // 1. Initial Loading State
  if (loading && pokemon.length === 0) {
    return <PokemonGridSkeleton count={10} />;
  }

  // 2. Error State
  if (error) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center rounded-3xl bg-surface p-8 shadow-soft">
        <ErrorState message={error.message} onRetry={onRetry} />
      </div>
    );
  }

  // 3. Empty State
  if (pokemon.length === 0) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center rounded-3xl bg-surface p-8 shadow-soft">
        <EmptyState
          title="No Pokémon Found"
          subtitle="Explore the list and add some Pokémon to your favorites, or adjust your search filter."
        />
      </div>
    );
  }

  // 4. Success State (Grid)
  return (
    <div className="grid w-full grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {pokemon.map((item, index) => {
        const image = item.sprites.other['official-artwork'].front_default || '';
        const types = item.types.map((t) => t.type.name);

        return (
          <div
            key={item.id}
            className={isFirstMount ? "opacity-0 animate-fade-up" : "opacity-100"}
            style={
              isFirstMount
                ? {
                    animationDelay: `${Math.min(index * 50, 600)}ms`,
                    animationFillMode: 'forwards',
                  }
                : {}
            }
          >
            <PokemonCard
              id={item.id}
              name={item.name}
              image={image}
              types={types}
              totalStats={item.stats.reduce((acc, s) => acc + s.base_stat, 0)}
              isFavorite={favorites.includes(item.name.toLowerCase())}
              onToggleFavorite={() => onToggleFavorite(item.name)}
              onClick={() => onCardClick?.(item.name)}
            />
          </div>
        );
      })}
    </div>
  );
}
