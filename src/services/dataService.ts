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
    .from("user_subject_details")
    .select(`
      subject_id,
      subject_name,
      icon_color,
      examboard_name,
      subtopic_id,
      subtopic_name,
      description,
      user_subtopic_state
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

  const subjectMap: Record<string, any> = {};

  for (const record of data) {
    const subjectId = record.subject_id;

    if (!subjectMap[subjectId]) {
      subjectMap[subjectId] = {
        id: subjectId,
        name: record.subject_name,
        iconColor: record.icon_color,
        examBoard: record.examboard_name ?? "Unknown",
        subtopics: [],
      };
    }

    // Only push subtopics if present
    if (record.subtopic_id) {
      subjectMap[subjectId].subtopics.push({
        id: record.subtopic_id,
        name: record.subtopic_name,
        description: record.description,
        learnt: record.user_subtopic_state === "learnt" ? 1 : 0,
        revised: record.user_subtopic_state === "revised" ? 1 : 0,
      });
    }
  }

  return Object.values(subjectMap);
};


export const getAllSubjectNames = async () => {
  const { data, error } = await supabase
    .from("subjects")
    .select("id, name, category, launched, icon_color");

  if (error) {
    console.error("Failed to fetch subjects:", error);
    return [];
  }
  console.log("✅ Collected Subjects from Supabase:", data);
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
    console.error("❌ Failed to fetch exam boards:", error);
    throw error; // Let the caller handle this
  }

  console.log("✅ Collected Exam Boards from Supabase:", data);

  return (data ?? []).map((board) => ({
    id: board.id,
    name: board.name,
  }));
};


export const addUserSubject = async (
  userId: string,
  subjectId: string,
  examBoardId: string
): Promise<any> => { // You can replace `any` with a more specific type if possible
  const { data, error } = await supabase
    .from("user_subjects")
    .insert([{ user_id: userId, subject_id: subjectId, exam_board_id: examBoardId }]);

  if (error) {
    console.error("Failed to add user subject:", error);
    throw error; // Propagate the error for handling at a higher level
  }

  return data; // Return the data after inserting the subject
};
 
export const removeUserSubject = async (
  userId: string,
  subjectId: string
): Promise<void> => {
  const { error } = await supabase
    .from("user_subjects")
    .delete()
    .match({ user_id: userId, subject_id: subjectId });

  if (error) {
    console.error("Failed to remove user subject:", error);
    throw error; // Propagate the error for handling at a higher level
  }
};
