import { useEffect, useState } from "react";
import { Event } from "@/types";
import { daysOfWeek, getFreeTimeSlots } from "@/utils/revision";

type UseBusySlotsResult = {
  busySlots: Event[];
  freeTimeSlots: Record<string, { start: string; end: string }[]>;
  setBusySlots: React.Dispatch<React.SetStateAction<Event[]>>;
  toggleBusySlot: ( index: number, field: "title" | "start" | "end"| "days", value: string | string[]) => void;
  addBusySlot: (days: string[]) => void;
  removeBusySlot: (index: number) => void;
};

export const useBusySlots = (): UseBusySlotsResult => {
  const [busySlots, setBusySlots] = useState<Event[]>([]);
  const [freeTimeSlots, setFreeTimeSlots] = useState<Record<string, { start: string; end: string }[]>>({});
  
  useEffect(() => {
    const defaultBusySlots: Event[] = [
      {
        title: "Sleep 1",
        start: "00:00",
        end: "06:00",
        days: [...daysOfWeek],
      },
      {
        title: "Sleep 2",
        start: "22:00",
        end: "23:59",
        days: [...daysOfWeek],
      },
      {
        title: "School",
        start: "08:30",
        end: "15:30",
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
      {
        title: "Meals",
        start: "12:30",
        end: "13:30",
        days: [...daysOfWeek],
      },
    ];
    setBusySlots(defaultBusySlots);
  }, []);

  // Recalculate free time whenever busy slots change
  useEffect(() => {
    const free = getFreeTimeSlots(busySlots);
    setFreeTimeSlots(free);
  }, [busySlots]);

  const toggleBusySlot = (
    index: number,
    field: "title" | "start" | "end" | "days",
    value: string | string[]
  ) => {
    setBusySlots((prev) =>
      prev.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      )
    );
  };

  const addBusySlot = (days: string[] = ["Monday"]) => {
    setBusySlots((prev) => [
      ...prev,
      { title: "Busy", start: "17:00", end: "18:00", days },
    ]);
  };

  const removeBusySlot = (index: number) => {
    setBusySlots((prev) => prev.filter((_, i) => i !== index));
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
