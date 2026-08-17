import type { Pokemon } from '@/types/pokemon';
import { PokemonCard } from './PokemonCard';
import { PokemonGridSkeleton } from './LoadingSkeleton';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import { AnimatePresence, motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { primarySpring } from '@/utils/motion';

interface PokemonGridProps {
  pokemon: Pokemon[];
  loading: boolean;
  error: Error | null;
  favorites: string[];
  onToggleFavorite: (name: string) => void;
  isFirstMount?: boolean;
  onRetry?: () => void;
  onCardClick?: (name: string) => void;
}

export function PokemonGrid({
  pokemon,
  loading,
  error,
  favorites,
  onToggleFavorite,
  onRetry,
  onCardClick,
}: PokemonGridProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <AnimatePresence mode="wait">
      {/* 1. Initial Loading State */}
      {loading && pokemon.length === 0 && (
        <motion.div
          key="skeleton-grid"
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          <PokemonGridSkeleton count={10} />
        </motion.div>
      )}

      {/* 2. Error State */}
      {!loading && error && (
        <motion.div
          key="error-grid"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={primarySpring}
          className="flex min-h-[400px] w-full items-center justify-center rounded-3xl bg-surface p-8 shadow-soft"
        >
          <ErrorState message={error.message} onRetry={onRetry} />
        </motion.div>
      )}

      {/* 3. Empty State */}
      {!loading && !error && pokemon.length === 0 && (
        <motion.div
          key="empty-grid"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={primarySpring}
          className="flex min-h-[400px] w-full items-center justify-center rounded-3xl bg-surface p-8 shadow-soft"
        >
          <EmptyState
            title="No Pokémon Found"
            subtitle="Explore the list and add some Pokémon to your favorites, or adjust your search filter."
          />
        </motion.div>
      )}

      {/* 4. Success State (Grid) */}
      {!loading && !error && pokemon.length > 0 && (
        <motion.div
          key="real-grid"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 1 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: prefersReducedMotion ? 0 : 0.05,
              },
            },
          }}
          className="grid w-full grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {pokemon.map((item, index) => {
              const image = item.sprites.other['official-artwork'].front_default || '';
              const types = item.types.map((t) => t.type.name);
              const totalStats = item.stats.reduce((acc, s) => acc + s.base_stat, 0);

              return (
                <motion.div
                  key={item.id}
                  layout={!prefersReducedMotion}
                  variants={{
                    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
                    show: { opacity: 1, y: 0, transition: primarySpring },
                  }}
                  initial="hidden"
                  animate="show"
                  exit={{
                    opacity: 0,
                    scale: prefersReducedMotion ? 1 : 0.95,
                    transition: { duration: 0.15 },
                  }}
                >
                  <PokemonCard
                    id={item.id}
                    name={item.name}
                    image={image}
                    types={types}
                    index={index}
                    totalStats={totalStats}
                    isFavorite={favorites.includes(item.name.toLowerCase())}
                    onToggleFavorite={() => onToggleFavorite(item.name)}
                    onClick={() => onCardClick?.(item.name)}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
