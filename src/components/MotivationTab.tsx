import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const MotivationTab = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Lightbulb size={18} />
        Motivation & Goals
      </h3>
      
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Motivation Dashboard</CardTitle>
          <CardDescription>
            Stay motivated and track your progress towards your educational goals
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">
            Coming Soon! Motivation tracking and goal setting features will be available in future updates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MotivationTab;
