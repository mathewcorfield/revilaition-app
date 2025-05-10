import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {ArrowLeft,   Shuffle} from "lucide-react";
import {useUser} from "@/context/UserContext";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Dialog,    DialogContent,    DialogHeader,    DialogTitle,    DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import {toast} from "@/components/ui/use-toast";
import { SubtopicCard } from "@/components/SubtopicCard";
import {Subtopic} from "@/types";
import {getRevisionQuestion, evaluateAnswer} from "@/services/openaiService";
import {addUserSubtopic, getQuestionsForSubtopic, addQuestion, addUserAnswer, updateUserAnswer} from "@/services/dataService";
import {useSubjectData } from "@/hooks/useSubjectData";
import {useLearningTimer } from "@/hooks/useLearningTimer";
import {parseQuestion } from "@/utils/parseQuestion";
import { logError } from '@/utils/logError';
import {PageFooter} from '@/components/PageFooter';
import {PageHeader} from "@/components/PageHeader";
        
const SubjectPage: React.FC = () => {
  const isTrial = sessionStorage.getItem("isTrial") === "true";
  const navigate = useNavigate();
  const {id} = useParams();
  const {user, loading, setUser} = useUser();
  const { subject, subtopics, setSubject, setSubtopics } = useSubjectData(user, id, loading);
  const [selectedSubtopic, setSelectedSubtopic] = useState <Subtopic | null >(null);
  const [question, setQuestion] = useState <string | null >(null);
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [answer, setAnswer] = useState <string >('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState < string | null > (null);

  const userId = user?.id;
  const subtopicId = selectedSubtopic?.id;
  const {isLearning,    elapsedTime,    formatTime,   handleStartLearning, handleStopLearning} = useLearningTimer({    userId,    subtopicId,  });

  useEffect(() => {
      if (!loading && !user && !isTrial) {
        navigate("/login"); // or homepage
      }
    }, [user, loading, isTrial, navigate]);
  if (loading) {
          return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  if (!subject) {
          return <div className="text-center mt-8">Subject not found</div>;
  }
  
  
  const handleToggle = async (subtopic: Subtopic, type: "learnt" | "revised") => {
    const newValue = subtopic[type] === 1 ? 0 : 1;
    try {
            if (!isTrial) {
      await addUserSubtopic(user.id, subtopic.id, { [type]: newValue });
            }
      const updatedSubjects = user.subjects.map(subject => {
        if (String(subject.id) === String(id)) {
          return {
            ...subject,
            subtopics: subject.subtopics.map(st =>
              st.id === subtopic.id ? { ...st, [type]: newValue } : st
            ),
          };
        }
        return subject;
      });

      setUser({ ...user, subjects: updatedSubjects });

      toast({
        title: newValue === 1 ? `Marked as ${type}` : `Unmarked as ${type}`,
        description: `You have ${newValue === 1 ? `marked` : "unmarked"} the topic: "${subtopic.name}"`,
      });

      newValue === 1 ? handleStartLearning() : handleStopLearning();
    } catch (err) {
      logError("[SubjectPage] Error handling toggle:", err);
      toast({ title: "Error", description: `Failed to update ${type} status.` });
    }
  };
const handleGenerateQuestion = async (subtopic : Subtopic) => {
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
      const response = `${randomQuestion.name} (${randomQuestion.marks} marks).`;
      setQuestion(response);
      } else {
      const response = await getRevisionQuestion(subtopic.name, subject.examBoard, subject.level);
      setQuestion(response);
      try {
        const parsed = parseQuestion(response); 
        const id = await addQuestion(userId, parsed.questionName, parsed.marks, subtopic.id);
        setQuestionId(id);
      } catch (error) {
        logError("[SubjectPage] Error adding Question to database:", error);
      }
      }
    toast({title: "Question Generated", description: "Here is your question!"});
  } catch (error) {
    logError("[SubjectPage] Failed to generate question.", error);
    toast({title: "Error", description: "Failed to generate question."});
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
    const id = await addUserAnswer(userId, questionId , answer);
    setIsEvaluating(true);
    setEvaluationFeedback(null);
    try {
        const evaluation = await evaluateAnswer(answer, question, subject.examBoard, subject.level);
        setEvaluationFeedback(evaluation); 
        const parsed = parseQuestion(evaluation); 
        await updateUserAnswer(id, evaluation, parsed?.marks || null);
        toast({title: "Answer Evaluated", description: "Check the feedback below."});
    } catch (error) {
      logError("[SubjectPage] Error evaluating answer", error);
      toast({title: "Error", description: "Failed to evaluate answer."});
    } finally {
      setIsEvaluating(false);
}};
        
const handleGenerateRandomQuestion = () => {
if (subtopics.length === 0) {
    toast({title: "No Subtopics", description: "No subtopics to generate questions for."});
    return;
}
const random = subtopics[Math.floor(Math.random() * subtopics.length)];
handleGenerateQuestion(random);
};
const actions = (
    <>
      <Badge variant="outline" className="uppercase text-lg font-medium">{subject.examBoard}</Badge>
      <span className="text-lg font-medium">{subtopics.length} subtopics</span>
      <Button 
        variant="outline" 
        onClick={handleGenerateRandomQuestion} 
        className="flex items-center gap-2"
        disabled={isGenerating}
      >
        <Shuffle size={16} className="mr-2" />
        Random Question
      </Button>
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft size={18} />
          </Button>
    </>
  );
return (
  <div key={id} className="min-h-screen flex flex-col">
    <PageHeader isTrial={isTrial} actions={actions} title={subject.name}/>
    <div className="grid gap-4 grid-cols-1">
      {subtopics.map((subtopic) => (
        <SubtopicCard
          key={subtopic.id}
          subtopic={subtopic}
          onToggle={handleToggle}
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
              <Button onClick={handleAnswerSubmit} disabled={isEvaluating || !answer || !question}>
                {isEvaluating ? "Evaluating..." : "Submit Answer"}
              </Button>

              {/* AI feedback */}
              {evaluationFeedback && (
                <div className="self-start max-w-[75%] bg-muted/70 p-3 rounded-xl border border-muted">
                  <p className="text-sm whitespace-pre-wrap">{evaluationFeedback}</p>
                </div>
              )}
            </div>
        )
      )}
    </div>
  </DialogContent>
</Dialog>

<Dialog open={isLearning} onOpenChange={() => {}}>
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
      <Button variant="destructive" onClick={() => {handleStopLearning();}}>
        Stop Timer
      </Button>
    </div>
  </DialogContent>
</Dialog>
<PageFooter />
</div>
);
};
export default SubjectPage;
