import { supabase } from "@/lib/supabaseClient"; // import your supabase instance

// Function to insert user interaction data into a 'user_interactions' table
export const insertInteraction = async (
  action: string,
  element: string,
  timestamp: string,
  userID: string | null // Adding userID as a parameter
) => {
  try {
    // Insert the interaction data into Supabase
    const { data, error } = await supabase
      .from("user_interactions")
      .insert([
        {
          action, // e.g., "click"
          element, // e.g., "button"
          timestamp, // e.g., Date.now() or ISO 8601 format
          user_id: userID, // Storing the user ID from the logged-in session
        },
      ]);

    // If an error occurs, throw it
    if (error) throw error;

    // Return the inserted data
    return data;
  } catch (error) {
    // Log and rethrow error for debugging
    console.error("Error inserting interaction:", error);
    throw error;
  }
};
