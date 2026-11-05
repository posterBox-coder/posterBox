import { useCallback, useEffect, useState } from 'react';

type AsyncState<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  reload: () => void;
};

export function useAsyncData<T>(loader: () => Promise<T>, errorMessage = 'Something went wrong'): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState(0);

  const reload = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(true);
    setRequestId((value) => value + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    loader()
      .then((result) => {
        if (cancelled) {
          return;
        }
        setData(result);
        setError(null);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        setError(errorMessage);
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [errorMessage, loader, requestId]);

  return { data, isLoading, error, reload };
}
