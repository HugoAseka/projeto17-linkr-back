import { Router } from "express";
import dotenv from "dotenv"; 
import { getClickedUser,getUserByName } from "../controllers/accessOtherUsersController.js";
import { checkAuth } from "../middlewares/authMiddleware.js";
dotenv.config(); 

const router = Router();

router.get("/users/:id", checkAuth, getClickedUser);
router.get("/other-users",getUserByName);

export default router;
