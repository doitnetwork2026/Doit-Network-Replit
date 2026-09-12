import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[#00c29e]/15 text-[#00876e]',
        secondary: 'border-transparent bg-zinc-100 text-zinc-800',
        destructive: 'border-transparent bg-rose-50 text-rose-700 border-rose-200',
        warning: 'border-transparent bg-amber-50 text-amber-800 border-amber-200',
        success: 'border-transparent bg-emerald-50 text-emerald-700 border-emerald-200',
        outline: 'text-zinc-800 border-zinc-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}

export { Badge, badgeVariants };
