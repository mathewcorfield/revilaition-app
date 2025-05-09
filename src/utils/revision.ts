import { Event, Subject } from "@/types";

export const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function timeStringToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTimeString(mins: number): string {
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}`;
}

export function getFreeTimeSlots(busySlots: Event[]) {
  const freeTime: Record<string, { start: string; end: string }[]> = {};

  for (const day of daysOfWeek) {
    const dailyBusy = busySlots
      .filter((slot) => slot.day === day)
      .sort((a, b) => timeStringToMinutes(a.start) - timeStringToMinutes(b.start));

    const dailyFree: { start: string; end: string }[] = [];
    let current = 0;

    for (const slot of dailyBusy) {
      const startMin = timeStringToMinutes(slot.start);
      if (startMin > current) {
        dailyFree.push({ start: minutesToTimeString(current), end: slot.start });
      }
      current = Math.max(current, timeStringToMinutes(slot.end));
    }

    if (current < 24 * 60) {
      dailyFree.push({ start: minutesToTimeString(current), end: "23:59" });
    }

    freeTime[day] = dailyFree;
  }

  return freeTime;
}

export function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export function getSoonestExamDate(subject: Subject) {
  return subject.examDates.reduce((earliest, current) =>
    new Date(current.date) < new Date(earliest.date) ? current : earliest
  );
}

export function getDaysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

export function isValidDate(d: Date) {
  return d instanceof Date && !isNaN(d.getTime());
}
