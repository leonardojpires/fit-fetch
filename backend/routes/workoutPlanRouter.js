import { Router } from "express";
import WorkoutPlanController from '../controllers/WorkoutPlanController.js';
import verifyFirebaseToken from '../middleware/verifyFirebaseToken.middleware.js';
import attachUserFromDB from '../middleware/attachUserFromDB.middleware.js';

const workoutPlanRouter = Router();

workoutPlanRouter.get("/", WorkoutPlanController.getAllWorkoutPlans);

// Protected route: get user's own workout plans (MUST come before /:id)
workoutPlanRouter.get("/user/plans",
  verifyFirebaseToken,
  attachUserFromDB,
  WorkoutPlanController.getUserWorkoutPlans
);

// Protected route: only authenticated users can generate workout plans
workoutPlanRouter.post("/generate", 
  verifyFirebaseToken, 
  attachUserFromDB, 
  WorkoutPlanController.generateWorkoutPlan
);

workoutPlanRouter.post("/save/:id", 
  verifyFirebaseToken,
  attachUserFromDB,
  WorkoutPlanController.saveWorkoutPlan
);

workoutPlanRouter.get("/:id", WorkoutPlanController.getWorkoutPlanById);

export default workoutPlanRouter;
