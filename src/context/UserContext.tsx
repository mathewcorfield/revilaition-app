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

type UserContextType = {
  user: User | null;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

UserContext.displayName = "UserContext";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      console.log("[UserContext] Fetching user...");

      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          console.warn("[UserContext] No user found or error occurred:", error);
          setUser(null);
          setLoading(false);
          return;
        }

        const fullData = await getUserData(data.user.id);
        console.log("[UserContext] Full user data loaded:", fullData);
        setUser(fullData);
      } catch (err) {
        console.error("[UserContext] Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a <UserProvider>");
  }
  return context;
};
