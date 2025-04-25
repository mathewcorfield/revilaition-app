import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, Edit3, HelpCircle, Shuffle } from "lucide-react";
import { Subject, Subtopic } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  getRevisionQuestion,
  evaluateAnswer
} from "@/services/openaiService";
import { mockUser } from "@/data/mockData";

const SubjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get subject id from URL
  const subject = mockUser.subjects.find((subject) => subject.id === id); // Find the subject by ID from mock data

  // If subject not found, show error message
  if (!subject) {
    return <div className="text-center mt-8">Subject not found</div>;
  }

  const [subtopics, setSubtopics] = useState<Subtopic[]>(subject.subtopics);
  const [selectedSubtopic, setSelectedSubtopic] = useState<Subtopic | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleLearntToggle = (subtopicId: string) => {
    setSubtopics(subtopics.map(st => 
      st.id === subtopicId ? { ...st, learnt: st.learnt === 1 ? 0 : 1 } : st
    ));
  };

  const handleRevisedToggle = (subtopicId: string) => {
    setSubtopics(subtopics.map(st => 
      st.id === subtopicId ? { ...st, revised: st.revised === 1 ? 0 : 1 } : st
    ));
  };

  const handleGenerateQuestion = async (subtopicName: string) => {
    setLoading(true);
    try {
      const response = await getRevisionQuestion(subtopicName, subject.examBoard, subject.level);
      setQuestion(response);
      toast({ title: "Question Generated", description: "Here is your question!" });
    } catch {
      toast({ title: "Error", description: "Failed to generate question." });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!answer) {
      toast({ title: "Error", description: "Please provide an answer." });
      return;
    }
    setLoading(true);
    try {
      const evaluation = await evaluateAnswer(answer, question || "", subject.examBoard, subject.level);
      toast({ title: "Answer Evaluated", description: `Feedback: ${evaluation}` });
    } catch {
      toast({ title: "Error", description: "Failed to evaluate answer." });
    } finally {
      setLoading(false);
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
              {selectedSubtopic && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Topic:</h4>
                    <p>{selectedSubtopic.name}</p>
                  </div>
                  {question && (
                    <div className="bg-accent p-4 rounded-md">
                      <p className="text-sm">{question}</p>
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
          <Card key={subtopic.id} className="p-4 flex items-center justify-between gap-4 hover:bg-accent/10 transition-colors">
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
                  <div className="py-4 space-y-4">
                    <div>
                      <h4 className="font-medium">Topic:</h4>
                      <p>{subtopic.name}</p>
                    </div>
                    {question && (
                      <div className="bg-accent p-4 rounded-md">
                        <p className="text-sm">{question}</p>
                      </div>
                    )}
                    <Button className="w-full">
                      <HelpCircle size={16} className="mr-2" />
                      Answer Question
                    </Button>
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

export default SubjectPage;
