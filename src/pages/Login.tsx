import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link , useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import useRedirectIfLoggedIn from "@/hooks/useRedirectIfLoggedIn";
import { useUser } from "@/context/UserContext";
import { getUserData } from "@/hooks/getUserData";
import useGoogleSignIn from "@/hooks/useGoogleSignIn";
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

  const { loading: googleLoading, handleGoogleSignIn } = useGoogleSignIn();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUser(null);
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        sessionStorage.removeItem("isTrial");
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
              emailRedirectTo: "https://revilaition.com/login",
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

          toast({
            title: "Account Created",
            description: "Welcome to RevilAItion! Check your inbox and click the link to verify your email.",
          });
          sessionStorage.setItem("isTrial", "true");
          const { user} = useUser();
          navigate('/dashboard');
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
    const user = (await supabase.auth.getUser()).data?.user;
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated. Please log in again.",
      });
      return;
    }

    const userId = user.id;

    // Check if the user already exists in the 'users' table
    const { data: existingUserProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !existingUserProfile) {
      // If no user profile exists, insert a new record into the 'users' table
      const { error: insertError } = await supabase
        .from('users')
        .insert([{ id: userId, current_level: level, country_id: country }]);

      if (insertError) {
        toast({
          title: "Error",
          description: insertError.message,
        });
        return;
      }

      // Update user context with new information
          const fullUserData = await getUserData(userId);
          setUser(fullUserData);
      setShowOnboarding(false);
      toast({
        title: "Onboarding Complete",
        description: "Welcome to RevilAItion! Let's start learning.",
      });
      navigate("/dashboard");
    }
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
            <CardTitle className="text-3xl font-bold text-primary">
              Revil
              <span className="text-yellow-400 font-extrabold">AI</span>
              tion
            </CardTitle>
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
                        <Button 
              onClick={handleGoogleSignIn} 
              className="w-full mt-4 flex items-center justify-center"
              disabled={googleLoading}
            >
              <img src="/google.webp" alt="Google Logo" className="w-6 h-6 mr-2" />
              {googleLoading ? "Signing in with Google..." : "Sign in with Google"}
            </Button>
            {/* Add Terms and Privacy Policy message here */}
        {!isLogin && (
          <div className="mt-4 text-sm text-center .text-muted-foreground">
            <p>
              By signing up you agree to our
            </p>
            <div className="mt-2 text-center">
              <Link to="/terms-of-service" className="text-blue-500 hover:underline">
                Terms of Service
              </Link>
            </div>
            <div className="mt-2 text-center">
              <Link to="/privacy-policy" className="text-blue-500 hover:underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        )}
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
