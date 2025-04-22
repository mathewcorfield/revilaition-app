import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

const PersonalityTab = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <User size={18} />
        Personality & Learning Style
      </h3>
      
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Learning Style Assessment</CardTitle>
          <CardDescription>
            Discover how you learn best to optimize your study approach
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">
            Coming Soon! Personality assessments and learning style profiles will be available in future updates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalityTab;
