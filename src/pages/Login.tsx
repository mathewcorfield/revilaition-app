import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import useRedirectIfLoggedIn from "@/hooks/useRedirectIfLoggedIn";
import { useUser } from "@/context/UserContext";
import { getUserData } from "@/hooks/getUserData";
import OnboardingModal from "@/components/OnboardingModal";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [level, setLevel] = useState(""); // User's study level
  const [country, setCountry] = useState(""); // User's country
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useUser();

 // Call the hook to check if the user is logged in
  useRedirectIfLoggedIn();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUser(null);
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);

        if (error) {
          toast({
            title: "Error",
            description: error.message,
          });
          return;
        }

      // Get the logged-in user's details
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData?.user) {
          toast({
            title: "Error",
            description: "Unable to fetch user data. Please try again later.",
          });
          return;
        }

// Check if the user has a `userID` in the database (first login check)
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userData.user.id)
          .single();

        if (profileError || !userProfile) {
          // If no profile found, show onboarding
          setShowOnboarding(true);
        } else {
          // If user profile exists, proceed normally
          const fullUserData = await getUserData(userData.user.id);
          setUser(fullUserData);
          toast({
            title: "Login Successful",
            description: "Welcome back to RevilAItion!",
          });
          navigate("/dashboard");
        }
      } else {
        if (email && password && name) {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: "https://revilaition.com/verify-email",
            },
          });

          setLoading(false);

          if (error) {
            toast({
              title: "Error",
              description: error.message,
            });
            return;
          }
          
            // Temporarily store user info (in session or context)
            sessionStorage.setItem("pendingUserEmail", email);
            sessionStorage.setItem("pendingUserName", name);
          
          toast({
            title: "Account Created",
            description: "Welcome to RevilAItion! Check your inbox and click the link to verify your email.",
          });
          navigate("/verify-email");
        }
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    }
  };
  
// Onboarding logic - Save the user's answers
  const handleOnboardingSubmit = async () => {
    if (!level || !country) {
      toast({
        title: "Error",
        description: "Please complete the onboarding questions.",
      });
      return;
    }

    try {
      // Save the user's level and country to the database
      const { data, error } = await supabase
        .from('users')
        .update({ level, country })
        .eq('id', supabase.auth.user()?.id);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
        });
        return;
      }

      // Update user context with new information
      setUser({ ...userProfile, level, country });
      setShowOnboarding(false);
      toast({
        title: "Onboarding Complete",
        description: "Welcome to RevilAItion! Let's start learning.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong during onboarding. Please try again.",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-accent to-background p-4">
      <div className="w-full max-w-md">
        <Card className="border-primary/20 shadow-lg animate-fade-in">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-primary">RevilAItion</CardTitle>
            <CardDescription>
              {isLogin ? "Sign in to access your learning journey" : "Create an account to start your learning journey"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required={!isLogin}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                  autoComplete="email" // Adding autocomplete for email
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password" // Adding autocomplete for password
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (isLogin ? "Logging in..." : "Signing up...") : isLogin ? "Sign In" : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </Button>
          </CardFooter>
        </Card>
      </div>
            {/* Show onboarding modal if it's the user's first login */}
      {showOnboarding && (
        <OnboardingModal
          setLevel={setLevel}
          setCountry={setCountry}
          onSubmit={handleOnboardingSubmit}
        />
      )}
    </div>
  );
};

export default Login;
