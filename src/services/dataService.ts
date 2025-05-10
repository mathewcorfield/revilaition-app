import { supabase } from "@/lib/supabaseClient";
import { User, Subject } from "@/types";
import { logError } from '@/utils/logError';

const handleSupabaseError = (error: any, context: string) => {
  if (error) {
    logError(`[${context}] Supabase Error:`, error);
    throw error;
  }
};

// Helper function to handle insert operations
const insertData = async (table: string, data: object[]) => {
  const { data: insertedData, error } = await supabase
    .from(table)
    .insert(data)
    .select("id"); 

  handleSupabaseError(error, `Insert into ${table}`);
  return insertedData?.[0];
};

// Function to insert user interaction data into a 'user_interactions' table
export const insertInteraction = async (action: string, element: string, timestamp: string, user_id?: string) => {
  const actualUserId = user_id || "8179c018-a27a-40a8-bbfb-25d929b82272";
  const { error } = await supabase
    .from("user_interactions")
    .insert([{ action,      element,      timestamp,      user_id: actualUserId }])

  handleSupabaseError(error, `Insert into user_interactions`);
  return
};

export const getUserInfo = async (userId: string) => {
const { data, error } = await supabase
  .from("users")
  .select(`
    id, 
    full_name, 
    email, 
    current_level(name) 
  `)
  .eq("id", userId)
  .maybeSingle();
  
  if (error) {
    console.error("Failed to fetch user info:", error);
    return null;
  }

  return {
    id: userId,
    name: data?.full_name || "",
    email: data?.email || "",
    level: data?.current_level?.name || "",
  };
};

