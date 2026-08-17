import { PokeBall } from './PokeBall';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center py-16 text-center">
      {/* Soft Icon Container */}
      <div className="mb-6 flex items-center justify-center text-red-500 dark:text-red-400">
        <PokeBall variant="error" size={80} />
      </div>
      
      <h3 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100 font-heading">
        Oops! Something went wrong.
      </h3>
      
      <p className="mb-8 max-w-sm text-slate-500 dark:text-slate-400">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full bg-primary px-8 py-3 font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-appBg active:translate-y-0 dark:focus:ring-offset-slate-900"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
