import type { CSSProperties, ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type MenuToggleIconProps = ComponentProps<'svg'> & { open: boolean; duration?: number };

export function MenuToggleIcon({ open, duration = 300, className, ...props }: MenuToggleIconProps) {
  const style: CSSProperties = { transitionDuration: `${duration}ms`, transformOrigin: '12px 12px' };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      aria-hidden="true" className={cn('size-5', className)} {...props}>
      <path d="M4 12h16" className="transition-transform motion-reduce:transition-none" style={{ ...style, transform: open ? 'rotate(45deg)' : 'translateY(-4px)' }} />
      <path d="M4 12h16" className="transition-transform motion-reduce:transition-none" style={{ ...style, transform: open ? 'rotate(-45deg)' : 'translateY(4px)' }} />
    </svg>
  );
}
