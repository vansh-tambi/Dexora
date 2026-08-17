import { typeColors } from '@/utils/typeColors';

interface PokemonCardProps {
  id: number | string;
  name: string;
  image: string;
  types: string[];
  onClick?: () => void;
}

export function PokemonCard({ id, name, image, types, onClick }: PokemonCardProps) {
  const formattedId = `#${String(id).padStart(3, '0')}`;
  
  // Get the primary type for the ambient glow effect
  const primaryType = types[0]?.toLowerCase();
  const theme = typeColors[primaryType] || typeColors.normal;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-full flex-col overflow-hidden rounded-3xl bg-surface p-5 text-left shadow-soft transition-all duration-200 hover:scale-[1.02] hover:shadow-soft-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-appBg dark:focus:ring-offset-slate-900"
      aria-label={`View details for ${name}`}
    >
      {/* ID Pill */}
      <div className="absolute left-5 top-5 z-10 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        {formattedId}
      </div>

      {/* Artwork Area with Ambient Glow */}
      <div className="relative mb-6 mt-4 flex h-32 w-full items-center justify-center">
        {/* Radial Glow Layer */}
        <div 
          className={`absolute inset-0 m-auto h-24 w-24 rounded-full bg-gradient-to-br opacity-40 blur-2xl transition-opacity duration-300 group-hover:opacity-60 ${theme.gradient}`}
          aria-hidden="true"
        />
        
        {/* Pokémon Artwork */}
        <img
          src={image}
          alt={name}
          className="relative z-10 h-full w-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Info Area */}
      <div className="flex flex-col items-center">
        <h2 className="mb-3 text-xl font-bold capitalize tracking-tight text-slate-800 dark:text-slate-100 font-heading">
          {name}
        </h2>
        
        <div className="flex flex-wrap justify-center gap-2">
          {types.map((type) => {
            const typeTheme = typeColors[type.toLowerCase()] || typeColors.normal;
            return (
              <span
                key={type}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider ${typeTheme.badgeBg} ${typeTheme.badgeText}`}
              >
                <span aria-hidden="true" className="text-sm">{typeTheme.icon}</span>
                {type}
              </span>
            );
          })}
        </div>
      </div>
    </button>
  );
}
