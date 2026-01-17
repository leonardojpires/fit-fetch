import Groq from 'groq-sdk';
import Alimento from '../models/alimentos.js';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/**
 * List all available models from GROQ (for debugging)
 */
export async function listAvailableModels() {
  try {
    const models = await groq.models.list();
    return models.data;
  } catch (err) {
    return [];
  }
}

/**
 * Generates a nutrition plan using GROQ AI based on user input
 * 
 * @param {string} userMessage - The user's message describing their nutrition goals
 * @param {Array} conversationHistory - Array of previous conversation messages for context
 * @returns {Object} AI response with conversational message and structured plan
 */
export async function generateNutritionPlanWithAI(userMessage, conversationHistory = []) {
    try {
        // Fetch all available foods from the database to provide context to the AI
        const foods = await Alimento.findAll({
            attributes: ['id', 'name', 'protein', 'carbs', 'fiber', 'fat', 'calories', 'serving_size', 'unit', 'category']
        });

        // Format foods list in a compact format to reduce token consumption
        const foodsContext = foods
            .map(f => `${f.name}:${f.calories}cal,P${f.protein}g,C${f.carbs}g,Fb${f.fiber}g,F${f.fat}g`)
            .join('|');

        /**
         * System prompt that instructs the AI on how to behave
         * Contains:
         * - Available foods context (so AI knows what foods exist in our database)
         * - Instructions on how to structure the response
         * - JSON format specification
         */
        const systemPrompt = `És um assistente de nutrição. SEMPRE respondes em JSON com este formato:

{"message": "texto", "plan": null ou objeto}

ALIMENTOS: ${foodsContext}

Se precisas de info: {"message": "Qual é o teu objetivo?", "plan": null}
Se vais gerar plano: {"message": "Criei o teu plano!", "plan": {objeto completo}}

FORMATO DO PLANO (quando tiveres dados suficientes):
{"message": "Plano criado", "plan": {"plan_name": "Nome", "description": "Desc", "diet_type": "Cutting", "total_calories": 1500, "total_protein": 120, "total_carbs": 150, "total_fibers": 25, "total_fat": 40, "meals": [{"meal_type": "Pequeno-almoço", "foods": [{"name": "Ovo", "quantity": 100, "calories": 155, "protein": 13, "carbs": 1, "fat": 11}]}, {"meal_type": "Lanche da manhã", "foods": [...]}, {"meal_type": "Almoço", "foods": [...]}, {"meal_type": "Lanche da tarde", "foods": [...]}, {"meal_type": "Jantar", "foods": [...]}]}}

REGRAS:
- SEMPRE retorna JSON válido
- Usa apenas alimentos da lista
- 5 refeições quando gera plano
- Português de Portugal
- Se o user pedir plano, gera logo com plan != null`;

        /**
         * Build the messages array for the GROQ API
         */
        const messages = [
            { role: 'system', content: systemPrompt },
            ...conversationHistory.map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            { role: 'user', content: userMessage }
        ];

        // Temperature: 0.5 (balanced - garante JSON mas mantém coerência)
        // max_tokens: 2000 (garante espaço para JSON completo)
        // response_format: force JSON output
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: messages,
            temperature: 0.7,
            max_tokens: 2500,
            response_format: { type: "json_object" }
        });

        // Extract the AI's response text
        const responseContent = response.choices[0].message.content;

        /**
         * Try to parse JSON from the response
         * If found: Return structured plan
         * If not found: Return conversational response
         */
        let jsonMatch = responseContent.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
            // Se não encontra JSON, retorna apenas a mensagem como conversação
            return {
                message: responseContent,
                plan: null
            };
        }

        try {
            const parsedResponse = JSON.parse(jsonMatch[0]);
            
            // Se o JSON não tem 'message' ou 'plan', retorna como mensagem
            if (!parsedResponse.message && !parsedResponse.plan) {
                return {
                    message: responseContent,
                    plan: null
                };
            }
            
            // Se tem plano, valida a estrutura
            if (parsedResponse.plan) {
                const requiredPlanProps = ['plan_name', 'description', 'total_calories', 'total_protein', 'total_carbs', 'total_fat', 'meals'];
                const missingProps = requiredPlanProps.filter(prop => !(prop in parsedResponse.plan));
                
                if (missingProps.length > 0) {
                    console.warn(`Plano com propriedades em falta: ${missingProps.join(', ')}`);
                    return {
                        message: parsedResponse.message || "Plano criado com sucesso!",
                        plan: null
                    };
                }
                
                if (!Array.isArray(parsedResponse.plan.meals) || parsedResponse.plan.meals.length === 0) {
                    console.warn("Plano sem refeições");
                    return {
                        message: parsedResponse.message || "Plano criado com sucesso!",
                        plan: null
                    };
                }
            }
            
            return {
                message: parsedResponse.message || "Assistente de nutrição",
                plan: parsedResponse.plan || null
            };
        } catch (parseErr) {
            console.warn("Erro ao fazer parse JSON:", parseErr.message);
            // Se JSON é malformado, retorna tudo como mensagem
            return {
                message: responseContent,
                plan: null
            };
        }

    } catch (err) {
        console.error("Erro ao gerar plano com GROQ:", err);
        throw new Error(`Erro ao gerar plano: ${err.message}`);
    }
}

