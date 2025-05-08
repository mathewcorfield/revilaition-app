import { useState, useMemo } from "react";
import { Subject, Event } from "@/types";
import useSubjectExamDates from "@/hooks/useSubjectExamDates";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { enGB } from "date-fns/locale";

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
}: {
  subjects: Subject[];
}) {
  const [dailyMinutes, setDailyMinutes] = useState(120);
  const [customBusySlots, setCustomBusySlots] = useState<Event[]>([]);
const resultsDay = "2024-08-01"; 

  const totalDays = getDaysUntil(resultsDay);
  const totalRevisionMinutes = totalDays * dailyMinutes;

  const allBusySlots = useMemo(() => [...defaultBusySlots, ...customBusySlots], [customBusySlots]);

  const handleAddBusySlot = () => {
    setCustomBusySlots((prev) => [...prev, { day: "Monday", start: "16:00", end: "18:00" }]);
  };

  const calculateBusyMinutesPerWeek = () => {
    return allBusySlots.reduce((total, slot) => {
      return total + (timeStringToMinutes(slot.end) - timeStringToMinutes(slot.start));
    }, 0);
  };
const calendarEvents = allBusySlots.map((slot, idx) => {
  const dayIndex = daysOfWeek.indexOf(slot.day); // 0 = Monday
  const today = new Date();
  const startOfWeek = startOfWeek(today, { weekStartsOn: 1 });

  const date = new Date(startOfWeek);
  date.setDate(date.getDate() + dayIndex);

  const [startHour, startMin] = slot.start.split(":").map(Number);
  const [endHour, endMin] = slot.end.split(":").map(Number);

  const startDate = new Date(date);
  startDate.setHours(startHour, startMin);

  const endDate = new Date(date);
  endDate.setHours(endHour, endMin);

  return {
    id: idx,
    title: "Busy",
    start: startDate,
    end: endDate,
    allDay: false,
  };
});
  const adjustedMinutesPerWeek = (dailyMinutes * 7) - calculateBusyMinutesPerWeek();
  const adjustedMinutesPerDay = Math.floor(adjustedMinutesPerWeek / 7);

  // Prioritize revision by soonest exams
  const getSoonestExamDate = (subject: Subject) =>
    subject.examDates.reduce((earliest, current) =>
      new Date(current.date) < new Date(earliest.date) ? current : earliest
    );
  
  const sortedSubjects = [...subjects].sort(
    (a, b) => new Date(getSoonestExamDate(a).date).getTime() - new Date(getSoonestExamDate(b).date).getTime()
  );

  const minutesPerSubject = Math.floor((totalRevisionMinutes * 0.9) / sortedSubjects.length); // 90% time for subjects

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
      </div>

      <div>
        <h3 className="font-semibold">Busy Sections</h3>
        {allBusySlots.map((slot, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <select
              value={slot.day}
              onChange={(e) =>
                setCustomBusySlots((prev) => {
                  const copy = [...prev];
                  copy[idx].day = e.target.value;
                  return copy;
                })
              }
              className="p-1 border rounded"
            >
              {daysOfWeek.map((day) => (
                <option key={day}>{day}</option>
              ))}
            </select>
            <input
              type="time"
              value={slot.start}
              onChange={(e) =>
                setCustomBusySlots((prev) => {
                  const copy = [...prev];
                  copy[idx].start = e.target.value;
                  return copy;
                })
              }
            />
            <input
              type="time"
              value={slot.end}
              onChange={(e) =>
                setCustomBusySlots((prev) => {
                  const copy = [...prev];
                  copy[idx].end = e.target.value;
                  return copy;
                })
              }
            />
          </div>
        ))}
        <button onClick={handleAddBusySlot} className="mt-2 px-2 py-1 bg-blue-600 text-white rounded">
          + Add Busy Time
        </button>
      </div>
      <div className="h-[600px] mt-4">
        <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            defaultView="week"
            views={["week"]}
            style={{ height: "100%" }}
        />
        </div>
      <div>
        <h3 className="font-semibold">Suggested Revision Plan</h3>
        <p>Total days left: {totalDays}</p>
        <p>Adjusted daily minutes: {adjustedMinutesPerDay} min</p>

        <ul className="mt-2 space-y-1">
          {sortedSubjects.map((subject, i) => (
            <li key={i} className="border p-2 rounded">
              <strong>{subject.name}</strong> — {minutesPerSubject} min total before{" "}
              {new Date(subject.examDates[0].date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}