import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
    const { address, isConnected } = useAccount();
    const [polBalance, setPolBalance] = useState('0.00');
    const [usdtBalance, setUsdtBalance] = useState('0.00');
    const [energyBalance, setEnergyBalance] = useState(0);
    const [ownBalance, setOwnBalance] = useState('0.00');
    const [stakedAmount, setStakedAmount] = useState(0);
    const [accumulatedRewards, setAccumulatedRewards] = useState(0);
    const [totalEarned, setTotalEarned] = useState(0);
    const [stakeHistory, setStakeHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchBalance = useCallback(async () => {
        if (!isConnected || !address) {
            setPolBalance('0.00');
            setUsdtBalance('0.00');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/v1/wallet/balance', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            const result = await response.json();
            if (result.success) {
                setPolBalance(result.data.polBalance);
                setUsdtBalance(result.data.usdtBalance);
            }
        } catch (error) {
            console.error('Error fetching on-chain balances:', error);
        } finally {
            setIsLoading(false);
        }
    }, [address, isConnected]);

    const fetchWalletInfo = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return; // Only require JWT auth, not wallet connection

        try {
            const response = await fetch('/api/v1/wallet/info', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (result.success && result.data) {
                const rawBalance = result.data.own_token_balance;
                setOwnBalance(parseFloat(rawBalance || 0).toString());
                setEnergyBalance(parseFloat(result.data.energy_balance || 0));
                setStakedAmount(parseFloat(result.data.locked_balance || 0));
            } else {
                console.warn('[WalletContext] fetchWalletInfo: API returned failure or no data', result);
            }
        } catch (error) {
            console.error('Error fetching wallet info:', error);
        }
    }, [address, isConnected]);

    const fetchStakeHistory = useCallback(async () => {
        if (!isConnected || !address) return;

        try {
            const response = await fetch('/api/v1/wallet/stake-history', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            const result = await response.json();
            if (result.success) {
                setStakeHistory(result.data);
            }
        } catch (error) {
            console.error('Error fetching stake history:', error);
        }
    }, [address, isConnected]);

    useEffect(() => {
        fetchBalance();
        fetchWalletInfo();
        fetchStakeHistory();
        const interval = setInterval(() => {
            fetchBalance();
            fetchWalletInfo();
            fetchStakeHistory();
        }, 30000);
        return () => clearInterval(interval);
    }, [fetchBalance, fetchWalletInfo, fetchStakeHistory]);


    useEffect(() => {
        if (stakedAmount <= 0) return;

        const rewardRatePerSecond = (stakedAmount * 0.012) / (7 * 24 * 60 * 60);
        const interval = setInterval(() => {
            setAccumulatedRewards(prev => prev + rewardRatePerSecond);
        }, 1000);

        return () => clearInterval(interval);
    }, [stakedAmount]);

    const stakeOwnToken = async (amount) => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            toast.error('Invalid amount');
            return false;
        }

        const currentBalance = parseFloat(ownBalance) || 0;
        if (numAmount > currentBalance) {
            toast.error(`Insufficient token balance (have ${currentBalance}, need ${numAmount})`);
            return false;
        }

        setIsLoading(true);
        try {

            const response = await fetch('/api/v1/wallet/stake-internal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    amount: numAmount
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to stake tokens on server');
            }

            toast.success(`Successfully staked ${numAmount} tokens`);
            fetchWalletInfo();
            fetchStakeHistory();
            return true;
        } catch (error) {
            console.error('Error staking tokens:', error);
            toast.error(error.message || 'Staking failed');
            return false;
        } finally {
            setIsLoading(false);
        }
    };


    const claimRewards = async () => {
        if (accumulatedRewards <= 0) {
            toast.info('No rewards to claim');
            return false;
        }

        setIsLoading(true);
        try {
            const rewardsToClaim = accumulatedRewards;
            const response = await fetch('/api/v1/wallet/claim-rewards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    amount: rewardsToClaim
                })
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to claim rewards on server');
            }

            setTotalEarned(prev => prev + rewardsToClaim);
            setAccumulatedRewards(0);
            toast.success(`Successfully claimed ${rewardsToClaim.toFixed(4)} GOLD`);
            fetchWalletInfo();
            fetchStakeHistory();
            return true;
        } catch (error) {
            console.error('Error claiming rewards:', error);
            toast.error(error.message || 'Reward claim failed');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <WalletContext.Provider
            value={{
                polBalance,
                usdtBalance,
                energyBalance,
                ownBalance,
                stakedAmount,
                accumulatedRewards,
                totalEarned,
                stakeHistory,
                isLoading,
                stakeOwnToken,
                claimRewards,
                refreshBalance: () => {
                    fetchBalance();
                    fetchWalletInfo();
                    fetchStakeHistory();
                }
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};
