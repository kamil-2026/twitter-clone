import * as React from 'react';
import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-12 w-full rounded-full border border-gray-700 bg-transparent px-4 text-base text-white transition-colors outline-none placeholder:text-gray-500 focus-visible:border-white focus-visible:ring-0 disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
