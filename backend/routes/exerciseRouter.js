import { Router } from "express";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.middleware.js";
import attachUserFromDB from "../middleware/attachUserFromDB.middleware.js";
import verifyAdmin from './../middleware/verifyAdmin.js';
import ExerciseController from "../controllers/ExerciseController.js";

const exerciseRouter = Router();

exerciseRouter.get("/all", ExerciseController.getAllExercises);
exerciseRouter.get("/:id", ExerciseController.getExerciseById);
exerciseRouter.post("/add", verifyFirebaseToken, attachUserFromDB, verifyAdmin, ExerciseController.addExercise);
exerciseRouter.put("/:id", verifyFirebaseToken, attachUserFromDB, verifyAdmin, ExerciseController.updateExercise);
exerciseRouter.delete("/:id", verifyFirebaseToken, attachUserFromDB, verifyAdmin, ExerciseController.deleteExercise);

export default exerciseRouter;
