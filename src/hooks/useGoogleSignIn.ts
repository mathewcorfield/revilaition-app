import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { getUserData } from "@/hooks/getUserData";

const useGoogleSignIn = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/dashboard`, // or handle it via query params
          },
        });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
        });
        setLoading(false);
        return;
      }

      // Assuming that Google Sign In is successful, you can fetch user profile
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        toast({
          title: "Error",
          description: "Unable to fetch user data. Please try again later.",
        });
        setLoading(false);
        return;
      }

      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userData.user.id)
        .single();

      if (profileError || !userProfile) {
        // If no profile found, show onboarding
        // You can add a flag to trigger onboarding modal in your parent component
        navigate("/onboarding");
      } else {
        const fullUserData = await getUserData(userData.user.id);
        setUser(fullUserData);
        toast({
          title: "Login Successful",
          description: "Welcome back to RevilAItion!",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong during Google sign-in. Please try again.",
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
