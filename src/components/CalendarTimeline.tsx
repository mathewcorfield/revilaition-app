import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Event, Subject } from "@/types";
import RevisionPlanner from "@/components/revisionPlanner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CalendarTimelineProps {
  events: Event[];
  subjects: Subject[];
}

const CalendarTimeline: React.FC<CalendarTimelineProps> = ({ events, subjects }) => {
  const sortedEvents = [...events].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const groupedEvents: Record<string, Event[]> = {};
  const [showPlanner, setShowPlanner] = useState(false);

  sortedEvents.forEach(event => {
    const date = new Date(event.date);
    const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    if (!groupedEvents[monthYear]) {
      groupedEvents[monthYear] = [];
    }
    groupedEvents[monthYear].push(event);
  });

  return (
    <div className="space-y-6">
      {/* Planner Button and Modal */}
      <div className="text-center">
        <Dialog open={showPlanner} onOpenChange={setShowPlanner}>
          <DialogTrigger asChild>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Generate Revision Plan
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Revision Planner</DialogTitle>
            </DialogHeader>
            <RevisionPlanner subjects={subjects} />
          </DialogContent>
        </Dialog>
      </div>

      {/* If no events, show message */}
      {sortedEvents.length === 0 ? (
        <div className="text-center text-gray-600 p-6">
          <p className="mb-2">You can start planning your revision above!</p>
        </div>
      ) : (
        // Render timeline of events
        <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4">
          {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
            <Card key={monthYear} className="min-w-[300px] border-primary/20 shadow-sm">
              <CardHeader className="pb-2 bg-accent/50">
                <CardTitle className="text-lg">{monthYear}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {monthEvents.map(event => (
                    <li key={event.id} className="flex items-start gap-3">
                      <div className="min-w-[40px] text-center">
                        <span className="font-semibold text-sm">
                          {new Date(event.date).getDate()}
                        </span>
                      </div>
                      <div className="bg-muted p-2 rounded-md flex-1">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarTimeline;
