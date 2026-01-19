/**
 * PURPOSE: Communicate with the GROQ AI chatbot backend to generate nutrition recommendations
 * and meal plans based on user messages and conversation context.
 * 
 * WHY CREATED: The Nutrition page has a chat interface where users interact with an AI to get
 * personalized nutrition advice. This hook handles sending messages to the AI and receiving structured
 * responses (text + optional nutrition plan JSON).
 * 
 * NECESSITY: Encapsulates complex AI communication logic including:
 * - Firebase authentication token management
 * - HTTP POST requests with conversation history
 * - Loading states for "AI is thinking" indicators
 * - Error handling for network/API failures
 * 
 * WHERE USED: src/pages/Nutrition/index.jsx - called when user submits a message in the chat.
 * 
 * WITHOUT THIS HOOK: The Nutrition page would need to:
 * - Manually handle token retrieval on every message
 * - Duplicate fetch logic and error handling inline
 * - Manage loading states directly in the component
 * - Make the component bloated with non-UI logic, reducing maintainability
 */
import { useState } from "react";
import { auth } from "../../services/firebase.js";

export default function useChatNutrition() {
    // Loading state to show "AI is typing..." indicator while waiting for response
    const [loading, setLoading] = useState(false);
    // Error state to display connection/API errors to the user
    const [error, setError] = useState(null);

    /**
     * Sends a message to the GROQ AI backend and returns the AI response.
     * @param {string} message - The user's current message/question
     * @param {Array} conversationHistory - Previous messages for context (optional)
     * @returns {Promise<Object>} Response with 'reply' (text) and optional 'nutritionPlan' (JSON)
     */
    const chatWithAI = async (message, conversationHistory = []) => {
        setLoading(true); // Show loading indicator
        setError(null); // Clear previous errors

        try {
            // Get Firebase authentication token
            const token = await auth.currentUser.getIdToken();

            // POST request to the AI chat endpoint
            const response = await fetch("http://localhost:3000/api/nutrition-plans/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` // Required for protected route
                },
                body: JSON.stringify({
                    message, // Current user message
                    conversationHistory // Array of previous {role, content} objects for context
                })
            });

            const data = await response.json();

            // Throw error if response is not successful (4xx/5xx status codes)
            if (!response.ok) throw new Error(data.message || "Desculpa, algo correu mal. Tenta novamente!");

            console.log("Resposta da API:", data);
            
            // Return the AI response (contains 'message' and optionally 'plan')
            return data;
        } catch(err) {
            // Store error message to display in UI
            setError(err.message || "Desculpa, algo correu mal. Tenta novamente!");
            throw err; // Re-throw so calling component can also handle it
        } finally {
            // Always hide loading indicator when done
            setLoading(false);
        }
    }

    return { chatWithAI, loading, error };
}
