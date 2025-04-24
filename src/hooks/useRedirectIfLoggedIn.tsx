import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient"; // Adjust the import path based on your project structure

const useRedirectIfLoggedIn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      console.log('Checking session...');
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // If session is found, navigate to the dashboard
           console.log('Session found');
          console.log('Redirecting to dashboard');
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    checkSession();
  }, [navigate]);
};

export default useRedirectIfLoggedIn;
