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
import { daysOfWeek , formatTimeToDate } from "@/utils/revisionUtils";
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

    const {
        events, loading, saved, generateEvents, saveEvents
    } = useRevisionEvents(userId, isOpen, subjects, dailyMinutes, freeTimeSlots);

    
    const allEvents = useMemo(() => [...events, ...busySlots.map((slot) => ({
        title: slot.title,
        start: formatTimeToDate(slot.start, slot.day),
        end: formatTimeToDate(slot.end, slot.day),
        allDay: false,
      }))], [events, busySlots]);
    
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
        <h3 className="font-semibold">Busy Sections (e.g. clubs, work)</h3>
        {daysOfWeek.map((day) => {
          const daySlots = busySlots.filter((slot) => slot.day === day);
          return (
            <div key={day} className="mb-4">
              <h4 className="text-md font-semibold">{day}</h4>
              {daySlots.map((slot, idx) => (
                <div key={idx} className="flex flex-col gap-2 mb-2 border p-2 rounded">
                  <input
                    type="text"
                    value={slot.title}
                    onChange={(e) => toggleBusySlot(day, idx, "title", e.target.value)}
                    className="p-1 border rounded"
                  />
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={slot.start}
                      onChange={(e) => toggleBusySlot(day, idx, "start", e.target.value)}
                      className="p-1 border rounded"
                    />
                    <input
                      type="time"
                      value={slot.end}
                      onChange={(e) => toggleBusySlot(day, idx, "end", e.target.value)}
                      className="p-1 border rounded"
                    />
                    {slot.title !== "School" && slot.title !== "Sleep 1" && slot.title !== "Sleep 2" && (
                      <button
                        onClick={() => removeBusySlot(day, idx)}
                        className="text-red-600 ml-2"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                onClick={() => addBusySlot(day)}
                className="text-blue-600 text-sm"
              >
                + Add Busy Time on {day}
              </button>
            </div>
          );
        })}
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