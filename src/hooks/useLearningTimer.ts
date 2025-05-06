import {useState, useEffect} from "react";
import { addEvent } from "@/services/dataService";
import { toast } from "@/components/ui/toast";

interface UseLearningTimerProps {
  userId: string | undefined; 
  subtopicId: string | undefined; 
}
export function useLearningTimer({ userId, subtopicId }: UseLearningTimerProps) {
        const [isLearning, setIsLearning] = useState(false); // To track if the user is learning
        const [elapsedTime, setElapsedTime] = useState(0); // Elapsed time in seconds
        const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

useEffect(() => {
  let interval: NodeJS.Timeout | null = null;
  if (isLearning) {
    interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  }

  return () => {
    if (interval) clearInterval(interval);
  };
}, [isLearning]);

 const handleLogLearning = async () => {
  if (!userId || !subtopicId) {
    toast({ title: "Error", description: "User or Subtopic not found." });
    return;
  }
    const eventDate = new Date();

    try {
      // Log the learning event with the elapsed time
      await addEvent(userId, `Learned ${subtopicId}`, "Event", `Learned for ${elapsedTime} seconds`, eventDate);

      // Toast feedback
      toast({
        title: "Learning Logged",
        description: `You have logged ${elapsedTime} seconds of learning for ${subtopicId}.`,
      });

    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to log the learning event.",
      });
      console.error("Error logging learning event:", err);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleStartLearning = () => {
          setElapsedTime(0);
    setIsLearning(true); // Start the learning timer
  };

  const handleStopLearning = () => {
    setIsLearning(false); // Stop the learning timer
    handleLogLearning(); // Log the learning event
  };
   return {
    isLearning,
    elapsedTime,
    formatTime,
    handleStartLearning,
    handleStopLearning,
  };
}
