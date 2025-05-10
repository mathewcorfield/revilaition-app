import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { usePasswordStrength } from "@/hooks/usePasswordStrength";
import { useLoginForm } from "@/hooks/useLoginForm";

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  isLogin
}: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  isLogin: boolean;
}) => {
  const { passwordStrength, evaluateStrength } = usePasswordStrength();
  const { handleSubmit, loading } = useLoginForm(isLogin, email, password);
  return (
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
          autoComplete="email"
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
            autoComplete="current-password"
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
    </form>
  );
};

export default LoginForm;
