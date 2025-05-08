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
        const { data, error } = await supabase.auth.getSession();

        if (error || !data?.session) {
        logError("[RedirectHandler] Failed to get session", error);
        toast({
          title: "Login Error",
          description: "Could not complete login. Please try again.",
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
