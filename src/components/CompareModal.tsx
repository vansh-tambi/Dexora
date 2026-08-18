import { useState, useEffect, useRef } from 'react';
import { X, Swords, Trophy, Search } from 'lucide-react';
import type { Pokemon } from '@/types/pokemon';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { primarySpring } from '@/utils/motion';

interface CompareModalProps {
  isOpen: boolean;
  pokemonList: Pokemon[];
  initialPokemon1?: Pokemon | null;
  initialPokemon2?: Pokemon | null;
  onClose: () => void;
}

export function CompareModal({
  isOpen,
  pokemonList,
  initialPokemon1 = null,
  initialPokemon2 = null,
  onClose,
}: CompareModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [pokemon1, setPokemon1] = useState<Pokemon | null>(initialPokemon1 || pokemonList[0] || null);
  const [pokemon2, setPokemon2] = useState<Pokemon | null>(initialPokemon2 || pokemonList[1] || pokemonList[0] || null);

  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');

  useEffect(() => {
    if (initialPokemon1) setPokemon1(initialPokemon1);
    if (initialPokemon2) setPokemon2(initialPokemon2);
  }, [initialPokemon1, initialPokemon2]);

  // Lock body scroll and set focus
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (modalRef.current) {
      modalRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredP1List = pokemonList.filter(
    (p) =>
      p.name.toLowerCase().includes(search1.toLowerCase().trim()) ||
      String(p.id).includes(search1.trim())
  );

  const filteredP2List = pokemonList.filter(
    (p) =>
      p.name.toLowerCase().includes(search2.toLowerCase().trim()) ||
      String(p.id).includes(search2.trim())
  );

  const getStat = (pokemon: Pokemon | null, statName: string): number => {
    if (!pokemon) return 0;
    const statObj = pokemon.stats.find((s) => s.stat.name === statName);
    return statObj ? statObj.base_stat : 0;
  };

  const statFields = [
    { label: 'HP', key: 'hp' },
    { label: 'Attack', key: 'attack' },
    { label: 'Defense', key: 'defense' },
    { label: 'Sp. Attack', key: 'special-attack' },
    { label: 'Sp. Defense', key: 'special-defense' },
    { label: 'Speed', key: 'speed' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-sm md:items-center md:p-4 overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
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
        className="relative flex w-full flex-col overflow-y-auto overflow-x-hidden bg-surface shadow-soft scrollbar-none h-[90vh] rounded-t-[2rem] md:h-auto md:max-h-[90vh] md:max-w-3xl md:rounded-[2rem] p-6"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Swords className="h-6 w-6 text-primary" />
            <h2 id="compare-modal-title" className="text-xl font-extrabold font-heading text-slate-800 dark:text-white">
              Compare Pokémon Statistics
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 focus:outline-none"
            aria-label="Close comparison modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Selection Pickers with Search Filter */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Picker 1 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="p1-select" className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Pokémon #1
            </label>
            <div className="relative flex items-center mb-1">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search name or ID..."
                value={search1}
                onChange={(e) => setSearch1(e.target.value)}
                className="w-full clip-notch-sm bg-slate-100 dark:bg-slate-800/80 pl-8 pr-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-100 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <select
              id="p1-select"
              value={pokemon1?.name || ''}
              onChange={(e) => {
                const found = pokemonList.find((p) => p.name === e.target.value);
                if (found) setPokemon1(found);
              }}
              className="w-full clip-notch-sm bg-slate-100 dark:bg-slate-800 p-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 border border-border focus:outline-none"
            >
              {filteredP1List.length > 0 ? (
                filteredP1List.map((p) => (
                  <option key={p.id} value={p.name}>
                    #{String(p.id).padStart(3, '0')} {p.name.toUpperCase()}
                  </option>
                ))
              ) : (
                <option value="">No Pokémon found</option>
              )}
            </select>
          </div>

          {/* Picker 2 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="p2-select" className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Pokémon #2
            </label>
            <div className="relative flex items-center mb-1">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search name or ID..."
                value={search2}
                onChange={(e) => setSearch2(e.target.value)}
                className="w-full clip-notch-sm bg-slate-100 dark:bg-slate-800/80 pl-8 pr-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-100 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <select
              id="p2-select"
              value={pokemon2?.name || ''}
              onChange={(e) => {
                const found = pokemonList.find((p) => p.name === e.target.value);
                if (found) setPokemon2(found);
              }}
              className="w-full clip-notch-sm bg-slate-100 dark:bg-slate-800 p-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 border border-border focus:outline-none"
            >
              {filteredP2List.length > 0 ? (
                filteredP2List.map((p) => (
                  <option key={p.id} value={p.name}>
                    #{String(p.id).padStart(3, '0')} {p.name.toUpperCase()}
                  </option>
                ))
              ) : (
                <option value="">No Pokémon found</option>
              )}
            </select>
          </div>
        </div>

        {/* Side-by-side Hero Showcase */}
        {pokemon1 && pokemon2 && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* Card 1 */}
              <div className="flex flex-col items-center p-4 clip-notch bg-slate-50 dark:bg-slate-800/40 border border-border dark:border-slate-700">
                <img
                  src={pokemon1.sprites.other['official-artwork'].front_default || ''}
                  alt={pokemon1.name}
                  className="h-28 w-28 object-contain drop-shadow-md mb-2"
                />
                <span className="text-[10px] font-bold text-slate-400">#{String(pokemon1.id).padStart(3, '0')}</span>
                <h3 className="text-lg font-extrabold capitalize text-slate-800 dark:text-white font-heading">
                  {pokemon1.name}
                </h3>
              </div>

              {/* Card 2 */}
              <div className="flex flex-col items-center p-4 clip-notch bg-slate-50 dark:bg-slate-800/40 border border-border dark:border-slate-700">
                <img
                  src={pokemon2.sprites.other['official-artwork'].front_default || ''}
                  alt={pokemon2.name}
                  className="h-28 w-28 object-contain drop-shadow-md mb-2"
                />
                <span className="text-[10px] font-bold text-slate-400">#{String(pokemon2.id).padStart(3, '0')}</span>
                <h3 className="text-lg font-extrabold capitalize text-slate-800 dark:text-white font-heading">
                  {pokemon2.name}
                </h3>
              </div>
            </div>

            {/* Stat Comparisons Table */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2">
                Stat Comparisons
              </h4>

              {statFields.map((field) => {
                const val1 = getStat(pokemon1, field.key);
                const val2 = getStat(pokemon2, field.key);
                const p1Wins = val1 > val2;
                const p2Wins = val2 > val1;

                return (
                  <div key={field.key} className="flex flex-col gap-1 p-3 clip-notch bg-slate-50 dark:bg-slate-800/40 border border-border dark:border-slate-700">
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className={`flex items-center gap-1 ${p1Wins ? 'text-amber-500 dark:text-amber-400 font-extrabold' : 'text-slate-700 dark:text-slate-300'}`}>
                        {val1} {p1Wins && <Trophy className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />}
                      </span>

                      <span className="uppercase tracking-widest text-[10px] text-slate-400">
                        {field.label}
                      </span>

                      <span className={`flex items-center gap-1 ${p2Wins ? 'text-amber-500 dark:text-amber-400 font-extrabold' : 'text-slate-700 dark:text-slate-300'}`}>
                        {p2Wins && <Trophy className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />} {val2}
                      </span>
                    </div>

                    {/* Progress Bar Dual Comparison */}
                    <div className="flex h-2.5 w-full gap-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      {/* Left bar for P1 */}
                      <div className="flex h-full w-1/2 justify-end">
                        <div
                          className={`h-full rounded-l-full ${p1Wins ? 'bg-amber-400' : 'bg-primary'}`}
                          style={{ width: `${Math.min((val1 / 255) * 100, 100)}%` }}
                        />
                      </div>
                      {/* Right bar for P2 */}
                      <div className="flex h-full w-1/2 justify-start">
                        <div
                          className={`h-full rounded-r-full ${p2Wins ? 'bg-amber-400' : 'bg-blue-500'}`}
                          style={{ width: `${Math.min((val2 / 255) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
