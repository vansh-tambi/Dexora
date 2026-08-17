import { useEffect, useRef } from 'react';
import { X, Scale, Ruler } from 'lucide-react';
import type { Pokemon } from '@/types/pokemon';
import { PokemonApiError } from '@/utils/errors';
import { typeColors } from '@/utils/typeColors';
import { ErrorState } from './ErrorState';
import { PokeBall } from './PokeBall';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { primarySpring } from '@/utils/motion';

interface PokemonModalProps {
  pokemon: Pokemon | null;
  isLoading: boolean;
  error: PokemonApiError | null;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onClose: () => void;
  onRetry: () => void;
}

function getGeneration(id: number): string {
  if (id <= 151) return 'Gen 1';
  if (id <= 251) return 'Gen 2';
  if (id <= 386) return 'Gen 3';
  if (id <= 493) return 'Gen 4';
  if (id <= 649) return 'Gen 5';
  if (id <= 721) return 'Gen 6';
  if (id <= 809) return 'Gen 7';
  if (id <= 905) return 'Gen 8';
  return 'Gen 9';
}

export function PokemonModal({
  pokemon,
  isLoading,
  error,
  isFavorite = false,
  onToggleFavorite,
  onClose,
  onRetry,
}: PokemonModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Capture previous active element on mount and lock background scroll
  useEffect(() => {
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Lock body scroll
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    // Focus modal container
    if (modalRef.current) {
      modalRef.current.focus();
    }

    return () => {
      // Restore scroll and focus
      document.body.style.overflow = originalStyle;
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, []);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Focus Trapping logic
  useEffect(() => {
    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusables = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;

      const firstElement = focusables[0];
      const lastElement = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleFocusTrap);
    return () => window.removeEventListener('keydown', handleFocusTrap);
  }, []);

  // Loading Skeleton View
  const renderSkeleton = () => (
    <div className="flex flex-col items-center p-8 animate-pulse">
      <div className="h-44 w-44 rounded-full bg-slate-200 dark:bg-slate-800" />
      <div className="mt-4 h-4 w-16 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-2 h-8 w-48 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-4 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="mt-8 grid w-full grid-cols-2 gap-4">
        <div className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="mt-6 w-full space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 flex-1 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  );

  // Close helper matching backdrop clicks
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const primaryType = pokemon?.types[0]?.type.name.toLowerCase() || 'normal';
  const typeTheme = typeColors[primaryType] || typeColors.normal;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-sm md:items-center md:p-4 overflow-hidden"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <motion.div
        ref={modalRef}
        initial={
          prefersReducedMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.95, y: 30 }
        }
        animate={
          prefersReducedMotion
            ? { opacity: 1 }
            : { opacity: 1, scale: 1, y: 0 }
        }
        exit={
          prefersReducedMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.95, y: 30 }
        }
        transition={primarySpring}
        className="relative flex w-full flex-col overflow-y-auto overflow-x-hidden bg-surface shadow-soft scrollbar-none
          h-[85vh] rounded-t-[2rem] md:h-auto md:max-h-[90vh] md:max-w-2xl md:rounded-[2rem]"
        tabIndex={-1}
      >
        {/* Sticky Close & Favorite Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-surface/80 backdrop-blur-md">
          {pokemon && (
            <button
              type="button"
              onClick={onToggleFavorite}
              className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-red-400"
              aria-label={isFavorite ? `Remove ${pokemon.name} from favorites` : `Add ${pokemon.name} to favorites`}
            >
              <PokeBall
                key={isFavorite ? 'fav-modal-active' : 'fav-modal-inactive'}
                variant="favorite"
                active={isFavorite}
                size={20}
                className={isFavorite ? 'animate-catch' : 'text-slate-400 hover:text-red-500 dark:text-slate-500'}
              />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close Pokémon details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Shell Rendering */}
        {isLoading && renderSkeleton()}

        {error && (
          <div className="p-8">
            <ErrorState message={error.message} onRetry={onRetry} />
          </div>
        )}

        {!isLoading && !error && pokemon && (
          <div className="px-6 pb-8">
            {/* Hero Header Section */}
            <div className="relative mb-6 flex flex-col items-center p-6 clip-notch bg-slate-50 dark:bg-slate-800/40 border border-border dark:border-slate-700">
              {/* Texture Grid overlay for collector theme */}
              <div className="pointer-events-none absolute inset-0 z-0 bg-grid-pattern opacity-60" />

              {/* Ambient Radial Glow */}
              <div
                className={`absolute inset-0 m-auto h-32 w-32 rounded-full bg-gradient-to-br opacity-30 blur-2xl ${typeTheme.gradient}`}
                aria-hidden="true"
              />
              
              {/* Shared Element Image Morphing */}
              <motion.img
                layoutId={prefersReducedMotion ? undefined : `pokemon-image-${pokemon.id}`}
                src={pokemon.sprites.other['official-artwork'].front_default || ''}
                alt={pokemon.name}
                className="relative z-10 h-40 w-40 object-contain drop-shadow-md"
              />

              {/* Technical ID & Gen Pill */}
              <div className="relative z-10 mt-4 flex items-center gap-2">
                <span className="font-heading text-xs font-bold tracking-wider text-slate-400 dark:text-slate-500">
                  #{String(pokemon.id).padStart(3, '0')}
                </span>
                <span className="clip-notch-sm bg-primary/10 text-primary dark:bg-primary/20 dark:text-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  {getGeneration(pokemon.id)}
                </span>
              </div>

              <h2
                id="modal-title"
                className="relative z-10 mt-1.5 text-3xl font-extrabold capitalize text-slate-800 dark:text-white font-heading"
              >
                {pokemon.name}
              </h2>

              {/* Notched Type Badges */}
              <div className="relative z-10 mt-3 flex gap-2">
                {pokemon.types.map(({ type }) => {
                  const theme = typeColors[type.name.toLowerCase()] || typeColors.normal;
                  return (
                    <span
                      key={type.name}
                      className={`flex items-center gap-1 clip-notch-sm p-[1px] bg-gradient-to-r ${theme.gradient}`}
                    >
                      <span
                        className={`flex items-center gap-1 clip-notch-sm px-3.5 py-0.5 text-xs font-bold uppercase tracking-wider ${theme.badgeBg} ${theme.badgeText}`}
                      >
                        <span aria-hidden="true" className="text-sm">{theme.icon}</span>
                        {type.name}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Height & Weight Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col items-center justify-center p-[1px] clip-notch bg-border dark:bg-slate-700">
                <div className="flex flex-col items-center justify-center w-full h-full bg-slate-50 dark:bg-slate-800/40 p-4 clip-notch">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Ruler className="h-4 w-4" />
                    <span className="text-xs font-medium">Height</span>
                  </div>
                  <span className="mt-1.5 text-base font-bold text-slate-800 dark:text-white">
                    {(pokemon.height / 10).toFixed(1)} m
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-[1px] clip-notch bg-border dark:bg-slate-700">
                <div className="flex flex-col items-center justify-center w-full h-full bg-slate-50 dark:bg-slate-800/40 p-4 clip-notch">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Scale className="h-4 w-4" />
                    <span className="text-xs font-medium">Weight</span>
                  </div>
                  <span className="mt-1.5 text-base font-bold text-slate-800 dark:text-white">
                    {(pokemon.weight / 10).toFixed(1)} kg
                  </span>
                </div>
              </div>
            </div>

            {/* Abilities Section */}
            <div className="mb-6">
              <h3 className="mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Abilities
              </h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map(({ ability, is_hidden }) => (
                  <span
                    key={ability.name}
                    className="flex items-center gap-1.5 clip-notch-sm border border-border bg-surface px-3 py-2 text-xs font-semibold capitalize text-slate-700 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700"
                  >
                    {ability.name.replace('-', ' ')}
                    {is_hidden && (
                      <span className="rounded bg-slate-100 px-1 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                        Hidden
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Base Stats Section with Staggered Spring Reveal */}
            <div className="mb-6">
              <h3 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Base Stats
              </h3>
              <div className="space-y-3.5">
                {pokemon.stats.map(({ stat, base_stat }, idx) => {
                  const percent = Math.min((base_stat / 255) * 100, 100);
                  const statNameMap: Record<string, string> = {
                    hp: 'HP',
                    attack: 'Attack',
                    defense: 'Defense',
                    'special-attack': 'Sp. Atk',
                    'special-defense': 'Sp. Def',
                    speed: 'Speed',
                  };

                  return (
                    <div key={stat.name} className="flex items-center gap-4">
                      {/* Stat Label */}
                      <span className="w-16 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {statNameMap[stat.name] || stat.name}
                      </span>
                      
                      {/* Progress Bar Track */}
                      <div className="relative h-2.5 flex-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <motion.div
                          className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${typeTheme.gradient}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{
                            ...primarySpring,
                            delay: prefersReducedMotion ? 0 : idx * 0.05,
                          }}
                        />
                      </div>
                      
                      {/* Stat Value */}
                      <span className="w-8 text-right text-xs font-bold text-slate-800 dark:text-white">
                        {base_stat}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Moves Section */}
            <div>
              <h3 className="mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Moves
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {pokemon.moves.slice(0, 15).map(({ move }) => (
                  <span
                    key={move.name}
                    className="clip-notch-sm bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {move.name.replace('-', ' ')}
                  </span>
                ))}
                {pokemon.moves.length > 15 && (
                  <span className="clip-notch-sm border border-dashed border-border px-2.5 py-1 text-xs font-semibold text-slate-400">
                    +{pokemon.moves.length - 15} more
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
