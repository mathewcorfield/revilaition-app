import { useState } from "react";
import { Subject, Event } from "@/types";
import useSubjectExamDates from "@/hooks/useSubjectExamDates";

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

export default function RevisionPlanner({
  subjects,
}: {
  subjects: Subject[];
}) {
  const [dailyMinutes, setDailyMinutes] = useState(120);
  const [busySlots, setBusySlots] = useState<Event[]>([]);
const resultsDay = "2024-08-01"; 

  const totalDays = getDaysUntil(resultsDay);
  const totalRevisionMinutes = totalDays * dailyMinutes;

  const handleAddBusySlot = () => {
    setBusySlots((prev) => [...prev, { day: "Monday", start: "16:00", end: "18:00" }]);
  };

  const calculateBusyMinutesPerWeek = () => {
    return busySlots.reduce((total, slot) => {
      return total + (timeStringToMinutes(slot.end) - timeStringToMinutes(slot.start));
    }, 0);
  };

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
      <h2 className="text-xl font-bold">Revision Planner</h2>

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
        {busySlots.map((slot, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <select
              value={slot.day}
              onChange={(e) =>
                setBusySlots((prev) => {
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
                setBusySlots((prev) => {
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
                setBusySlots((prev) => {
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