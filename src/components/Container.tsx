import { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

export function Container({
  className,
  isDynamic = true,
  ...props
}: ComponentPropsWithoutRef<'div'> & { isDynamic?: boolean }) {
  return (
    <div
      className={cn(
        isDynamic
          ? 'sm:max-w-[900px] md:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] 3xl:max-w-[2000px] px-4 md:px-10 2xl:px-12 3xl:px-0 mx-auto'
          : 'sm:w-[900px] md:w-[1400px] xl:w-[1600px] 2xl:w-[1800px] 3xl:w-[2000px] px-4 md:px-10 2xl:px-12 3xl:px-0 mx-auto',
        className
      )}
      {...props}
    />
  );
}
