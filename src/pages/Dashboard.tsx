import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MilestoneTimeline from "@/components/MilestoneTimeline";
import CalendarTimeline from "@/components/CalendarTimeline";
import SubjectTab from "@/components/SubjectTab";
import PersonalityTab from "@/components/PersonalityTab";
import MotivationTab from "@/components/MotivationTab";
import Footer from '@/components/Footer';
import OnboardingModal from "@/components/login/OnboardingModal";
import { Book, User, Lightbulb, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import useSubjects from "@/hooks/getSubjects";
import useExamBoards from "@/hooks/getExamBoards";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import useLogout from "@/hooks/useLogout";

const Dashboard = () => {
  const isTrial = sessionStorage.getItem("isTrial") === "true";
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { allSubjects, loadingSubjects } = useSubjects();
  const { allExamBoards, loadingExamBoards } = useExamBoards();
  const { user, loading: userLoading } = useUser();
  const logout = useLogout();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!userLoading && !user && !isTrial) {
      navigate("/login"); 
  }
  const shouldShow = sessionStorage.getItem("showOnboarding");
  if (shouldShow === "true") {
    setShowOnboarding(true);
    sessionStorage.removeItem("showOnboarding");
  }
}, [user, userLoading, isTrial, navigate]);
  
  if (loadingSubjects || loadingExamBoards || userLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-medium">
        Loading your Dashboard...
      </div>
    );
  }
const handleOnboardingComplete = () => {
  setShowOnboarding(false);
};
  return (
    <div className={"min-h-screen flex flex-col bg-background"}>
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-brand-purple" />
          <span className="font-bold text-xl text-gray-900">Revilaition</span>
              </Link>
            <span className="text-muted-foreground">|</span>
            <span>
              {isTrial 
                ? <strong>Verify your email and log in to unlock full feature!</strong>
                : `${user?.name ? `${user.name}'s` : "Your"} Dashboard`}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate("/subscription")}>Subscribe for Full Access</Button>
            {isTrial ? (
              <Button onClick={() => navigate("/login")}>Verify & Login to end trial mode</Button>
            ) : (
            <Button variant="outline" onClick={logout}>Log Out</Button>
            )}
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 flex-grow">
        {isTrial && (
          <div className="mb-4 p-4 rounded-md bg-yellow-100 text-yellow-900 border border-yellow-300">
            <strong>You're in Trial Mode:</strong> Welcome to Revilaition! You're currently exploring with limited features. 
<strong>Verify your email and log in</strong> to unlock full AI-powered revision tools and insights.
          </div>
        )}
        {showOnboarding && (
        <OnboardingModal usedId = {user.id} onComplete={handleOnboardingComplete}/>
      )}
        <div className="mb-8">
          <MilestoneTimeline milestones={user?.milestones || []} isTrial={isTrial} />
        </div>
        <div className="mb-8">
          <CalendarTimeline events={user?.events || []} subjects={user?.subjects || []} userId={user.id} />
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
                isTrial={isTrial}
              />
            </TabsContent>
            <TabsContent value="personality">
              <PersonalityTab isTrial={isTrial}/>
            </TabsContent>
            <TabsContent value="motivation">
              <MotivationTab isTrial={isTrial}/>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
