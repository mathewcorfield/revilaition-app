import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MilestoneTimeline from "@/components/MilestoneTimeline";
import CalendarTimeline from "@/components/CalendarTimeline";
import SubjectTab from "@/components/SubjectTab";
import PersonalityTab from "@/components/PersonalityTab";
import MotivationTab from "@/components/MotivationTab";
import {PageHeader} from "@/components/PageHeader";
import {PageFooter} from '@/components/PageFooter';
import OnboardingModal from "@/components/login/OnboardingModal";
import { Book, User, Lightbulb, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RevilAItionText } from "@/components/RevilAItionText";
import { useUser } from "@/context/UserContext";
import useSubjects from "@/hooks/getSubjects";
import useExamBoards from "@/hooks/getExamBoards";
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
      return; 
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
const actions = isTrial ? (
  <>
    <Button onClick={() => navigate("/subscription")}>Subscribe for Full Access</Button>
    <Button onClick={() => navigate("/login")}>Verify & Login to end trial mode</Button>
  </>
) : (
  <>
    <Button onClick={() => navigate("/subscription")}>Subscription</Button>
    <Button variant="outline" onClick={logout}>Log Out</Button>
  </>
);
  return (
    <div className={"min-h-screen flex flex-col bg-background"}>
      <PageHeader isTrial={isTrial} actions={actions}/>
      <main className="container mx-auto p-4 flex-grow">
        {isTrial && (
          <div className="mb-4 p-4 rounded-md bg-yellow-100 text-yellow-900 border border-yellow-300">
            <strong>You're in Trial Mode:</strong> Welcome to Revilaition! You're currently exploring with limited features. 
<strong>Verify your email and log in</strong> to unlock full AI-powered revision tools and insights.
          </div>
        )}
        {showOnboarding && (
        <OnboardingModal userId = {user.id} onComplete={handleOnboardingComplete}/>
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
      <PageFooter />
    </div>
  );
};

export default Dashboard;
