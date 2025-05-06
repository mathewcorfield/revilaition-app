import {  createContext,  useContext,  useEffect,  useState,  ReactNode, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getUserData } from "@/hooks/getUserData";
import { User } from "@/types";
import { mockUser } from "@/data/mockData"; 

const CACHE_KEY = "user";
const CACHE_EXPIRY_MINUTES = 120; 

type CachedUser = {
  user: User;
  cachedAt: number; // timestamp in ms
};

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  clearUser: () => void;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);
UserContext.displayName = "UserContext";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isTrial = sessionStorage.getItem("isTrial") === "true";

  const setUserAndCache = useCallback((newUserOrUpdater: User | null | ((prevUser: User | null) => User | null)) => {
    setUserState(prev => {
      const newUser = typeof newUserOrUpdater === "function"
        ? (newUserOrUpdater as (prevUser: User | null) => User | null)(prev)
        : newUserOrUpdater;
  
      if (newUser) {
        const cachedUser: CachedUser = {
          user: newUser,
          cachedAt: Date.now(),
        };
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(cachedUser));
      } else {
        sessionStorage.removeItem(CACHE_KEY);
      }
  
      return newUser;
    });
  }, []);

  const clearUser = useCallback(() => {
    setUserState(null);
    sessionStorage.removeItem(CACHE_KEY);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const cachedRaw = sessionStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          const cachedData: CachedUser = JSON.parse(cachedRaw);
          const now = Date.now();
          const ageMinutes = (now - cachedData.cachedAt) / (1000 * 60);

          if (ageMinutes < CACHE_EXPIRY_MINUTES) {
            setUserState(cachedData.user);
            setLoading(false);
            return;
          } else {
            console.info("[UserContext] Cache expired, refetching...");
            localStorage.removeItem(CACHE_KEY);
          }
        }

        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          console.warn("[UserContext] No user found or error occurred:", error);
          if (isTrial) {
            console.info("[UserContext] Trial mode active. Using mock user.");
            setUserAndCache(mockUser);
          } else {
            clearUser(); // Ensure no user is stored
          }
          setLoading(false);
          return;
        }

        const fullData = await getUserData(data.user.id);
        setUserAndCache(fullData);
      } catch (err) {
        console.error("[UserContext] Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setUserAndCache, isTrial]);

  return (
    <UserContext.Provider
      value={{ user, setUser: setUserAndCache, clearUser, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    console.error("useUser must be used within a UserProvider");
    return {
      user: null,
      setUser: () => {},
      clearUser: () => {},
      loading: true,
    };
  }
  return context;
};
