import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
