import { Router } from "express";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.middleware.js";
import attachUserFromDB from "../middleware/attachUserFromDB.middleware.js";
import verifyAdmin from '../middleware/verifyAdmin.js';
import FoodController from "../controllers/FoodController.js";

const foodRouter = Router();

foodRouter.get("/", verifyFirebaseToken, attachUserFromDB, FoodController.getAllFoods);
foodRouter.get("/:id", verifyFirebaseToken, attachUserFromDB, FoodController.getFoodById);
foodRouter.post("/add", verifyFirebaseToken, attachUserFromDB, verifyAdmin, FoodController.addFood);
foodRouter.put("/:id", verifyFirebaseToken, attachUserFromDB, verifyAdmin, FoodController.updateFood);
foodRouter.delete("/:id", verifyFirebaseToken, attachUserFromDB, verifyAdmin, FoodController.deleteFood);

export default foodRouter;
