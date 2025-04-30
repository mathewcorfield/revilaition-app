import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Book, Check, Edit3 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Subject, AvailableSubject } from "@/types";
import SubjectDetail from "./SubjectDetail";
import { useToast } from "@/hooks/use-toast";

interface SubjectTabProps {
  subjects: Subject[] | null;
  availableSubjects: AvailableSubject[] | null;
  availableExamBoards: AvailableExamBoard[] | null;
}

const SubjectTab: React.FC<SubjectTabProps> = ({ subjects: initialSubjects, availableSubjects, availableExamBoards}) => {
  // Default to empty arrays if null
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects || []);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSubjectToAdd, setSelectedSubjectToAdd] = useState<string>("");
  const [selectedExamBoard, setSelectedExamBoard] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleAddSubject = () => {
    if (!availableSubjects) return;  // If availableSubjects is null, prevent any action

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
      const newSubject: Subject = {
        id: `${subjectToAdd.id}-${Date.now()}`,
        name: subjectToAdd.name,
        examBoard: selectedExamBoard,
        iconColor: subjectToAdd.iconColor,
        subtopics: subjectToAdd.subtopics.map(st => ({
          ...st,
          learnt: 0,
          revised: 0
        }))
      };
      
      setSubjects([...subjects, newSubject]);
      setIsAddDialogOpen(false);
      setSelectedSubjectToAdd("");
      setSelectedExamBoard("");
      
      toast({
        title: "Subject Added",
        description: `${subjectToAdd.name} has been added to your subjects.`
      });
    }
  };

  // Filter available subjects to exclude the ones that are already selected
const filteredSubjects = (availableSubjects || []).filter(
  subject => !subjects.some(s => s.name === subject.name)
);
  
  const getLearntProgress = (subject: Subject) => {
    const totalSubtopics = subject.subtopics.length;
    if (totalSubtopics === 0) return 0;
    
    const learntCount = subject.subtopics.reduce((sum, subtopic) => sum + (subtopic.learnt > 0 ? 1 : 0), 0);
    return Math.round((learntCount / totalSubtopics) * 100);
  };
  
  const getRevisedProgress = (subject: Subject) => {
    const totalSubtopics = subject.subtopics.length;
    if (totalSubtopics === 0) return 0;
    
    const revisedCount = subject.subtopics.reduce((sum, subtopic) => sum + (subtopic.revised > 0 ? 1 : 0), 0);
    return Math.round((revisedCount / totalSubtopics) * 100);
  };

  return (
    <div className="space-y-6">
      {selectedSubject ? (
        <SubjectDetail 
          subject={selectedSubject} 
          onBack={() => setSelectedSubject(null)}
        />
      ) : (
        <>
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
                    <Select value={selectedExamBoard} onValueChange={setSelectedExamBoard}>
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
                      onClick={handleAddSubject}
                      disabled={!selectedSubjectToAdd || !selectedExamBoard}
                      className="w-full"
                    >
                      Add Subject
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <Card 
                key={subject.id} 
                className="border-l-4 hover:shadow-md transition-shadow cursor-pointer"
                style={{ borderLeftColor: subject.iconColor }}
                  onClick={() => {
                      console.log(`Navigating to /subject/${subject.id}`);
                      navigate(`/subject/${subject.id}`);
                    }}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Book size={18} style={{ color: subject.iconColor }} /> 
                      {subject.name}
                    </CardTitle>
                    <Badge variant="outline" className="uppercase">
                      {subject.examBoard}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <div className="flex items-center gap-1">
                          <Check size={14} className="text-green-500" />
                          <span>Learnt</span>
                        </div>
                        <span>{getLearntProgress(subject)}%</span>
                      </div>
                      <Progress value={getLearntProgress(subject)} className="h-1.5" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <div className="flex items-center gap-1">
                          <Edit3 size={14} className="text-blue-500" />
                          <span>Revised</span>
                        </div>
                        <span>{getRevisedProgress(subject)}%</span>
                      </div>
                      <Progress value={getRevisedProgress(subject)} className="h-1.5" />
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="text-xs text-muted-foreground">
                    {subject.subtopics.length} subtopics
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {subjects.length === 0 && (
              <div className="col-span-full text-center py-8 bg-muted/50 rounded-lg">
                <Book size={40} className="mx-auto text-muted-foreground mb-2" />
                <h3 className="font-medium mb-1">No Subjects Added Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Add your first subject to start tracking your learning progress</p>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
                    <PlusCircle size={16} className="mr-2" /> Add Your First Subject
                  </Button>
                </DialogTrigger>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SubjectTab;
