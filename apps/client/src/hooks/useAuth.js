import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApiService } from '../services/authApiService';

export const useNonce = (address) => {
    return useQuery({
        queryKey: ['nonce', address],
        queryFn: () => authApiService.getNonce(address),
        enabled: !!address,
        staleTime: 0, // Always get a fresh nonce
        retry: false
    });
};

export const useVerifySignature = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ address, signature }) => authApiService.verifySignature(address, signature),
        onSuccess: (data) => {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            queryClient.invalidateQueries(); // Invalidate everything to get fresh data for new user
        }
    });
};
