import {useState, useEffect} from "react";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import {    ArrowLeft,    Check,    Edit3,    HelpCircle,    Shuffle} from "lucide-react";
import {useUser} from "@/context/UserContext";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {    Dialog,    DialogContent,    DialogHeader,    DialogTitle,    DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import {toast} from "@/components/ui/use-toast";
import { SubtopicCard } from "@/components/SubtopicCard";
import {Subtopic} from "@/types";
import {getRevisionQuestion, evaluateAnswer} from "@/services/openaiService";
import { addUserSubtopic, addEvent, getQuestionsForSubtopic } from "@/services/dataService";
import { useSubjectData } from "@/hooks/useSubjectData";
        
const SubjectPage: React.FC = () => {
        const location = useLocation();
        const isTrial = location.state?.isTrial ?? false;
    const navigate = useNavigate();
    const {id} = useParams();
    const {user, loading, setUser} = useUser();
    const { subject, subtopics, setSubject, setSubtopics } = useSubjectData(user, id, loading);
    const [selectedSubtopic, setSelectedSubtopic] = useState < Subtopic | null > (null);
    const [question, setQuestion] = useState < string | null > (null);
    const [answer, setAnswer] = useState < string > ('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [evaluationFeedback, setEvaluationFeedback] = useState < string | null > (null);
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
                  const userId = user?.id; // Ensure user is not undefined
  const subtopicId = selectedSubtopic?.id; // Ensure subtopic is selected
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

      // Redirect back to the subject page
      navigate("/subject"); // Replace with your subject page route
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
        
    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }
    if (!subject) {
        return <div className="text-center mt-8">Subject not found</div>;
    }
    const handleLearntToggle = async (subtopicId: string) => {
  const subtopic = subtopics.find((st) => st.id === subtopicId);
  const newValue = subtopic?.learnt === 1 ? 0 : 1;

  setSubtopics((prev) =>
    prev.map((st) =>
      st.id === subtopicId ? { ...st, learnt: newValue } : st
    )
  );

  try {
    await addUserSubtopic(user.id, subtopicId, newValue);
          if (setUser) {
      const updatedSubjects = user.subjects.map((subject) => {
        if (String(subject.id) === String(id)) {
          return {
            ...subject,
            subtopics: subject.subtopics.map((st) =>
              st.id === subtopicId ? { ...st, learnt: newValue } : st
            ),
          };
        }
        return subject;
      });

      setUser({ ...user, subjects: updatedSubjects });
    }
              toast({
      title: newValue === 1 ? "Marked as Learnt" : "Unmarked as Learnt",
      description: `You have ${newValue === 1 ? "learnt" : "unmarked"} the topic: "${subtopic?.name}"`,
    });
          // Start the timer when "Learnt" is clicked
    if (newValue === 1) {
      handleStartLearning(); // Start the learning timer
    } else {
      handleStopLearning(); // Stop the learning timer when unmarked as learnt
    }
  } catch (err) {
    toast({ title: "Error", description: "Failed to update 'Learnt' status." });
  }
};
const handleRevisedToggle = async (subtopicId: string) => {
  const subtopic = subtopics.find((st) => st.id === subtopicId);
  const newValue = subtopic?.revised === 1 ? 0 : 1;

  setSubtopics((prev) =>
    prev.map((st) =>
      st.id === subtopicId ? { ...st, revised: newValue } : st
    )
  );

  try {
    await addUserSubtopic(user.id, subtopicId, newValue);
          if (setUser) {
      const updatedSubjects = user.subjects.map((subject) => {
        if (String(subject.id) === String(id)) {
          return {
            ...subject,
            subtopics: subject.subtopics.map((st) =>
              st.id === subtopicId ? { ...st, revised: newValue } : st
            ),
          };
        }
        return subject;
      });

      setUser({ ...user, subjects: updatedSubjects });
    }
              toast({
      title: newValue === 1 ? "Marked as revised" : "Unmarked as revised",
      description: `You have ${newValue === 1 ? "revised" : "unmarked"} the topic: "${subtopic?.name}"`,
    });
          // Start the timer when "Learnt" is clicked
    if (newValue === 1) {
      handleStartLearning(); // Start the learning timer
    } else {
      handleStopLearning(); // Stop the learning timer when unmarked as learnt
    }
  } catch (err) {
    toast({ title: "Error", description: "Failed to update 'Revised' status." });
  }
};
    const handleGenerateQuestion = async (subtopicName : string, subtopic : Subtopic) => {
        setIsGenerating(true);
        setSelectedSubtopic(subtopic);
        setAnswer('');
        setQuestion(null);
        setEvaluationFeedback(null);
        setShowDialog(true);
        try {
                if (isTrial) {
                        const questions = await getQuestionsForSubtopic(subtopic.id);
                        if (questions.length === 0) {
                                throw new Error("No trial questions available for this subtopic.");
                              }
                        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
                         const response = `${randomQuestion.name} (${randomQuestion.marks} marks).\nExample mark scheme: ${randomQuestion.mark_scheme}`;
                        setQuestion(response);
                } else {
            const response = await getRevisionQuestion(subtopicName, subject.examBoard, subject.level);
                setQuestion(response);
                }
                
            toast({title: "Question Generated", description: "Here is your question!"});
        } catch {
            toast(
                {title: "Error", description: "Failed to generate question."}
            );
        } finally {
            setIsGenerating(false);
        
    }
};
    
const handleAnswerSubmit = async () => {
    if (!answer) {
        toast({title: "Error", description: "Please provide an answer."});
        return;
    }
        if (isTrial) {
      toast({
        title: "Action Required",
        description: "Please verify your email and log in to receive AI feedback.",
      });
      return;
    }
    setIsEvaluating(true);
    setEvaluationFeedback(null);
    try {
        const evaluation = await evaluateAnswer(answer, question || "", subject.examBoard, subject.level);
        setEvaluationFeedback(evaluation); // show in dialog
        toast({title: "Answer Evaluated", description: "Check the feedback below."});
    } catch {
        toast(
            {title: "Error", description: "Failed to evaluate answer."}
        );
    } finally {
        setIsEvaluating(false);
    
}};const handleGenerateRandomQuestion = () => {
if (subtopics.length === 0) {
    toast({title: "No Subtopics", description: "No subtopics to generate questions from."});
    return;
}
const random = subtopics[Math.floor(Math.random() * subtopics.length)];
handleGenerateQuestion(random.name, random);}
        ;return (
        <div className="space-y-6"> 
        {/* Subject header */}
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} />
            </Button>
            <div className="flex items-center gap-6 flex-wrap">
                <h3 className="text-lg font-medium">{subject.name}</h3>
                <Badge variant="outline" className="uppercase">{subject.examBoard}</Badge>
                <span className="text-sm text-muted-foreground">{subtopics.length} subtopics</span>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleGenerateRandomQuestion} 
              className="flex items-center gap-2"
              disabled={isGenerating}
            >
              <Shuffle size={16} className="mr-2" />
              Random Question
            </Button>
  </div>
    </div>
    <div className="grid gap-4 grid-cols-1">
  {subtopics.map((subtopic) => (
    <SubtopicCard
            key={subtopic.id}
            subtopic={subtopic}
            onLearntToggle={handleLearntToggle}
            onRevisedToggle={handleRevisedToggle}
            onGenerateQuestion={handleGenerateQuestion}
          />
  ))}
</div>
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
  <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
    <DialogHeader>
      <DialogTitle>AI Revision Chat</DialogTitle>
    </DialogHeader>
    <div className="flex-grow overflow-y-auto space-y-6 pr-2">
      {isGenerating && !question ? (
        <div className="text-center text-muted-foreground mt-10">Generating question...</div>
      ) : (
        selectedSubtopic && question && (
          <>
            <div className="flex flex-col gap-4">
              {/* AI asks a question */}
              <div className="self-start max-w-[75%] bg-accent p-3 rounded-xl">
                <p className="text-sm whitespace-pre-wrap">{question}</p>
              </div>

              {/* User answers */}
              {answer && (
                <div className="self-end max-w-[75%] bg-primary text-primary-foreground p-3 rounded-xl">
                  <p className="text-sm whitespace-pre-wrap">{answer}</p>
                </div>
              )}

              {/* Textarea for user input */}
              <textarea
                className="w-full border rounded-md p-2 text-sm"
                rows={3}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                disabled={isEvaluating}
              />
              <Button onClick={handleAnswerSubmit} disabled={isEvaluating || !answer}>
                {isEvaluating ? "Evaluating..." : "Submit Answer"}
              </Button>

              {/* AI feedback */}
              {evaluationFeedback && (
                <div className="self-start max-w-[75%] bg-muted/70 p-3 rounded-xl border border-muted">
                  <p className="text-sm whitespace-pre-wrap">{evaluationFeedback}</p>
                </div>
              )}
            </div>
          </>
        )
      )}
    </div>
  </DialogContent>
</Dialog>

<Dialog open={isLearning} onOpenChange={setIsLearning}>
  <DialogContent className="max-w-sm">
    <DialogHeader>
      <DialogTitle>Learning Session</DialogTitle>
      <DialogDescription>
        Timer is running. Close this dialog to continue working.
      </DialogDescription>
    </DialogHeader>
    <div className="text-2xl font-bold text-center text-green-600 mt-4">
      ⏱ {formatTime(elapsedTime)}
    </div>
    <div className="flex justify-end mt-6">
      <Button variant="destructive" onClick={() => {
        setIsLearning(false);
        setElapsedTime(0);
      }}>
        Stop Timer
      </Button>
    </div>
  </DialogContent>
</Dialog>
</div>
);
};
export default SubjectPage;
