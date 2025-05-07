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
import OnboardingModal from "@/components/OnboardingModal";
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
  const [name, setName] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [level, setLevel] = useState("");
  const [country, setCountry] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useUser();

  useRedirectIfLoggedIn();

  const { loading: googleLoading, handleGoogleSignIn } = useGoogleSignIn();
  const { handleSubmit, loading } = useLoginForm(isLogin, email, password, setUser, navigate, setShowOnboardin);
  const { passwordStrength, evaluateStrength } = usePasswordStrength();
  const { handleOnboardingSubmit } = useOnboarding(name, level, country, setUser, navigate);
  
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
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPassword(val);
                    evaluateStrength(val);
                  }}
                  required
                  autoComplete="current-password" // Adding autocomplete for password
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-sm text-muted-foreground"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                </div>
              </div>
              {password && (
                <>
                  <p
                    className={`text-sm ${
                      passwordStrength === "Strong"
                        ? "text-green-600"
                        : passwordStrength === "Medium"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    Strength: {passwordStrength}
                  </p>
                  <ul className="text-sm text-muted-foreground mt-1 ml-1 list-disc pl-4">
                    <li>At least 8 characters</li>
                    <li>One uppercase letter</li>
                    <li>One number</li>
                  </ul>
                </>
                )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (isLogin ? "Logging in..." : "Signing up...") : isLogin ? "Sign In" : "Sign Up"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full mt-2 text-sm text-blue-500"
                onClick={async () => {
                  if (!email) {
                    toast({ title: "Email Required", description: "Enter your email to receive a login link." });
                    return;
                  }
                  setLoading(true);
                  const { error } = await supabase.auth.signInWithOtp({
                    email,
                    options: {
                      emailRedirectTo: "https://www.revilaition.com/#/dashboard",
                      shouldCreateUser: false, 
                    },
                  });
                  setLoading(false);
              
                  if (error) {
                    toast({ title: "Error", description: error.message });
                  } else {
                    toast({
                      title: "Check your inbox",
                      description: "We've sent you a magic link to log in.",
                    });
                  }
                }}
              >
                Send Magic Link Instead
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
          <div className="mt-4 text-sm text-center text-muted-foreground">
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
