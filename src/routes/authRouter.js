import { Router } from 'express';
import { signUp, login, logout } from "../controllers/authController.js";
import { checkAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/sign-up', signUp);
router.post('/login', login);
router.delete('/logout', checkAuth, logout)

export default router;