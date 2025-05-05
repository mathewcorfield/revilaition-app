import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { addUserSubject, fetchSubtopicsForSubject } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";
import { Subject } from "@/types";

export const useAddSubject = (isTrial: boolean) => {
  const { user, setUser } = useUser();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubject = async (
    selectedSubject: Subject
  ) => {
    if (selectedSubject && !selectedSubject.launched) {
      toast({
        title: "Coming Soon",
        description: `${selectedSubject.name} is not yet available.`,
        variant: "destructive",
      });
      return;
    }
    
    if (selectedSubject) {
      try {
        setIsAdding(true); // Start loading state
        if (!isTrial){
        await addUserSubject(user.id, selectedSubject.id);
        }
        const fetchedSubtopics = await fetchSubtopicsForSubject(selectedSubject.id);
        
        const newSubject: Subject = {
          id: selectedSubject.id,
          name: selectedSubject.name,
          examBoard: selectedSubject.examBoard,
          iconColor: selectedSubject.iconColor,
          subtopics: (fetchedSubtopics || []).map(st => ({
            ...st,
            learnt: 0,
            revised: 0,
          })),
        };

        setUser(prevUser => ({
          ...prevUser,
          subjects: [...(prevUser?.subjects || []), newSubject],
        }));

        toast({
          title: "Subject Added",
          description: `${selectedSubject.name} has been added to your subjects.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add subject. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsAdding(false); // End loading state
      }
    }
  };

  return { handleAddSubject, isAdding };
};
