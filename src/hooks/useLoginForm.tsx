import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { supabase } from '../lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { logError } from '@/utils/logError';
import { getUserData } from "@/hooks/getUserData";
import { useUser } from "@/context/UserContext";

export const useLoginForm = (isLogin: boolean, email: string, password: string) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);

        if (error) {
          logError("[Login] SignIn Error", error);
          toast({ title: "Email Verification Needed", description: error.message });
          setLoading(false);
          return;
        }

        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
          logError("[Login] Fetching User Error", userError);
          toast({ title: "Error", description: userError.message });
          setLoading(false);
          return;
        }

        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userData.user.id)
          .single();

        if (profileError || !userProfile) {
          logError("[Login] Get User Profile Error", profileError);
          sessionStorage.setItem("showOnboarding", "true");
        } else {
          const fullUserData = await getUserData(userData.user.id);
          setUser(fullUserData);
          toast({ title: "Login Successful", description: "Welcome back to RevilAItion!" });
        }
          sessionStorage.removeItem("isTrial");
          navigate("/dashboard");
      } else {
        if (email && password) {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: "https://www.revilaition.com/redirect.html" },
          });

          if (error) {
            logError("[Login] SignUp Error", error);
            toast({ title: "Error", description: error.message });
            setLoading(false);
            return;
          }

          toast({
            title: "Account Created",
            description: "Welcome to RevilAItion! Check your inbox and click the  to verify your email.",
          });
          sessionStorage.setItem("isTrial", "true");
          setUser(data.user)
          navigate('/dashboard');
        }
      }
    } catch (error) {
      setLoading(false);
      logError("[Login] Unexpected Error", error);
      toast({ title: "Error", description: error.message });
    }
  };

  return { handleSubmit, loading };
};
