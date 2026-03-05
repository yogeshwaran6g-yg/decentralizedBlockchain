import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';
import { getActiveNetwork } from '../config/networkConfig';
import { api } from '../services/axios';
import { API_ENDPOINTS } from '../utils/endpoints';

const WalletContext = createContext(null);

const activeNetwork = getActiveNetwork();
const USDT_ADDRESS = activeNetwork.usdtAddress;

const ERC20_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function transfer(address to, uint256 amount) returns (bool)',
];

export const WalletProvider = ({ children }) => {
    const { address, isConnected } = useAccount();
    const [usdtBalance, setUsdtBalance] = useState('0.00'); // This now represents "DB Token" balance for simpler state management
    const [stakedAmount, setStakedAmount] = useState(0);
    const [accumulatedRewards, setAccumulatedRewards] = useState(0);
    const [totalEarned, setTotalEarned] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchBalance = useCallback(async () => {
        if (!isConnected || !address || !window.ethereum) {
            setUsdtBalance('0.00');
            return;
        }

        setIsLoading(true);
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, provider);

            const [balance, decimals] = await Promise.all([
                contract.balanceOf(address),
                contract.decimals()
            ]);

            // Note: This is on-chain USDT balance
            // However, the app seems to use setUsdtBalance for DB Tokens elsewhere.
            // For now, we keep this as is but ensure backend takes priority if needed.
        } catch (error) {
            console.error('Error fetching on-chain balance:', error);
        } finally {
            setIsLoading(false);
        }
    }, [address, isConnected]);

    const fetchWalletInfo = useCallback(async () => {
        if (!isConnected || !address) return;

        try {
            const result = await api.get(API_ENDPOINTS.WALLET.BALANCE);
            if (result.status === 200) {
                // The balance endpoint returns { ownTokenBalance, energyBalance, ... }
                setUsdtBalance(result.data.ownTokenBalance?.toString() || '0.00');
                setStakedAmount(parseFloat(result.data.lockedBalance || 0));
            }
        } catch (error) {
            console.error('Error fetching wallet info from backend:', error);
        }
    }, [address, isConnected]);

    useEffect(() => {
        fetchBalance();
        fetchWalletInfo();
        const interval = setInterval(() => {
            fetchBalance();
            fetchWalletInfo();
        }, 30000);
        return () => clearInterval(interval);
    }, [fetchBalance, fetchWalletInfo]);

    useEffect(() => {
        if (stakedAmount <= 0) return;

        const rewardRatePerSecond = (stakedAmount * 0.012) / (7 * 24 * 60 * 60);
        const interval = setInterval(() => {
            setAccumulatedRewards(prev => prev + rewardRatePerSecond);
        }, 1000);

        return () => clearInterval(interval);
    }, [stakedAmount]);

    const stakeUSDT = async (amount) => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            toast.error('Invalid amount');
            return false;
        }

        if (numAmount > parseFloat(usdtBalance)) {
            toast.error('Insufficient token amount');
            return false;
        }

        setIsLoading(true);
        try {
            toast.info('Initiating internal staking...');

            const result = await api.post('/wallet/stake-internal', { amount: numAmount }, {
                showSuccessToast: true
            });

            if (result.status === 200) {
                setStakedAmount(prev => prev + numAmount);
                setUsdtBalance(prev => (parseFloat(prev) - numAmount).toString());
                fetchWalletInfo(); // Refresh both balances
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error staking tokens:', error);
            toast.error(error.message || 'Staking failed');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const claimRewards = () => {
        if (accumulatedRewards <= 0) {
            toast.info('No rewards to claim');
            return false;
        }

        const rewardsToClaim = accumulatedRewards;
        setTotalEarned(prev => prev + rewardsToClaim);
        setAccumulatedRewards(0);
        toast.success(`Successfully claimed ${rewardsToClaim.toFixed(4)} GOLD`);
        return true;
    };

    return (
        <WalletContext.Provider
            value={{
                usdtBalance: usdtBalance,
                rawUsdtBalance: usdtBalance,
                stakedAmount,
                accumulatedRewards,
                totalEarned,
                isLoading,
                stakeUSDT,
                claimRewards,
                refreshBalance: () => {
                    fetchBalance();
                    fetchWalletInfo();
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
