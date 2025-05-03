import { useEffect } from "react";
import { insertInteraction } from "@/services/dataService"; 
import { supabase } from "@/lib/supabaseClient"; // Make sure to import supabase

const ADMIN_USER_ID = "8179c018-a27a-40a8-bbfb-25d929b82272";

const useTrackUserInteractions = () => {
  const getUserID = async (): Promise<string> => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.user?.id ?? ADMIN_USER_ID;
  };

  useEffect(() => {
    // Handle click event
    const handleClick = async (event: MouseEvent) => {
      const targetElement = event.target as HTMLElement;
      const element = targetElement.innerText?.trim().slice(0, 100) || "Unknown Element";
      const userID = await getUserID(); // Retrieve user ID asynchronously
      await insertInteraction("click", element, new Date().toISOString(), userID);
    };

    // Handle form submit event
    const handleSubmit = async (event: Event) => {
      const targetForm = event.target as HTMLFormElement;
      const element = targetForm.innerText?.trim().slice(0, 100) || "Unknown Element";
      const userID = await getUserID(); // Retrieve user ID asynchronously
      await insertInteraction("submit", element, new Date().toISOString(), userID);
    };

    // Add event listeners for click and submit
    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleSubmit);

    // Cleanup event listeners when component unmounts
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("submit", handleSubmit);
    };
  }, []); // Empty dependency array to run this only once

};

export default useTrackUserInteractions;
