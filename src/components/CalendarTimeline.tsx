import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Event } from "@/types";

interface CalendarTimelineProps {
  events: Event[];
}

const CalendarTimeline: React.FC<CalendarTimelineProps> = ({ events }) => {
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group events by month and year
  const groupedEvents: Record<string, Event[]> = {};
  
  sortedEvents.forEach(event => {
    const date = new Date(event.date);
    const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    
    if (!groupedEvents[monthYear]) {
      groupedEvents[monthYear] = [];
    }
    
    groupedEvents[monthYear].push(event);
  });

  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default CalendarTimeline;
