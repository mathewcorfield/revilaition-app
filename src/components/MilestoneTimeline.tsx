import { Card, CardContent } from "@/components/ui/card";
import { Milestone } from "@/types";

interface MilestoneTimelineProps {
  milestones: Milestone[];
}

const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({ milestones }) => {
  const sortedMilestones = [...milestones].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  if (sortedMilestones.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No milestones to display.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="w-full relative">
        <div className="absolute top-[50%] left-0 right-0 h-0.5 bg-primary/20 -translate-y-1/2" />
        <div className="flex justify-between relative">
          {sortedMilestones.map((milestone, index) => (
            <div 
              key={milestone.id} 
              className="flex flex-col items-center relative"
              style={{
                flex: index === 0 || index === sortedMilestones.length - 1 ? '0 0 auto' : '1 1 0',
                marginLeft: index === 0 ? '0' : '',
                marginRight: index === sortedMilestones.length - 1 ? '0' : '',
              }}
            >
              <Card className="mb-3 w-32 shadow-md hover:shadow-lg transition-shadow border-primary/20">
                <CardContent className="p-3 text-center">
                  <p className="font-medium text-sm truncate">{milestone.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(milestone.date).toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </CardContent>
              </Card>
              <div className="w-4 h-4 rounded-full bg-primary z-10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default MilestoneTimeline;
