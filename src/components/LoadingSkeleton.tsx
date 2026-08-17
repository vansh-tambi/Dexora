interface LoadingSkeletonProps {
  count?: number;
}

export function LoadingSkeleton() {
  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-3xl bg-surface p-5 shadow-soft">
      {/* ID Pill Placeholder */}
      <div className="absolute left-5 top-5 z-10 h-6 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />

      {/* Artwork Area Placeholder */}
      <div className="relative mb-6 mt-4 flex h-32 w-full items-center justify-center">
        <div className="h-28 w-28 rounded-full bg-slate-200/50 dark:bg-slate-800/50" />
      </div>

      {/* Info Area Placeholder */}
      <div className="flex flex-col items-center">
        {/* Name Placeholder */}
        <div className="mb-4 h-6 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
        
        {/* Badges Placeholder */}
        <div className="flex justify-center gap-2">
          <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Shimmer Effect Overlay */}
      <div 
        className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10 motion-reduce:animate-none" 
        aria-hidden="true" 
      />
    </div>
  );
}

export function PokemonGridSkeleton({ count = 10 }: LoadingSkeletonProps) {
  return (
    <div className="grid w-full grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <LoadingSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );
}
