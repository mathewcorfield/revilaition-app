import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAddSubject } from "@/hooks/addUserSubject";
import { AvailableSubject, AvailableExamBoard } from "@/types";

interface AddSubjectDialogProps {
  availableSubjects: AvailableSubject[];
  availableExamBoards: AvailableExamBoard[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const AddSubjectDialog: React.FC<AddSubjectDialogProps> = ({
  availableSubjects,
  availableExamBoards,
  isOpen,
  setIsOpen,
}) => {
  const [selectedSubjectToAdd, setSelectedSubjectToAdd] = useState<string>("");
  const [selectedExamBoard, setSelectedExamBoard] = useState<string>("");
  const { handleAddSubject, isAdding } = useAddSubject();

  const handleAdd = () => {
    if (!selectedSubjectToAdd || !selectedExamBoard) return;
    handleAddSubject(selectedSubjectToAdd, availableSubjects, selectedExamBoard);
    setIsOpen(false);
    setSelectedSubjectToAdd("");
    setSelectedExamBoard("");
  };

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
            <Select value={selectedSubjectToAdd} onValueChange={setSelectedSubjectToAdd}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a subject" />
              </SelectTrigger>
              <SelectContent>
                {availableSubjects.map(subject => (
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
              const selectedBoard = availableExamBoards.find(board => board.id === value);
              if (selectedBoard) {
                setSelectedExamBoard(selectedBoard.name);
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an exam board" />
              </SelectTrigger>
              <SelectContent>
                {availableExamBoards.map((board) => (
                  <SelectItem key={board.id} value={board.id}>
                    {board.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="pt-4">
            <Button 
              onClick={handleAdd}
              disabled={!selectedSubjectToAdd || !selectedExamBoard || isAdding}
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
