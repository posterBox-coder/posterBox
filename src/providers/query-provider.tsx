import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type PropsWithChildren } from 'react';

export function QueryProvider({ children }: PropsWithChildren) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, staleTime: 15 * 1000 },
          mutations: { retry: 0 },
        },
      })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
