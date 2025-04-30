import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, Edit3, HelpCircle, Shuffle } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
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
  const [isLoading, setIsLoading] = useState(false);

  console.log("Route id:", id);
  console.log("Available subjects:", user?.subjects.map(s => s.id));
  
useEffect(() => {
  if (!loading && user?.subjects && id) {
    const subject = user.subjects.find((s) => String(s.id) === String(id));
    if (subject) {
      setSubtopics(subject.subtopics);
      setSubject(subject); // Use local subject state
    }
  }
}, [user, id, loading]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!subject) {
    return <div className="text-center mt-8">Subject not found</div>;
  }

  const handleLearntToggle = (subtopicId: string) => {
    setSubtopics((prev) =>
      prev.map((st) =>
        st.id === subtopicId ? { ...st, learnt: st.learnt === 1 ? 0 : 1 } : st
      )
    );
  };

  const handleRevisedToggle = (subtopicId: string) => {
    setSubtopics((prev) =>
      prev.map((st) =>
        st.id === subtopicId ? { ...st, revised: st.revised === 1 ? 0 : 1 } : st
      )
    );
  };

  const handleGenerateQuestion = async (subtopicName: string) => {
    setIsLoading(true);
    try {
      const response = await getRevisionQuestion(subtopicName, subject.examBoard, subject.level);
      setQuestion(response);
      toast({ title: "Question Generated", description: "Here is your question!" });
    } catch {
      toast({ title: "Error", description: "Failed to generate question." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!answer) {
      toast({ title: "Error", description: "Please provide an answer." });
      return;
    }
    setIsLoading(true);
    try {
      const evaluation = await evaluateAnswer(answer, question || "", subject.examBoard, subject.level);
      toast({ title: "Answer Evaluated", description: `Feedback: ${evaluation}` });
    } catch {
      toast({ title: "Error", description: "Failed to evaluate answer." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateRandomQuestion = () => {
    if (subtopics.length === 0) {
      toast({ title: "No Subtopics", description: "No subtopics to generate questions from." });
      return;
    }
    const random = subtopics[Math.floor(Math.random() * subtopics.length)];
    setSelectedSubtopic(random);
    handleGenerateQuestion(random.name);
  };

  return (
    <div className="space-y-6">
      {/* Subject header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h3 className="text-lg font-medium">{subject.name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="uppercase">{subject.examBoard}</Badge>
              <span className="text-sm text-muted-foreground">{subtopics.length} subtopics</span>
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
              {selectedSubtopic && question && (
                <>
                  <h4 className="font-medium">Topic: {selectedSubtopic.name}</h4>
                  <div className="bg-accent p-4 rounded-md">{question}</div>
                  <textarea
                    className="w-full p-2 border rounded-md mt-2"
                    rows={4}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                  />
                  <Button onClick={handleAnswerSubmit} className="w-full mt-4" disabled={isLoading}>
                    {isLoading ? "Evaluating..." : "Submit Answer"}
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Subtopic cards */}
      <div className="space-y-3">
        {subtopics.map((subtopic) => (
          <Card key={subtopic.id} className="p-4 flex items-center justify-between gap-4 hover:bg-accent/10 transition-colors">
            <div className="flex-grow">
              <h4 className="font-medium">{subtopic.name}</h4>
              {subtopic.description && <p className="text-sm text-muted-foreground mt-1">{subtopic.description}</p>}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={subtopic.learnt ? "default" : "outline"}
                size="sm"
                onClick={() => handleLearntToggle(subtopic.id)}
              >
                <Check size={16} />
                {subtopic.learnt ? "Learnt" : "Mark Learnt"}
              </Button>

              <Button
                variant={subtopic.revised ? "secondary" : "outline"}
                size="sm"
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
                    {question && <div className="bg-accent p-4 rounded-md">{question}</div>}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubjectPage;
