import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';

type As = 'div' | 'button' | 'span';

export type CreatorLockupProps = {
  as?: As;
  variant?: 'default' | 'compact' | 'onDark';
} & (HTMLAttributes<HTMLDivElement> & Partial<ButtonHTMLAttributes<HTMLButtonElement>>);

/**
 * Text wordmark: **sixsevencreator** (matches marketing nav).
 */
export default function CreatorLockup({
  as = 'div',
  variant = 'default',
  className,
  type = 'button',
  ...rest
}: CreatorLockupProps) {
  const extra =
    variant === 'compact'
      ? 'creator-lockup--compact'
      : variant === 'onDark'
        ? 'creator-lockup--on-dark'
        : '';

  const mark = <span className="creator-lockup-wordmark">sixsevencreator</span>;

  if (as === 'button') {
    return (
      <button
        type={type}
        className={cn('creator-lockup', extra, className)}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {mark}
      </button>
    );
  }

  const Comp = as;
  return (
    <Comp className={cn('creator-lockup', extra, className)} {...(rest as HTMLAttributes<HTMLElement>)}>
      {mark}
    </Comp>
  );
}
