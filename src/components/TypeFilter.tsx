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
      <div className="scrollbar-none flex w-full gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible md:pb-0">
        
         {/* "All" Filter Button */}
        <button
          type="button"
          onClick={() => onSelectType(null)}
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-appBg dark:focus:ring-offset-slate-900 motion-reduce:transition-none motion-reduce:hover:scale-100 ${
            selectedType === null
              ? 'bg-slate-800 text-white shadow-soft hover:scale-[1.02] dark:bg-slate-200 dark:text-slate-900'
              : 'border border-border bg-surface text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          ⭕ All
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
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-appBg dark:focus:ring-offset-slate-900 motion-reduce:transition-none motion-reduce:hover:scale-100 ${
                isSelected
                  ? `bg-gradient-to-r ${theme.gradient} text-white shadow-soft hover:scale-[1.02]`
                  : 'border border-border bg-surface text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-sm">{theme.icon}</span>
              {theme.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
