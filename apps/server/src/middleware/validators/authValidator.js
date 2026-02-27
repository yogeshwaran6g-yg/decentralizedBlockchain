import { body, query } from 'express-validator';

export const getNonceValidator = [
    query('address')
        .notEmpty().withMessage('Wallet address is required')
        .isLength({ min: 42, max: 42 }).withMessage('Invalid wallet address length')
        .matches(/^0x[a-fA-F0-9]{40}$/).withMessage('Invalid wallet address format')
];

export const verifyValidator = [
    body('address')
        .notEmpty().withMessage('Wallet address is required')
        .isLength({ min: 42, max: 42 }).withMessage('Invalid wallet address length')
        .matches(/^0x[a-fA-F0-9]{40}$/).withMessage('Invalid wallet address format'),
    body('signature')
        .notEmpty().withMessage('Signature is required')
        .isLength({ min: 132 }).withMessage('Invalid signature length')
];
