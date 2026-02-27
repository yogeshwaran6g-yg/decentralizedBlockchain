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
