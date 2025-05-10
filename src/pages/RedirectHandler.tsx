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
      const savedHash = sessionStorage.getItem("oauth_hash");
      const hash = savedHash.startsWith("#") ? savedHash.substring(1) : savedHash;
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
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (!userProfile) {
          sessionStorage.setItem("showOnboarding", "true");
        } else {
        const fullUserData = await getUserData(userId);
          setUser(fullUserData);
          toast({ title: "Login Successful", description: "Welcome back to RevilAItion!" });
        navigate("/dashboard");
        }
      } catch (err) {
        logError("[RedirectHandler] Unexpected error", err);
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
