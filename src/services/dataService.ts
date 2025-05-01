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
  // Initialize both states to 0
  let learnt = 0;
  let revised = 0;

  // Update the state based on `user_subtopic_state`
  if (record.user_subtopic_state === "Learnt") {
    learnt = 1;
  } else if (record.user_subtopic_state === "Revised") {
    revised = 1;
  } else if (record.user_subtopic_state === "Learnt and Revised") {
    learnt = 1;
    revised = 1;
  }

  // Push the subtopic with the correct learnt and revised states
  subjectMap[subjectId].subtopics.push({
    id: record.subtopic_id,
    name: record.subtopic_name,
    description: record.description,
    learnt: learnt,
    revised: revised,
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

  return (data ?? []).map((board) => ({
    id: board.id,
    name: board.name,
  }));
};


export const addUserSubject = async (
  userId: string,
  subjectId: string
): Promise<any> => { // You can replace `any` with a more specific type if possible
  const { data, error } = await supabase
    .from("user_subjects")
    .insert([{ user_id: userId, subject_id: subjectId}]);

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

export const fetchSubtopicsForSubject = async (subjectId: string) => {
  const { data, error } = await supabase
    .from("subtopics")
    .select("id, name, category, description")
    .eq("subject_id", subjectId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const addEvent = async (userId: string, title: string, type: string, description: string, eventdate: date) => {
  // Check if an event with the same title already exists
const { data: existingEvent, error: fetchError } = await supabase
  .from("events")
  .select("id")
  .eq("title", title) // Match the title
  .single(); // Get a single row if exists

if (fetchError) {
  // Handle any error that occurred during the fetch operation
  console.error("Error fetching event:", fetchError);
  return;
}
let eventId: string | undefined;
// If an event with the same title doesn't exist, insert a new one
if (!existingEvent) {
 // Insert the event into the "events" table
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .insert([{ title, description, type }])
    .select("id")  // Return the event_id after insertion

  if (eventError) {
    console.error("Failed to add event:", eventError);
    throw eventError; // Propagate the error for handling at a higher level
  }

  // Extract the event_id from the inserted event data
   eventId = eventData?.[0]?.id;
}
  else { eventId = existingEvent.id}
  if (!eventId) {
    console.error("Failed to retrieve event_id from the inserted event.");
    throw new Error("Event insertion failed. No event_id returned.");
  }

  // Insert the event into the "user_events" table
  const { data: userEventData, error: userEventError } = await supabase
    .from("user_events")
    .insert([{ event_id: eventId, user_id: userId, event_date: eventdate }]);

  if (userEventError) {
    console.error("Failed to add user event:", userEventError);
    throw userEventError; // Propagate the error for handling at a higher level
  }

  return { eventData, userEventData }; // Return both event data and user event data
};

export const removeEvent = async (
  userId: string,
  eventId: string
): Promise<void> => {
  const { error } = await supabase
    .from("user_events")
    .delete()
    .match({ user_id: userId, event_id: eventId });

  if (error) {
    console.error("Failed to remove user event:", error);
    
    throw error; // Propagate the error for handling at a higher level
  }
};

export const getAllLevels = async () => {
  const { data, error } = await supabase
    .from("level")
    .select("id, name, launched");

  if (error) {
    console.error("❌ Failed to fetch exam boards:", error);
    throw error; // Let the caller handle this
  }

  return (data ?? []).map((level) => ({
    id: level.id,
    name: level.name,
    launched: level.launched,
  }));
};

export const getAllCountries = async () => {
  const { data, error } = await supabase
    .from("raw_country")
    .select("id, name, launched");

  if (error) {
    console.error("❌ Failed to fetch exam boards:", error);
    throw error; // Let the caller handle this
  }

  return (data ?? []).map((country) => ({
    id: country.id,
    name: country.name,
    launched: country.launched,
  }));
};

export const addUserSubtopic = async (
  userId: string,
  subtopicId: string,
  state: number
) => {
    const learnt = state === 0 ? true : false;
  const revised = state === 1 ? true : false;
  const { error } = await supabase
    .from("user_subtopics")
    .insert([{ user_id: userId, subtopic_id: subtopicId, learnt, revised }]);

  if (error) throw error;
};
