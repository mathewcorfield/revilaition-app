import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Create a ref to track if session check has been completed
  const sessionChecked = useRef(false);

  useEffect(() => {
    const checkSession = async () => {
      // Avoid re-triggering the session check if it's already been done
      if (sessionChecked.current) return;
      sessionChecked.current = true;

      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error.message);
      } else {
        console.log("Session:", session);
      }

      if (session) {
        // User is already authenticated, navigate to the dashboard
        navigate("/dashboard");
      }
    };

    checkSession();
  }, [navigate]); // Only run the effect once, when the component mounts

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // You can now remove the redundant session check here
    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setLoading(false);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
        });
        return;
      }

      // Mock login with Supabase
      localStorage.setItem("user", JSON.stringify({ email, name: "User" }));
      toast({
        title: "Login Successful",
        description: "Welcome back to RevilAItion!",
      });
      navigate("/dashboard");
    } else {
      if (email && password && name) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        setLoading(false);

        if (error) {
          toast({
            title: "Error",
            description: error.message,
          });
          return;
        }

        // Store user data and notify about successful signup
        localStorage.setItem("user", JSON.stringify({ email, name }));
        toast({
          title: "Account Created",
          description: "Welcome to RevilAItion! Please log in.",
        });
        navigate("/login"); // Redirect to login page after signup
      }
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
    </div>
  );
};

export default Login;
