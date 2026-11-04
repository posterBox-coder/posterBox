import { useMutation, useQuery } from '@tanstack/react-query';

import { locationsService } from '@/api/services/locations';
import { quotesService } from '@/api/services/quotes';

import { queryKeys } from './query-keys';

export const useStates = () =>
  useQuery({ queryKey: queryKeys.states, queryFn: locationsService.states, staleTime: Infinity });

export const useLgas = (state: string) =>
  useQuery({
    queryKey: queryKeys.lgas(state),
    queryFn: () => locationsService.lgas(state),
    enabled: !!state,
    staleTime: Infinity,
  });

export const useCreateQuote = () => useMutation({ mutationFn: quotesService.create });
