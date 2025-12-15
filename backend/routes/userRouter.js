import { Router } from "express";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.middleware.js";
import attachUserFromDB from '../middleware/attachUserFromDB.middleware.js';
import UserController from "../controllers/UserController.js";
import verifyAdmin from './../middleware/verifyAdmin.js';
import uploadAvatar from "../middleware/uploadAvatar.js";

const userRouter = Router();

userRouter.post("/sync", verifyFirebaseToken, UserController.syncUser);
userRouter.get("/me", verifyFirebaseToken, attachUserFromDB, UserController.getCurrentUser);
userRouter.put("/me", verifyFirebaseToken, attachUserFromDB, uploadAvatar.single("avatar"), UserController.updateCurrentUser);
userRouter.get("/all", verifyFirebaseToken, attachUserFromDB, verifyAdmin, UserController.getAllUsers);
userRouter.get("/:userId", verifyFirebaseToken, attachUserFromDB, verifyAdmin, UserController.getUserById);
userRouter.post("/add", verifyFirebaseToken, attachUserFromDB, verifyAdmin, UserController.addUser);
userRouter.put("/:userId", verifyFirebaseToken, attachUserFromDB, verifyAdmin, UserController.updateUser);
userRouter.delete("/:userId", verifyFirebaseToken, attachUserFromDB, verifyAdmin, UserController.deleteUser);

export default userRouter;
