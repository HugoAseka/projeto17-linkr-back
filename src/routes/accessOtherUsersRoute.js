import { Router } from "express";
import dotenv from "dotenv"; 
import { checkFollow, followFriend, followers, getClickedUser,getUserByName } from "../controllers/accessOtherUsersController.js";
import { checkAuth } from "../middlewares/authMiddleware.js";
dotenv.config(); 

const router = Router();

router.get("/users/:id", checkAuth, getClickedUser);
router.post("/other-users", checkAuth, getUserByName);
router.post("/check-follow", checkAuth, checkFollow);
router.post("/follow", checkAuth, followFriend);
router.get("/followers", checkAuth, followers );

export default router;
