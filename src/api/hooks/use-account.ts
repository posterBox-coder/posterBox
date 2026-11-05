import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { banksService } from '@/api/services/banks';
import { usersService } from '@/api/services/users';
import type { PayoutFormValues } from '@/types';

import { queryKeys } from './query-keys';

export const useMe = () => useQuery({ queryKey: queryKeys.me, queryFn: usersService.getMe, staleTime: 5 * 60 * 1000 });

export const useBanks = () =>
  useQuery({ queryKey: queryKeys.banks, queryFn: banksService.list, staleTime: Infinity });

export function useResolveAccount(bankCode: string, accountNumber: string) {
  return useQuery({
    queryKey: queryKeys.bankAccount(bankCode, accountNumber),
    queryFn: () => banksService.resolve({ bankCode, accountNumber }),
    enabled: !!bankCode && /^\d{10}$/.test(accountNumber),
    retry: false,
    staleTime: Infinity,
  });
}

export function useSavePayoutAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: PayoutFormValues) => usersService.savePayoutAccount(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.me }),
  });
}
