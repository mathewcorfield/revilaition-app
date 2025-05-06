import {  createContext,  useContext,  useEffect,  useState,  ReactNode, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getUserData } from "@/hooks/getUserData";
import { User } from "@/types";
import { mockUser } from "@/data/mockData"; 

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
  const CACHE_KEY = isTrial ? "user_trial" : "user";
  
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
            sessionStorage.removeItem(CACHE_KEY);
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

       try {
          const fullData = await getUserData(data.user.id);
          if (!fullData) throw new Error("Failed to retrieve user data");
          setUserAndCache(fullData);
        } catch (err) {
          console.error("[UserContext] Failed to get full user data:", err);
          clearUser();
        }
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
  throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
