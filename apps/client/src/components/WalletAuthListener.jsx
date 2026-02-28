import { useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useAuthContext } from '../context/AuthContext';
import { useLogout } from '../hooks/useAuth';

/**
 * WalletAuthListener
 * Watches for wallet disconnects and address changes, then clears auth state.
 */
export function WalletAuthListener() {
    const { isConnected, address } = useAccount();
    const { isAuthenticated } = useAuthContext();
    const logout = useLogout();
    const previousAddressRef = useRef(null);

    useEffect(() => {
        if (!isConnected) {
            if (isAuthenticated) logout();
            previousAddressRef.current = null;
            return;
        }

        if (address && previousAddressRef.current &&
            previousAddressRef.current.toLowerCase() !== address.toLowerCase()) {
            logout();
        }

        previousAddressRef.current = address;
    }, [isConnected, address, isAuthenticated, logout]);

    return null;
}
