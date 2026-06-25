'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SupabaseProvider } from '@presentei/api-client';
import { useState, type ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseProvider>{children}</SupabaseProvider>
    </QueryClientProvider>
  );
}
