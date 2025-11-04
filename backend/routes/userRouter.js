import { Router } from "express";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.middleware.js";
import attachUserFromDB from '../middleware/attachUserFromDB.middleware.js';
import UserController from "../controllers/UserController.js";
import verifyAdmin from './../middleware/verifyAdmin.js';


const userRouter = Router();

userRouter.post("/sync", verifyFirebaseToken, UserController.syncUser);
userRouter.get("/me", verifyFirebaseToken, attachUserFromDB, UserController.getCurrentUser);
userRouter.get("/all", verifyFirebaseToken, attachUserFromDB, verifyAdmin, UserController.getAllUsers);

export default userRouter;
