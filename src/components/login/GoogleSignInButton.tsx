import React from "react";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import useGoogleSignIn from "@/hooks/useGoogleSignIn";

const GoogleSignInButton = ({setShowOnboarding}: {setShowOnboarding: React.Dispatch<React.SetStateAction<boolean>>;}) => {
  const { handleGoogleSignIn, loading } = useGoogleSignIn(setShowOnboarding);
  return (
    <Button
      onClick={handleGoogleSignIn}
      className="w-full mt-4 flex items-center justify-center"
      disabled={loading}
    >
      <img src="/google.webp" alt="Google Logo" className="w-6 h-6 mr-2" />
      {loading ? "Signing in with Google..." : "Sign in with Google"}
    </Button>
  );
};

export default GoogleSignInButton;
