'use client';

import { Search } from 'nextra/components/search';

import { useDebouncedTracking } from '@/hooks/useDebouncedTracking';
import { AnalyticEvent } from '@/lib/analytics';

interface CustomSearchProps {
  className?: string;
}

const CustomSearch = ({ className }: CustomSearchProps) => {
  const trackSearchChange = useDebouncedTracking({
    eventName: AnalyticEvent.QueriedDocumentation,
    transform: (query: string) => ({ query }),
  });

  return (
    <Search
      className={className}
      onSearch={(query: string) => {
        if (query != null && query.length > 1) {
          trackSearchChange(query);
        }
      }}
    />
  );
};

export default CustomSearch;
