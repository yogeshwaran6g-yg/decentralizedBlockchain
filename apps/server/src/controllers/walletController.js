import * as blockchainService from '../services/blockchainService.js';
import * as walletService from '../services/walletService.js';
import { rtnRes } from '../utils/helper.js';


export const getWalletBalance = async (req, res) => {
    try {
        // req.user is populated by authMiddleware
        const address = req.user?.wallet_address;

        if (!address) {
            return rtnRes(res, 400, "Wallet address not found in user session");
        }

        const balances = await blockchainService.getWalletBalance(address);
        const internalInfo = await walletService.getWalletInfo(req.user.id);

        const responseData = {
            address,
            ethBalance: balances.ethBalance,
            usdtBalance: balances.usdtBalance,
            ownTokenBalance: internalInfo.data?.own_token || 0,
            energyBalance: internalInfo.data?.energy_balance || 0,
            lockedBalance: internalInfo.data?.locked_balance || 0
        };

        return rtnRes(res, 200, "Wallet balance fetched successfully", responseData);
    } catch (err) {
        console.error("Error from getWalletBalance controller:", err);
        return rtnRes(res, 500, "Internal Error fetching balance");
    }
};


export const getTestEth = async (req, res) => {
    try {
        // Faucet logic for fake balance removed per user request
        return rtnRes(res, 200, "The internal faucet is currently disabled. Please use an official Polygon Amoy faucet for testnet POL/USDT.");
    } catch (err) {
        console.error("Error from getTestEth controller:", err);
        return rtnRes(res, 500, "Internal Error in faucet");
    }
};


export const recordStake = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { amount, txHash } = req.body;

        if (!userId) {
            return rtnRes(res, 400, "User ID not found in session");
        }

        if (!amount || !txHash) {
            return rtnRes(res, 400, "Amount and Transaction Hash are required");
        }

        const result = await walletService.recordStakingTransaction(userId, amount, txHash);

        return rtnRes(res, result.status, result.message, result.data);
    } catch (err) {
        console.error("Error from recordStake controller:", err);
        return rtnRes(res, 500, "Internal Error recording stake");
    }
};

export const stakeInternal = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { amount } = req.body;

        if (!userId) {
            return rtnRes(res, 400, "User ID not found in session");
        }

        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            return rtnRes(res, 400, "Valid stake amount is required");
        }

        const result = await walletService.stakeInternalToken(userId, parseFloat(amount));

        return rtnRes(res, result.status, result.message, result.data);
    } catch (err) {
        console.error("Error from stakeInternal controller:", err);
        return rtnRes(res, 500, "Internal Error staking tokens");
    }
};

export const getWalletInfo = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return rtnRes(res, 400, "User ID not found in session");
        }

        const result = await walletService.getWalletInfo(userId);
        return rtnRes(res, result.status, result.message, result.data);
    } catch (err) {
        console.error("Error from getWalletInfo controller:", err);
        return rtnRes(res, 500, "Internal Error fetching wallet info");
    }
};

export const topUpInternal = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { amount } = req.body;

        if (!userId) {
            return rtnRes(res, 400, "User ID not found in session");
        }

        const topUpAmount = parseFloat(amount || 1000); // Default 1000 if not specified
        const result = await walletService.topUpInternalToken(userId, topUpAmount);

        return rtnRes(res, result.status, result.message, result.data);
    } catch (err) {
        console.error("Error from topUpInternal controller:", err);
        return rtnRes(res, 500, "Internal Error topping up tokens");
    }
};

export const updateBalance = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { type, amount } = req.body;

        if (!userId) {
            return rtnRes(res, 400, "User ID not found in session");
        }

        if (!type || !['NRG', 'DB'].includes(type.toUpperCase())) {
            return rtnRes(res, 400, "Valid token type (NRG or DB) is required");
        }

        const newAmount = parseFloat(amount);
        if (isNaN(newAmount) || newAmount < 0) {
            return rtnRes(res, 400, "Valid non-negative amount is required");
        }

        const result = await walletService.updateWalletBalance(userId, type.toUpperCase(), newAmount);

        return rtnRes(res, result.status, result.message, result.data);
    } catch (err) {
        console.error("Error from updateBalance controller:", err);
        return rtnRes(res, 500, "Internal Error updating balance");
    }
};
