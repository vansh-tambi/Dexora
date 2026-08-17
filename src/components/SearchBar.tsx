import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBarProps {
  value: string;
  onSearch: (value: string) => void;
}

export function SearchBar({ value, onSearch }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 300);

  // Sync local input value if parent updates `value` prop (e.g., clearing the search)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Trigger search callback when debounced value changes
  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleClear = () => {
    setLocalValue('');
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
        <Search className="h-5 w-5" strokeWidth={2} />
      </div>
      
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Search Pokémon name or ID..."
        className="w-full rounded-full border border-border bg-surface py-3 pl-12 pr-12 text-sm text-slate-800 placeholder-slate-400 shadow-soft transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-slate-100 dark:placeholder-slate-500"
      />

      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          aria-label="Clear search query"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
