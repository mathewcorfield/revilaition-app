import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/context/UserContext";

const useLogout = () => {
  const navigate = useNavigate();
  const { clearUser } = useUser();

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      clearUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Error",
        description: "There was an issue logging out. Please try again.",
      });
    }
  };

  return logout;
};

export default useLogout;
