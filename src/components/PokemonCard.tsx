import type React from 'react';
import { typeColors } from '@/utils/typeColors';
import { PokeBall } from './PokeBall';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { primarySpring } from '@/utils/motion';

interface PokemonCardProps {
  id: number | string;
  name: string;
  image: string;
  types: string[];
  index?: number;
  totalStats?: number;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
  onClick?: () => void;
}

export function PokemonCard({
  id,
  name,
  image,
  types,
  index = 0,
  totalStats = 0,
  isFavorite = false,
  onToggleFavorite,
  onClick,
}: PokemonCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const formattedId = `#${String(id).padStart(3, '0')}`;
  
  // Get primary type color theme
  const primaryType = types[0]?.toLowerCase();
  const theme = typeColors[primaryType] || typeColors.normal;

  // Determine if it is a high-stat collector card
  const isHighStat = totalStats >= 500;

  const handleToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(e);
  };

  // Rotation alternating: +0.6deg for even, -0.6deg for odd index
  const hoverRotation = index % 2 === 0 ? 0.6 : -0.6;

  return (
    <motion.div
      layout={!prefersReducedMotion}
      whileHover={
        prefersReducedMotion
          ? { scale: 1.01 }
          : { y: -7, scale: 1.025, rotate: hoverRotation }
      }
      whileTap={
        prefersReducedMotion
          ? { scale: 0.99 }
          : { scale: 0.97 }
      }
      transition={primarySpring}
      className={`group relative p-[1.5px] clip-notch focus-within:ring-2 focus-within:ring-primary ${
        isHighStat
          ? 'bg-gradient-to-br from-amber-400 via-pink-400 to-blue-400'
          : 'bg-border dark:bg-slate-700'
      }`}
    >
      {/* 1px hover outline overlay */}
      <div
        className={`absolute inset-0 z-0 clip-notch opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-gradient-to-br ${theme.gradient}`}
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={onClick}
        className="relative z-10 flex w-full flex-col overflow-hidden bg-surface p-5 text-left clip-notch dark:bg-slate-800 focus:outline-none cursor-pointer"
        aria-label={`View details for ${name}`}
      >
        {/* Holographic foil overlay (only for high stats) */}
        {isHighStat && (
          <div
            className="pointer-events-none absolute inset-0 z-10 animate-holo opacity-40 mix-blend-color-dodge dark:opacity-20"
            aria-hidden="true"
          />
        )}

        {/* Top bar: ID and Favorite toggle */}
        <div className="z-20 flex w-full items-center justify-between">
          <span className="font-heading text-xs font-bold tracking-wider text-slate-400 dark:text-slate-500">
            {formattedId}
          </span>

          <button
            type="button"
            onClick={handleToggleFav}
            className="rounded-full p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            aria-label={isFavorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
          >
            <PokeBall
              key={isFavorite ? 'fav-active' : 'fav-inactive'}
              variant="favorite"
              active={isFavorite}
              size={20}
              className={isFavorite ? 'animate-catch' : 'text-slate-400 hover:text-red-500 dark:text-slate-500'}
            />
          </button>
        </div>

        {/* Artwork Area with Ambient Glow */}
        <div className="relative mb-4 mt-2 flex h-28 w-full items-center justify-center">
          {/* Ambient Glow */}
          <div 
            className={`absolute inset-0 m-auto h-20 w-20 rounded-full bg-gradient-to-br opacity-25 blur-xl transition-all duration-300 group-hover:scale-110 group-hover:opacity-40 ${theme.gradient}`}
            aria-hidden="true"
          />
          
          {/* Shared Element Image Morphing */}
          <motion.img
            layoutId={prefersReducedMotion ? undefined : `pokemon-image-${id}`}
            src={image}
            alt={name}
            className="relative z-10 h-full w-full object-contain drop-shadow-md"
            loading="lazy"
          />
        </div>

        {/* Content Area */}
        <div className="flex flex-col items-center w-full text-center">
          <h2 className="mb-2.5 font-heading text-lg font-bold capitalize tracking-tight text-slate-800 dark:text-slate-100 truncate w-full">
            {name}
          </h2>
          
          {/* Notched Type Badges */}
          <div className="flex justify-center gap-1.5 w-full flex-wrap">
            {types.map((type) => {
              const typeTheme = typeColors[type.toLowerCase()] || typeColors.normal;
              return (
                <span
                  key={type}
                  className={`flex items-center gap-1 clip-notch-sm p-[1px] ${
                    isHighStat
                      ? 'bg-gradient-to-r from-amber-400 to-pink-500'
                      : `bg-gradient-to-r ${typeTheme.gradient}`
                  }`}
                >
                  <span
                    className={`flex items-center gap-1 clip-notch-sm px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                      isHighStat
                        ? 'bg-slate-900 text-amber-300 dark:bg-slate-800'
                        : `${typeTheme.badgeBg} ${typeTheme.badgeText}`
                    }`}
                  >
                    <span aria-hidden="true" className="text-xs">{typeTheme.icon}</span>
                    {type}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </button>
    </motion.div>
  );
}
