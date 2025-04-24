import React, { useState, useEffect } from "react";
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
  const [loadingSession, setLoadingSession] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      console.log('Checking session...');
      try {
        const { data: session } = await supabase.auth.getSession();
        if (session) {
          console.log('Session found');
          // Only navigate if on login page
          if (window.location.pathname === "/login") {
            console.log('Redirecting to dashboard');
            navigate("/dashboard");
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoadingSession(false); // Ensure this is always called after session check
      }
    };

    checkSession();
  }, [navigate]);

  if (loadingSession) {
    return <div>Loading...</div>; // Loading state
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
            options: {
              emailRedirectTo: "https://revilaition.com/dashboard",
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

          localStorage.setItem("user", JSON.stringify({ email, name }));
          toast({
            title: "Account Created",
            description: "Welcome to RevilAItion! Please log in.",
          });
          navigate("/login");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-accent to-background p-4">
      <div className="w-full max-w-md">
        <Card className="border-primary/20 shadow-lg animate-f
