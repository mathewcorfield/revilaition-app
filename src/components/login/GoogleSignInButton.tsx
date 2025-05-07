import React from "react";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { useGoogleSignIn } from "@/hooks/useGoogleSignIn";

const GoogleSignInButton = () => {
  const { handleGoogleSignIn, googleLoading } = useGoogleSignIn();
  return (
    <Button
      onClick={handleGoogleSignIn}
      className="w-full mt-4 flex items-center justify-center"
      disabled={googleLoading}
    >
      <img src="/google.webp" alt="Google Logo" className="w-6 h-6 mr-2" />
      {googleLoading ? "Signing in with Google..." : "Sign in with Google"}
    </Button>
  );
};

export default GoogleSignInButton;
