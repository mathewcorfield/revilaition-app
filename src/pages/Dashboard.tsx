import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MilestoneTimeline from "@/components/MilestoneTimeline";
import CalendarTimeline from "@/components/CalendarTimeline";
import SubjectTab from "@/components/SubjectTab";
import PersonalityTab from "@/components/PersonalityTab";
import MotivationTab from "@/components/MotivationTab";
import Footer from '@/components/Footer';
import { Book, User, Lightbulb, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockUser } from "@/data/mockData";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
          <GraduationCap className="h-8 w-8 text-brand-purple" />
          <span className="font-bold text-xl text-gray-900">Revilaition</span>
            <span className="text-muted-foreground">|</span>
            <span>{mockUser.name}'s Dashboard</span>
          </div>
          <Button variant="outline" onClick={handleLogout}>Log Out</Button>
        </div>
      </header>
      <main className="container mx-auto p-4 flex-grow">
        <div className="mb-8">
          <MilestoneTimeline milestones={mockUser.milestones} />
        </div>
        <div className="mb-8">
          <CalendarTimeline events={mockUser.events} />
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
                subjects={mockUser.subjects} 
                availableSubjects={mockUser.availableSubjects} 
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
