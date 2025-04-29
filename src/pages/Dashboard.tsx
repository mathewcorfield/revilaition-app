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
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/context/UserContext";
import { mockUser } from "@/data/mockData";

const Dashboard = () => {
  const [user, setUser] = useState(mockUser); // Mock user data
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      navigate("/login"); // Just navigate to login for now
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user) return null;

  return (
    <div>
      <h1>{user.name}'s Dashboard</h1>
      <Button onClick={handleLogout}>Log Out</Button>
    </div>
  );
};

export default Dashboard;
