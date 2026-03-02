import pool from './src/config/db.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupDatabase = async () => {
    try {
        console.log('--- Database Setup Started ---');

        // Step 1: Create tables from db.sql
        console.log('Step 1: Creating/Updating tables from db.sql...');
        const sqlPath = path.join(__dirname, 'db.sql');
        const schemaSql = await fs.readFile(sqlPath, 'utf8');
        await pool.query(schemaSql);
        console.log('✓ Schema applied successfully.');

        // Step 2: Seed initial users
        console.log('Step 2: Seeding initial users...');
        const userCount = await pool.query('SELECT COUNT(*) FROM users');
        if (parseInt(userCount.rows[0].count) === 0) {
            const adminWallet = '0xf39Fd6e51aad88F6F4ce6aB8827219c761116117'; // Sample Hardhat address
            const referralCode = 'REF-ADMIN-01';

            const result = await pool.query(`
                INSERT INTO users (wallet_address, nonce, referral_code, role)
                VALUES ($1, $2, $3, $4)
                RETURNING id
            `, [adminWallet.toLowerCase(), '123456', referralCode, 'ADMIN']);

            const adminId = result.rows[0].id;
            console.log(`✓ Admin user created with ID: ${adminId}`);

            // Step 3: Seed Profile for the admin
            console.log('Step 3: Seeding profile...');
            await pool.query(`
                INSERT INTO profile (user_id, username, email, phone_number, dob, city, country)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [adminId, 'Super Admin', 'admin@dapp.io', '+100000000', '1990-01-01', 'Web3 City', 'Digital Realm']);
            console.log('✓ Admin profile seeded.');
        } else {
            console.log('✓ Users already exist, skipping user/profile seed.');
        }

        // Step 4: Seed initial levels
        console.log('Step 4: Seeding levels...');
        const levelCount = await pool.query('SELECT COUNT(*) FROM levels');
        if (parseInt(levelCount.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO levels (id, current_level_id, total_xp)
                VALUES ($1, $2, $3)
            `, [1, 1, 0]);
            console.log('✓ Initial level seeded.');
        } else {
            console.log('✓ Levels already exist, skipping level seed.');
        }

        // Step 5: Seed Treasury Logs
        console.log('Step 5: Seeding treasury logs...');
        const treasuryCount = await pool.query('SELECT COUNT(*) FROM treasury_logs');
        if (parseInt(treasuryCount.rows[0].count) === 0) {
            const logs = [
                ['INFLOW', 'ETH', 12.50, 33450.00, '0x8a9c...3fc', 'CONFIRMED'],
                ['PAYOUT', 'USDC', 5000.00, 5000.00, '0x14b9...f822', 'CONFIRMED'],
                ['INFLOW', 'USDT', 2500.00, 2500.00, '0x77d2...e1a2', 'CONFIRMED'],
                ['TRANSFER', 'ETH', 1.20, 3200.00, '0x33b1...a91d', 'CONFIRMED']
            ];

            for (const log of logs) {
                await pool.query(`
                    INSERT INTO treasury_logs (type, asset, amount, usd_value, tx_hash, status)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `, log);
            }
            console.log('✓ Treasury logs seeded.');
        } else {
            console.log('✓ Treasury logs already exist, skipping seed.');
        }

        console.log('--- Database Setup Successful ---');
        process.exit(0);
    } catch (err) {
        console.error('❌ ERROR during setup:', err.message);
        console.error('\nTips:');
        console.error('1. Ensure PostgreSQL is running.');
        console.error('2. Check DB_PASSWORD and other credentials in .env');
        process.exit(1);
    }
};

setupDatabase();
