import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { logError } from "@/utils/logError";
import { getUserData } from "@/hooks/getUserData";
import { useUser } from "@/context/UserContext";

export const useOnboarding = (usedId: string, name: string, level: string, country: string) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleOnboardingSubmit = async () => {
    if (!level || !country || !name) {
      toast({ title: "Error", description: "Please complete the onboarding questions." });
      return false;
    }

    try {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ id: usedId, current_level: level, country_id: country, full_name: name }]);

        if (insertError) {
          logError("[Onboarding] Insert User Error", insertError);
          toast({ title: "Error", description: insertError.message });
          setLoading(false);
          return;
        }
        const fullUserData = await getUserData(usedId);
        setUser(fullUserData);
        setLoading(false);
        toast({ title: "Onboarding Complete", description: "Welcome to RevilAItion! Let's start learning." });
        navigate("/dashboard");
        return true;
    } catch (error) {
      logError("[Onboarding] Unexpected Error", error);
      toast({ title: "Error", description: error.message });
      return false;
    }
  };

  return { handleOnboardingSubmit, loading };
};
