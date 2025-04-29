import { supabase } from "@/lib/supabaseClient";
import { User } from "@/types";

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

export const getUserInfo = async (userId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("users.id, users.full_name, users.email, level.name AS level") // Explicitly specify the table names
    .leftJoin("level", "users.current_level", "level.id") // Use leftJoin to specify the join condition
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch user info:", error);
    return null;
  }

  if (!data) {
    console.warn("No user found with ID:", userId);
    return null;
  }

  return {
    id: data.id,
    name: data.full_name,
    email: data.email,
    level: data.level || "",
  };
};

export const getUserEvents = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_events")
    .select("event_id, event_date, events(title, description, type)")
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }

  return data.map((item) => ({
    id: item.event_id,
    title: item.events.title,
    description: item.events.description,
    date: item.event_date,
    type: item.events.type,
  }));
};

export const getUserSubjects = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_subjects")
    .select(`
      subject_id,
      subjects (
        id,
        name,
        icon_color,
        key_examboard_level_subject (
          examboard (name)
        ),
        subtopics (
          id,
          name,
          description,
          user_subtopics (
            state
          )
        )
      )
    `)
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to fetch subjects:", error);
    return [];
  }

  return data.map((record: any) => {
    const subject = record.subjects;

    return {
      id: subject.id,
      name: subject.name,
      examBoard: subject.key_examboard_level_subject?.examboard?.name || "",
      iconColor: subject.icon_color,
      subtopics: subject.subtopics.map((sub: any) => {
        const states = sub.user_subtopics.map((us: any) => us.state);
        return {
          id: sub.id,
          name: sub.name,
          description: sub.description,
          learnt: states.includes("learnt") ? 1 : 0,
          revised: states.includes("revised") ? 1 : 0,
        };
      }),
    };
  });
};

