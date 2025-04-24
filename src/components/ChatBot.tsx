import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getRevisionQuestion, evaluateAnswer } from "@/services/openaiService";
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

  // Fetch the question when component mounts
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

  // Submit the answer for evaluation
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

  // Fetch question on component mount
  useState(() => {
    fetchQuestion();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <Button onClick={onBack} variant="ghost" className="mb-4 text-sm text-gray-500">
        &lt; Back to Subtopics
      </Button>

      {/* Chatbot Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-primary">Revision Chat Bot</h2>
        <p className="text-gray-500 text-sm">Get personalized revision questions and feedback.</p>
      </div>

      {/* Question Section */}
      {question && (
        <div className="mb-6 p-4 bg-gray-50 border rounded-md">
          <h4 className="font-medium text-lg text-gray-800">Your Question:</h4>
          <p className="text-gray-700 mt-2">{question}</p>
        </div>
      )}

      {/* Answer Section */}
      <div className="mb-6">
        <h4 className="font-medium text-lg text-gray-800">Your Answer:</h4>
        <Textarea
          rows={5}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full p-4 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
        />
      </div>

      {/* Submit Button */}
      <Button
        onClick={submitAnswer}
        className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors duration-200"
        disabled={loading}
      >
        {loading ? "Evaluating..." : "Submit Answer"}
      </Button>

      {/* AI Feedback Section */}
      {feedback && (
        <div className="mt-6 p-4 border-2 border-gray-300 rounded-md bg-gray-100">
          <h4 className="font-medium text-lg text-gray-800">AI's Feedback:</h4>
          <p className="text-gray-700 mt-2">{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
