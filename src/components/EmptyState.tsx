import { PokeBall } from './PokeBall';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;
}

export function EmptyState({ title, subtitle, icon }: EmptyStateProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center py-16 text-center">
      {/* Soft Icon Container */}
      <div className="mb-6 flex items-center justify-center text-slate-400 dark:text-slate-500">
        {icon || <PokeBall variant="empty" size={80} />}
      </div>
      
      <h3 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100 font-heading">
        {title}
      </h3>
      
      <p className="max-w-sm text-slate-500 dark:text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}
