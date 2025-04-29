import { useEffect, useState } from "react";
import { getUserInfo, getUserEvents, getUserSubjects } from "@/services/dataService.ts";
import { User } from "@/types";

export const getUserData = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);

      const [info, events, subjects] = await Promise.all([
        getUserInfo(userId),
        getUserEvents(userId),
        getUserSubjects(userId),
      ]);

      if (info) {
        setUser({
          ...info,
          milestones: events.filter(e => e.type === "milestone"),
          events: events.filter(e => e.type === "event"),
          subjects,
        });
      }

      setLoading(false);
    };

    fetchData();
  }, [userId]);

  return { user, loading };
};
