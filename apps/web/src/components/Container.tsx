import { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

export function Container({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn(
        'sm:max-w-[800px] md:max-w-[1200px] xl:max-w-[1440px] 2xl:max-w-[1440px] 3xl:max-w-[1550px] px-4 md:px-10 2xl:px-12 3xl:px-0 mx-auto',
        className
      )}
      {...props}
    />
  );
}
