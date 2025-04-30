import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MilestoneTimeline from "@/components/MilestoneTimeline";
import CalendarTimeline from "@/components/CalendarTimeline";
import SubjectTab from "@/components/SubjectTab";
import PersonalityTab from "@/components/PersonalityTab";
import MotivationTab from "@/components/MotivationTab";
import Footer from '@/components/Footer';
import { Book, User, Lightbulb, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/context/UserContext";
import { getAllSubjectNames, getAllExamBoards } from "@/services/dataService";

const { toast } = useToast();
const Dashboard = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [allSubjects, setAllSubjects] = useState<any[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [allExamBoards, setAllExamBoards] = useState<any[]>([]);
  const [loadingExamBoards, setLoadingExamBoards] = useState(true);

useEffect(() => {
    const subcached = sessionStorage.getItem("allSubjects");
    const examcached = sessionStorage.getItem("allExamBoards");
    if (subcached) {
      setAllSubjects(JSON.parse(subcached));
      setLoadingSubjects(false);
    } else {
      getAllSubjectNames().then((data) => {
        setAllSubjects(data);
        sessionStorage.setItem("allSubjects", JSON.stringify(data));
        setLoadingSubjects(false);
      });
    }
  if (examcached) {
      setAllExamBoards(JSON.parse(examcached));
      setLoadingExamBoards(false);
    } else {
      getAllExamBoards().then((data) => {
        setAllExamBoards(data);
        sessionStorage.setItem("allExamBoards", JSON.stringify(data));
        setLoadingExamBoards(false);
      });
    }
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

if (loading) {
  return (
    <div className="flex items-center justify-center h-screen text-xl font-medium">
      Loading...
    </div>
  );
}

  if (!user) return null;

const handleLogout = async () => {
  try {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    navigate("/login");
  } catch (error) {
    console.error("Logout error:", error);
    toast({
      title: "Logout Error",
      description: "There was an issue logging out. Please try again.",
    });
  }
};

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
          <GraduationCap className="h-8 w-8 text-brand-purple" />
          <span className="font-bold text-xl text-gray-900">Revilaition</span>
            <span className="text-muted-foreground">|</span>
            <span>{user?.name ?? "Your"}'s Dashboard</span>
          </div>
          <Button variant="outline" onClick={handleLogout}>Log Out</Button>
        </div>
      </header>
      <main className="container mx-auto p-4 flex-grow">
        <div className="mb-8">
          <MilestoneTimeline milestones={user.milestones} />
        </div>
        <div className="mb-8">
          <CalendarTimeline events={user.events} />
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
                userId={user.id} 
                subjects={user.subjects} 
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
