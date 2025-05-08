import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { getUserData } from "@/hooks/getUserData";
import { logError } from "@/utils/logError";

const RedirectHandler = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   const handleRedirect = async () => {
       console.log("[RedirectHandler] Mounted. Attempting to get session");
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);

      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (!access_token || !refresh_token) {
        logError("[RedirectHandler] Missing tokens in URL", { access_token, refresh_token });
        toast({
          title: "Login Error",
          description: "Could not complete login. Please try again.",
        });
        navigate("/login");
        return;
      }
     const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error || !data.session) {
        logError("[RedirectHandler] Failed to set session", error);
        toast({
          title: "Login failed",
          description: "Could not set your session. Please try again.",
        });
        navigate("/login");
        return;
      }
  try {
        const userId = data.session.user.id;
        const userProfile = await getUserData(userId);
        if (!userProfile) {
          logError("[RedirectHandler] No profile found, redirecting to onboarding", profileError);
          navigate("/onboarding");
          return;
        }
        setUser(userProfile);
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });

        navigate("/dashboard");
      } catch (err) {
        logError("[RedirectHandler] Unexpected error", err);
        toast({
          title: "Error",
          description: "Something went wrong after sign-in.",
        });
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    handleRedirect();
  }, []);

  return <p className="text-center mt-8">{loading ? "Finishing sign-in..." : "Redirecting..."}</p>;
};

export default RedirectHandler;
