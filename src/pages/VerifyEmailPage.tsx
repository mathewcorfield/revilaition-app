import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { getUserData } from "@/hooks/getUserData";
import { useUser } from "@/context/UserContext";
import { Loader2 } from "lucide-react";

const VerifyEmailPage = () => {
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState("Waiting for email verification...");
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
        // Check if there is an authenticated session
    const user = supabase.auth.user();
    // If there's no session, prompt the user to log in again
    if (!user) {
      setMessage("No active session. Please log in again.");
      navigate("/login");
      setChecking(false);
      return;
    }
    const interval = setInterval(async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Auth check error:", error);
        setMessage("Error checking email status. Please refresh.");
        clearInterval(interval);
        setChecking(false);
        return;
      }
      if (data?.user?.email_confirmed_at) {
        clearInterval(interval);
        setMessage("Email verified! Preparing your dashboard...");

        try {
          const fullData = await getUserData(data.user.id);
          setUser(fullData);
          navigate("/dashboard");
        } catch (err) {
          console.error("Failed to fetch full user data:", err);
          setMessage("Verified, but error loading profile. Please try again.");
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate, setUser]);

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-4">
      <Loader2 className="animate-spin h-8 w-8 mb-4 text-brand-purple" />
      <h2 className="text-xl font-semibold">{message}</h2>
      <p className="text-muted-foreground mt-2">
        Please check your inbox and click the verification link.
      </p>
    </div>
  );
};

export default VerifyEmailPage;
