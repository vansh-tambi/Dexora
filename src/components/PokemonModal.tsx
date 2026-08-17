import { useEffect, useRef, useState } from 'react';
import { X, Scale, Ruler, Heart } from 'lucide-react';
import type { Pokemon } from '@/types/pokemon';
import { PokemonApiError } from '@/utils/errors';
import { typeColors } from '@/utils/typeColors';
import { ErrorState } from './ErrorState';

interface PokemonModalProps {
  pokemon: Pokemon | null;
  isLoading: boolean;
  error: PokemonApiError | null;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onClose: () => void;
  onRetry: () => void;
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
  const [animate, setAnimate] = useState(false);

  // Trigger stat bar transition animation on mount or when pokemon changes
  useEffect(() => {
    if (pokemon) {
      const t = setTimeout(() => setAnimate(true), 100);
      return () => {
        clearTimeout(t);
        setAnimate(false);
      };
    }
  }, [pokemon]);

  // Capture previous active element on mount and lock background scroll
  useEffect(() => {
    previousActiveElement.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    };
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Focus trap
  useEffect(() => {
    if (isLoading || error || !pokemon || !modalRef.current) return;

    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = modalRef.current.querySelectorAll(focusableSelector);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    // Auto-focus close button on open
    firstElement.focus();

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoading, error, pokemon]);

  // Render detail skeleton
  const renderSkeleton = () => (
    <div className="flex flex-col gap-6 animate-pulse p-6">
      {/* Artwork & Header Skeleton */}
      <div className="flex flex-col items-center justify-center py-6">
        <div className="h-40 w-40 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="mt-6 h-8 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="mt-3 flex gap-2">
          <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
      {/* Physical properties Skeleton */}
      <div className="grid grid-cols-2 gap-4">
        <div className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/50" />
        <div className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/50" />
      </div>
      {/* Stats Skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
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
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-sm transition-opacity duration-300 md:items-center md:p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="relative flex w-full flex-col overflow-y-auto bg-surface shadow-soft transition-all duration-300 scrollbar-none
          h-[85vh] rounded-t-[2rem] md:h-auto md:max-h-[90vh] md:max-w-2xl md:rounded-[2rem]
          translate-y-0 opacity-100 animate-fade-up md:animate-none md:scale-100 motion-reduce:transition-none motion-reduce:animate-none"
      >
        {/* Sticky Close Button Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-surface/80 backdrop-blur-md">
          {pokemon && (
            <button
              type="button"
              onClick={onToggleFavorite}
              className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-red-400"
              aria-label={isFavorite ? `Remove ${pokemon.name} from favorites` : `Add ${pokemon.name} to favorites`}
            >
              <Heart
                key={isFavorite ? 'fav-modal' : 'unfav-modal'}
                className={`h-5 w-5 ${
                  isFavorite
                    ? 'animate-heart-pop fill-red-500 text-red-500'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
                strokeWidth={2}
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
            <div className="relative mb-6 flex flex-col items-center">
              {/* Ambient Radial Glow */}
              <div
                className={`absolute -top-6 h-48 w-48 rounded-full bg-gradient-to-br opacity-40 blur-3xl ${typeTheme.gradient}`}
                aria-hidden="true"
              />
              
              <img
                src={pokemon.sprites.other['official-artwork'].front_default || ''}
                alt={pokemon.name}
                className="relative z-10 h-44 w-44 object-contain drop-shadow-md transition-transform duration-300 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
              />

              <span className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                #{String(pokemon.id).padStart(3, '0')}
              </span>

              <h2
                id="modal-title"
                className="mt-1 text-3xl font-extrabold capitalize text-slate-800 dark:text-white font-heading"
              >
                {pokemon.name}
              </h2>

              {/* Type Badges */}
              <div className="mt-3 flex gap-2">
                {pokemon.types.map(({ type }) => {
                  const theme = typeColors[type.name.toLowerCase()] || typeColors.normal;
                  return (
                    <span
                      key={type.name}
                      className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider ${theme.badgeBg} ${theme.badgeText}`}
                    >
                      <span aria-hidden="true" className="text-sm">{theme.icon}</span>
                      {type.name}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Height & Weight Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Ruler className="h-4 w-4" />
                  <span className="text-xs font-medium">Height</span>
                </div>
                <span className="mt-1.5 text-base font-bold text-slate-800 dark:text-white">
                  {(pokemon.height / 10).toFixed(1)} m
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Scale className="h-4 w-4" />
                  <span className="text-xs font-medium">Weight</span>
                </div>
                <span className="mt-1.5 text-base font-bold text-slate-800 dark:text-white">
                  {(pokemon.weight / 10).toFixed(1)} kg
                </span>
              </div>
            </div>

            {/* Abilities Section */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Abilities
              </h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map(({ ability, is_hidden }) => (
                  <span
                    key={ability.name}
                    className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium capitalize text-slate-700 dark:text-slate-300"
                  >
                    {ability.name.replace('-', ' ')}
                    {is_hidden && (
                      <span className="rounded bg-slate-100 px-1 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        Hidden
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Base Stats Section with Animations */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Base Stats
              </h3>
              <div className="space-y-3.5">
                {pokemon.stats.map(({ stat, base_stat }) => {
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
                      <div className="relative h-2.5 flex-1 rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out motion-reduce:transition-none ${typeTheme.gradient}`}
                          style={{
                            width: animate ? `${percent}%` : '0%',
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
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Moves
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {pokemon.moves.slice(0, 15).map(({ move }) => (
                  <span
                    key={move.name}
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-850 dark:text-slate-400"
                  >
                    {move.name.replace('-', ' ')}
                  </span>
                ))}
                {pokemon.moves.length > 15 && (
                  <span className="rounded-lg border border-dashed border-border px-2 py-1 text-xs text-slate-400">
                    +{pokemon.moves.length - 15} more
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
