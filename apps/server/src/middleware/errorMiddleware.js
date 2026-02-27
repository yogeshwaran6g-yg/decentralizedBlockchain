import { rtnRes } from '../utils/helper.js';

const errorHandler = (err, req, res, next) => {
    console.error(`[ErrorHandler] ${err.stack}`);
    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return rtnRes(res, status, message);
};

export default errorHandler;
