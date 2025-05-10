import { Link, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RevilAItionText } from "@/components/RevilAItionText";
import useLogout from "@/hooks/useLogout";

interface PageHeaderProps {
  UserName?: string;
  isTrial?: boolean;
}

export const PageHeader = ({ UserName, isTrial }: PageHeaderProps) => {
    const navigate = useNavigate()
    const logout = useLogout();
  return (
<header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-brand-purple" />
          <span className="font-bold text-xl text-gray-900"><RevilAItionText /></span>
              </Link>
            <span className="text-muted-foreground">|</span>
            <span>
              {isTrial 
                ? <strong>Verify your email and log in to unlock full feature!</strong>
                : `${UserName ? `${UserName}'s` : "Your"} Dashboard`}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate("/subscription")}>Subscribe for Full Access</Button>
            {isTrial ? (
              <Button onClick={() => navigate("/login")}>Verify & Login to end trial mode</Button>
            ) : (
            <Button variant="outline" onClick={logout}>Log Out</Button>
            )}
          </div>
        </div>
      </header>
  );
};