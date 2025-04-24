import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChatBot } from "@/components/ChatBot"; // Import the new chat bot component

interface SubjectDetailProps {
  subject: Subject;
  onBack: () => void;
}

const SubjectDetail: React.FC<SubjectDetailProps> = ({ subject, onBack }) => {
  const [subtopics, setSubtopics] = useState<Subtopic[]>(subject.subtopics);
  const [selectedSubtopic, setSelectedSubtopic] = useState<Subtopic | null>(null);
  const [showChatBot, setShowChatBot] = useState(false);

  const handleGenerateRandomQuestion = () => {
    if (subtopics.length === 0) {
      alert("No subtopics available.");
      return;
    }

    const randomIndex = Math.floor(Math.random() * subtopics.length);
    const randomSubtopic = subtopics[randomIndex];
    setSelectedSubtopic(randomSubtopic);
    setShowChatBot(true); // Show chat bot UI for interaction
  };

  return (
    <div className="space-y-6">
      {/* Other subject detail UI */}
      <Dialog open={showChatBot} onOpenChange={setShowChatBot}>
        <DialogTrigger asChild>
          <Button onClick={handleGenerateRandomQuestion}>
            Generate Random Question
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chat Bot: Revision</DialogTitle>
          </DialogHeader>
          {selectedSubtopic && (
            <ChatBot
              subtopicName={selectedSubtopic.name}
              examBoard={subject.examBoard}
              level={subject.level}
              onBack={() => setShowChatBot(false)} // Close the chat bot UI when back is clicked
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubjectDetail;
