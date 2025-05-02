import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MilestoneTimeline from "@/components/MilestoneTimeline";
import CalendarTimeline from "@/components/CalendarTimeline";
import SubjectTab from "@/components/SubjectTab";
import PersonalityTab from "@/components/PersonalityTab";
import MotivationTab from "@/components/MotivationTab";
import Footer from '@/components/Footer';
import { Book, User, Lightbulb, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import useSubjects from "@/hooks/getSubjects";
import useExamBoards from "@/hooks/getExamBoards";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import useLogout from "@/hooks/useLogout";

const Dashboard = () => {
  useAuthRedirect();
  
  const { allSubjects, loadingSubjects } = useSubjects();
  const { allExamBoards, loadingExamBoards } = useExamBoards();
  const { user, loading: userLoading } = useUser();
  const logout = useLogout();
  
  if (loadingSubjects || loadingExamBoards || userLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-medium">
        Loading your Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-brand-purple" />
          <span className="font-bold text-xl text-gray-900">Revilaition</span>
              </Link>
            <span className="text-muted-foreground">|</span>
            <span>{user?.name ? `${user.name}'s` : "Your"} Dashboard</span>
          </div>
          <Button variant="outline" onClick={logout}>Log Out</Button>
        </div>
      </header>
      <main className="container mx-auto p-4 flex-grow">
        <div className="mb-8">
          <MilestoneTimeline milestones={user?.milestones || []} />
        </div>
        <div className="mb-8">
          <CalendarTimeline events={user?.events || []} />
        </div>
        <div className="border rounded-lg shadow-sm bg-white p-4">
          <Tabs defaultValue="subjects" className="w-full">
            <TabsList className="mb-8 border p-1 rounded-md bg-secondary">
              <TabsTrigger value="subjects" className="flex items-center gap-2">
                <Book size={18} /> Subjects
              </TabsTrigger>
              <TabsTrigger value="personality" className="flex items-center gap-2">
                <User size={18} /> Personality
              </TabsTrigger>
              <TabsTrigger value="motivation" className="flex items-center gap-2">
                <Lightbulb size={18} /> Motivation
              </TabsTrigger>
            </TabsList>
            <TabsContent value="subjects">
              <SubjectTab 
                subjects={user?.subjects || []} 
                availableSubjects={allSubjects} 
                availableExamBoards={allExamBoards}
              />
            </TabsContent>
            <TabsContent value="personality">
              <PersonalityTab />
            </TabsContent>
            <TabsContent value="motivation">
              <MotivationTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
