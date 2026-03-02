import * as userService from '../services/userService.js';
import { rtnRes } from '../utils/helper.js';

export const getUsers = async (req, res) => {
    const result = await userService.getAllUsersForAdmin();
    return rtnRes(res, result.status, result.message, result.data);
};
export const getStats = async (req, res) => {
    const result = await userService.getDashboardStats();
    return rtnRes(res, result.status, result.message, result.data);
};

export const getTreasuryMetrics = async (req, res) => {
    const result = await userService.getTreasuryMetrics();
    return rtnRes(res, result.status, result.message, result.data);
};

export const getTreasuryLogs = async (req, res) => {
    const result = await userService.getTreasuryLogs();
    return rtnRes(res, result.status, result.message, result.data);
};
