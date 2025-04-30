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
  .select(`
    id, 
    full_name, 
    email, 
    level:current_level(name)  // Join on the 'current_level' column to get the 'name' of the level
  `)
  .eq("id", userId)
  .maybeSingle();
  
  if (error) {
    console.error("Failed to fetch user info:", error);
    return null;
  }

  if (!data) {
    console.warn("No user found with ID:", userId);

    // Fallback to localStorage for name and email if present
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    // If no name or email are stored in localStorage, return default user info
    if (!name || !email) {
      console.warn("No name or email found in localStorage.");
      return { id: userId, name: "", email: "", level: "" };
    }

    // Return the fallback data from localStorage
    return {
      id: userId,
      name: name,
      email: email,
      level: "", // Level is not available from localStorage, so set it as empty
    };
  }

  return {
    id: data.id,
    name: data.full_name,
    email: data.email,
    level: data.level?.name || "",
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

    if (!data) {
    console.warn("No events found with ID:", userId);
    return null;
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
      key_examboard_level_subject (
        examboard (
          name
        )
      ),
      subjects (
        id,
        name,
        icon_color,
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

  if (!data) {
    console.warn("No subjects found for user:", userId);
    return null;
  }

  return data.map((record: any) => {
    const subject = record.subjects;
    const examBoardName = record.key_examboard_level_subject?.examboard?.name ?? "Unknown";

    return {
      id: subject.id,
      name: subject.name,
      iconColor: subject.icon_color,
      examBoard: examBoardName,
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


export const getAllSubjectNames = async () => {
  const { data, error } = await supabase
    .from("subjects")
    .select("id, name, category, launched, icon_color");

  if (error) {
    console.error("Failed to fetch subjects:", error);
    return [];
  }

  return data.map((subject) => ({
    id: subject.id,
    name: subject.name,
    category: subject.category,
    launched: subject.launched,
    iconColor: subject.icon_color,
  }));
};

export const getAllExamBoards = async () => {
  const { data, error } = await supabase
    .from("examboard")
    .select("id, name");

  if (error) {
    console.error("Failed to fetch exam boards:", error);
    return [];
  }

  return data.map((board) => ({
    id: board.id,
    name: board.name,
  }));
};
