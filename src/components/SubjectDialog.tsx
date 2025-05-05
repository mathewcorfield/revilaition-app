import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAddSubject } from "@/hooks/addUserSubject";
import { Subject, AvailableSubject, AvailableExamBoard } from "@/types";

interface AddSubjectDialogProps {
  availableSubjects: AvailableSubject[];
  availableExamBoards: AvailableExamBoard[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userSubjects: Subject[];
  isTrial: boolean;
}

const AddSubjectDialog: React.FC<AddSubjectDialogProps> = ({
  availableSubjects,
  availableExamBoards,
  isOpen,
  setIsOpen,
  userSubjects,
  isTrial,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedExamBoardId, setSelectedExamBoardId] = useState<string>("");
  const { handleAddSubject, isAdding } = useAddSubject(isTrial);

  const handleAdd = () => {
    const subject = availableSubjects.find(s => s.id === selectedSubjectId);
    const examBoard = availableExamBoards.find(b => b.id === selectedExamBoardId);
    
    if (!subject || !examBoard) return;
    
    const updatedSubject = { ...subject, examBoard: examBoard.name };
    handleAddSubject(updatedSubject);
    setIsOpen(false);
    setSelectedSubjectId("");
    setSelectedExamBoardId("");
  };
  
const filteredSubjects = availableSubjects.filter(
  subject => !(userSubjects ?? []).some(s => s.name === subject.name)
);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
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
            <Select value={selectedExamBoardId} onValueChange={setSelectedExamBoardId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an exam board" />
              </SelectTrigger>
              <SelectContent>
                {availableExamBoards.map((board) => (
                  <SelectItem key={board.id} value={board.id} disabled={board.launched !== true}>
                    {board.name}
                    {board.launched !== true && (
                      <span className="ml-2 text-xs text-muted-foreground">(Coming Soon)</span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="pt-4">
            <Button 
              onClick={handleAdd}
              disabled={!selectedSubjectId || !selectedExamBoardId || isAdding}
              className="w-full"
            >
              {isAdding ? 'Adding...' : 'Add Subject'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubjectDialog;
