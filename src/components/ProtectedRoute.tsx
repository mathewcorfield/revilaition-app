import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user?.isVerified) {
    // If the user is not verified, redirect them to the verification page or show a message
    navigate('/verify-email'); // Assuming you have a page for email verification
    return null; // Don't render the protected content
  }

  return <>{children}</>; // Render the children (protected content)
};
