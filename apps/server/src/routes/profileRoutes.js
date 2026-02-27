import express from 'express';
import * as profileController from '../controllers/profileController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { updateProfileValidator } from '../middleware/validators/profileValidator.js';
import { validate } from '../middleware/validatorMiddleware.js';

const router = express.Router();

router.get('/:user_id', authMiddleware, profileController.getProfile);
router.put('/', authMiddleware, updateProfileValidator, validate, profileController.updateProfile);
router.get('/', authMiddleware, profileController.getAllProfiles);

export default router;
