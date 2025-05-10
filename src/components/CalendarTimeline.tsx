import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Calendar } from "lucide-react";
import { Event, Subject } from "@/types";
import RevisionPlanner from "@/components/revisionPlanner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CalendarTimelineProps {
  events: Event[];
  subjects: Subject[];
  userId: string;
}

const CalendarTimeline: React.FC<CalendarTimelineProps> = ({ events, subjects, userId }) => {
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

  return subjects.length === 0 ? null : (
    <div className="space-y-6">
      {/* Planner Button and Modal */}
      <>
  <Dialog open={showPlanner} onOpenChange={setShowPlanner}>
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Revision Planner</DialogTitle>
      </DialogHeader>
      {showPlanner && (
    <RevisionPlanner
      subjects={subjects}
      userId={userId}
      isOpen={showPlanner}
    />
  )}
    </DialogContent>
  </Dialog>
</>

  {/* If no events, show message */}
  {sortedEvents.length === 0 ? (
    <div className="flex justify-center text-gray-600 p-6">
      <Button    onClick={() => setShowPlanner(true)}    size="sm" className="flex items-center gap-1">
        <PlusCircle size={16} />
        Generate Revision Plan
      </Button>
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
    )};

export default CalendarTimeline;
