import { useEffect } from "react";
import { insertInteraction } from "@/services/dataService"; 
import { supabase } from "@/lib/supabaseClient"; // Make sure to import supabase

const useTrackUserInteractions = () => {
  // Helper function to retrieve the user ID from the current session
  const getUserID = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || null; // Return user ID if session exists, otherwise null
  };

  useEffect(() => {
    // Handle click event
    const handleClick = async (event: MouseEvent) => {
      const targetElement = event.target as HTMLElement;
      const action = "click";
      const element = targetElement.innerText;
      const userID = await getUserID(); // Retrieve user ID asynchronously
      console.log("User clicked on:", targetElement);
      await insertInteraction(action, element, new Date().toISOString(), userID);
    };

    // Handle form submit event
    const handleSubmit = async (event: Event) => {
      const targetForm = event.target as HTMLFormElement;
      const action = "submit";
      const element = targetForm.innerText;
      const userID = await getUserID(); // Retrieve user ID asynchronously
      console.log("User submitted form:", targetForm);
      await insertInteraction(action, element, new Date().toISOString(), userID);
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
