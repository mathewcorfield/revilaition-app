import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

const useRedirectIfLoggedIn = (isTrial: boolean) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isTrial) {
        navigate("/dashboard?trial=true");
      return;
      }
    const checkAuth = async () => {
      console.log("Checking user and session...");

      // First, get the session to check for expiration
      const { data: { session } } = await supabase.auth.getSession();

      if (session && session.expires_at && session.expires_at < Date.now() / 1000) {
        console.warn("Session expired, signing out.");
        await supabase.auth.signOut();
        return;
      }

      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error("Error checking user:", error);
        return;
      }
      
      if (user) {
            console.log("Valid user found. Redirecting to dashboard...");
            navigate("/dashboard");
        } else {
          console.log("No valid user found. Stay on login page.");
      }
        };
      

    checkAuth();
  }, [navigate]);
};

export default useRedirectIfLoggedIn;
