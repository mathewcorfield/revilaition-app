import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Book, Check, Edit3, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AvailableExamBoard } from "@/types";
import { useRemoveSubject } from "@/hooks/removeUserSubject";
import { useAddSubject } from "@/hooks/addUserSubject";
import { useUser } from "@/context/UserContext";
import SubjectCard from "@/components/SubjectCard"; 

interface SubjectTabProps {
  availableSubjects: AvailableSubject[] | null;
  availableExamBoards: AvailableExamBoard[] | null;
}

const SubjectTab: React.FC<SubjectTabProps> = ({availableSubjects, availableExamBoards}) => {
  // Default to empty arrays if null
  const { user, setUser } = useUser(); 
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSubjectToAdd, setSelectedSubjectToAdd] = useState<string>("");
  const [selectedExamBoard, setSelectedExamBoard] = useState<string>("");
  const navigate = useNavigate();
  
  const { handleAddSubject, isAdding } = useAddSubject();
  const { handleRemoveSubject } = useRemoveSubject();

const filteredSubjects = (availableSubjects || []).filter(
  subject => !user?.subjects?.some(s => s.name === subject.name)
);
  
const calculateProgress = (subject: Subject, key: "learnt" | "revised") => {
    const totalSubtopics = subject.subtopics.length;
    if (totalSubtopics === 0) return 0;

    const count = subject.subtopics.reduce(
      (sum, subtopic) => sum + (subtopic[key] > 0 ? 1 : 0),
      0
    );
    return Math.round((count / totalSubtopics) * 100);
  };
  
  const handleAddSubjectClick = () => {
    if (!selectedSubjectToAdd || !selectedExamBoard) return;
    handleAddSubject(selectedSubjectToAdd, availableSubjects, selectedExamBoard);
  };

  return (
    <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">My Subjects</h3>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-1">
                  <PlusCircle size={16} />
                  Add Subject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Subject</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Subject</label>
                    <Select value={selectedSubjectToAdd} onValueChange={setSelectedSubjectToAdd}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a subject" />
                      </SelectTrigger>
                        <SelectContent>
                          {filteredSubjects.map(subject => (
                            <SelectItem 
                              key={subject.id} 
                              value={subject.id} 
                              disabled={subject.launched !== true}
                            >
                              {subject.name}
                              {subject.launched !== true && (
                                <span className="ml-2 text-xs text-muted-foreground">(Coming Soon)</span>
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Exam Board</label>
                    <Select value={selectedExamBoard} onValueChange={(value) => {
                        const selectedBoard = availableExamBoards?.find(board => board.id === value);
                        if (selectedBoard) {
                          setSelectedExamBoard(selectedBoard.name);  // Set the name of the board
                        }
                      }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an exam board" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableExamBoards?.map((board) => (
                          <SelectItem key={board.id} value={board.id}>
                            {board.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="pt-4">
                    <Button 
                      onClick={handleAddSubjectClick}
                      disabled={!selectedSubjectToAdd || !selectedExamBoard || isAdding}
                      className="w-full"
                    >
                      {isAdding ? 'Adding...' : 'Add Subject'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
