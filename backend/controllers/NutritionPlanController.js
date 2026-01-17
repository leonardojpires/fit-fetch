import db from "../models/index.mjs";
import { generateNutritionPlanWithAI, validateFoodsInPlan } from "../services/groqNutritionService.js";

const { PlanoAlimentacao, Alimento, AlimentosPlano } = db;

class NutritionPlanController {
  static errorMessage = "Erro interno do servidor";
  static async getUserPlans(req, res) {
    try {
      const userId = req.user.id;

      const plans = await PlanoAlimentacao.findAll({
        where: { user_id: userId, is_saved: true },
        include: [
          {
            model: Alimento,
            as: "alimentos",
            through: { attributes: ["quantity"] },
          },
        ],
        order: [["created_at", "DESC"]],
      });

      return res.status(200).json({ plans });
    } catch (err) {
      console.error("Erro ao buscar planos:", err);
      return res.status(500).json({ message: NutritionPlanController.errorMessage });
    }
  }

  static async getPlanById(req, res) {
    try {
      const { id } = req.params;

      const plan = await PlanoAlimentacao.findByPk(id, {
        include: [
          {
            model: Alimento,
            as: "alimentos",
            through: { attributes: ["quantity"] },
            attributes: ['id', 'name', 'calories', 'protein', 'carbs', 'fiber', 'fat', 'serving_size'],
          },
        ],
      });

      if (!plan)
        return res
          .status(404)
          .json({ message: "Plano de nutrição não encontrado!" });

      // Retornar os valores armazenados na BD (não recalcular)
      return res.status(200).json({
        plan: plan.toJSON(),
      });
    } catch (err) {
      console.error("Erro ao buscar plano:", err);
      return res.status(500).json({ message: NutritionPlanController.errorMessage });
    }
  }

