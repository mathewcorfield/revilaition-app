import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getRevisionQuestion, evaluateAnswer } from "@/services/openaiService"; // Import OpenAI service
import { useToast } from "@/hooks/use-toast"; 

interface ChatBotProps {
  subtopicName: string;
  examBoard: string;
  level: string;
  onBack: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ subtopicName, examBoard, level, onBack }) => {
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const response = await getRevisionQuestion(subtopicName, examBoard, level);
      setQuestion(response);
      toast({ title: "Question Generated", description: "Here is your revision question." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate question." });
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer) {
      toast({ title: "Error", description: "Please enter an answer." });
      return;
    }

    setLoading(true);

    try {
      const evaluation = await evaluateAnswer(answer, question || "", examBoard, level);
      setFeedback(evaluation);
      toast({ title: "Answer Evaluated", description: "Here is your feedback." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to evaluate your answer." });
    } finally {
      setLoading(false);
    }
  };

  // Fetch question when the component is mounted
  useState(() => {
    fetchQuestion();
  }, []);
  
  return (
    <div className="space-y-6 p-4">
      <Button onClick={onBack} variant="ghost">
        Back to Subtopics
      </Button>
      <div className="space-y-4">
        {question && (
          <div>
            <h4 className="font-medium">Question:</h4>
            <p>{question}</p>
          </div>
        )}
        
        <div>
          <h4 className="font-medium">Your Answer:</h4>
          <Textarea 
            rows={4} 
            value={answer} 
            onChange={(e) => setAnswer(e.target.value)} 
            placeholder="Type your answer here..." 
          />
        </div>

        <Button onClick={submitAnswer} disabled={loading}>
          {loading ? "Evaluating..." : "Submit Answer"}
        </Button>

        {feedback && (
          <div className="mt-4 p-4 border rounded-md">
            <h4 className="font-medium">AI's Feedback:</h4>
            <p>{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBot;
