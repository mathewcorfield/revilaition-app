import { Toaster } from "@/components/ui/toaster"; 
import { Toaster as Sonner } from "@/components/ui/sonner"; 
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SubscriptionPage from "@/pages/SubscriptionPage";
import SuccessPage from "@/pages/SuccessPage";
import SubjectPage from "@/pages/SubjectPage";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import ProtectedRoute from '@/components/ProtectedRoute';
import useTrackUserInteractions from "@/hooks/useTrackUserInteractions"; 
import { UserProvider } from "@/context/UserContext";
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

const queryClient = new QueryClient();
const sentry_dsn = import.meta.env.VITE_SENTRY_DSN;
// Initialize Sentry with your DSN (Data Source Name)
Sentry.init({
  dsn: sentry_dsn, // Replace with your actual DSN from Sentry
  integrations: [
    new Integrations.BrowserTracing(),
  ],
  tracesSampleRate: 1.0, // Adjust this value for performance monitoring
});
const App = () => {
  
 useTrackUserInteractions(); // Tracking user interactions
  
  return (
    <Sentry.ErrorBoundary fallback={<p>Something went wrong.</p>}>
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
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/subject/:id" element={<SubjectPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </UserProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </Sentry.ErrorBoundary>
  );
};

export default App;
