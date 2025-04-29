import { Toaster } from "@/components/ui/toaster"; 
import { Toaster as Sonner } from "@/components/ui/sonner"; 
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SubjectPage from "@/pages/SubjectPage";
import ProtectedRoute from '@/components/ProtectedRoute';
import useTrackUserInteractions from "@/hooks/useTrackUserInteractions"; 
import { UserProvider } from "@/context/UserContext";

const App = () => {
  console.log("App Component Loaded");

  useTrackUserInteractions(); // Tracking user interactions

  return (
    <UserProvider>
      <div>
        <h1>App is loading</h1>
      </div>
    </UserProvider>
  );
};

export default App;
