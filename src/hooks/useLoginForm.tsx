import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { logError } from '@/utils/logError';

export const useLoginForm = (isLogin: boolean, email: string, password: string, setUser: Function, navigate: Function,setShowOnboarding: Function) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        sessionStorage.removeItem("isTrial");
        setLoading(false);

        if (error) {
          logError("[Login] SignIn Error", error);
          toast({ title: "Error", description: error.message });
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
          setShowOnboarding(true);
        } else {
          const fullUserData = await getUserData(userData.user.id);
          setUser(fullUserData);
          toast({ title: "Login Successful", description: "Welcome back to RevilAItion!" });
          navigate("/dashboard");
        }
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
            description: "Welcome to RevilAItion! Check your inbox and click the link to verify your email.",
          });
          sessionStorage.setItem("isTrial", "true");
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
