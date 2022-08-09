import { Router } from "express";
import dotenv from "dotenv"; 
import { getClickedUser } from "../controllers/accessOtherUsersController.js";
dotenv.config(); 

const router = Router();

router.get("/users/:id", getClickedUser);
router.get("/ranking",);

export default router;
