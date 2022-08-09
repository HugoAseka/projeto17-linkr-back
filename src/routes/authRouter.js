import { Router } from 'express';
import { signUp, login } from "../controllers/authController.js";

const router = Router();

router.post('/sign-up', signUp);
router.post('/login', login);

export default router;