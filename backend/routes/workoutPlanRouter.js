import { Router } from "express";
import WorkoutPlanController from '../controllers/WorkoutPlanController.js';
import verifyFirebaseToken from '../middleware/verifyFirebaseToken.middleware.js';
import attachUserFromDB from '../middleware/attachUserFromDB.middleware.js';

const workoutPlanRouter = Router();

workoutPlanRouter.get("/", WorkoutPlanController.getAllWorkoutPlans);
workoutPlanRouter.get("/:id", WorkoutPlanController.getWorkoutPlanById);

// Protected route: only authenticated users can generate workout plans
workoutPlanRouter.post("/generate", 
  verifyFirebaseToken, 
  attachUserFromDB, 
  WorkoutPlanController.generateWorkoutPlan
);

// Protected route: get user's own workout plans
workoutPlanRouter.get("/user/plans",
  verifyFirebaseToken,
  attachUserFromDB,
  WorkoutPlanController.getUserWorkoutPlans
);

export default workoutPlanRouter;
