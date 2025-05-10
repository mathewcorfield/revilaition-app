import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { supabase } from "../lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import OnboardingModal from "@/components/login/OnboardingModal";
import LoginForm from "@/components/login/LoginForm";
import GoogleSignInButton from "@/components/login/GoogleSignInButton";
import TermsAndPrivacy from "@/components/login/TermsAndPrivacy";
import useRedirectIfLoggedIn from "@/hooks/useRedirectIfLoggedIn";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  useRedirectIfLoggedIn();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-accent to-background p-4">
      <div className="w-full max-w-md">
        <Card className="border-primary/20 shadow-lg animate-fade-in">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-primary">
              Revil
              <span className="text-black font-bold animate-shimmer bg-gradient-to-r from-black via-white to-black bg-clip-text text-transparent">AI</span>
              tion 
            </CardTitle>
            <CardDescription>
              {isLogin ? (
      <>
        The Future of Revision.
      </>
    ) : (
      "Create an account to start your learning journey"
    )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              isLogin={isLogin}
              setShowOnboarding={setShowOnboarding}
            />
            <GoogleSignInButton 
              setShowOnboarding={setShowOnboarding}
              />
            <TermsAndPrivacy isLogin={isLogin} />
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
        <OnboardingModal />
      )}
    </div>
  );
};

export default Login;
