import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, Edit3, HelpCircle, Shuffle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getRevisionQuestion, evaluateAnswer } from "@/services/openaiService";
import { toast } from "@/components/ui/use-toast";
import { Subtopic } from "@/types";

const SubjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, loading } = useUser();
  const [subject, setSubject] = useState<any | null>(null);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [selectedSubtopic, setSelectedSubtopic] = useState<Subtopic | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user?.subjects && id) {
      const subject = user.subjects.find((s) => String(s.id) === String(id));
      if (subject) {
        setSubtopics(subject.subtopics);
        setSubject(subject);
      }
    }
  }, [user, id, loading]);

  const handleLearntToggle = (subtopicId: string) => {
    setSubtopics((prev) =>
      prev.map((st) =>
        st.id === subtopicId
          ? {
              ...st,
              learnt: st.learnt === 1 ? 0 : 1,
            }
          : st
      )
    );
  };

  const handleRevisedToggle = (subtopicId: string) => {
    setSubtopics((prev) =>
      prev.map((st) =>
        st.id === subtopicId
          ? {
              ...st,
              revised: st.revised === 1 ? 0 : 1,
            }
          : st
      )
    );
  };

  const handleGenerateQuestion = async (subtopicName: string, subtopic: Subtopic) => {
    setIsGenerating(true);
    setSelectedSubtopic(subtopic);
    setAnswer('');
    setQuestion(null);
    setEvaluationFeedback(null);
    setShowDialog(true);
    try {
      const response = await getRevisionQuestion(subtopicName, subject.examBoard, subject.level);
      setQuestion(response);
      toast({ title: "Question Generated", description: "Here is your question!" });
    } catch {
      toast({ title: "Error", description: "Failed to generate question." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!answer) {
      toast({ title: "Error", description: "Please provide an answer." });
      return;
    }
    setIsEvaluating(true);
    setEvaluationFeedback(null);
    try {
      const evaluation = await evaluateAnswer(answer, question || "", subject.examBoard, subject.level);
      setEvaluationFeedback(evaluation);
      toast({ title: "Answer Evaluated", description: "Check the feedback below." });
    } catch {
      toast({ title: "Error", description: "Failed to evaluate answer." });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleGenerateRandomQuestion = () => {
    if (subtopics.length === 0) {
      toast({ title: "No Subtopics", description: "No subtopics to generate questions from." });
      return;
    }
    const random = subtopics[Math.floor(Math.random() * subtopics.length)];
    handleGenerateQuestion(random.name, random);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!subject) {
    return <div className="text-center mt-8">Subject not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Subject header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h3 className="text-2xl font-semibold">{subject.name}</h3>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="uppercase">{subject.examBoard}</Badge>
              <span className="text-sm text-muted-foreground">{subtopics.length} subtopics</span>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={handleGenerateRandomQuestion} className="ml-auto py-2 px-6">
          <Shuffle size={16} className="mr-2" />
          Random Question
        </Button>
      </div>

      {/* Subtopic cards */}
      <div className="space-y-3">
        {subtopics.map((subtopic) => (
          <Card key={subtopic.id} className="p-4 flex items-center justify-between gap-4 hover:bg-accent/10 transition-colors">
            <div className="flex-grow">
              <h4 className="font-medium">{subtopic.name}</h4>
              {subtopic.description && (
                <p className="text-sm text-muted-foreground mt-1">{subtopic.description}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Generate Question Button */}
              <Button variant="outline" size="sm" onClick={() => handleGenerateQuestion(subtopic.name, subtopic)}>
                <HelpCircle size={16} className="mr-1" />
                Generate Question
              </Button>

              {/* Mark Learnt Button */}
              <Button variant={subtopic.learnt ? "default" : "outline"} size="sm" onClick={() => handleLearntToggle(subtopic.id)}>
                <Check size={16} />
                {subtopic.learnt ? "Learnt" : "Mark Learnt"}
              </Button>

              {/* Mark Revised Button */}
              <Button variant={subtopic.revised ? "secondary" : "outline"} size="sm" onClick={() => handleRevisedToggle(subtopic.id)}>
                <Edit3 size={16} />
                {subtopic.revised ? "Revised" : "Mark Revised"}
              </Button>
            </div>
          </Card>
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
    </div>
  );
};

export default SubjectPage;
