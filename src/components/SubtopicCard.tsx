import {    Check,    Edit3,    HelpCircle} from "lucide-react";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

interface Props {
  subtopic: Subtopic;
  onToggle: (subtopicid: string) => void;
  onGenerateQuestion: (subtopicName: string, subtopic: Subtopic) => void;
}

export const SubtopicCard: React.FC<Props> = ({ subtopic, onToggle, onGenerateQuestion }) => (
  <Card className="p-4 flex items-center justify-between gap-4 hover:bg-accent/10 transition-colors">
    <div className="flex-grow">
      <h4 className="font-medium">{subtopic.name}</h4>
      {subtopic.description && <p className="text-sm text-muted-foreground mt-1">{subtopic.description}</p>}
    </div>
    <div className="flex items-center gap-2">
      <Button variant={subtopic.learnt ? "default" : "outline"} size="sm" onClick={() => onToggle(subtopic, "learnt")}>
        <Check size={16} /> {subtopic.learnt ? "Learnt" : "Mark as Learnt"}
      </Button>
      <Button variant={subtopic.revised ? "secondary" : "outline"} size="sm" onClick={() => onToggle(subtopic, "revised")}>
        <Edit3 size={16} /> {subtopic.revised ? "Revised" : "Mark as Revised"}
      </Button>
      <Button variant="outline" size="sm" onClick={() => onGenerateQuestion(subtopic.name, subtopic)}>
        <HelpCircle size={16} />
        Generate Question
      </Button>
    </div>
  </Card>
);
