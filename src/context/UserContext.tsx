import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { getUserData } from "@/hooks/getUserData";
import { User } from "@/types";
import { mockUser } from "@/data/mockData"; 

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

UserContext.displayName = "UserContext";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        console.warn("[UserContext] No user found or error occurred:", error);
        setUser(mockUser);  // Fallback to mock user
        setLoading(false);
        return;
      }
      const fullData = await getUserData(data.user.id);
      console.log("Fetched user:", fullData);
      // If required fields are empty, fall back to mock user
      if (!fullData.name || fullData.milestones.length === 0 || fullData.subjects.length === 0) {
        console.warn("[UserContext] Missing essential data, using mock data...");
        setUser(mockUser);  // Fallback to mock user
        setLoading(false);
        return;
      }

      setUser(fullData);  // Set fetched user data if everything is valid
    } catch (err) {
      console.error("[UserContext] Unexpected error:", err);
      setUser(mockUser);  // Fallback to mock user in case of error
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);


  return (
<UserContext.Provider value={{ user, setUser, loading }}>
  {children}
</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined || context === null) {
    console.error("useUser must be used within a UserProvider");
    return { user: null, loading: true }; // fallback to avoid crashing
  }
  return context;
};
