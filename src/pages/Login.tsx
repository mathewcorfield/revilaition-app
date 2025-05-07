import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { supabase } from "../lib/supabaseClient";
import { Link , useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import OnboardingModal from "@/components/login/OnboardingModal";
import LoginForm from "@/components/login/LoginForm";
import GoogleSignInButton from "@/components/login/GoogleSignInButton";
import TermsAndPrivacy from "@/components/login/TermsAndPrivacy";
import useRedirectIfLoggedIn from "@/hooks/useRedirectIfLoggedIn";
import { getUserData } from "@/hooks/getUserData";
import useGoogleSignIn from "@/hooks/useGoogleSignIn";
import { useLoginForm } from "@/hooks/useLoginForm";
import { useOnboarding } from "@/hooks/useOnboarding";
import { usePasswordStrength } from "@/hooks/usePasswordStrength";
import { logError } from "@/utils/logError";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); //is this needed?
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [level, setLevel] = useState(""); //is this needed?
  const [country, setCountry] = useState(""); //is this needed?
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { setUser } = useUser();
  const { handleSubmit, loading } = useLoginForm(isLogin, email, password, setUser, setShowOnboarding);
  const { handleGoogleSignIn, googleLoading } = useGoogleSignIn();
  const { passwordStrength, evaluateStrength } = usePasswordStrength();
  const { handleOnboardingSubmit } = useOnboarding(name, level, country, setUser, navigate);

  useRedirectIfLoggedIn();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-accent to-background p-4">
      <div className="w-full max-w-md">
        <Card className="border-primary/20 shadow-lg animate-fade-in">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-primary">
              Revil
              <span className="text-black">AI</span>
              tion <br /> Revil
              <span className="text-cyan-300 font-bold animate-shimmer bg-gradient-to-r from-cyan-200 via-white to-cyan-300 bg-clip-text text-transparent">AI</span>
              tion <br /> Revil
              <span className="text-cyan-300">AI</span>
              tion
            </CardTitle>
            <CardDescription>
              {isLogin ? (
      <>
        Smarter Revision. Powered by AI.<br />
        Clarity in Every Question. Progress in Every Session.<br />
        The Future of Revision Is Personal.<br />
        Revise with Confidence. Achieve with Ease.
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
              handleSubmit={handleSubmit}
              passwordStrength={passwordStrength}
              loading={loading}
              isLogin={isLogin}
            />
            <GoogleSignInButton handleGoogleSignIn={handleGoogleSignIn} googleLoading={googleLoading} />
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
        <OnboardingModal
          setName={setName}
          setLevel={setLevel}
          setCountry={setCountry}
          onSubmit={handleOnboardingSubmit}
        />
      )}
    </div>
  );
};

export default Login;
