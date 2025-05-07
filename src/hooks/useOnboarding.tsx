import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { logError } from "@/utils/logError";
import { getUserData } from "@/hooks/getUserData";

export const useOnboarding = (name: string, level: string, country: string, setUser: Function, navigate: Function) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleOnboardingSubmit = async () => {
    if (!level || !country || !name) {
      toast({ title: "Error", description: "Please complete the onboarding questions." });
      return;
    }

    try {
      const user = (await supabase.auth.getUser()).data?.user;
      if (!user?.id) {
        logError("[Onboarding] User not authenticated", new Error("User not authenticated"));
        toast({ title: "Error", description: "User not authenticated. Please log in again." });
        setLoading(false);
        return;
      }

      const { data: existingUserProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !existingUserProfile) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ id: user.id, current_level: level, country_id: country, full_name: name }]);

        if (insertError) {
          logError("[Onboarding] Insert User Error", insertError);
          toast({ title: "Error", description: insertError.message });
          setLoading(false);
          return;
        }

        const fullUserData = await getUserData(user.id);
        setUser(fullUserData);
        setLoading(false);
        toast({ title: "Onboarding Complete", description: "Welcome to RevilAItion! Let's start learning." });
        navigate("/dashboard");
      }
    } catch (error) {
      logError("[Onboarding] Unexpected Error", error);
      toast({ title: "Error", description: error.message });
    }
  };

  return { handleOnboardingSubmit, loading };
};
