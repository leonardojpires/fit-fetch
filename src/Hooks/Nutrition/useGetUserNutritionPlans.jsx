/**
 * PURPOSE: Fetch all saved nutrition plans for the authenticated user from the backend API.
 * 
 * WHY CREATED: The Nutrition page needs to display a list of the user's previously saved
 * nutrition plans. This hook encapsulates the fetching logic, authentication, and state management.
 * 
 * NECESSITY: Separates data fetching concerns from UI rendering, making the Nutrition component
 * cleaner and following React best practices (separation of concerns, reusability).
 * 
 * WHERE USED: src/pages/Nutrition/index.jsx - to display saved plans in the sidebar or history section.
 * 
 * WITHOUT THIS HOOK: The Nutrition page would need to:
 * - Manually manage loading/error states
 * - Handle Firebase token retrieval directly in the component
 * - Duplicate fetch logic if plans need to be accessed elsewhere
 * - Mix data fetching logic with UI rendering, violating separation of concerns
 */
import { useEffect, useState } from "react";
import { auth } from "../../services/firebase.js";

export default function useGetUserNutritionPlans() {
    // State to store the array of nutrition plans returned from the API
    const [plans, setPlans] = useState([]);
    // Loading state to show spinners/skeletons while fetching
    const [loading, setLoading] = useState(false);
    // Error state to display error messages if the fetch fails
    const [error, setError] = useState(null);

    // useEffect runs once on component mount to automatically fetch plans
    useEffect(() => {
        const fetchPlans = async () => {
            setLoading(true); // Show loading indicator
            setError(null); // Clear any previous errors
            try {
                // Get Firebase ID token for authentication
                const token = await auth.currentUser.getIdToken();

                // Call backend API to get user's saved nutrition plans
                const response = await fetch("http://localhost:3000/api/nutrition-plans/user/plans", {
                    headers: {
                        Authorization: `Bearer ${token}` // Include token for protected route
                    }
                });

                const data = await response.json();

                // If response is not OK, throw error with backend message
                if (!response.ok) throw new Error(data.message || "Erro ao obter planos de nutrição.");

                // Update plans state with fetched data (or empty array as fallback)
                setPlans(data.plans || []);
            } catch(err) {
                // Store error message in state to display to user
                setError(err.message || "Erro ao obter planos de nutrição.");
                throw err;
            } finally {
                // Always hide loading indicator when done (success or error)
                setLoading(false);
            }
        };

        // Only fetch if user is authenticated
        if (auth.currentUser) {
            fetchPlans();
        }
        
    }, []); // Empty dependency array = run only once on mount

    return { plans, loading, error };
}