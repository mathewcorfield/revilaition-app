import { useState, useEffect } from "react";
import { Subject, Event } from "@/types";
import { getUserEvents, addEvent } from "@/services/dataService";
import { logError } from "@/utils/logError";
import { daysOfWeek, getSoonestExamDate, getDaysUntil, timeStringToMinutes, isValidDate, shuffleArray } from "@/utils/revision";

export function useRevisionEvents(userId: string, isOpen: boolean, subjects: Subject[], dailyMinutes: number, freeTimeSlots: Record<string, { start: string; end: string }[]>) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen && !saved) {
      setLoading(true);
      getUserEvents(userId)
        .then(setEvents)
        .catch((err) => logError("Failed to fetch revision events", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const generateEvents = () => {
    try {
    const revisionEvents: Event[] = [];
    const today = new Date();
    const occupiedSlots = new Set<string>();
    const sortedSubjects = [...subjects].sort(
      (a, b) =>
        new Date(getSoonestExamDate(a).date).getTime() -
        new Date(getSoonestExamDate(b).date).getTime()
    );

    for (const subject of sortedSubjects) {
      const examDate = new Date(getSoonestExamDate(subject).date);
      const totalDays = getDaysUntil(getSoonestExamDate(subject).date);
      const totalRevisionMinutes = totalDays * dailyMinutes;
      const minutesPerSubject = Math.floor((totalRevisionMinutes * 0.9) / subjects.length);
      let remaining = minutesPerSubject;
      let current = new Date(today);
      const shuffledSubtopics = shuffleArray(subject.subtopics);
      let subtopicIndex = 0;

      while (remaining > 0 && current <= examDate) {
        const day = daysOfWeek[current.getDay() === 0 ? 6 : current.getDay() - 1];
        const freeSlots = freeTimeSlots[day] || [];

        for (const slot of freeSlots) {
          let slotStartMin = timeStringToMinutes(slot.start);
          const slotEndMin = timeStringToMinutes(slot.end);

          while (slotStartMin + 15 <= slotEndMin && remaining > 0) {
            const sessionDuration = Math.min(30, remaining, slotEndMin - slotStartMin);
            if (sessionDuration < 15) break;

            const startDate = new Date(current);
            startDate.setHours(Math.floor(slotStartMin / 60), slotStartMin % 60);
            const endDate = new Date(startDate);
            endDate.setMinutes(startDate.getMinutes() + sessionDuration);
            const slotKey = `${startDate.toISOString()}-${endDate.toISOString()}`;

            if (!isValidDate(startDate) || !isValidDate(endDate) || occupiedSlots.has(slotKey)) {
              slotStartMin += sessionDuration;
              continue;
            }

            const subtopic = shuffledSubtopics[subtopicIndex % shuffledSubtopics.length];
            revisionEvents.push({
              title: `Revise: ${subject.name} - ${subtopic.name}`,
              start: startDate.toISOString(),
              end: endDate.toISOString(),
            });

            occupiedSlots.add(slotKey);
            remaining -= sessionDuration;
            subtopicIndex++;
            slotStartMin += sessionDuration;
          }
        }
        current.setDate(current.getDate() + 1);
      }
    }

    setEvents(revisionEvents);
} catch (error) {
    logError("Error generating revision events", error);
  }
  };

  const saveEvents = async (events) => {
    try {
    for (const event of events) {
      await addEvent(userId, event.title, "Event", "Revision Plan Generated", event.start);
    }
    setSaved(true);
  
    } catch (error) {
        logError("Error generating revision events", error);
    }
};
  return { events, loading, saved, generateEvents, saveEvents };
}
