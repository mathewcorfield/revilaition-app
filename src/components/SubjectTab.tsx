import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Book} from "lucide-react";
import { AvailableSubject, AvailableExamBoard } from "@/types";
import { useUser } from "@/context/UserContext";
import { useRemoveSubject } from "@/hooks/removeUserSubject";
import SubjectCard from "@/components/SubjectCard"; 
import AddSubjectDialog from "@/components/AddSubjectDialog";

interface SubjectTabProps {
  availableSubjects: AvailableSubject[] | null;
  availableExamBoards: AvailableExamBoard[] | null;
}

const SubjectTab: React.FC<SubjectTabProps> = ({availableSubjects, availableExamBoards}) => {
  // Default to empty arrays if null
  const { user, setUser } = useUser(); 
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const { handleRemoveSubject } = useRemoveSubject();

const filteredSubjects = (availableSubjects || []).filter(
  subject => !user?.subjects?.some(s => s.name === subject.name)
);

  return (
    <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">My Subjects</h3>
              <AddSubjectDialog
                availableSubjects={availableSubjects || []}
                availableExamBoards={availableExamBoards || []}
                isOpen={isAddDialogOpen}
                setIsOpen={setIsAddDialogOpen}
              />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {user?.subjects?.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onRemoveSubject={handleRemoveSubject}
              />
            ))}
            
            {user?.subjects.length === 0 && (
              <div className="col-span-full text-center py-8 bg-muted/50 rounded-lg">
                <Book size={40} className="mx-auto text-muted-foreground mb-2" />
                <h3 className="font-medium mb-1">No Subjects Added Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Add your first subject to start tracking your learning progress</p>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
                    <PlusCircle size={16} className="mr-2" /> Add Your First Subject
                  </Button>
              </div>
            )}
          </div>
    </div>
  );
};

export default SubjectTab;
