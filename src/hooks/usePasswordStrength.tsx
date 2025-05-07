import { useState } from "react";

export const usePasswordStrength = () => {
  const [passwordStrength, setPasswordStrength] = useState<"Weak" | "Medium" | "Strong" | "">("");

  const evaluateStrength = (password: string) => {
    let strength: "Weak" | "Medium" | "Strong" | "" = "Weak";
    if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      strength = "Strong";
    } else if (password.length >= 6 && /[A-Z]/.test(password) && /\d/.test(password)) {
      strength = "Medium";
    }
    setPasswordStrength(strength);
  };

  return { passwordStrength, evaluateStrength };
};
