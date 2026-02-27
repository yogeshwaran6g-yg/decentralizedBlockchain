import { body } from 'express-validator';

export const updateProfileValidator = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isString().withMessage('Username must be a string')
        .trim(),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    body('phone_number')
        .optional()
        .isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'),
    body('dob')
        .optional()
        .isISO8601().withMessage('Invalid date format for DOB'),
    body('city')
        .optional()
        .isString().withMessage('City must be a string')
        .trim(),
    body('country')
        .optional()
        .isString().withMessage('Country must be a string')
        .trim()
];
