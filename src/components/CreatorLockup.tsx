import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';

type As = 'div' | 'button' | 'span';

export type CreatorLockupProps = {
  as?: As;
  variant?: 'default' | 'compact' | 'onDark';
} & (HTMLAttributes<HTMLDivElement> & Partial<ButtonHTMLAttributes<HTMLButtonElement>>);

/**
 * Text lockup matching the marketing site: **67** + monospace `/ creator`.
 * Same look as the landing nav (no favicon-only mark).
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

  if (as === 'button') {
    return (
      <button
        type={type}
        className={cn('creator-lockup', extra, className)}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        <span className="creator-lockup-67">67</span>
        <span className="creator-lockup-tag">/ creator</span>
      </button>
    );
  }

  const Comp = as;
  return (
    <Comp className={cn('creator-lockup', extra, className)} {...(rest as HTMLAttributes<HTMLElement>)}>
      <span className="creator-lockup-67">67</span>
      <span className="creator-lockup-tag">/ creator</span>
    </Comp>
  );
}
