import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { addUserSubject, fetchSubtopicsForSubject } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";
import { Subject, AvailableSubject } from "@/types";

export const useAddSubject = () => {
  const { user, setUser } = useUser();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubject = async (
    selectedSubjectToAdd: string,
    availableSubjects: AvailableSubject[],
    selectedExamBoard: string
  ) => {
    if (!availableSubjects) return;

    const subjectToAdd = availableSubjects.find(s => s.id === selectedSubjectToAdd);
    
    if (subjectToAdd && !subjectToAdd.launched) {
      toast({
        title: "Coming Soon",
        description: `${subjectToAdd.name} is not yet available.`,
        variant: "destructive",
      });
      return;
    }
    
    if (subjectToAdd && selectedExamBoard) {
      try {
        setIsAdding(true); // Start loading state
        
        await addUserSubject(user.id, subjectToAdd.id, selectedExamBoard);
        const fetchedSubtopics = await fetchSubtopicsForSubject(subjectToAdd.id);
        
        const newSubject: Subject = {
          id: subjectToAdd.id,
          name: subjectToAdd.name,
          examBoard: selectedExamBoard,
          iconColor: subjectToAdd.iconColor,
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
          description: `${subjectToAdd.name} has been added to your subjects.`,
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
