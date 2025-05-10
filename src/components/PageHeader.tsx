import { Link, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { RevilAItionText } from "@/components/RevilAItionText";
import { useUser } from "@/context/UserContext";

interface PageHeaderProps {
    title?: string;
  isTrial?: boolean;
  actions?: React.ReactNode;
}

export const PageHeader = ({ title, isTrial,actions }: PageHeaderProps) => {
    const { user } = useUser();
  return (
<header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-brand-purple" />
          <span className="font-bold text-xl text-gray-900"><RevilAItionText /></span>
              </Link>
            <span className="text-muted-foreground">|</span>
            <span className="text-lg font-medium">
              {isTrial 
                ? <strong>Verify your email and log in to unlock full feature!</strong>
                : title || `${user?.name ? `${user.name}'s` : "Your"} Dashboard`}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {actions}            
          </div>
        </div>
      </header>
  );
};