  static async saveNutritionPlan(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const plan = await PlanoAlimentacao.findOne({
        where: { id, user_id: userId },
      });

      if (!plan)
        return res
          .status(404)
          .json({ message: "Plano de nutrição não encontrado!" });

      const newSavedState = !plan.is_saved;
      await plan.update({ is_saved: newSavedState });

      const message = newSavedState
        ? "Plano de nutrição guardado com sucesso!"
        : "Plano de nutrição removido dos guardados com sucesso!";

      return res.status(200).json({
        message,
        plan,
        is_saved: newSavedState,
      });
    } catch (err) {
      return res.status(500).json({ message: NutritionPlanController.errorMessage });
    }
  }

  static async deleteNutritionPlan(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const plan = await PlanoAlimentacao.findOne({
        where: { id, user_id: userId },
      });

      if (!plan)
        return res
          .status(404)
          .json({ message: "Plano de nutrição não encontrado!" });

      await AlimentosPlano.destroy({
        where: { plano_id: id },
      });

      await plan.destroy();

      return res
        .status(200)
        .json({ message: "Plano de nutrição eliminado com sucesso!" });
    } catch (err) {
      return res.status(500).json({ message: NutritionPlanController.errorMessage });
    }
  }

  /* -- AI METHODS -- */

  /**
   * Handler for chatting with the AI nutrition assistant
   * Receives user message, sends it to GROQ AI service, validates the response,
   * and returns a formatted nutrition plan proposal
   *
   * 
   * @param {Object} req - Express request object
   * @param {string} req.body.message - The user's message describing their nutrition goals
   * @param {Array} req.body.conversationHistory - Array of previous messages in the chat (for context)
   * @param {Object} res - Express response object
   */
  static async chatWithNutritionAi(req, res) {
    try {
      // Extract the user's message and conversation history from the request body
      const { message, conversationHistory } = req.body;

      // Validate that the message is not empty
      // This prevents sending blank requests to the AI service (waste of resources)
      if (!message || message.trim() === "")
        return res
          .status(400)
          .json({ message: "A mensagem não pode estar vazia!" });

      /**
       * Call the GROQ AI service to generate a nutrition plan
       * The service will:
       * 1. Fetch all foods from the database
       * 2. Create a system prompt with the food list as context
       * 3. Send the user message to GROQ API
       * 4. Parse the AI response into a structured JSON format
       * 
       * Returns: { message: "conversational response", plan: { ...structured plan data } }
       */
      const aiResponse = await generateNutritionPlanWithAI(
        message,
        conversationHistory || []
      );

      // If the AI is just asking questions (no plan yet), return immediately
      // This allows conversational flow before generating the actual plan
      if (!aiResponse.plan) {
        return res.status(200).json({
          message: aiResponse.message,
          plan: null,
          isValid: true,
        });
      }

      /**
       * Validate that all foods suggested by the AI exist in the database
       */
      console.log("Validando alimentos do plano...");
      console.log("Estrutura do aiResponse.plan:", JSON.stringify(aiResponse.plan, null, 2));
      
      const validationResult = await validateFoodsInPlan(aiResponse);
      
      console.log("Resultado da validação:", validationResult);

      // If validation fails, return error with list of invalid foods
      // This allows the frontend to inform the user which foods are not available
      if (!validationResult.isValid) {
        console.warn("Alimentos inválidos:", validationResult.invalidFoods);
        // PERMITIR o plano mesmo com alimentos inválidos (com aviso)
        return res.status(200).json({
          message: aiResponse.message + " (Nota: alguns alimentos podem não existir na BD)",
          plan: aiResponse.plan,
          isValid: false,
          invalidFoods: validationResult.invalidFoods
        });
      }

      // If validation passes, return the AI response
      return res.status(200).json({
        message: aiResponse.message,
        plan: aiResponse.plan,
        isValid: true,
      });
    } catch (err) {
      console.error("Erro ao chamar AI:", err);
      return res.status(500).json({ message: NutritionPlanController.errorMessage });
    }
  }

  /**
   * Creates and saves a nutrition plan from AI-generated data
   *
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.body.plan - The complete nutrition plan object from AI
   * @param {string} req.body.plan.plan_name - Name of the plan (e.g., "Bulking Plan")
   * @param {string} req.body.plan.description - Plan description
   * @param {Array} req.body.plan.meals - Array of meals with foods
   * @param {Object} req.user - Current authenticated user (from middleware)
   * @param {string} req.body.message - Optional: original message from user
   * @param {Object} res - Express response object
   */
  static async createPlanFromAI(req, res) {
    // Initialize transaction variable (will be used for rollback if needed)
    let transaction;
    try {
      console.log("🔵 createPlanFromAI - Request body:", JSON.stringify(req.body, null, 2));
      console.log("🔵 User:", req.user);
      
      // START TRANSACTION: All database operations below will be atomic
      // Atomic means: either ALL succeed and are committed, or ALL fail and are rolled back
      // This prevents partial data (e.g., plan created but no foods linked)
      transaction = await db.sequelize.transaction();

      // Destructure the incoming data from the request body
      const { plan, message } = req.body;
      // Extract user ID from authenticated user (req.user is populated by middleware)
      const userId = req.user.id;

      console.log("🔵 Plan structure:", {
        hasPlan: !!plan,
        hasMeals: !!plan?.meals,
        mealsCount: plan?.meals?.length,
        mealsStructure: plan?.meals?.[0]
      });

      /**
       * Validate that the incoming plan data is valid
       * Checks:
       * - plan object exists
       * - plan.meals array exists
       * - plan.meals is not empty
       */
      if (!plan || !plan.meals || plan.meals.length === 0) {
        console.error("❌ Plano inválido");
        return res.status(400).json({ message: "Plano inválido!" });
      }

      /**
       * CREATE the main nutrition plan record in the database
       * 
       * Fields explanation:
       * - user_id: Links this plan to the authenticated user
       * - name: Display name of the plan
       * - description: Text describing the plan
       * - is_saved: Boolean flag (false = temporary, can be toggled to true)
       * - calories/proteins/carbs/fibers/fats: Nutritional totals from AI response
       * 
       * { transaction } parameter: ensures this operation is part of the transaction
       * If anything fails later, this insert will be rolled back automatically
       */
      const newPlan = await PlanoAlimentacao.create(
        {
          user_id: userId,
          name: plan.name || "Plano de Nutrição",
          description: plan.description || message || null,
          is_saved: true,
          calories: plan.total_calories || null,
          total_proteins: plan.total_proteins || null,
          total_carbs: plan.total_carbs || null,
          total_fibers: plan.total_fibers || null,
          total_fats: plan.total_fats || null,
        },
        { transaction } // All changes in this transaction
      );

      /**
       * POPULATE the plan with foods
       * 
       * This nested loop structure processes:
       * plan.meals = [{ meal_type: "breakfast", foods: [...] }, ...]
       *
       * For each meal, we iterate through all foods in that meal
       * For each food, we:
       * 1. Find the food in the Alimentos (foods) table by name
       * 2. Create a link in AlimentosPlano join table with the quantity
       * 
       * Why a join table? Because of many-to-many relationship:
       * - One plan can have many foods
       * - One food can be in many plans
       */
      if (plan.meals && Array.isArray(plan.meals)) {
        // Loop through each meal in the plan
        for (const meal of plan.meals) {
          // Check if this meal has foods array
          if (meal.foods && Array.isArray(meal.foods)) {
            // Loop through each food in this meal
            for (const food of meal.foods) {
              /**
               * LOOKUP: Find the food in the database by its name
               * This validates that the food actually exists
               * (Should be already validated by validateFoodsInPlan, but double-check)
               */
              const alimento = await Alimento.findOne({
                where: { name: food.name },
              });

              /**
               * Only create the relationship if food exists
               * This prevents broken references in the join table
               */
              if (alimento) {
                /**
                 * CREATE a record in AlimentosPlano join table
                 * 
                 * This links:
                 * - plano_id: the plan we just created
                 * - alimento_id: the food from the database
                 * - quantity: how many grams of this food
                 * 
                 * Example: "100g of Chicken Breast in this plan"
                 */
                await AlimentosPlano.create(
                  {
                    plano_id: newPlan.id, // Reference to the plan we just created
                    alimento_id: alimento.id, // Reference to the existing food
                    quantity: parseInt(food.quantity) || 1, // Quantity in grams (default 1 if not provided)
                  },
                  { transaction } // Part of the same transaction
                );
              }
            }
          }
        }
      }

      /**
       * COMMIT the transaction
       * This confirms all database operations were successful
       * All changes are now permanently saved to the database
       */
      await transaction.commit();

      /**
       * RETRIEVE the complete plan with all associated foods
       * This ensures we return fresh data that reflects what was actually saved
       * 
       * The 'include' clause performs a JOIN operation to fetch related foods
       * 'as: alimentos' means we access foods via plan.alimentos
       * 'through: { attributes: [...] }' specifies what data from the join table to include
       */
      const completePlan = await PlanoAlimentacao.findByPk(newPlan.id, {
        include: [
          {
            model: Alimento,
            as: "alimentos",
            through: { attributes: ["quantity"] }, // Only include quantity from join table
          },
        ],
      });

      /**
       * CALCULATE dynamic macros
       * 
       * This method sums up all foods in the plan and their quantities
       * to calculate total calories, proteins, carbs, etc.
       * 
       * We pass completePlan.alimentos (the foods array) to the helper method
       */
      const macros = NutritionPlanController.calculateMacros(completePlan.alimentos);

      /**
       * RETURN the complete plan to the client
       * 
       * Status 201 = CREATED (indicates a new resource was successfully created)
       * We combine the plan data with calculated macros
       */
      return res.status(201).json({
        message: "Plano de nutrição criado com sucesso!",
        plan: {
          ...completePlan.toJSON(), // Spread the plan data
          ...macros, // Spread the calculated macros (overwrites any stored values)
        },
      });
    } catch (err) {
      /**
       * ERROR HANDLING with transaction rollback
       * 
       * If any error occurs during the creation process:
       * 1. Check if transaction exists (was started)
       * 2. Rollback all changes made during this transaction
       * 3. Log the error for debugging
       * 4. Return error response to client
       * 
       * This ensures we never have partial data saved
       */
      if (transaction) {
        try {
          // Attempt to rollback the transaction
          // This undoes ALL database changes made during this operation
          await transaction.rollback();
        } catch (rollbackErr) {
          // If rollback itself fails, log it (rare but possible)
          console.error("Erro ao reverter a transação: ", rollbackErr);
        }
      }
      // Log the original error for debugging
      console.error("❌ ERRO em createPlanFromAI:");
      console.error("   Message:", err.message);
      console.error("   Stack:", err.stack);
      console.error("   Full error:", err);
      // Return generic error to client
      return res.status(500).json({ message: NutritionPlanController.errorMessage });
    }
  }

  /* -- HELPER METHODS -- */

  /**
   * CALCULATES the total macronutrient values for a nutrition plan
   * 
   * This is the KEY to avoiding storing redundant data in the database!
   * Instead of storing total_calories in the database, we calculate it dynamically
   * from the individual foods and their quantities
   * 
   * Algorithm:
   * 1. Initialize a macros object with all totals set to 0
   * 2. For each food in the plan, calculate: (food's macro * quantity / serving_size)
   * 3. Sum all these individual calculations
   * 4. Round to 2 decimal places for display
   * 
   * Why divide by serving_size?
   * - All foods in the database have macros defined per serving_size (usually 100g)
   * - If we add 150g of a food, we need to scale the macros: (macros * 150 / 100)
   * 
   * @param {Array} alimentos - Array of food objects with quantity data
   * @returns {Object} Object containing total_calories, total_proteins, etc.
   */
  static calculateMacros(alimentos) {
    /**
     * Initialize the macros accumulator object
     * All values start at 0, we'll sum them up as we process each food
     */
    const macros = {
      total_calories: 0,
      total_proteins: 0,
      total_carbs: 0,
      total_fibers: 0,
      total_fats: 0,
    };

    /**
     * Guard clause: if no foods provided, return empty macros
     * This prevents errors when processing empty plans
     */
    if (!alimentos || alimentos.length === 0) return macros;

    /**
     * ITERATE through each food in the plan
     * 
     * Each 'alimento' object has:
     * - alimento.calories, alimento.protein, etc. (per serving_size)
     * - alimento.serving_size (usually 100)
     * - alimento.AlimentosPlano.quantity (how much we're using in THIS plan)
     */
    alimentos.forEach((alimento) => {
      /**
       * EXTRACT the quantity for this food from the join table
       * 
       * Structure: alimento.AlimentosPlano.quantity
       * Why?
       * - alimentos is fetched via Sequelize include with join table
       * - Sequelize puts join table data in a property named after the join model
       * - In our case: AlimentosPlano → alimento.AlimentosPlano
       * - The quantity field is inside that object
       * 
       * Default to 1 if undefined (safety fallback)
       */
      const quantity = alimento.AlimentosPlano?.quantity || 1;

      /**
       * CALCULATE the scaling multiplier
       * 
       * All macros in the Alimentos table are per serving_size (e.g., 100g)
       * If we add 150g of chicken, the multiplier is 150/100 = 1.5
       * We then multiply all macros by 1.5
       * 
       * Example:
       * - Chicken: 165 calories per 100g
       * - We use 200g in the plan
       * - Multiplier: 200 / 100 = 2
       * - Calories for this food: 165 * 2 = 330 cal
       */
      const multiplier = quantity / alimento.serving_size;

      /**
       * ADD (accumulate) this food's macronutrients to the totals
       * Each line multiplies the food's macro by the multiplier
       * and adds it to the running total
       * 
       * macros.total_calories += (100 * 2) adds 200 calories
       * macros.total_calories += (50 * 1.5) adds 75 more calories
       * etc.
       */
      macros.total_calories += alimento.calories * multiplier;
      macros.total_proteins += alimento.protein * multiplier;
      macros.total_carbs += alimento.carbs * multiplier;
      macros.total_fibers += alimento.fiber * multiplier;
      macros.total_fats += alimento.fat * multiplier;
    });

    /**
     * ROUND all values to 2 decimal places
     * 
     * Why?
     * - Floating point arithmetic can result in long decimals: 2800.0000000001
     * - We want clean display values: 2800.00
     * 
     * Algorithm: Math.round(value * 100) / 100
     * Example: Math.round(2800.1234 * 100) / 100 = Math.round(280012.34) / 100 = 280012 / 100 = 2800.12
     */
    Object.keys(macros).forEach((key) => {
      macros[key] = Math.round(macros[key] * 100) / 100;
    });

    /**
     * RETURN the final macros object with all totals calculated and rounded
     * 
     * Example output:
     * {
     *   total_calories: 2800.00,
     *   total_proteins: 180.50,
     *   total_carbs: 320.00,
     *   total_fibers: 25.00,
     *   total_fats: 75.00
     * }
     */
    return macros;
  }
}

export default NutritionPlanController;
