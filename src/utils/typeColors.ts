export interface PokemonTypeTheme {
  name: string;
  gradient: string;
  badgeBg: string;
  badgeText: string;
  icon: string;
}

export const typeColors: Record<string, PokemonTypeTheme> = {
  normal: {
    name: 'Normal',
    gradient: 'from-gray-400 to-gray-500',
    badgeBg: 'bg-gray-100 dark:bg-gray-800',
    badgeText: 'text-gray-700 dark:text-gray-300',
    icon: '⭕',
  },
  fire: {
    name: 'Fire',
    gradient: 'from-orange-400 to-red-500',
    badgeBg: 'bg-orange-100 dark:bg-orange-900',
    badgeText: 'text-orange-700 dark:text-orange-300',
    icon: '🔥',
  },
  water: {
    name: 'Water',
    gradient: 'from-blue-400 to-blue-600',
    badgeBg: 'bg-blue-100 dark:bg-blue-900',
    badgeText: 'text-blue-700 dark:text-blue-300',
    icon: '💧',
  },
  electric: {
    name: 'Electric',
    gradient: 'from-yellow-300 to-yellow-500',
    badgeBg: 'bg-yellow-100 dark:bg-yellow-900',
    badgeText: 'text-yellow-700 dark:text-yellow-300',
    icon: '⚡',
  },
  grass: {
    name: 'Grass',
    gradient: 'from-green-400 to-emerald-500',
    badgeBg: 'bg-green-100 dark:bg-green-900',
    badgeText: 'text-green-700 dark:text-green-300',
    icon: '🌿',
  },
  ice: {
    name: 'Ice',
    gradient: 'from-cyan-300 to-cyan-500',
    badgeBg: 'bg-cyan-100 dark:bg-cyan-900',
    badgeText: 'text-cyan-700 dark:text-cyan-300',
    icon: '❄️',
  },
  fighting: {
    name: 'Fighting',
    gradient: 'from-red-600 to-red-800',
    badgeBg: 'bg-red-100 dark:bg-red-900',
    badgeText: 'text-red-700 dark:text-red-300',
    icon: '🥊',
  },
  poison: {
    name: 'Poison',
    gradient: 'from-purple-400 to-purple-600',
    badgeBg: 'bg-purple-100 dark:bg-purple-900',
    badgeText: 'text-purple-700 dark:text-purple-300',
    icon: '☠️',
  },
  ground: {
    name: 'Ground',
    gradient: 'from-amber-500 to-amber-700',
    badgeBg: 'bg-amber-100 dark:bg-amber-900',
    badgeText: 'text-amber-700 dark:text-amber-300',
    icon: '⛰️',
  },
  flying: {
    name: 'Flying',
    gradient: 'from-sky-300 to-sky-500',
    badgeBg: 'bg-sky-100 dark:bg-sky-900',
    badgeText: 'text-sky-700 dark:text-sky-300',
    icon: '🕊️',
  },
  psychic: {
    name: 'Psychic',
    gradient: 'from-pink-400 to-pink-600',
    badgeBg: 'bg-pink-100 dark:bg-pink-900',
    badgeText: 'text-pink-700 dark:text-pink-300',
    icon: '🔮',
  },
  bug: {
    name: 'Bug',
    gradient: 'from-lime-400 to-lime-600',
    badgeBg: 'bg-lime-100 dark:bg-lime-900',
    badgeText: 'text-lime-700 dark:text-lime-300',
    icon: '🐛',
  },
  rock: {
    name: 'Rock',
    gradient: 'from-stone-500 to-stone-700',
    badgeBg: 'bg-stone-100 dark:bg-stone-800',
    badgeText: 'text-stone-700 dark:text-stone-300',
    icon: '🪨',
  },
  ghost: {
    name: 'Ghost',
    gradient: 'from-violet-500 to-indigo-700',
    badgeBg: 'bg-violet-100 dark:bg-violet-900',
    badgeText: 'text-violet-700 dark:text-violet-300',
    icon: '👻',
  },
  dragon: {
    name: 'Dragon',
    gradient: 'from-indigo-600 to-purple-800',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-900',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    icon: '🐉',
  },
  dark: {
    name: 'Dark',
    gradient: 'from-slate-700 to-slate-900',
    badgeBg: 'bg-slate-200 dark:bg-slate-800',
    badgeText: 'text-slate-800 dark:text-slate-300',
    icon: '🌙',
  },
  steel: {
    name: 'Steel',
    gradient: 'from-slate-400 to-slate-600',
    badgeBg: 'bg-slate-100 dark:bg-slate-800',
    badgeText: 'text-slate-700 dark:text-slate-300',
    icon: '⚙️',
  },
  fairy: {
    name: 'Fairy',
    gradient: 'from-rose-300 to-pink-400',
    badgeBg: 'bg-rose-100 dark:bg-rose-900',
    badgeText: 'text-rose-700 dark:text-rose-300',
    icon: '✨',
  },
};
