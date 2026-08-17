import { typeColors } from '@/utils/typeColors';

interface TypeFilterProps {
  selectedType: string | null;
  onSelectType: (type: string | null) => void;
}

export function TypeFilter({ selectedType, onSelectType }: TypeFilterProps) {
  const types = Object.keys(typeColors);

  return (
    <div className="w-full">
      {/* Scrollable Container */}
      <div className="scrollbar-none flex w-full gap-2.5 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible md:pb-0">
        
        {/* "All" Filter Button */}
        <button
          type="button"
          onClick={() => onSelectType(null)}
          className={`flex shrink-0 items-center justify-center p-[1.5px] clip-notch-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary ${
            selectedType === null
              ? 'bg-slate-800 dark:bg-slate-200'
              : 'bg-border dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-500'
          }`}
          aria-label="Show all Pokémon types"
        >
          <span
            className={`flex items-center gap-1.5 clip-notch-sm px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-150 ${
              selectedType === null
                ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                : 'bg-surface text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            ⭕ All
          </span>
        </button>

        {/* Type Buttons */}
        {types.map((type) => {
          const theme = typeColors[type];
          const isSelected = selectedType === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => onSelectType(type)}
              className={`flex shrink-0 items-center justify-center p-[1.5px] clip-notch-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary ${
                isSelected
                  ? `bg-gradient-to-r ${theme.gradient}`
                  : 'bg-border dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-500'
              }`}
              aria-label={`Filter by ${theme.name} type`}
            >
              <span
                className={`flex items-center gap-1.5 clip-notch-sm px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-150 ${
                  isSelected
                    ? `bg-gradient-to-r ${theme.gradient} text-white`
                    : 'bg-surface text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                <span className="text-sm" aria-hidden="true">{theme.icon}</span>
                {theme.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
