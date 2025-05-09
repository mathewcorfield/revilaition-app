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

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


  // Prioritize revision by soonest exams
  const getSoonestExamDate = (subject: Subject) =>
    subject.examDates.reduce((earliest, current) =>
      new Date(current.date) < new Date(earliest.date) ? current : earliest
    );

function getDaysUntil(dateStr: string) {
  const now = new Date();
  const target = new Date(dateStr);
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function timeStringToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}
function getFreeTimeSlots(busySlots: Event[]) {
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
  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  
  function minutesToTimeString(mins: number) {
    const h = Math.floor(mins / 60)
      .toString()
      .padStart(2, "0");
    const m = (mins % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  }
function isValidDate(d: Date) {
    return d instanceof Date && !isNaN(d.getTime());
}

const defaultBusySlots: Event[] = daysOfWeek.flatMap((day) => [
    { title:"School", day, start: "08:30", end: "15:30" }, 
    { title:"Sleep 2", day, start: "22:00", end: "23:59" },
    { title:"Sleep 1", day, start: "00:00", end: "07:00" }, 
  ]);

export default function RevisionPlanner({
  subjects,
  userId,
  isOpen,
}: {
  subjects: Subject[];
  userId: string;
  isOpen: boolean;
}) {
    const { toast } = useToast();
    const { setUser } = useUser();
    const [dailyMinutes, setDailyMinutes] = useState(120);
    const [customBusySlots, setCustomBusySlots] = useState<Event[]>([]);
    const [busySlots, setBusySlots] = useState<Event[]>([...defaultBusySlots, ...customBusySlots]);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isPlanSaved, setIsPlanSaved] = useState(false);
  const [revisionEvents, setRevisionEvents] = useState([]);

    useEffect(() => {
        const loadSavedEvents = async () => {
            if (!isPlanSaved) {
          const userEvents = await getUserEvents(userId); 
          setRevisionEvents(userEvents); // use this to initialize the calendar
        }
        };
      
        if (isOpen) {
          loadSavedEvents();
        }
      }, [isOpen]);



const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const allBusySlots = useMemo(() => [...defaultBusySlots, ...customBusySlots], [customBusySlots]);

  const handleAddBusySlot = () => {
    setCustomBusySlots((prev) => [...prev, { day: "Monday", start: "16:00", end: "18:00" }]);
  };

  const calculateBusyMinutesPerWeek = () => {
    return allBusySlots.reduce((total, slot) => {
      return total + (timeStringToMinutes(slot.end) - timeStringToMinutes(slot.start));
    }, 0);
  };
  const calendarEvents = useMemo(() => {
    return allBusySlots.map((slot, idx) => {
      const dayIndex = daysOfWeek.indexOf(slot.day);
      const today = new Date();
      const startOfW = startOfWeek(today, { weekStartsOn: 1 });
      const date = new Date(startOfW);
      date.setDate(date.getDate() + dayIndex);
  
      const [startHour, startMin] = slot.start.split(":").map(Number);
      const [endHour, endMin] = slot.end.split(":").map(Number);
  
      const startDate = new Date(date);
      startDate.setHours(startHour, startMin);
  
      const endDate = new Date(date);
      endDate.setHours(endHour, endMin);
  
      return {
        id: idx,
        title: slot.title || "Busy",
        start: startDate,
        end: endDate,
        allDay: false,
      };
    });
  }, [allBusySlots]);
  const freeTimeSlots = useMemo(() => getFreeTimeSlots(allBusySlots), [allBusySlots]);
  const adjustedMinutesPerWeek = (dailyMinutes * 7) - calculateBusyMinutesPerWeek();
  const adjustedMinutesPerDay = Math.floor(adjustedMinutesPerWeek / 7);


  
    const sortedSubjects = useMemo(() => {
        return [...subjects].sort(
          (a, b) => new Date(getSoonestExamDate(a).date).getTime() - new Date(getSoonestExamDate(b).date).getTime()
        );
      }, [subjects]);
      function generateMultiWeekRevisionEvents(
        subjects: Subject[],
        dailyMinutes: number,
        freeTimeMap: Record<string, { start: string; end: string }[]>,
      ) {
        
        const today = new Date();
        const occupiedSlots: Set<string> = new Set();
        try {
            
        for (const subject of subjects) {
            const examDate = new Date(getSoonestExamDate(subject).date);
          if (isNaN(examDate.getTime())) {
            logError(`Invalid or missing exam date for ${subject.name}`,"Error");
            continue; // Skip this subject if examDate is invalid
          }
          const totalDays = getDaysUntil(getSoonestExamDate(subject).date);
          const totalRevisionMinutes = totalDays * dailyMinutes;
          const minutesPerSubject = Math.floor((totalRevisionMinutes * 0.9) / subjects.length);
          let remaining = minutesPerSubject;
          let current = new Date(today);
          const shuffledSubtopics = shuffleArray(subject.subtopics);
          let subtopicIndex = 0;
          while (remaining > 0 && current <= examDate) {
            const day = daysOfWeek[current.getDay() === 0 ? 6 : current.getDay() - 1]; // Convert JS Sunday (0) to 6
            
            const freeSlots = freeTimeMap[day] || [];
            for (const slot of freeSlots) {
                let  slotStartMin  = timeStringToMinutes(slot.start);
                const slotEndMin  = timeStringToMinutes(slot.end);
                while (slotStartMin + 15 <= slotEndMin && remaining > 0) {
                    const sessionDuration = Math.min(30, remaining, slotEndMin - slotStartMin);
                    if (sessionDuration < 15) break;
                
                const startDate = new Date(current);
                startDate.setHours(Math.floor(slotStartMin / 60), slotStartMin % 60);
      
                const endDate = new Date(startDate);
                endDate.setMinutes(startDate.getMinutes() + sessionDuration);
    
                const slotKey = `${startDate.toISOString()}-${endDate.toISOString()}`;
                if (occupiedSlots.has(slotKey)) {
                  continue; // Skip if this slot is already occupied
                }
    
              if (!isValidDate(startDate) || !isValidDate(endDate)) {
                console.warn(`Invalid event date generated for ${subject.name} on ${day}:`, startDate, endDate);
                continue;
              }
              const subtopic = shuffledSubtopics[subtopicIndex % shuffledSubtopics.length];
                revisionEvents.push({
                    title: `Revise: ${subject.name} - ${subtopic.name}`,
                  start: startDate,
                  end: endDate,
                  allDay: false,
                });
                occupiedSlots.add(slotKey);
                remaining -= sessionDuration;
                subtopicIndex++;
                slotStartMin += sessionDuration;
                if (remaining <= 0) break;
              }
            }
      
            current.setDate(current.getDate() + 1); // Move to next day
          }
        }
    } catch (error) {
        logError("Error generating revision events:", error);
      }
        return revisionEvents;
      }
      setRevisionEvents(generateMultiWeekRevisionEvents(sortedSubjects, dailyMinutes, freeTimeSlots))

  
  const allEvents = useMemo(() => [...calendarEvents, ...revisionEvents], [calendarEvents, revisionEvents]);

  const totalDays = getDaysUntil(getSoonestExamDate(subjects[0]).date);

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
        onClick={async () => {
            for (const event of revisionEvents) {
            await addEvent(userId, event.title, "Event", "Revision Plan Generated", event.start);
            }
            setIsPlanSaved(true);
            toast("Revision plan saved!");
        }}
        disabled={isPlanSaved}
        className={`ml-4 px-4 py-2 rounded text-white ${
            isPlanSaved ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
        >
        {isPlanSaved ? "Plan Saved" : "Save Plan"}
        </button>
    </div>

    <div>
        <h3 className="font-semibold">Busy Sections (e.g. friends, clubs, work)</h3>
        {allBusySlots.map((slot, idx) => (
        <div key={idx} className="flex flex-col gap-2 mb-4 border p-2 rounded">
            <input
            type="text"
            value={slot.title}
            onChange={(e) =>
                setCustomBusySlots((prev) => {
                  const copy = [...prev];
                  copy[idx].title = e.target.value;
                  return copy;
                })
              }
            placeholder="e.g., work, club"
            className="p-1 border rounded"
            />
            <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => (
                <label key={day} className="flex items-center gap-1">
                <input
                    type="checkbox"
                    checked={slot.days?.includes(day)}
                    onChange={() =>
                    setBusySlots((prev) => {
                        const copy = [...prev];
                        const days = copy[idx].days || [];
                        if (days.includes(day)) {
                        copy[idx].days = days.filter((d) => d !== day);
                        } else {
                        copy[idx].days = [...days, day];
                        }
                        return copy;
                    })
                    }
                />
                {day}
                </label>
            ))}
            </div>
            <div className="flex gap-2">
            <input
                type="time"
                value={slot.start}
                onChange={(e) =>
                setBusySlots((prev) => {
                    const copy = [...prev];
                    copy[idx].start = e.target.value;
                    return copy;
                })
                }
                className="p-1 border rounded"
            />
            <input
                type="time"
                value={slot.end}
                onChange={(e) =>
                setBusySlots((prev) => {
                    const copy = [...prev];
                    copy[idx].end = e.target.value;
                    return copy;
                })
                }
                className="p-1 border rounded"
            />
            </div>
        </div>
        ))}
        <button
        onClick={handleAddBusySlot}
        className="mt-2 px-2 py-1 bg-blue-600 text-white rounded"
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