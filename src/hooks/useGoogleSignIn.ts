import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { logError } from '@/utils/logError';

const useGoogleSignIn = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: "https://www.revilaition.com/redirect.html"
          },
        });

      if (error) {
        logError("[Google SignIn] OAuth Error", error);
        setLoading(false);
        return;
      }
    } catch (error) {
      logError("[Google SignIn] Unexpected Error", error);
      toast({
          title: "Error",
          description: error.message,
        });
      setLoading(false);
    }
  };

  return {
    loading,
    handleGoogleSignIn,
  };
};

export default useGoogleSignIn;
