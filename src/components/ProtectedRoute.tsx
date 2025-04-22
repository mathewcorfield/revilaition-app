import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Your Supabase client
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate('/login'); // Redirect to login if user is not authenticated
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  if (loading) return <p>Loading...</p>; // Optional: Show loading until we confirm auth state

  return <>{children}</>;
};

export default ProtectedRoute;