export const getUserEvents = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_events")
    .select("event_id, event_date, events(title, description, type)")
    .eq("user_id", userId);
  
    handleSupabaseError(error, "Fetch user events");

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
      level_id,
      level,
      examboard_id,
      examboard_name,
      subtopic_id,
      subtopic_name,
      description,
      user_subtopic_state
    `)
    .eq("user_id", userId);

    handleSupabaseError(error, "Fetch user subjects");

  if (!data) {
    logError(userId, "No user subjects found");
    return null;
  }

  const subjectMap: Record<string, any> = {};
  const examDatePromises: Record<string, Promise<any>> = {};

  for (const record of data) {
    const subjectId = record.subject_id;
    const level = record.level ?? "Unknown";
    const examBoard = record.examboard_name ?? "Unknown";

    if (!subjectMap[subjectId]) {
      subjectMap[subjectId] = {
        id: subjectId,
        name: record.subject_name,
        iconColor: record.icon_color,
        level,
        examBoard,
        subtopics: [],
        examDates: [],
      };
    }

    examDatePromises[subjectId] = getExamDates(record.level_id, record.examboard_id, subjectId);

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
  const examDateEntries = await Promise.all(
    Object.entries(examDatePromises).map(async ([subjectId, promise]) => {
      const dates = await promise;
      return [subjectId, dates];
    })
  );

  for (const [subjectId, dates] of examDateEntries) {
    subjectMap[subjectId].examDates = Array.isArray(dates) ? dates : [];;
  }

  return Object.values(subjectMap);
};


export const getAllSubjectNames = async () => {
  const { data, error } = await supabase
    .from("subjects")
    .select("id, name, category, launched, icon_color")
    .order('launched', { ascending: false }) // Launched first
    .order('name', { ascending: true }); // Then alphabetical

    handleSupabaseError(error, "Fetch subjects");

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
    .select("id, name, launched")
    .order('launched', { ascending: false }) // Launched first
    .order('name', { ascending: true }); // Then alphabetical

  handleSupabaseError(error, "Fetch examboards");

  return (data ?? []).map((board) => ({
    id: board.id,
    name: board.name,
    launched: board.launched,
  }));
};


export const addUserSubject = async (  userId: string,  subjectId: string): Promise<any> => { 
  const insertedData = await insertData("user_subjects", [{ user_id: userId, subject_id: subjectId}]);
  return insertedData;
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

export const addEvent = async (userId: string, title: string, type: string, description: string, eventdate: Date) => {
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
  const insertedData = await insertData("user_events",[{ event_id: eventId, user_id: userId, event_date: eventdate.toISOString() }]);
  return insertedData;
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
    .select("id, name, launched")
    .eq("launched", true)
    .order("name", { ascending: true });;

  handleSupabaseError(error, "Fetch levels");

  return (data ?? []).map((level) => ({
    id: level.id,
    name: level.name,
    launched: level.launched,
  }));
};

export const getAllCountries = async () => {
  const { data, error } = await supabase
    .from("country")
    .select("id, name, launched");

  handleSupabaseError(error, "Fetch countries");

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

export const getQuestionsForSubtopic = async (subtopicId: string) => {
  const { data, error } = await supabase
    .from("questions")
    .select("id, name, marks, mark_scheme, past")
    .eq("subtopic_id", subtopicId);

    handleSupabaseError(error, "Fetch quesstions for subtopic");  

  return data ?? [];
};

export async function  addQuestion(userId: string, name: string, marks: number, subtopic_id: string): Promise<string> {
  // Check if a question with the same name already exists
const { data: existingQuestion, error: fetchError } = await supabase
  .from("questions")
  .select("id")
  .eq("name", name) // Match on question name
  .maybeSingle(); // Get a single row if exists

if (fetchError) {
  // Handle any error that occurred during the fetch operation
  logError("Error fetching Question:", fetchError);
  throw fetchError;
}
let question_id : string | undefined;
// If an Question with the same name doesn't exist, insert a new one
if (!existingQuestion) {
 // Insert the Question into the "Questions" table
  const { data: QuestionData, error: QuestionError } = await supabase
    .from("questions")
    .insert([{ name, marks, subtopic_id }])
    .select("id")  // Return the Question_id after insertion

  if (QuestionError) {
    logError("Failed to add Question:", QuestionError);
    throw QuestionError; 
  }

  // Extract the Question_id from the inserted Question data
  question_id  = QuestionData?.[0]?.id;
}
  else { question_id  = existingQuestion.id}
  if (!question_id ) {
    logError("Failed to retrieve Question_id from the inserted Question.","no Question_id returned.");
    throw new Error("Question insertion failed. No Question_id returned.");
  }

  // Insert the Question into the "user_Questions" table
  const { error: userQuestionError } = await supabase
    .from("user_questions")
    .insert([{ question_id: question_id , user_id: userId }]);

  if (userQuestionError) {
    logError("Failed to add user Question:", userQuestionError);
    throw userQuestionError; 
  }

  return question_id; 
};

export const addUserAnswer = async (  user_id: string,  question_id: string, name:string): Promise<string> => { 
  const { data: answerData, error: answerError } = await supabase
    .from("user_answers")
    .insert([{ user_id, question_id, name}])
    .select("id") 

  if (answerError) {
    logError("Failed to add user answer:", answerError);
    throw answerError; 
  }
  const answer_id  = answerData?.[0]?.id;
  if (!answer_id) {
    throw new Error("No answer ID returned.");
  }
  return answer_id; 
};

export const updateUserAnswer = async (  answer_id: string,  evaluation: string, marks: number): Promise<void> => {
  const { error } = await supabase
    .from("user_answers")
    .update({ evaluation, marks})
    .eq("id", answer_id);

    handleSupabaseError(error, "Update user answers");
};

export const getExamDates = async (level: string, examBoard: string, subjectId: string): Promise<Event[]>  => {
  const { data, error } = await supabase
    .from("exam_dates")
    .select("id, exam_name, exam_timestamp")
    .eq("level_id", level)
    .eq("examboard_id", examBoard)
    .eq("subject_id", subjectId);

    handleSupabaseError(error, "Get exam dates");

    if (!data) return [];

    return data.map((row) => ({
      id: row.id,
      title: row.exam_name,
      date: row.exam_timestamp,
    }));
  };