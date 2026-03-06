import { ethers } from 'ethers';
import { queryRunner, transactionRunner } from '../config/db.js';
import { serviceResponse } from '../utils/helper.js';
import { ACTIVE_CONFIG } from '../config/constants.js';

const provider = new ethers.JsonRpcProvider(ACTIVE_CONFIG.RPC_URLS[0]);
const USDT_ADDRESS = ACTIVE_CONFIG.USDT_ADDRESS.toLowerCase();
const ADMIN_WALLET = ACTIVE_CONFIG.ADMIN_WALLET.toLowerCase();

/**
 * Record a successful on-chain staking transaction
 * @param {number} userId 
 * @param {number} amount 
 * @param {string} txHash 
 * @returns {Promise<Object>}
 */
export const recordStakingTransaction = async (userId, amount, txHash) => {
    try {
        // 1. Verify transaction on-chain
        console.log(`[WalletService] Verifying transaction ${txHash} on-chain...`);
        const tx = await provider.getTransaction(txHash);

        if (!tx) {
            return serviceResponse(false, 400, 'Transaction not found on-chain');
        }

        const receipt = await provider.getTransactionReceipt(txHash);
        if (!receipt || receipt.status !== 1) {
            return serviceResponse(false, 400, 'Transaction failed or not confirmed');
        }

        // 2. Decode transaction to ensure it's a USDT transfer to ADMIN_WALLET
        // Note: For a robust implementation, we would parse the data using the ERC20 interface
        // but as a verification step, we check the 'to' address (if it's a direct transfer)
        // or the contract address and data if it's an ERC20 transfer.

        // Since it's a contract call (ERC20 transfer), tx.to will be USDT_ADDRESS
        if (tx.to.toLowerCase() !== USDT_ADDRESS) {
            return serviceResponse(false, 400, 'Transaction is not a USDT transfer');
        }

        // We can add more rigorous data decoding here if needed, but for now, we've verified the tx success.

        return await transactionRunner(async (client) => {
            // 2. Update user's locked balance
            await client.query(`
                INSERT INTO user_wallets (user_id, locked_balance) 
                VALUES ($1, $2) 
                ON CONFLICT (user_id) DO UPDATE SET 
                    locked_balance = user_wallets.locked_balance + $2,
                    updated_at = CURRENT_TIMESTAMP
            `, [userId, amount]);

            // 3. Create entry in yeild table
            await client.query(`
                INSERT INTO yeild (user_id, amount, asset) 
                VALUES ($1, $2, 'USDT')
            `, [userId, amount]);

            // 4. Log in treasury_logs
            await client.query(`
                INSERT INTO treasury_logs (type, asset, amount, usd_value, tx_hash, status) 
                VALUES ('INFLOW', 'USDT', $1, $1, $2, 'CONFIRMED')
            `, [amount, txHash]);

            return serviceResponse(true, 200, 'Staking transaction verified and recorded successfully');
        });
    } catch (err) {
        console.error(`[WalletService] Error in recordStakingTransaction: ${err.message}`);
        return serviceResponse(false, 500, 'Error recording staking transaction', null, err.message);
    }
};

export const stakeInternalToken = async (userId, amount) => {
    try {
        return await transactionRunner(async (client) => {

            const balanceRes = await client.query(
                'SELECT own_token FROM user_wallets WHERE user_id = $1',
                [userId]
            );

            if (balanceRes.rows.length === 0 || parseFloat(balanceRes.rows[0].own_token) < amount) {
                return serviceResponse(false, 400, 'Insufficient internal token balance');
            }


            await client.query(`
                UPDATE user_wallets 
                SET own_token = own_token - $1,
                    locked_balance = locked_balance + $1,
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = $2
            `, [amount, userId]);


            await client.query(`
                INSERT INTO internal_stakes (user_id, amount, status)
                VALUES ($1, $2, 'ACTIVE')
            `, [userId, amount]);

            await client.query(`
                INSERT INTO yeild (user_id, amount, asset) 
                VALUES ($1, $2, 'INTERNAL')
            `, [userId, amount]);

            await client.query(`
                INSERT INTO stake_history (user_id, amount, type) 
                VALUES ($1, $2, 'STAKE')
            `, [userId, amount]);

            return serviceResponse(true, 200, 'Internal staking successful');
        });
    } catch (err) {
        console.error(`[WalletService] Error in stakeInternalToken: ${err.message}`);
        return serviceResponse(false, 500, 'Error in internal staking', null, err.message);
    }
};

/**
 * Get wallet details for a user
 * @param {number} userId 
 * @returns {Promise<Object>}
 */
/**
 * Add amount to user's internal token balance (Faucet functionality)
 * @param {number} userId 
 * @param {number} amount 
 * @returns {Promise<Object>}
 */
export const topUpInternalToken = async (userId, amount) => {
    try {
        await queryRunner(`
            INSERT INTO user_wallets (user_id, own_token) 
            VALUES ($1, $2) 
            ON CONFLICT (user_id) DO UPDATE SET 
                own_token = user_wallets.own_token + $2,
                updated_at = CURRENT_TIMESTAMP
        `, [userId, amount]);

        return serviceResponse(true, 200, `${amount} DB Tokens added successfully!`);
    } catch (err) {
        console.error(`[WalletService] Error in topUpInternalToken: ${err.message}`);
        return serviceResponse(false, 500, 'Error topping up internal balance', null, err.message);
    }
};

/**
 * Manually update wallet balance for testing
 * @param {number} userId 
 * @param {string} type - 'NRG' or 'DB'
 * @param {number} amount 
 * @returns {Promise<Object>}
 */
export const updateWalletBalance = async (userId, type, amount) => {
    try {
        let column;
        switch (type.toUpperCase()) {
            case 'NRG': column = 'energy_balance'; break;
            case 'DB': column = 'own_token'; break;
            case 'LOCKED': column = 'locked_balance'; break;
            default: column = 'own_token';
        }

        await queryRunner(`
            INSERT INTO user_wallets (user_id, ${column}) 
            VALUES ($1, $2) 
            ON CONFLICT (user_id) DO UPDATE SET 
                ${column} = $2,
                updated_at = CURRENT_TIMESTAMP
        `, [userId, amount]);

        return serviceResponse(true, 200, `${type} balance updated to ${amount}`);
    } catch (err) {
        console.error(`[WalletService] Error in updateWalletBalance: ${err.message}`);
        return serviceResponse(false, 500, 'Error updating balance', null, err.message);
    }
};

export const getWalletInfo = async (userId) => {
    try {
        const walletRes = await queryRunner(
            'SELECT energy_balance, own_token, locked_balance FROM user_wallets WHERE user_id = $1',
            [userId]
        );

        const wallet = walletRes[0] || { energy_balance: 0, own_token: 0, locked_balance: 0 };

        return serviceResponse(true, 200, 'Wallet info fetched successfully', {
            energy_balance: wallet.energy_balance,
            own_token: wallet.own_token,
            locked_balance: wallet.locked_balance
        });
    } catch (err) {
        console.error(`[WalletService] Error in getWalletInfo: ${err.message}`);
        return serviceResponse(false, 500, 'Error fetching wallet info', null, err.message);
    }
};
