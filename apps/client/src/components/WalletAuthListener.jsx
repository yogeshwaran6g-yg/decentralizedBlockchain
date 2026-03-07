import { useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useAuthContext } from '../context/AuthContext';
import { useNonce, useLogin } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

/**
 * WalletAuthListener
 * Automatically triggers the signature request immediately after connection
 * if the user is not authenticated.
 */
export function WalletAuthListener() {
    const { address, isConnected } = useAccount();
    const { isAuthenticated } = useAuthContext();
    const { login } = useLogin();
    const referralCode = localStorage.getItem('referralCode');
    const { data: nonce, refetch: fetchNonce } = useNonce(
        isConnected && !isAuthenticated ? address : null,
        referralCode
    );
    const navigate = useNavigate();

    // Use a ref to prevent multiple simultaneous signing requests
    const isAuthenticating = useRef(false);

    useEffect(() => {
        const handleLogin = async (isManual = false) => {
            const token = localStorage.getItem('authToken');
            const isCancelled = sessionStorage.getItem('autoLoginCancelled');

            // If manual, we clear the cancellation flag
            if (isManual) {
                sessionStorage.removeItem('autoLoginCancelled');
            }

            // Trigger if:
            // 1. Connected
            // 2. Not authenticated
            // 3. Not currently authenticating (global state)
            // 4. (No token OR manual trigger)
            // 5. (Not cancelled OR manual trigger)
            if (isConnected && address && !isAuthenticated && !isAuthenticating.current) {
                if (!isManual && (token || isCancelled)) return;

                isAuthenticating.current = true;

                // Slightly shorter delay to ensure connector is ready but feel faster
                await new Promise(resolve => setTimeout(resolve, isManual ? 100 : 400));

                try {
                    // 1. Get a fresh nonce
                    const result = await fetchNonce();
                    const currentNonce = result.data;

                    if (currentNonce) {
                        // 2. Trigger the login (signature prompt)
                        const loginResult = await login(currentNonce);
                        if (loginResult) {
                            localStorage.removeItem('referralCode');
                            navigate('/dashboard');
                        }
                    }
                } catch (error) {
                    console.error('Wallet authentication failed:', error);
                    // If it was a rejection, set the cancellation flag
                    if (error.code === 4001 || error.message?.includes('User rejected')) {
                        sessionStorage.setItem('autoLoginCancelled', 'true');
                    }
                } finally {
                    isAuthenticating.current = false;
                }
            }
        };

        const onManualTrigger = () => {
            console.log('[WalletAuthListener] Manual trigger received');
            handleLogin(true);
        };

        window.addEventListener('trigger-wallet-auth', onManualTrigger);

        // Initial check for auto-login
        if (!sessionStorage.getItem('autoLoginCancelled')) {
            handleLogin(false);
        }

        return () => {
            window.removeEventListener('trigger-wallet-auth', onManualTrigger);
        };
    }, [isConnected, address, isAuthenticated, fetchNonce, login, navigate]);

    return null;
}