/**
 * Validates that all foods in the AI-generated plan exist in our database
 * This prevents data integrity issues when saving the plan
 * 
 * @param {Object} aiResponse - The AI response containing the nutrition plan
 * @returns {Object} Validation result: { isValid: boolean, invalidFoods: [] }
 */
export async function validateFoodsInPlan(aiResponse) {
    try {
        const invalidFoods = [];

        // Check if the response has the expected structure
        if (!aiResponse.plan || !aiResponse.plan.meals) {
            console.error("Estrutura inválida do plano:", aiResponse);
            return { isValid: false, invalidFoods: ["Estrutura do plano inválida"] };
        }

        /**
         * Collect all unique food names from the plan
         * Using a Set to automatically remove duplicates
         * (same food might appear in multiple meals)
         */
        const foodNamesInPlan = new Set();
        aiResponse.plan.meals.forEach(meal => {
            if (meal.foods && Array.isArray(meal.foods)) {
                meal.foods.forEach(food => {
                    foodNamesInPlan.add(food.name);
                });
            }
        });

        /**
         * OPTIMIZED: Check all foods in a single query instead of N queries
         * This reduces validation time from ~8 seconds to ~0.5 seconds
         */
        
        // Step 1: Process all food names (extract from parentheses if needed)
        const foodNamesArray = Array.from(foodNamesInPlan);
        const searchNames = foodNamesArray.map(foodName => {
            const extractedName = foodName.match(/\(([^)]+)\)/);
            return extractedName ? extractedName[1] : foodName;
        });

        // Step 2: Fetch ALL foods at once using WHERE IN (case-insensitive)
        const { Op } = await import('sequelize');
        const existingFoods = await Alimento.findAll({
            where: {
                [Op.or]: searchNames.map(name => ({
                    name: {
                        [Op.like]: `%${name}%`
                    }
                }))
            },
            attributes: ['name']
        });

        // Step 3: Create a Set of found food names (for O(1) lookup, case-insensitive)
        const foundFoodNamesLower = new Set(existingFoods.map(f => f.name.toLowerCase()));

        // Step 4: Check which foods are missing (case-insensitive)
        for (let i = 0; i < foodNamesArray.length; i++) {
            const originalName = foodNamesArray[i];
            const searchName = searchNames[i].toLowerCase();
            
            // Check if any found food name contains the search term
            let found = false;
            for (const dbFoodName of foundFoodNamesLower) {
                if (dbFoodName.includes(searchName) || searchName.includes(dbFoodName)) {
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                invalidFoods.push(originalName);
            }
        }

        // Return validation result
        if (invalidFoods.length > 0) {
            return {
                isValid: false,
                invalidFoods
            };
        }
        
        return {
            isValid: invalidFoods.length === 0,
            invalidFoods
        };
    } catch (err) {
        console.error("ERRO na validação de alimentos:", err);
        return { isValid: false, invalidFoods: ["Erro ao validar alimentos: " + err.message] };
    }
}
