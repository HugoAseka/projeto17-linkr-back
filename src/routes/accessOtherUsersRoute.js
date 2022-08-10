import { Router } from "express";
import dotenv from "dotenv"; 
import { getClickedUser,getUserByName } from "../controllers/accessOtherUsersController.js";
dotenv.config(); 

const router = Router();

router.get("/users/:id", getClickedUser);
router.get("/other_users",getUserByName);

export default router;
