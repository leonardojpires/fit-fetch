import { Router } from "express";
import WorkoutPlanController from './../controllers/WorkoutPlanController.js';

const workoutPlanRouter = Router();

workoutPlanRouter.post("/generate", WorkoutPlanController.generateWorkoutPlan);

export default workoutPlanRouter;
