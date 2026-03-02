import { queryRunner } from '../config/db.js';
import { serviceResponse } from '../utils/helper.js';

export const findUserById = async (id) => {
    try {
        const result = await queryRunner('SELECT * FROM users WHERE id = $1', [id]);
        if (result.length === 0) {
            return serviceResponse(false, 404, 'User not found');
        }
        return serviceResponse(true, 200, 'User found', result[0]);
    } catch (err) {
        return serviceResponse(false, 500, 'Error finding user', null, err.message);
    }
};

export const findUserByAddress = async (address) => {
    try {
        const result = await queryRunner('SELECT * FROM users WHERE wallet_address = $1', [address.toLowerCase()]);
        if (result.length === 0) {
            return serviceResponse(false, 404, 'User not found');
        }
        return serviceResponse(true, 200, 'User found', result[0]);
    } catch (err) {
        return serviceResponse(false, 500, 'Error finding user by address', null, err.message);
    }
};

export const getAllUsersForAdmin = async () => {
    try {
        const query = `
            SELECT 
                u.id, 
                u.wallet_address, 
                u.is_active, 
                u.is_blocked, 
                u.created_at,
                p.username,
                p.email,
                l.current_level_id as level,
                l.total_xp,
                r.wallet_address as referred_by_address
            FROM users u
            LEFT JOIN profile p ON u.id = p.user_id
            LEFT JOIN levels l ON u.id = l.id
            LEFT JOIN users r ON u.referred_by = r.id
            ORDER BY u.created_at DESC
        `;
        const result = await queryRunner(query);
        return serviceResponse(true, 200, 'Users fetched successfully', result);
    } catch (err) {
        return serviceResponse(false, 500, 'Error fetching users for admin', null, err.message);
    }
};
