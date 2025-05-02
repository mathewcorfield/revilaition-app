import { useUser } from "@/context/UserContext";
import { removeUserSubject } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";

export const useRemoveSubject = () => {
  const { user, setUser } = useUser();
  const { toast } = useToast();

  const handleRemoveSubject = async (subjectId: string) => {
    try {
      await removeUserSubject(user.id, subjectId);

      setUser(prevUser => ({
        ...prevUser,
        subjects: prevUser?.subjects.filter(subject => subject.id !== subjectId),
      }));

      toast({
        title: "Subject Removed",
        description: "The subject has been removed from your subjects.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove subject. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { handleRemoveSubject };
};
