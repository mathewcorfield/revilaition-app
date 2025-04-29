import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";  // Keep only if it's necessary to use both
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

const queryClient = new QueryClient();

const App = () => {
  // Track user interactions globally (click and submit currently)
  useTrackUserInteractions();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster /> {/* Make sure you only need this one */}
        <Sonner />  {/* Use this only if it's necessary; otherwise, remove it */}
          <UserProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/subject/:id" element={<SubjectPage />} />
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
