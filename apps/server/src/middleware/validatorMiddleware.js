import { validationResult } from 'express-validator';
import { rtnRes } from '../utils/helper.js';

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0].msg;
        return rtnRes(res, 400, firstError, { errors: errors.array() });
    }
    next();
};
