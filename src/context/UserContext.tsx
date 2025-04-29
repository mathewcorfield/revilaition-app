import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getUserData } from "@/hooks/useUserData";
import { User } from "@/types";

const UserContext = createContext<{
  user: User | null;
  loading: boolean;
}>({ user: null, loading: true });

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the user data after the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      const fullData = await useUserData(data.user.id);  // Changed this line
      setUser(fullData);
      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
