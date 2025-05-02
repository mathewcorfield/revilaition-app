import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addEvent, removeEvent } from "@/services/dataService"; // Ensure this points to your correct function
import { useUser } from "@/context/UserContext";
import { Milestone } from "@/types";

interface MilestoneTimelineProps {
  milestones: Milestone[];
}

const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({ milestones }) => {
  const { user, setUser } = useUser();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneDate, setNewMilestoneDate] = useState("");
  const { toast } = useToast();

  const sortedMilestones = [...milestones].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const handleAddMilestone = async () => {
    if (!newMilestoneTitle || !newMilestoneDate) {
      toast({
        title: "Error",
        description: "Please provide both title and date for the milestone.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Format the date to YYYY-MM-DD
    const formattedDate = new Date(newMilestoneDate).toISOString().split('T')[0]; 
      
      // Call the new `addEvent` function
      await addEvent(user.id, newMilestoneTitle, "Milestone", "Milestone Event", newMilestoneDate);

      // Assuming the event is successfully added, update the user cache with the new milestone
      const newMilestone: Milestone = {
        title: newMilestoneTitle,
        date: newMilestoneDate,
        id: String(Date.now()), // Example ID generation, could be from Supabase auto ID
      };

      // Update the user milestones in the cache
      setUser(prevUser => ({
        ...prevUser,
        milestones: [...(prevUser?.milestones || []), newMilestone],
      }));

      // Close the dialog and reset inputs
      setIsAddDialogOpen(false);
      setNewMilestoneTitle("");
      setNewMilestoneDate("");

      // Success toast
      toast({
        title: "Milestone Added",
        description: `${newMilestoneTitle} has been added to your milestones.`,
      });
    } catch (error) {
      console.error("Error adding milestone:", error);
      toast({
        title: "Error",
        description: "Failed to add milestone. Please try again.",
        variant: "destructive",
      });
    }
  };
  
const handleRemoveMilestone = async (milestoneId: string) => {
    try {
      // Call removeEvent to update the backend (API)
      await removeEvent(user.id, milestoneId);

      // Update the user milestones in the cache
      setUser(prevUser => ({
        ...prevUser,
        milestones: prevUser?.milestones.filter((milestone) => milestone.id !== milestoneId) || [],
      }));

      toast({
        title: "Milestone Removed",
        description: "The milestone has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove milestone. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">My Milestones</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <PlusCircle size={16} />
              Add Milestone
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Milestone</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  type="text"
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  placeholder="Enter milestone title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={newMilestoneDate}
                  onChange={(e) => setNewMilestoneDate(e.target.value)}
                />
              </div>
              <div className="pt-4">
                <Button onClick={handleAddMilestone} className="w-full">
                  Add Milestone
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
              <Card className="mb-3 w-32 shadow-md hover:shadow-lg transition-shadow border-primary/20 relative group">
                <CardContent className="p-3 text-center">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm truncate">{milestone.title}</p>
                    <Button
                      size="icon"
                      className="text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-700 transition-opacity"
                      onClick={() => handleRemoveMilestone(milestone.id)}
                    >
                      <X size={12} />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(milestone.date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
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
