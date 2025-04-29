import { getUserInfo, getUserEvents, getUserSubjects } from "@/services/dataService.ts";
import { User } from "@/types";

export const getUserData = async (userId: string): Promise<User | null> => {
  if (!userId) return null;

  const [info, events, subjects] = await Promise.all([
    getUserInfo(userId),
    getUserEvents(userId),
    getUserSubjects(userId),
  ]);

  if (!info) return null;

  return {
    ...info,
    milestones: events.filter(e => e.type === "Milestone"),
    events: events.filter(e => e.type === "Event"),
    subjects,
  };
};
