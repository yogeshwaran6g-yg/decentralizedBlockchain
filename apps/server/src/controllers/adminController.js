import * as userService from '../services/userService.js';
import { rtnRes } from '../utils/helper.js';

export const getUsers = async (req, res) => {
    const result = await userService.getAllUsersForAdmin();
    return rtnRes(res, result.status, result.message, result.data);
};
