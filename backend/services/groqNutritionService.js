import Groq from 'groq-sdk';
import Alimento from '../models/alimentos.js';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

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

        // Format foods list as a human-readable string for the AI prompt
        // Each line contains: Food Name (Category): Nutritional values per serving
        const foodsContext = foods
            .map(f => `${f.name} (${f.category || 'Sem categoria'}): ${f.calories}cal, P:${f.protein}g, C:${f.carbs}g, F:${f.fat}g, Fibra:${f.fiber}g por ${f.serving_size}${f.unit || 'g'}`)
            .join('\n');

        /**
         * System prompt that instructs the AI on how to behave
         * Contains:
         * - Available foods context (so AI knows what foods exist in our database)
         * - Instructions on how to structure the response
         * - JSON format specification
         */
        const systemPrompt = `Tu és um assistente nutricional profissional português.

ALIMENTOS DISPONÍVEIS NA BASE DE DADOS:
${foodsContext}

INSTRUÇÕES CRÍTICAS:
1. Responde SEMPRE em Português de Portugal
2. Cria planos equilibrados baseados nos objetivos do utilizador
3. USA APENAS alimentos da lista acima - NÃO inventes alimentos!
4. Estrutura o plano com refeições (Pequeno-almoço, Almoço, Lanche, Jantar, Ceia)
5. Para cada alimento, inclui a quantidade em gramas
6. Calcula os macros totais do plano

RESPONDE SEMPRE em JSON com EXATAMENTE este formato:
{
  "message": "resposta conversacional explicando o plano",
  "plan": {
    "name": "Nome descritivo do plano",
    "description": "Descrição breve do objetivo",
    "diet_type": "Bulking/Cutting/Manutenção/Outro",
    "total_calories": número,
    "total_proteins": número,
    "total_carbs": número,
    "total_fibers": número,
    "total_fats": número,
    "meals": [
      {
        "meal_type": "Pequeno-almoço",
        "foods": [
          {
            "name": "Nome EXATO do alimento da lista",
            "quantity": 100,
            "calories": número,
            "protein": número,
            "carbs": número,
            "fat": número
          }
        ]
      }
    ]
  }
}`;

        /**
         * Build the messages array for the GROQ API
         * Structure:
         * 1. System message (instructions/context)
         * 2. Previous conversation messages (for context continuity)
         * 3. Current user message
         */
        const messages = [
            { role: 'system', content: systemPrompt },
            ...conversationHistory.map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            { role: 'user', content: userMessage }
        ];

        /**
         * Call GROQ API to generate the nutrition plan
         * 
         * Parameters:
         * - model: The AI model to use (Mixtral is good for structured outputs)
         * - messages: The conversation history + current message
         * - temperature: Controls randomness (0.7 = balanced creativity)
         * - max_tokens: Maximum length of response
         */
        const response = await groq.chat.completions.create({
            model: "mixtral-8x7b-32768",
            messages: messages,
            temperature: 0.7,
            max_tokens: 2000
        });

        // Extract the AI's response text
        const responseContent = response.choices[0].message.content;

        /**
         * Parse JSON from the AI response
         * The AI might include text before/after the JSON, so we use regex to extract it
         * Pattern: \{[\s\S]*\} matches any JSON object (including nested objects)
         */
        const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Nenhum JSON encontrado na resposta da IA");
        }

        // Parse the extracted JSON string into a JavaScript object
        const parsedResponse = JSON.parse(jsonMatch[0]);
        return parsedResponse;

    } catch (err) {
        // Log the error for debugging and re-throw with descriptive message
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
         * For each food name, check if it exists in the database
         * If not found, add to invalidFoods array
         */
        for (const foodName of foodNamesInPlan) {
            const foodExists = await Alimento.findOne({
                where: { name: foodName }
            });

            if (!foodExists) {
                invalidFoods.push(foodName);
            }
        }

        // Return validation result
        return {
            isValid: invalidFoods.length === 0,
            invalidFoods
        };
    } catch (err) {
        console.error("Erro ao validar alimentos:", err);
        return { isValid: false, invalidFoods: ["Erro ao validar alimentos"] };
    }
}