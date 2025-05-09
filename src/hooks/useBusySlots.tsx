import { useEffect, useState } from "react";
import { Event } from "@/types";
import { daysOfWeek, getFreeTimeSlots } from "@/utils/revision";

type UseBusySlotsResult = {
  busySlots: Event[];
  freeTimeSlots: Record<string, { start: string; end: string }[]>;
  setBusySlots: React.Dispatch<React.SetStateAction<Event[]>>;
  toggleBusySlot: (day: string, index: number, field: "title" | "start" | "end", value: string) => void;
  addBusySlot: (day: string) => void;
  removeBusySlot: (day: string, index: number) => void;
};

export const useBusySlots = (): UseBusySlotsResult => {
  const [busySlots, setBusySlots] = useState<Event[]>([]);
  const [freeTimeSlots, setFreeTimeSlots] = useState<Record<string, { start: string; end: string }[]>>({});
  
  useEffect(() => {
    const defaultBusySlots: Event[] = daysOfWeek.flatMap((day) => [
      { title: "School", day, start: "08:30", end: "15:30" },
      { title: "Sleep 1", day, start: "00:00", end: "07:00" },
      { title: "Sleep 2", day, start: "22:00", end: "23:59" },
    ]);
    setBusySlots(defaultBusySlots);
  }, []);

  // Recalculate free time whenever busy slots change
  useEffect(() => {
    const free = getFreeTimeSlots(busySlots);
    setFreeTimeSlots(free);
  }, [busySlots]);

  const toggleBusySlot = (day: string, index: number, field: "title" | "start" | "end", value: string) => {
    setBusySlots((prev) =>
      prev.map((slot, i) =>
        slot.day === day && index === prev.filter((s) => s.day === day).indexOf(slot)
          ? { ...slot, [field]: value }
          : slot
      )
    );
  };

  const addBusySlot = (day: string) => {
    setBusySlots((prev) => [
      ...prev,
      { title: "Busy", start: "17:00", end: "18:00", day },
    ]);
  };

  const removeBusySlot = (day: string, index: number) => {
    setBusySlots((prev) => {
      const filtered = prev.filter((slot) => slot.day === day);
      const toRemove = filtered[index];
      return prev.filter((slot) => slot !== toRemove);
    });
  };

  return {
    busySlots,
    freeTimeSlots,
    setBusySlots,
    toggleBusySlot,
    addBusySlot,
    removeBusySlot,
  };
};
