import { ArrowUpDown } from 'lucide-react';

export type SortOption =
  | 'id-asc'
  | 'id-desc'
  | 'name-asc'
  | 'name-desc'
  | 'attack-desc'
  | 'speed-desc'
  | 'hp-desc';

interface SortSelectProps {
  value: SortOption;
  onChange: (option: SortOption) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="relative flex items-center p-[1.5px] clip-notch-sm bg-border dark:bg-slate-700 shrink-0">
      <div className="flex items-center gap-2 clip-notch-sm bg-surface dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
        <ArrowUpDown className="h-4 w-4 text-primary shrink-0" />
        <span className="hidden sm:inline font-bold uppercase tracking-wider text-[10px] text-slate-400">Sort:</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className="bg-transparent font-medium focus:outline-none cursor-pointer text-slate-800 dark:text-slate-100 pr-1"
          aria-label="Sort Pokémon list"
        >
          <option value="id-asc" className="bg-surface dark:bg-slate-800 text-slate-800 dark:text-slate-100">ID (Low to High)</option>
          <option value="id-desc" className="bg-surface dark:bg-slate-800 text-slate-800 dark:text-slate-100">ID (High to Low)</option>
          <option value="name-asc" className="bg-surface dark:bg-slate-800 text-slate-800 dark:text-slate-100">Name (A - Z)</option>
          <option value="name-desc" className="bg-surface dark:bg-slate-800 text-slate-800 dark:text-slate-100">Name (Z - A)</option>
          <option value="attack-desc" className="bg-surface dark:bg-slate-800 text-slate-800 dark:text-slate-100">Highest Attack ⚔️</option>
          <option value="speed-desc" className="bg-surface dark:bg-slate-800 text-slate-800 dark:text-slate-100">Highest Speed ⚡</option>
          <option value="hp-desc" className="bg-surface dark:bg-slate-800 text-slate-800 dark:text-slate-100">Highest HP ❤️</option>
        </select>
      </div>
    </div>
  );
}
