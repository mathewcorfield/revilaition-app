import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@/components/ui'; // Assuming you're using these UI components

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message); // Handle error here
      return;
    }

    // Redirect to the dashboard after successful login
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleLogin}>
      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <Button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Log In'}
      </Button>
    </form>
  );
};

export default LoginPage;
