import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Book, Check, Edit3, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { calculateProgress } from "@/utils/calculateProgress";

interface SubjectCardProps {
  subject: Subject;
  onRemoveSubject: (id: string) => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onRemoveSubject }) => {
  const navigate = useNavigate();

  const learntProgress = calculateProgress(subject, "learnt");
  const revisedProgress = calculateProgress(subject, "revised");

  return (
    <Card
      key={subject.id}
      className="relative group border-l-4 hover:shadow-md transition-shadow cursor-pointer"
      style={{ borderLeftColor: subject.iconColor }}
      onClick={() => navigate(`/subject/${subject.id}`)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center gap-2">
            <Book size={18} style={{ color: subject.iconColor }} />
            {subject.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="uppercase">
              {subject.examBoard}
            </Badge>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveSubject(subject.id);
              }}
              className="text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-700 transition-opacity"
              aria-label="Remove Subject"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <div className="flex items-center gap-1">
                <Check size={14} className="text-green-500" />
                <span>Learnt</span>
              </div>
              <span>{learntProgress}%</span>
            </div>
            <Progress value={learntProgress} className="h-1.5" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <div className="flex items-center gap-1">
                <Edit3 size={14} className="text-blue-500" />
                <span>Revised</span>
              </div>
              <span>{revisedProgress}%</span>
            </div>
            <Progress value={revisedProgress} className="h-1.5" />
          </div>
        </div>
        <Separator className="my-3" />
        <div className="text-xs text-muted-foreground">
          {subject.subtopics.length} subtopics
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectCard;
