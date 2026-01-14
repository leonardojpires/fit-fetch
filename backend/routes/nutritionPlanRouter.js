import { Router } from "express";
import verifyFirebaseToken from "./../middleware/verifyFirebaseToken.middleware.js";
import attachUserFromDB from "./../middleware/attachUserFromDB.middleware.js";
import NutritionPlanController from "../controllers/NutritionPlanController.js";

const nutritionPlanRouter = Router();

// Chat with AI to generate plan (protected)
nutritionPlanRouter.post(
  "/chat",
  verifyFirebaseToken,
  attachUserFromDB,
  NutritionPlanController.chatWithNutritionAi
);

// Create/save plan from AI response (protected)
nutritionPlanRouter.post(
  "/",
  verifyFirebaseToken,
  attachUserFromDB,
  NutritionPlanController.createPlanFromAI
);

// Get user's saved plans (protected)
nutritionPlanRouter.get(
  "/user/plans",
  verifyFirebaseToken,
  attachUserFromDB,
  NutritionPlanController.getUserPlans
);

// Get specific plan by ID (protected)
nutritionPlanRouter.get(
  "/:id",
  verifyFirebaseToken,
  attachUserFromDB,
  NutritionPlanController.getPlanById
);

// Toggle save/unsave plan (protected)
nutritionPlanRouter.post(
  "/:id/save",
  verifyFirebaseToken,
  attachUserFromDB,
  NutritionPlanController.saveNutritionPlan
);

// Delete plan (protected)
nutritionPlanRouter.delete(
  "/:id",
  verifyFirebaseToken,
  attachUserFromDB,
  NutritionPlanController.deleteNutritionPlan
);

export default nutritionPlanRouter;
