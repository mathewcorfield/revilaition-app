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
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import ProtectedRoute from '@/components/ProtectedRoute';
import useTrackUserInteractions from "@/hooks/useTrackUserInteractions"; 
import { UserProvider } from "@/context/UserContext";

const queryClient = new QueryClient();

const App = () => {
  
 useTrackUserInteractions(); // Tracking user interactions
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster /> {/* Make sure you only need this one */}
        <Sonner />  {/* Use this only if it's necessary */}
          <UserProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/subject/:id" element={<SubjectPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
