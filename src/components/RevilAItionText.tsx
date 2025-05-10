import React from "react";
import { cn } from "@/lib/utils";

interface RevilAItionTextProps {
  className?: string;
}

export const RevilAItionText = ({ className }: RevilAItionTextProps) => {
  return (
    <span className={cn("font-bold text-primary text-3xl", className)}>
      Revil
      <span className="text-black animate-shimmer bg-gradient-to-r from-black via-white to-black bg-clip-text text-transparent">
        AI
      </span>
      tion
    </span>
  );
};
