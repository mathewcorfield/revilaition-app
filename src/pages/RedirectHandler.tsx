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
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData?.user) {
          logError("[RedirectHandler] Failed to get user", userError);
          toast({
            title: "Error",
            description: "Could not retrieve user after sign-in.",
          });
          navigate("/login");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", userData.user.id)
          .single();

        if (profileError || !profile) {
          logError("[RedirectHandler] No profile found, redirecting to onboarding", profileError);
          navigate("/onboarding");
          return;
        }

        const fullUserData = await getUserData(userData.user.id);
        setUser(fullUserData);

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
