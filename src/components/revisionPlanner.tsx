import { useState, useEffect, useMemo } from "react";
import { Subject, Event } from "@/types";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { enGB } from "date-fns/locale";
import { logError } from '@/utils/logError';
import { addEvent, getUserEvents } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { daysOfWeek } from "@/utils/revision";
import { useRevisionEvents } from "@/hooks/useRevisionEvents";
import { useBusySlots } from "@/hooks/useBusySlots";

// Configure the localizer
const locales = {
    "en-GB": enGB,
  };

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
  });

  import { addDays, nextDay, setHours, setMinutes, setSeconds } from "date-fns";

  export function formatTimeToDate(time: string, day: string): Date {
    const [hours, minutes] = time.split(":").map(Number);
  
    const daysMap: Record<string, number> = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
  
    const targetDay = daysMap[day];
    if (targetDay === undefined) {
      throw new Error(`Invalid day: ${day}`);
    }
  
    let base = new Date();
    base = nextDay(base, targetDay); // gets next occurrence of the day
    base = setHours(base, hours);
    base = setMinutes(base, minutes);
    base = setSeconds(base, 0);
  
    return base;
  }

  export default function RevisionPlanner({ subjects, userId, isOpen }: { subjects: Subject[]; userId: string; isOpen: boolean }) {
    if (!isOpen) return null;
    const { toast } = useToast();
    const { setUser } = useUser();
    const [dailyMinutes, setDailyMinutes] = useState(120);
    const [customBusySlots, setCustomBusySlots] = useState<Event[]>([]);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [isPlanSaved, setIsPlanSaved] = useState(false);
    const [revisionEvents, setRevisionEvents] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    const {
        busySlots,
        freeTimeSlots,
        addBusySlot,
        removeBusySlot,
        toggleBusySlot,
    } = useBusySlots();

    console.log("Hook given:", { userId, isOpen, subjects, dailyMinutes, freeTimeSlots });
    const {events, loading, saved, generateEvents, saveEvents} = useRevisionEvents(userId, isOpen, subjects, dailyMinutes, freeTimeSlots);

    
    const allEvents = useMemo(() => [
        ...events,
        ...busySlots.flatMap((slot) =>
          slot.days.map((day) => ({
            title: slot.title,
            start: formatTimeToDate(slot.start, day),
            end: formatTimeToDate(slot.end, day),
            allDay: false,
          }))
        )
      ], [events, busySlots]);
    
    const handleSave = async () => {
    setIsSaving(true);
    await saveEvents(events);
    toast({
        title: "Plan saved!",
        description: "Your revision plan has been saved successfully.",
        variant: "success",
    });
    setIsPlanSaved(true);
    setIsSaving(false);
    };

  return (
    <div className="space-y-4">
    <div>
        <label>How many minutes per day do you want to revise?</label>
        <input
        type="number"
        value={dailyMinutes}
        onChange={(e) => setDailyMinutes(Number(e.target.value))}
        className="ml-2 p-1 border rounded"
        />
        <button
        onClick={generateEvents}
        disabled={events.length > 0}
        className={`ml-4 px-4 py-2 rounded text-white ${
            events.length > 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
        >
        {events.length > 0 ? "Plan Generated" : "Generate Plan"}
        </button>
        <button
          onClick={handleSave}
          disabled={isPlanSaved}
          className={`ml-4 px-4 py-2 rounded text-white ${
            isPlanSaved
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isPlanSaved ? "Plan Saved" : "Save Plan"}
        </button>
    </div>

    <div>
  <h3 className="font-semibold mb-2">Busy Sections (e.g. school, sleep, meals)</h3>

  {busySlots.map((slot, idx) => (
    <div key={idx} className="flex flex-col gap-2 mb-4 border p-3 rounded">
      <input
        type="text"
        value={slot.title}
        onChange={(e) => toggleBusySlot(idx, "title", e.target.value)}
        className="p-1 border rounded"
      />

      <div className="flex gap-2 items-center">
        <label className="text-sm">Start:</label>
        <input
          type="time"
          value={slot.start}
          onChange={(e) => toggleBusySlot(idx, "start", e.target.value)}
          className="p-1 border rounded"
        />
        <label className="text-sm">End:</label>
        <input
          type="time"
          value={slot.end}
          onChange={(e) => toggleBusySlot(idx, "end", e.target.value)}
          className="p-1 border rounded"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {daysOfWeek.map((day) => (
          <label key={day} className="text-sm flex items-center gap-1">
            <input
              type="checkbox"
              checked={slot.days?.includes(day)}
              onChange={(e) => {
                const updatedDays = e.target.checked
                  ? [...(slot.days || []), day]
                  : (slot.days || []).filter((d) => d !== day);
                toggleBusySlot(idx, "days", updatedDays);
              }}
            />
            {day}
          </label>
        ))}
      </div>

      {!["School", "Sleep 1", "Sleep 2", "Meals"].includes(slot.title) && (
        <button
          onClick={() => removeBusySlot(idx)}
          className="text-red-600 text-sm mt-1"
        >
          Remove
        </button>
      )}
    </div>
  ))}

  <button
    onClick={() => addBusySlot()}
    className="text-blue-600 text-sm mt-2"
  >
    + Add Busy Time
  </button>
</div>

    <div className="h-[600px] mt-4">
        <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        views={["week", "day"]}
        step={30}
        timeslots={2}
        style={{ height: "100%" }}
        />
    </div>
    </div>
  );
}