/**
 * PURPOSE: Save a complete nutrition plan to the database with all meals, foods, and quantities.
 * 
 * WHY CREATED: When the AI generates a nutrition plan in the chat, the user needs a way to save it
 * to their profile. This hook handles the complex process of persisting the entire plan structure
 * (plan metadata + foods + quantities) to the backend using a transaction.
 * 
 * NECESSITY: Saving a nutrition plan requires:
 * - Creating a record in planos_alimentacao table
 * - Creating multiple records in alimentos_planos join table (for each food)
 * - Handling Firebase authentication
 * - Using database transactions to ensure data consistency (all-or-nothing)
 * - Managing loading/error states during the save operation
 * 
 * WHERE USED: src/pages/Nutrition/index.jsx - called when user clicks "Save Plan" after AI generates one.
 * 
 * WITHOUT THIS HOOK: The Nutrition page would need to:
 * - Manually construct complex POST request bodies
 * - Handle authentication token retrieval inline
 * - Manage loading state for the save button directly in component
 * - Duplicate this logic if plans need to be saved from multiple places
 * - Deal with transaction complexity at the UI layer (bad separation of concerns)
 */
import { useState } from "react";
import { auth } from "../../services/firebase.js";

export default function useCreateNutritionPlan() {
    // Loading state specific to the create operation (e.g., "Saving..." button state)
    const [creating, setCreating] = useState(false);
    // Error state to display save operation failures
    const [error, setError] = useState(null);

    /**
     * Creates and saves a complete nutrition plan to the database.
     * @param {Object} plan - The nutrition plan object with meals, foods, quantities, diet_type, etc.
     * @param {string} message - Optional user message that generated this plan (for context)
     * @returns {Promise<Object>} The created plan with ID and all associated data
     */
    const createPlan = async (plan, message = "") => {
        setCreating(true); // Show "Saving..." indicator on save button
        setError(null); // Clear any previous save errors

        try {
            // Get Firebase authentication token
            const token = await auth.currentUser.getIdToken();

            // POST request to create nutrition plan endpoint
            const response = await fetch("http://localhost:3000/api/nutrition-plans", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` // Required for protected route
                },
                body: JSON.stringify({
                    plan, // The complete nutrition plan object (meals array, diet_type, etc.)
                    message // Optional: the user message that triggered plan generation
                }),
            });

            const data = await response.json();

            // Throw error if save failed (validation errors, DB constraints, etc.)
            if (!response.ok) throw new Error (data.message || "Erro ao criar plano de nutrição.");

            // Return the created plan with database ID and all relationships
            return data;
        } catch(err) {
            // Store error message to display to user
            setError(err.message || "Erro ao criar plano de nutrição.");
            throw err; // Re-throw so calling component can handle it
        } finally {
            // Always hide loading indicator when done
            setCreating(false);
        }
    }
    
    return { createPlan, creating, error };
}
