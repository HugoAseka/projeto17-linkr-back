import { Router } from 'express';
import { signUp, login, logout } from "../controllers/authController.js";

const router = Router();

router.post('/sign-up', signUp);
router.post('/login', login);
router.delete('/logout',logout)

export default router;