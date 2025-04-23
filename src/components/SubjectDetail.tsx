import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, Edit3, HelpCircle, Shuffle } from "lucide-react";
import { Subject, Subtopic } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getRevisionQuestion, evaluateAnswer } from "../services/openaiService"; // Import the API call

interface SubjectDetailProps {
  subject: Subject;
  onBack: () => void;
}

const SubjectDetail: React.FC<SubjectDetailProps> = ({ subject, onBack }) => {
  const [subtopics, setSubtopics] = useState<Subtopic[]>(subject.subtopics);
  const [selectedSubtopic, setSelectedSubtopic] = useState<Subtopic | null>(null);
  const [question, setQuestion] = useState<string | null>(null); // State to store the generated question
  const [answer, setAnswer] = useState<string>(''); // State to store the user's answer
  const [loading, setLoading] = useState(false); // Loading state
  const { toast } = useToast();
  
  const handleLearntToggle = (subtopicId: string) => {
    setSubtopics(subtopics.map(st => 
      st.id === subtopicId 
        ? { ...st, learnt: st.learnt === 1 ? 0 : 1 }
        : st
    ));
  };
  
  const handleRevisedToggle = (subtopicId: string) => {
    setSubtopics(subtopics.map(st => 
      st.id === subtopicId 
        ? { ...st, revised: st.revised === 1 ? 0 : 1 }
        : st
    ));
  };
  
  // Function to handle question generation
  const handleGenerateQuestion = async (subtopicName: string) => {
    setLoading(true);
    try {
      // Make API call to get revision question based on subtopic
      const response = await getRevisionQuestion(subtopicName, subject.examBoard, subject.level); // Call OpenAI API

      setQuestion(response); // Set the question in the state
      toast({
        title: "Question Generated",
        description: "Here is your question!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate question.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to handle answer submission and evaluation
  const handleAnswerSubmit = async () => {
    if (!answer) {
      toast({ title: "Error", description: "Please provide an answer to the question." });
      return;
    }

    setLoading(true);

    try {
      // Send the answer to OpenAI for evaluation based on a mark scheme
      const evaluation = await evaluateAnswer(answer, question || "", subject.examBoard, subject.level);
      toast({ title: "Answer Evaluated", description: `Feedback: ${evaluation}` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to evaluate answer." });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGenerateRandomQuestion = () => {
    // Get all subtopics
    if (subtopics.length === 0) {
      toast({
        title: "No Subtopics Available",
        description: "This subject has no subtopics to generate questions from."
      });
      return;
    }
    
    // Select random subtopic
    const randomIndex = Math.floor(Math.random() * subtopics.length);
    const randomSubtopic = subtopics[randomIndex];
    
    setSelectedSubtopic(randomSubtopic);
    handleGenerateQuestion(randomSubtopic.name);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h3 className="text-lg font-medium">{subject.name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="uppercase">
                {subject.examBoard}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {subtopics.length} subtopics
              </span>
            </div>
          </div>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={handleGenerateRandomQuestion} className="gap-2">
              <Shuffle size={16} />
              Random Question
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Practice Question</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {selectedSubtopic && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Topic:</h4>
                    <p>{selectedSubtopic.name}</p>
                  </div>
                  {question && (
                    <div className="bg-accent p-4 rounded-md">
                      <p className="text-sm">{question}</p> {/* Display the generated question */}
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium">Your Answer:</h4>
                    <textarea
                      className="w-full p-2 border rounded-md"
                      rows={4}
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                    />
                  </div>
                  <Button onClick={handleAnswerSubmit} className="w-full mt-4" disabled={loading}>
                    {loading ? "Evaluating..." : "Submit Answer"}
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-3">
        {subtopics.map((subtopic) => (
          <Card 
            key={subtopic.id} 
            className="p-4 flex items-center justify-between gap-4 hover:bg-accent/10 transition-colors"
          >
            <div className="flex-grow">
              <h4 className="font-medium">{subtopic.name}</h4>
              {subtopic.description && (
                <p className="text-sm text-muted-foreground mt-1">{subtopic.description}</p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant={subtopic.learnt ? "default" : "outline"} 
                size="sm" 
                className="gap-1 min-w-[90px]"
                onClick={() => handleLearntToggle(subtopic.id)}
              >
                <Check size={16} /> 
                {subtopic.learnt ? "Learnt" : "Mark Learnt"}
              </Button>
              
              <Button 
                variant={subtopic.revised ? "secondary" : "outline"} 
                size="sm" 
                className="gap-1 min-w-[90px]"
                onClick={() => handleRevisedToggle(subtopic.id)}
              >
                <Edit3 size={16} /> 
                {subtopic.revised ? "Revised" : "Mark Revised"}
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setSelectedSubtopic(subtopic);
                      handleGenerateQuestion(subtopic.name);
                    }}
                  >
                    <HelpCircle size={18} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Practice Question</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Topic:</h4>
                        <p>{subtopic.name}</p>
                      </div>
                      {question && (
                    <div className="bg-accent p-4 rounded-md">
                      <p className="text-sm">{question}</p> {/* Display the generated question */}
                    </div>
                  )}
                      <Button className="w-full">
                        <HelpCircle size={16} className="mr-2" />
                        Answer Question
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        ))}
        
        {subtopics.length === 0 && (
          <div className="text-center py-6 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">No subtopics available for this subject</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectDetail;
