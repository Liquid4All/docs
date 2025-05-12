import { clsx } from 'clsx';
import { ComponentPropsWithoutRef } from 'react';

export function Container({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={clsx('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)} {...props} />;
}
